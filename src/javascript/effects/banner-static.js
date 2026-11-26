import {gsap} from 'gsap';
import {stateManager, MIN_INTENSITY, MAX_INTENSITY, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED} from '../managers/state-manager.js';
import { isEffectsEnabled } from '../managers/targets.js';
import { getBannerTargets } from '../managers/banner-manager.js';
import { BANNER_STATIC as SETTINGS} from '../managers/effect-config.js';

const EFFECT_ID = 'banner-static';

let isActive = false;
let frameTimer = null;
let overlays = [];

function _randomBetween(min, max) {
    return min + Math.random() * (max- min);
}

function _getAlpha() {
    const intensity = stateManager.getIntensity();
    const progress = Math.max(0, Math.min(1, (intensity - MIN_INTENSITY) / (MAX_INTENSITY - MIN_INTENSITY)));
    return SETTINGS.alphaAtLowest + progress * (SETTINGS.alphaAtHighest - SETTINGS.alphaAtLowest);
}

function _createOverlay(banner) {
    const rect = banner.element.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width / SETTINGS.cellSize));
    const height = Math.max(1, Math.round(rect.height / SETTINGS.cellSize));

    const canvas = document.createElement('canvas');
    canvas.className = 'banner-ad__static';
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute('aria-hidden', 'true');
    banner.element.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    return {canvas, ctx, width, height, image: ctx.createImageData(width, height)};
}

function _drawFrame(overlay) {
    const {ctx, width, height, image} = overlay;
    const data = image.data;
    const alpha = _getAlpha() * 255;

    for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = alpha;
    }

    if (Math.random() < SETTINGS.tearChance) {
        const bandHeight = Math.max(1, Math.round(height * _randomBetween(SETTINGS.tearMinFraction, SETTINGS.tearMaxFraction)));
        const top = Math.floor(Math.random() * Math.max(1, height - bandHeight));
        for (let y = top; y < Math.min(height, top + bandHeight); y++) {
            for (let x = 0; x < width; x++) {
                data[(y * width + x) * 4 + 3] = 255;
            }
        }
    }

    ctx.putImageData(image, 0, 0);
}

function _renderAll() {
    overlays.forEach(_drawFrame);
}

function stop({notify = false} = {}) {
    if (!isActive) return;

    clearInterval(frameTimer);
    frameTimer = null;
    
    overlays.forEach(({canvas}) => {
        gsap.to(canvas, {
            duration: SETTINGS.fadeOutSeconds,
            opacity: 0,
            ease: 'none',
            overwrite: 'auto',
            onComplete: () => canvas.remove()
        });
    });

    overlays = [];
    isActive = false;

    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: {id: EFFECT_ID},
        }));
    }
}

function start() {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    const found = getBannerTargets({max: SETTINGS.maxBanners});
    if (found.length === 0) return false;
    
    overlays = found.map(_createOverlay);
    isActive = true;

    overlays.forEach(({canvas}) => {
        gsap.fromTo(canvas, {opacity: 0}, {opacity: 1, duration: SETTINGS.fadeInSeconds, ease: 'none'});
    });

    _renderAll();
    frameTimer = setInterval(_renderAll, SETTINGS.frameMs);
    return true;
}

function bannerStatic() {
    if (isActive) stop();
    else start();
    return isActive;
}

bannerStatic.id = EFFECT_ID;
bannerStatic.minIntensity = SETTINGS.minIntensity;
bannerStatic.start = start;
bannerStatic.stop = stop;
bannerStatic.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => stop({notify: true}));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) stop({notify: true});
});

export {bannerStatic};
