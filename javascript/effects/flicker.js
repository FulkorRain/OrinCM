import {stateManager} from "../managers/state-manager.js";

let isActive = false;
const FLICKER_CLASSES = ['flickering-low', 'flickering-mid', 'flickering-high'];

function _getFlickerClass() {
    const intensity = stateManager.getIntensity();
    if (intensity <= 3) return FLICKER_CLASSES[0];
    if (intensity <= 7) return FLICKER_CLASSES[1];
    return FLICKER_CLASSES[2];
}

function _clearFlicker() {
    FLICKER_CLASSES.forEach(cls => document.body.classList.remove(cls));
    document.body.classList.remove('scanlines');
    document.body.classList.remove('vignette');
}

function flicker() {
    isActive = !isActive;
    const intensity = stateManager.getIntensity();

    if (isActive) {
        _clearFlicker();
        document.body.classList.add(_getFlickerClass());
        if (intensity >= 4) document.body.classList.add('scanlines');
        if (intensity >= 8) document.body.classList.add('vignette');
    } else {
        _clearFlicker();
    }

    return isActive;
}

flicker.isActive = () => isActive;

export { flicker };