import { stateManager } from "../managers/state-manager.js";

let isActive = false;

const SHAKE_CLASSES = ['shaking-low', 'shaking-mid', 'shaking-high'];

function _getShakeClass() {
    const intensity = stateManager.getIntensity();
    if (intensity <= 3) return SHAKE_CLASSES[0];
    if (intensity <= 7) return SHAKE_CLASSES[1];
    return SHAKE_CLASSES[2];
}

function _clearShake() {
    const app = document.getElementById('app');
    SHAKE_CLASSES.forEach(cls => app.classList.remove(cls));
}

function screenShake() {
    const app = document.getElementById('app');
    isActive = !isActive;

    if (isActive) {
        _clearShake();
        app.classList.add(_getShakeClass());
    } else {
        _clearShake();
    }

    return isActive;
}

screenShake.isActive = () => isActive;

export { screenShake };