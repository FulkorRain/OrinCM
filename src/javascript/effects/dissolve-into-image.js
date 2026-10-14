import {stateManager, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED, MAX_INTENSITY} from '../managers/state-manager.js';
import { PERMANENT_DISSOLVE as SETTINGS } from '../managers/effect-config.js';
import {isEffectsEnabled} from '../managers/targets.js';
import {createSeededRandom, newSeed} from '../managers/seeded-random.js';

const EFFECT_ID = 'permanent-dissolve';

const ALIVE = 0;
const DYING = 1;
const DEAD = 2;

let isActive = false;
let ready = false;
let runId = 0;
let seed = 0;

let canvas = null;
let ctx = null;
let imageSource = null;
let imageLayer = null;
let blockColors;

let dpr = 1;
let width = 0;
let height = 0;
let cols = 0;
let rows = 0;
let total = 0;
let state = new Uint8Array(0);
let order = new Uint32Array(0);
let pointer = 0;
let dying = [];
let carry = 0;

let protectedMask = new Uint8Array(0);
let frameId = null;
let maskFrameId = null;
let resizeTimer = null;
let lastFrame = 0;

const rect = {x: 0, y: 0, w: 0, h: 0};

function _createCanvas() {
    const element = document.createElement('canvas');
    element.setAttribute('data-effect-ui', '');
    element.setAttribute('aria-hidden', 'true');
    element.style.cssText = `
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index : ${SETTINGS.zIndex};
        opacity: 1;
        transition: opacity ${SETTINGS.fadeOutMs}ms ease;
    `;
    document.body.appendChild(element);
    return element;
}

function _removeCanvas(element) {
    if (SETTINGS.fadeOutMs > 0) {
        element.style.opacity = '0';
        setTimeout(() => element.remove(), SETTINGS.fadeOutMs);
    } else {
        element.remove();
    }
}

function _makeFallbackSource() {
    const fallback = document.createElement("canvas");
    fallback.width = 800;
    fallback.height = 600;
    const g = fallback.getContext("2d");
    const gradient = g.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, "#1a1a1a");
    gradient.addColorStop(1, "#8b2e2e");
    g.fillStyle = gradient;
    g.fillRect(0, 0, 800, 600);
    g.fillStyle = '#e8d5c4';
    g.font = "bold 48px serif";
    g.textAlign = "center";
    g.fillText("IMAGE NOT FOUND", 400, 310);
    return fallback;
}

function _loadImage(src) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
            console.error(`Permanent dissolve could not load ${src}`);
            resolve(_makeFallbackSource());
        };
        img.src = src;
    });
}

function _drawCover(targetCtx, source, w, h) {
    const sourceW = source.naturalWidth || source.width;
    const sourceH = source.naturalHeight || source.height;
    const scale = Math.max(w / sourceW, h / sourceH) * SETTINGS.imageZoom;
    const drawW = sourceW * scale;
    const drawH = sourceH  * scale;

    targetCtx.fillStyle = SETTINGS.imageBackground;
    targetCtx.fillRect(0,0, w, h);
    targetCtx.drawImage(source, (w - drawW) / 2, (h - drawH) /2, drawW, drawH);
}

function _buildImageLayer() {
    imageLayer = document.createElement("canvas");
    imageLayer.width = canvas.width;
    imageLayer.height = canvas.height;
    _drawCover(imageLayer.getContext("2d"), imageSource, imageLayer.width, imageLayer.height);

    blockColors = null;
    if (!SETTINGS.pixelatedReveal) return;

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

function _buildOrder(random) {
    const claimed = new Uint8Array(total);
    const result = new Uint32Array(total);

    const fallback = Array.from({length: total}, (_, i) => i);
    for (let i = total - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [fallback[i], fallback[j]] = [fallback[j], fallback[i]];
    }
    let fallbackPos = 0;

    for (let count = 0; count < total; count++) {
        let pick = -1;
        if (count > 0 && random() < SETTINGS.spreadChance) {
            for (let attempt = 0; attempt < 8; attempt++) {
                const from = result [Math.floor(random() * count)];
                const col = (from % cols) + Math.floor(random() * 3) - 1;
                const row = Math.floor(from/ cols) + Math.floor(random() * 3) - 1;
                if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
                const neighbour = row * cols + col;
                if (!claimed[neighbour]) {pick = neighbour; break}
            }
        }
        if (pick === -1) {
            while (claimed[fallback[fallbackPos]]) fallbackPos++;
            pick = fallback[fallbackPos++];
        }
    
        claimed[pick] = 1;
        result[count] = pick;
    }

    return result;
}

function _setRect(index) {
    const size = SETTINGS.cellSize;
    rect.x = (index % cols) * size;
    rect.y = Math.floor(index / cols) * size;
    rect.w = Math.min(size, width - rect.x);
    rect.h = Math.min(size, height - rect.y);
}

function _setupGrid() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.ceil(width / SETTINGS.cellSize);
    rows = Math.ceil(height / SETTINGS.cellSize);
    total = cols * rows;

    state = new Uint8Array(total);
    order = _buildOrder(createSeededRandom(String(seed)));
    pointer = 0;
    dying = [];
    carry = 0;
    protectedMask = _computeProtectedMask();

    _buildImageLayer();
}

function _computeProtectedMask() {
    const mask = new Uint8Array(cols * rows);
    if (!SETTINGS.protect) return mask;

    const size = SETTINGS.cellSize;
    const pad = SETTINGS.protectPaddingPx;
    const elements = document.querySelectorAll(SETTINGS.protect);
    for (const element of elements) {
        const box = element.getBoundingClientRect();
        if(box.width === 0 || box.height === 0) continue;

        const left = Math.max(0, Math.floor((box.left - pad) / size));
        const right = Math.min(cols - 1, Math.floor((box.right + pad) / size));
        const top = Math.max(0, Math.floor((box.top - pad) /size));
        const bottom = Math.min(rows - 1, Math.floor((box.bottom + pad) / size));

        for (let row = top; row <= bottom; row++) {
            for (let col = left; col <= right; col++) {
                mask[row*cols + col] = 1;
            }
        }
    }

    return mask;
}

function _refreshProtectedMask() {
    if (!ready) return;

    const newMask = _computeProtectedMask();
    for(let i = 0; i < newMask.length; i++) {
        if (newMask[i] === protectedMask[i]) continue;
        protectedMask[i] = newMask[i];
        if (state[i] === ALIVE) continue;

        if (newMask[i]) {
            _setRect(i);
            ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
        } else if (state[i] === DEAD) {
            _paintDeadCell(i);
        }
    }
}

function _scheduleMaskRefresh() {
    if (maskFrameId !== null || !ready) return;
    maskFrameId = requestAnimationFrame(() => {
        maskFrameId = null;
        try {
            _refreshProtectedMask();
        } catch (err) {
            console.error("Protected mask refresh failed:", err);
        }
    });
}

function _paintDeadCell(index) {
    if (protectedMask[index]) return;
    _setRect(index);
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

function _paintDyingCell(cell, now) {
    if (protectedMask[cell.index]) return;
    const progress = (now - cell.bornAt) / cell.life;
    _setRect(cell.index);
    ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
    ctx.globalAlpha = Math.min(1, progress * 1.2 + Math.random() * 0.25);
    ctx.fillStyle = SETTINGS.decayColors[Math.floor(Math.random() * SETTINGS.decayColors.length)];
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.globalAlpha = 1;
}

function _clearCell(index) {
    _setRect(index);
    ctx.clearRect(rect.x, rect.y, rect.w, rect.h);
}

function _getCoverage() {
    const intensity = stateManager.getIntensity();
    if (intensity <= 0) return 0;
    const share = Math.min(1, intensity / MAX_INTENSITY);
    return SETTINGS.maxCoverage * Math.pow(share, SETTINGS.coverageCurve);
}

function _getTargetCells() {
    return Math.round(total * _getCoverage());
}

function _claim(pos, now) {
    const index = order[pos];
    state[index] = DYING;
    dying.push({pos, index, bornAt: now, life: SETTINGS.dyingMs * (1- SETTINGS.dyingJitter + Math.random())});
}

function _grow(elapsedMs, now) {
    const remaining = _getTargetCells() - pointer;
    if (remaining <= 0) {
        carry = 0;
        return;
    }

    carry += (total / SETTINGS.secondsForFullScreen) * (elapsedMs / 1000);
    const count = Math.min(Math.floor(carry), remaining);
    carry -= count;

    for (let i = 0; i < count; i ++) {
        _claim (pointer, now);
        pointer++;
    }
}

function _updateDying(now) {
    for (let n = dying.length - 1; n >= 0; n--) {
        const cell = dying[n];
        if (now - cell.bornAt >= cell.life) {
            state[cell.index] = DEAD;
            _paintDeadCell(cell.index);
            dying[n] = dying[dying.length - 1];
            dying.pop();
        } else {
            _paintDyingCell(cell, now);
        }
    }
}

function _retreat(newPointer) {
    for (let pos = pointer - 1; pos >= newPointer; pos--) {
        const index = order[pos];
        state[index] = ALIVE;
        _clearCell(index);
    }
    dying = dying.filter(cell => cell.pos < newPointer);
    pointer = newPointer;
}

function _paintInstant(count) {
    for (let pos = 0; pos < count; pos++) {
        const index = order[pos];
        state[index] = DEAD;
        _paintDeadCell(index);
    }

    pointer = count;
}

function _frame(now) {
    frameId = null;
    if (!isActive) return;

    const elapsed = Math.min(100, Math.max(0, now - lastFrame));
    lastFrame = now;
    _grow(elapsed, now);
    _updateDying(now);

    if (pointer < _getTargetCells() || dying.length > 0) {
        frameId = requestAnimationFrame(_frame);
    }
}

function _wake() {
    if (frameId !== null || !ready) return;
    lastFrame = performance.now();
    frameId = requestAnimationFrame(_frame);
}

function _onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (!ready) return;
        if (window.innerWidth === width && window.innerHeight === height) return;
        try {
            const fraction = pointer / total;
            _setupGrid();
            _paintInstant(Math.round(fraction * total));
            _wake();
        } catch (err) {
            console.error('Permanent dissolve resize failed', err);
        }
    }, 200);
}

function _begin(withSeed, instant) {
    seed = withSeed;
    isActive = true;
    ready = false;
    const myRun = ++runId;
    canvas = _createCanvas();
    ctx = canvas.getContext('2d');

    const src = document.body.dataset.effectImage || SETTINGS.imageSrc;
    _loadImage(src).then(image => {
        if (!isActive || myRun !== runId) return;

        imageSource = image;
        _setupGrid();
        ready = true;

        window.addEventListener('resize', _onResize);
        window.addEventListener('scroll', _scheduleMaskRefresh, {passive: true});
        window.addEventListener('load', _scheduleMaskRefresh);
        if (document.fonts) document.fonts.ready.then(_scheduleMaskRefresh);
        _scheduleMaskRefresh();
        if (instant) _paintInstant(_getTargetCells());
        _wake();
    });
}

function _shutdown({notify = false, clearSaved = false} = {}) {
    if (!isActive) return;

    runId++;
    cancelAnimationFrame(frameId);
    cancelAnimationFrame(maskFrameId);
    clearTimeout(resizeTimer);
    frameId = null;
    maskFrameId = null;
    resizeTimer = null;
    window.removeEventListener('resize', _onResize);
    window.removeEventListener('scroll', _scheduleMaskRefresh);
    window.removeEventListener('load', _scheduleMaskRefresh);

    _removeCanvas(canvas);
    canvas = null;
    ctx = null;
    imageLayer = null;
    dying = [];
    ready = false;
    isActive = false;

    if (clearSaved) stateManager.clearEffectState(EFFECT_ID);
    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: {id: EFFECT_ID}
        }));
    }
}

function start () {
    if (isActive) return false;
    if (!isEffectsEnabled())  return false;
    if (stateManager.getIntensity() === 0) return false;

    const freshSeed = newSeed();
    stateManager.saveEffectState(EFFECT_ID, {seed: freshSeed});
    _begin(freshSeed, false);
    return true;
}

function stop() {
    _shutdown({clearSaved: true});
}

function restore() {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;
    const saved = stateManager.loadEffectState(EFFECT_ID);
    if (!saved || !Number.isFinite(saved.seed)) return false;
    _begin(saved.seed, true);
    return true;
}

function permanentDissolve() {
    if (isActive) stop();
    else start();
    return isActive;
}

permanentDissolve.id = EFFECT_ID;
permanentDissolve.minIntensity = SETTINGS.minIntensity;
permanentDissolve.permanent = true;
permanentDissolve.continuous = true;
permanentDissolve.start = start;
permanentDissolve.stop = stop;
permanentDissolve.restore = restore;
permanentDissolve.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => _shutdown({notify: true}));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) {
        _shutdown({notify: true});
        return;
    }

    if (!isActive || !ready) return;

    const target = _getTargetCells();
    if (target < pointer) _retreat(target);
    _wake();
});

export {permanentDissolve};