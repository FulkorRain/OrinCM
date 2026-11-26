import { gsap } from 'gsap';
import { stateManager, MIN_INTENSITY, MAX_INTENSITY, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED } from '../managers/state-manager.js';
import { isEffectsEnabled } from '../managers/targets.js';
import { getBannerTargets } from '../managers/banner-manager.js';
import { BANNER_SIZE as SETTINGS } from '../managers/effect-config.js';

const EFFECT_ID = 'banner-size';

let isActive = false;
let targets = [];

function _randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function _getZoom() {
    const intensity = stateManager.getIntensity();
    const progress = Math.max(0, Math.min(1, (intensity - MIN_INTENSITY) / (MAX_INTENSITY - MIN_INTENSITY)));   
    const base = SETTINGS.zoomAtLowest + progress * (SETTINGS.zoomAtHighest - SETTINGS.zoomAtLowest);
    return base * _randomBetween(1 - SETTINGS.zoomJitter, 1 + SETTINGS.zoomJitter);
}

function stop({ notify = false } = {}) {
    if (!isActive) return;

    targets.forEach(banner => {
        gsap.to(banner.stage, {
            duration: SETTINGS.zoomOutSeconds,
            scale: 1,
            ease: 'power2.out',
            overwrite: 'auto',
            clearProps: 'transform'
        });
    });

    targets = [];
    isActive = false;

    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: { id: EFFECT_ID }
        }));
    }
}

function start() {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    const found = getBannerTargets({ max: SETTINGS.maxBanners });
    if (found.length === 0) return false;

    targets = found;
    isActive = true;

    targets.forEach(banner => {
        gsap.set(banner.stage, {
            transformOrigin: `${_randomBetween(10, 90)}% ${_randomBetween(10, 90)}%`
        });

        gsap.to(banner.stage, {
            duration: SETTINGS.zoomInSeconds,
            scale: _getZoom(),
            ease: 'power3.out',
            overwrite: 'auto'
        });
    });
    return true;
}

function bannerSize() {
    if (isActive) stop();
    else start();
    return isActive;
}

bannerSize.id = EFFECT_ID;
bannerSize.minIntensity = SETTINGS.minIntensity;
bannerSize.start = start;
bannerSize.stop = stop;
bannerSize.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => stop({notify: true}));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) stop({notify: true});
});

export {bannerSize};