const HIDDEN_IMAGE_SRC = "/src/assets/images/index_banner.png";
const START_DELAY_MS = 4000;
const TOTAL_DURATION_MS = 10000;
const EASE_POWER = 1.4;
const CELL_SIZE = 30;
const DYING_MS = 800;
const DYING_JITTER = 0.6;
const SPREAD_CHANCE = 0.45;
const TICK_MS = 70;
const PIXELATED_REVEAL = false;
const DECAY_COLORS = ["#2b2b2b", "#1a1a1a", "#000000"];
const RESTART_KEY = "r";
const RESPECT_REDUCED_MOTION = true;
const IMAGE_ZOOM = 0.95;
const IMAGE_BACKGROUND = '#1a1a1a';
const PROTECTED_SELECTOR = "a, button, [data-decay-ignore]";
const PROTECT_PADDING_PX = 10;

const ALIVE = 0;
const DYING = 1;
const DEAD = 2;

const canvas = document.getElementById("decay-canvas");
const ctx = canvas.getContext("2d");

const hiddenImage = new Image();
let imageSource = hiddenImage;

let dpr = 1;
let width = 0;
let height = 0;
let cols = 0;
let rows = 0;

let state;
let bornAt;
let lifeLen;
let blockColors;
let shuffledOrder;
let shufflePos = 0;
let dyingCells = [];
let touchedCells = [];

let imageLayer = null;
let startTime = 0;
let tickTimer = null;
let frameId = null;
let resizeTimer = null;
let finished = false;

let protectedMask;
let maskFrameId = null;

const rect = {x: 0, y: 0, w: 0, h: 0};

function setRect(index) {
    rect.x = (index % cols) * CELL_SIZE;
    rect.y = Math.floor(index / cols) * CELL_SIZE;
    rect.w = Math.min(CELL_SIZE, width - rect.x);
    rect.h = Math.min(CELL_SIZE, height - rect.y);
}

function computeProtectedMask() {
    const mask = Uint8Array(cols * rows);
    if (!PROTECTED_SELECTOR) return mask;

    const elements = document.querySelectorAll(PROTECTED_SELECTOR);
    for (const element of elements) {
        const box = element.getBoundingClientRect();
        if(box.width === 0 || box.height === 0) continue;

        const left = Math.max(0, Math.floor((box.left - PROTECT_PADDING_PX) / CELL_SIZE));
        const right = Math.min(cols - 1, Math.floor((box.right + PROTECT_PADDING_PX) / CELL_SIZE));
        const top = Math.max(0, Math.floor((box.top - PROTECT_PADDING_PX) /CELL_SIZE));
        const bottom = Math.min(rows - 1, Math.floor((box.bottom + PROTECT_PADDING_PX) / CELL_SIZE));

        for (let row = top; row <= bottom; row++) {
            for (let col = left; col <= right; col++) {
                mask[row*cols + col] = 1;
            }
        }
    }

    return mask;
}

function refreshProtectedMask() {
    if (!protectedMask) return;

    const newMask = computeProtectedMask();
    for(let i = 0; i < newMask.length; i++) {
        if (newMask[i] === protectedMask[i]) continue;
        protectedMask[i] = newMask[i];
        if (state[i] === ALIVE) continue;

        if (newMask[i]) {
            setRect(i);
            ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
        } else if (state[i] === DEAD) {
            paintDeadCell(i);
        }
    }
}

function scheduleMaskRefresh() {
    if (maskFrameId) return;
    maskFrameId = requestAnimationFrame(() => {
        maskFrameId = null;
        try {
            refreshProtectedMask();
        } catch (err) {
            console.error("Protected mask refresh failed:", err);
        }
    });
}

function makeFallbackSource() {
    const fallback = document.createElement("canvas");
    fallback.width = 800;
    fallback.height = 600;
    const g = fallback.getContext("2d");
    const gradient = g.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, "#1a1a1a");
    gradient.addColorStop(1, "#8b2e2e");
    g.fillStyle = gradient;
    g.fillRect(0, 0, 800, 600);
    g.font = "bold 48px serif";
    g.textAlign = "center";
    g.fillText("IMAGE NOT FOUND", 400, 310);
    return fallback;
}

function drawCover(targetCtx, source, w, h) {
    const sourceW = source.naturalWidth || source.width;
    const sourceH = source.naturalHeight || source.height;
    const scale = Math.max(w / sourceW, h / sourceH) * IMAGE_ZOOM;
    const drawW = sourceW * scale;
    const drawH = sourceH  * scale;

    targetCtx.fillStyle = IMAGE_BACKGROUND;
    targetCtx.fillRect(0,0, w, h);
    targetCtx.drawImage(source, (w - drawW) / 2, (h - drawH) /2, drawW, drawH);
}

function buildImageLayer() {
    imageLayer = document.createElement("canvas");
    imageLayer.width = canvas.width;
    imageLayer.height = canvas.height;
    drawCover(imageLayer.getContext("2d"), imageSource, imageLayer.width, imageLayer.height);

    blockColors = null;
    if (!PIXELATED_REVEAL) return;

    try {
        const tiny = document.createElement("canvas");
        tiny.width = cols;
        tiny.height = rows;
        const tinyCtx = tiny.getContext("2d");
        tinyCtx.imageSmoothingQuality = "high";
        tinyCtx.drawImage(imageLayer, 0, 0, cols, rows);
        blockColors = tinyCtx.getImageData(0, 0, cols, rows).data;
    } catch (err) {
        console.warn("Reveal unavailable, using sharp pieces instead");
    }
}

function buildShuffledOrder(total) {
    const order = new Uint32Array(total);
    for (let i = 0; i < total; i++) order[i] = i;
    for (let i = total - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]]
    }
    return order;
}

function setupGrid() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.ceil(width / CELL_SIZE);
    rows = Math.ceil(height / CELL_SIZE);
    const total = cols * rows;

    state = new Uint8Array(total);
    bornAt = new Float64Array(total);
    lifeLen = new Float32Array(total);
    shuffledOrder = buildShuffledOrder(total);
    shufflePos = 0;
    dyingCells = [];
    touchedCells = [];
    protectedMask = computeProtectedMask();

    buildImageLayer();
}

function paintDeadCell(index) {
    if (protectedMask[index]) return;
    setRect(index);
    ctx.clearRect(rect.x, rect.y, rect.w, rect.h);

    if (blockColors) {
        const p = index * 4;
        ctx.fillStyle = `rgb(${blockColors[p]}, ${blockColors[p + 1]}, ${blockColors[p + 2]})`;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    } else {
        ctx.drawImage (
            imageLayer,
            rect.x * dpr, rect.y * dpr, rect.w * dpr, rect.h * dpr, rect.x, rect.y, rect.w, rect.h
        );
    }
}

function paintDyingCell(index, now) {
    if (protectedMask[index]) return;
    const progress = (now - bornAt[index]) / lifeLen[index];
    setRect(index);
    ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
    ctx.globalAlpha = Math.min(1, progress * 1.2 + Math.random() * 0.25);
    ctx.fillStyle = DECAY_COLORS[Math.floor(Math.random() * DECAY_COLORS.length)];
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.globalAlpha = 1;
}

function randomStep() {
    return Math.floor(Math.random() * 3) - 1;
} 

function pickCell() {
    if (touchedCells.length > 0 && Math.random() < SPREAD_CHANCE) {
        for (let attempt = 0; attempt < 8; attempt++) {
            const from = touchedCells[Math.floor(Math.random() * touchedCells.length)];
            const col = (from % cols) + randomStep();
            const row = Math.floor(from/cols) + randomStep();
            if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
            const neighbour = row * cols + col;
            if (state[neighbour] === ALIVE) return neighbour;
        }
    }

    while (shufflePos < shuffledOrder.length) {
        const candidate = shuffledOrder[shufflePos++];
        if (state[candidate] === ALIVE) return candidate;
    }
    return -1;
}

function claimCell(index, instant) {
    touchedCells.push(index);
    if (instant) {
        state[index] = DEAD;
        paintDeadCell(index);
        return;
    }

    state[index] = DYING;
    bornAt[index] = performance.now();
    lifeLen[index] = DYING_MS * (1 - DYING_JITTER + Math.random());
    dyingCells.push(index);
}

function killCells(count, instant) {
    for (let i = 0; i < count; i++) {
        const index = pickCell();
        if (index === -1) return;
        claimCell(index, instant);
    }
}

function tick() {
    tickTimer = null;
    try {
        const elapsed = performance.now() - startTime - START_DELAY_MS;
        const progress = Math.min(1, Math.max(0, elapsed / TOTAL_DURATION_MS));
        const totalCells = cols * rows;
        const targetCount = Math.round(Math.pow(progress, EASE_POWER) * totalCells);

        killCells(targetCount - touchedCells.length, false);

        if (touchedCells.length >= totalCells) {
            finished = true;
            return;
        }
    } catch(err) {
        console.error("Dissolve tick failed:", err);
    }

    tickTimer = setTimeout(tick, TICK_MS * (0.5 + Math.random()));
}

function frame(now) {
    try {
        for (let n = dyingCells.length - 1; n >= 0; n--) {
            const index = dyingCells[n];
            if (now - bornAt[index] >= lifeLen[index]) {
                state[index] = DEAD;
                paintDeadCell(index);
                dyingCells[n] = dyingCells[dyingCells.length - 1];
                dyingCells.pop();
            } else {
                paintDyingCell(index, now);
            }
        }
    } catch(err) {
        console.error("Pixel decay frame failed:", err);
    }

    if (finished && dyingCells.length === 0) {
        frameId = null;
        return;
    }
    frameId = requestAnimationFrame(frame);
}

function stopEffect() {
    clearTimeout(tickTimer);
    cancelAnimationFrame(frameId);
    tickTimer = null;
    frameId = null;
}

function startEffect() {
    stopEffect();
    setupGrid();
    finished = false;
    startTime = performance.now();
    tickTimer = setTimeout(tick, 0);
    frameId = requestAnimationFrame(frame);
}

function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth === width && window.innerHeight === height) return;

        try {
            const progressFraction = touchedCells.length / (cols * rows);
            setupGrid();
            killCells(Math.round(progressFraction * cols * rows), true);
        } catch (err) {
            console.error("Dissolve resize failed:", err);
        }
    }, 200);
}

function handleKeydown(event) {
    if (!RESTART_KEY) return;
    if (event.key.toLowerCase() === RESTART_KEY) startEffect();
}

function cleanUp() {
    stopEffect();
    clearTimeout(resizeTimer);
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("keydown", handleKeydown);
    cancelAnimationFrame(maskFrameId);
    window.removeEventListener("scroll", scheduleMaskRefresh);
    window.removeEventListener("load", scheduleMaskRefresh);
}

function init() {
    // if (RESPECT_REDUCED_MOTION && window.matchMedia("(prefers-reduced-motion : reduce)").matches) {
    //     console.info("Dissolve skipped, reduced motion is turned on in your settings");
    //     return;
    // }

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("beforeunload", cleanUp);
    window.addEventListener("scroll", scheduleMaskRefresh, {passive: true});
    window.addEventListener("load", scheduleMaskRefresh);
    if (document.fonts) document.fonts.ready.then(scheduleMaskRefresh);

    hiddenImage.onload = startEffect;
    hiddenImage.onerror = () => {
        console.error(`Could not load ${HIDDEN_IMAGE_SRC}`);
        imageSource = makeFallbackSource();
        startEffect();
    };
    hiddenImage.src = HIDDEN_IMAGE_SRC;
}

init();