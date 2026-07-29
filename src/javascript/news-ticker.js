const RING_TEXT = 'THE FOURTH ESTATE';
const ring = document.getElementById('textStage');
const stageWidth = ring.clientWidth;
const stageHeight = ring.clientHeight;

const FONT_SIZE = stageWidth * 0.15;
const LETTER_SPACING = FONT_SIZE * 0.62;
const SPACE_WIDTH = FONT_SIZE * 0.35;
const TRAVEL_SPEED = stageWidth * 0.3;
const FIXED_Y = stageHeight * 0.125;
const SKULL_LEFT_EDGE = -stageWidth * 0.25;
const FADE_MARGIN = stageWidth * 0.12;
const SPAWN_BUFFER = LETTER_SPACING;

const chars = [...RING_TEXT];

const fragment = document.createDocumentFragment();
let cursor = 0;
const letters = chars.map((char, i) => {
    const element = document.createElement('span');
    element.className = 'ring-word';
    element.textContent = char;
    element.style.fontSize = `${FONT_SIZE}px`;
    fragment.appendChild(element);

    const width = char === ' ' ? SPACE_WIDTH : LETTER_SPACING;
    const offset = cursor;
    cursor += width;

    return {element, offset};
});
ring.appendChild(fragment);

const phraseWidth = cursor;
const stageHalfWidth = stageWidth / 2;
const startX = stageHalfWidth + SPAWN_BUFFER;
const endX = SKULL_LEFT_EDGE - phraseWidth - FADE_MARGIN;

function clamp (value, min, max) {
    return Math.min(max, Math.max(min, value));
}

let phraseX = startX;
let lastTime = performance.now();

function animate(now) {
    const deltaSeconds = (now - lastTime) / 1000;
    lastTime = now;

    phraseX -= TRAVEL_SPEED * deltaSeconds;
    if (phraseX < endX) phraseX = startX;

    letters.forEach(({element, offset}) => {
        const x = phraseX + offset;

        let opacity;
        if (x >= SKULL_LEFT_EDGE) {
            opacity = 1;
        } else {
            const distancePastEdge = SKULL_LEFT_EDGE - x;
            opacity = clamp(1- distancePastEdge / FADE_MARGIN, 0, 1);
        }

        let transform = `translate(-50%, -50%) translate3d(${x}px, ${FIXED_Y}px, 0)`;

        element.style.transform = transform;
        element.style.opacity = opacity;
    }); 

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);