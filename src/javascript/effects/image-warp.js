import {gsap} from 'gsap';
import {stateManager, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED} from '../managers/state-manager.js';
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

function _warpImage(img, n) {
    const hue = _randomBetween(-SETTINGS.huePerLevel, SETTINGS.huePerLevel) * n;
    const blur = _randomBetween(0, SETTINGS.blurPerLevel) * n;
    const saturate = Math.max(0, 1 + _randomBetween(-SETTINGS.saturatePerLevel, SETTINGS.saturatePerLevel) * n);

    gsap.to(img, {
        duration: SETTINGS.warpSeconds,
        scaleX: 1 + _randomBetween(-SETTINGS.scaleXPerLevel, SETTINGS.scaleXPerLevel) * n,
        scaleY: 1 + _randomBetween(-SETTINGS.scaleYPerLevel, SETTINGS.scaleYPerLevel) * n,
        skewX: _randomBetween(-SETTINGS.skewXPerLevel, SETTINGS.skewXPerLevel) * n,
        skewY: _randomBetween(-SETTINGS.skewYPerLevel, SETTINGS.skewYPerLevel) * n,
        filter: `hue-rotate(${hue}deg) blur(${blur}px) saturate(${saturate})`,
        ease: 'power1.inOut',
        overwrite: 'auto'
    });
}

function _tick() {
    const n = stateManager.getIntensity();
    targets.forEach(img => {
        if (img.isConnected) _warpImage(img, n);
    });
}

function stop({notify = false} = {}) {
    if (!isActive) return;

    clearInterval(tickTimer);
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
    if (_motionBlocked()) return false;

    const found = getImageTargets({root, max: SETTINGS.maxImages});
    if (found.length === 0) return false;

    targets = found;
    isActive = true;

    gsap.set(targets, {filter: NEUTRAL_FILTER});
    _tick();
    tickTimer = setInterval(_tick, SETTINGS.intervalMs);
    return true;
}

function imageWarp(root) {
    if (isActive) stop();
    else start(root);
    return isActive;
}

imageWarp.id = EFFECT_ID,
imageWarp.minIntensity = SETTINGS.minIntensity;
imageWarp.permanent = false;
imageWarp.continuous = false;
imageWarp.start = start;
imageWarp.stop = stop;
imageWarp.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => stop ({notify: true}));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) stop({notify: true});
});

export {imageWarp};