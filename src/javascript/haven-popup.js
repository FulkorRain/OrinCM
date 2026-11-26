
import { stateManager, EVENT_INTENSITY_CHANGED } from './managers/state-manager.js';
import { isEffectsEnabled } from './managers/targets.js';
import { SHELF_SEEN_KEY } from './scare-settings.js';

const DOLL_SRC = new URL('../assets/images/crawling_doll.gif', import.meta.url).href;
// swap the file (any size or shape) and update the text when the final art arrives
const POPUP_SRC = new URL('../assets/images/haven_alert_popup.png', import.meta.url).href;
const POPUP_TEXT = 'Emergency Alert System. Something has noticed you. Immediately cease all internet activity and deauthenticate all modems and routers.';

const DOLL_WIDTH = 80;
const DOLL_HEIGHT = 150;
const START_DELAY_MS = 1200;
const STEPS = 7;  
const STEP_MS = 380;
const REST_MS = 140;  
const SIDE_STEP_PX = 70;
const STOP_AT = 0.55;   
const POPUP_DELAY_MS = 500;
const LAYER = 1000000; 

let running = false;
let doll = null;
let popup = null;

function isWaiting() {
    try {
        return localStorage.getItem(SHELF_SEEN_KEY) === '1';
    } catch {
        return false;
    }
}

function isAllowed() {
    return isEffectsEnabled() && stateManager.getIntensity() > 0;
}

function load(src) {
    const image = new Image();
    image.src = src;
    return image.decode();
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));


function screenBox() {
    const view = window.visualViewport;
    return view
        ? { left: view.offsetLeft, top: view.offsetTop, width: view.width, height: view.height }
        : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
}

function makeDoll() {
    const element = document.createElement('img');
    element.className = 'haven-crawler';
    element.src = DOLL_SRC;
    element.alt = '';
    element.setAttribute('aria-hidden', 'true');
    element.setAttribute('data-effect-ui', '');
    element.style.cssText = `
        position: fixed; left: 0; top: 0; margin: 0; padding: 0; border: 0;
        width: ${DOLL_WIDTH}px; height: ${DOLL_HEIGHT}px; max-width: none;
        image-rendering: pixelated; pointer-events: none; z-index: ${LAYER};
    `;
    return element;
}

function crabwalk(element) {
    const screen = screenBox();
    const maxX = Math.max(0, screen.width - DOLL_WIDTH);
    const endY = Math.max(0, screen.height * STOP_AT - DOLL_HEIGHT / 2);
    let x = Math.random() * maxX;
    let side = Math.random() < 0.5 ? -1 : 1;

    const at = (px, py, tilt) => ({ transform: `translate(${screen.left + px}px, ${screen.top + py}px) rotate(${tilt}deg)` });
    const points = [{ x, y: -DOLL_HEIGHT }];
    for (let i = 1; i <= STEPS; i++) {
        x = Math.min(maxX, Math.max(0, x + side * SIDE_STEP_PX * (0.6 + Math.random() * 0.8)));
        points.push({ x, y: -DOLL_HEIGHT + (endY + DOLL_HEIGHT) * (i / STEPS), tilt: side * 14 });
        side = -side;
    }

    const total = STEPS * (STEP_MS + REST_MS);
    const frames = [{ ...at(points[0].x, points[0].y, 0), offset: 0 }];
    for (let i = 1; i <= STEPS; i++) {
        const from = points[i - 1];
        const to = points[i];
        const start = (i - 1) * (STEP_MS + REST_MS);
        frames.push({ ...at(from.x, from.y, to.tilt), offset: start / total });
        frames.push({ ...at(to.x, to.y, to.tilt), offset: (start + STEP_MS) / total });
    }
    frames.push({ ...at(points[STEPS].x, points[STEPS].y, 0), offset: 1 });

    return element.animate(frames, { duration: total, fill: 'forwards' }).finished;
}

function showPopup() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'haven-popup';
    button.setAttribute('data-effect-ui', '');
    button.style.cssText = `
        position: fixed; width: max-content; transform: translate(-50%, -50%);
        margin: 0; padding: 0; border: 0; background: none; cursor: pointer;
        line-height: 0; z-index: ${LAYER}; filter: drop-shadow(0 12px 30px rgba(0, 0, 0, .6));
    `;

    const image = document.createElement('img');
    image.src = POPUP_SRC;
    image.alt = POPUP_TEXT;
    image.style.cssText = `
        display: block; width: auto; height: auto;
        margin: 0; border: 0; pointer-events: none;
    `;

    function place() {
        const screen = screenBox();
        button.style.left = `${screen.left + screen.width / 2}px`;
        button.style.top = `${screen.top + screen.height / 2}px`;
        image.style.maxWidth = `${screen.width * 0.92}px`;
        image.style.maxHeight = `${screen.height * 0.9}px`;
    }

    const view = window.visualViewport || window;
    view.addEventListener('resize', place);
    view.addEventListener('scroll', place);

    button.appendChild(image);
    button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        view.removeEventListener('resize', place);
        view.removeEventListener('scroll', place);
        button.remove();
        popup = null;
    });
    place();
    document.body.appendChild(button);
    return button;
}

async function play() {
    if (running || popup || !isWaiting() || !isAllowed()) return;
    running = true;

    try {
        await Promise.all([load(DOLL_SRC), load(POPUP_SRC), wait(START_DELAY_MS)]);
        if (!isWaiting() || !isAllowed()) return;

        doll = makeDoll();
        document.body.appendChild(doll);
        await crabwalk(doll);
        await wait(POPUP_DELAY_MS);
        if (!isAllowed()) return;

        popup = showPopup();
        localStorage.removeItem(SHELF_SEEN_KEY);
    } catch (error) {
        console.warn('Haven popup could not play', error);
    } finally {
        if (doll) doll.remove();
        doll = null;
        running = false;
    }
}

document.addEventListener(EVENT_INTENSITY_CHANGED, event => {
    if (event.detail.intensity !== 0) return;
    if (doll) doll.remove();
    if (popup) popup.remove();
    popup = null;
});

window.addEventListener('pageshow', play);
