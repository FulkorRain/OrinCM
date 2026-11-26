import {gsap} from 'gsap';
import {stateManager, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED, MIN_INTENSITY, MAX_INTENSITY} from '../managers/state-manager.js';
import {getImageTargets, isEffectsEnabled} from '../managers/targets.js';
import { IMAGE_WARP as SETTINGS} from '../managers/effect-config.js';

const EFFECT_ID = 'image-warp';

const NEUTRAL_FILTER = 'hue-rotate(0deg) blur(0px) saturate(1)';

let isActive = false;
let tickTimer = null;
let targets = [];

function _randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function _getIntervalMs() {
    const intensity = stateManager.getIntensity();
    const progress = Math.max(0, Math.min(1, (intensity - MIN_INTENSITY) / (MAX_INTENSITY - MIN_INTENSITY)));
    const base = SETTINGS.intervalAtLowestMs + progress * (SETTINGS.intervalAtHighestMs - SETTINGS.intervalAtLowestMs);
    return base * _randomBetween(0.7, 1.3);
}

function _warpImage(img) {
    const hue = _randomBetween(-SETTINGS.hue, SETTINGS.hue);
    const blur = _randomBetween(0, SETTINGS.blur);
    const saturate = Math.max(0, 1 + _randomBetween(-SETTINGS.saturate, SETTINGS.saturate));

    gsap.to(img, {
        duration: SETTINGS.warpSeconds,
        scaleX: 1 + _randomBetween(-SETTINGS.scaleX, SETTINGS.scaleX),
        scaleY: 1 + _randomBetween(-SETTINGS.scaleY, SETTINGS.scaleY),
        skewX: _randomBetween(-SETTINGS.skewX, SETTINGS.skewX),
        skewY: _randomBetween(-SETTINGS.skewY, SETTINGS.skewY),
        filter: `hue-rotate(${hue}deg) blur(${blur}px) saturate(${saturate})`,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: 1,
        overwrite: 'auto'
    });
}

function _tick() {
    if (!isActive) return;
    targets.forEach(img => {
        if (img.isConnected) _warpImage(img);
    });
    tickTimer = setTimeout(_tick, _getIntervalMs());
}

function stop({notify = false} = {}) {
    if (!isActive) return;

    clearTimeout(tickTimer);
    tickTimer = null;

    targets.forEach(img => {
        if (!img.isConnected) return;
        gsap.to(img, {
            duration: SETTINGS.resetSeconds,
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
            skewY: 0,
            filter: NEUTRAL_FILTER,
            ease: 'power2.out',
            overwrite: 'auto',
            clearProps: 'transform,filter'
        });
    });
    targets = [];
    isActive = false;

    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: {id: EFFECT_ID},
        }));
    }
}

function start(root) {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    const found = getImageTargets({root, max: SETTINGS.maxImages});
    if (found.length === 0) return false;

    targets = found;
    isActive = true;

    gsap.set(targets, {filter: NEUTRAL_FILTER});
    _tick();
    return true;
}

function imageWarp(root) {
    if (isActive) stop();
    else start(root);
    return isActive;
}

imageWarp.id = EFFECT_ID;
imageWarp.minIntensity = SETTINGS.minIntensity;
imageWarp.start = start;
imageWarp.stop = stop;
imageWarp.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => stop ({notify: true}));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) stop({notify: true});
});

export {imageWarp};