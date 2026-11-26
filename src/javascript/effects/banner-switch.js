import {stateManager, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED} from '../managers/state-manager.js';
import { isEffectsEnabled } from '../managers/targets.js'; 
import {getBannerTargets, canShow, showVariant, restoreBase} from '../managers/banner-manager.js';
import { BANNER_SWITCH as SETTINGS } from '../managers/effect-config.js';

const EFFECT_ID = 'banner-switch';

let isActive = false;
let targets = [];

function _getOptions(banner) {
    const rules = SETTINGS.rules[banner.base] || {};
    return Object.keys(rules).filter(variant => rules[variant] > 0 && canShow(banner, variant));
}

function _rollVariant(banner) {
    const rules = SETTINGS.rules[banner.base];
    const options = _getOptions(banner);
    const total = options.reduce((sum, variant) => sum + rules[variant], 0);

    let roll = Math.random() * total;
    for (const variant of options) {
        roll -= rules[variant];
        if (roll <= 0) return variant;
    }
    return options[options.length - 1];
}

function stop ({notify = false} = {}) {
    if (!isActive) return;

    targets.forEach(banner => restoreBase(banner));
    targets = [];
    isActive = false;

    if (notify) {
        document.dispatchEvent(new CustomEvent('effect-ended', {
            detail: {id: EFFECT_ID}
        }));
    }
}

function start() {
    if (isActive) return false;
    if (!isEffectsEnabled()) return false;
    if (stateManager.getIntensity() === 0) return false;

    const found = getBannerTargets({max: SETTINGS.maxBanners, filter: banner => _getOptions(banner).length > 0});
    if (found.length === 0) return false;

    targets = found;
    isActive = true;
    targets.forEach(banner => showVariant(banner, _rollVariant(banner)));
    return true;
}

function bannerSwitch() {
    if (isActive) stop();
    else start();
    return isActive;
}

bannerSwitch.id = EFFECT_ID;
bannerSwitch.minIntensity = SETTINGS.minIntensity;
bannerSwitch.start = start;
bannerSwitch.stop = stop;
bannerSwitch.isActive = () => isActive;

document.addEventListener(EVENT_INFECTION_CURED, () => stop({notify: true}));
document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (event.detail.intensity === 0) stop({notify: true});
});

export {bannerSwitch};