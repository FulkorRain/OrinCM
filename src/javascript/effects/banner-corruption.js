import { stateManager, MIN_INTENSITY, MAX_INTENSITY, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED } from '../managers/state-manager.js';
import { isEffectsEnabled } from '../managers/targets.js';
import { getBannerTargets, setBase, resetAllBanners, VARIANT } from '../managers/banner-manager.js';
import { BANNER_CORRUPTION as SETTINGS } from '../managers/effect-config.js';

const EFFECT_ID = 'banner-corruption';

let isActive = false;

function _getProgress() {
    const intensity = stateManager.getIntensity();
    return Math.max(0, Math.min(1, (intensity - MIN_INTENSITY) / (MAX_INTENSITY - MIN_INTENSITY)));
}

function _chance (atLowest, atHighest) {
    return atLowest + _getProgress() * (atHighest - atLowest);
}

function _rollVariant() {
    const specialChance = _chance(SETTINGS.specialChanceAtLowest, SETTINGS.specialChanceAtHighest);
    const corruptChance = _chance(SETTINGS.corruptChanceAtLowest, SETTINGS.corruptChanceAthighest);
    const roll = Math.random();

    if (roll < specialChance) return VARIANT.SPECIAL;
    if (roll < specialChance + corruptChance) return VARIANT.CORRUPT;
    return VARIANT.NORMAL;
}

function stop({notify = false} = {}) {
    if (!isActive) return;

    isActive = false;
    resetAllBanners();
    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: {id: EFFECT_ID}
        }));
    }
}

function start() {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if(stateManager.getIntensity() === 0) return false;
    if (performance.now() > SETTINGS.rollWindowMs) return false;

    const found = getBannerTargets({max: Infinity});

    let changed = 0;
    found.forEach(banner => {
        const variant  = _rollVariant();
        if (variant === VARIANT.NORMAL) return;
        setBase(banner, variant);
        changed ++;
    });

    isActive = changed > 0;
    return isActive;
}

function bannerCorruption() {
    if (isActive) stop();
    else start();
    return isActive;
}

bannerCorruption.id = EFFECT_ID;
bannerCorruption.minIntensity = SETTINGS.minIntensity;
bannerCorruption.start = start;
bannerCorruption.stop = stop;
bannerCorruption.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => stop({notify: true}));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) stop({notify: true});
});

export {bannerCorruption};