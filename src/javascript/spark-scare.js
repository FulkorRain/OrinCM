import { stateManager, EVENT_INTENSITY_CHANGED } from './managers/state-manager.js';
import { isEffectsEnabled } from './managers/targets.js';
import { createEarwigBalls } from './spark-earwigs.js';
import { HIGH_INFECTION } from './scare-settings.js';

const SETTINGS = {
    lightsOutFrom: HIGH_INFECTION,
    swappedChance: 0.25,
};

const TORCHES_OUT = {
    left: new URL('../assets/images/spark_torch_out_left.png', import.meta.url).href,
    right: new URL('../assets/images/spark_torch_out_right.png', import.meta.url).href,
};
const LIT_BACKGROUND = new URL('../assets/images/spark_background.png', import.meta.url).href;

const root = document.documentElement;
const torches = Array.from(document.querySelectorAll('[data-torch]'));
const litSources = torches.map(torch => torch.getAttribute('src'));

let lightsAreOut = false;
let earwigs = null;

function lightsOut() {
    lightsAreOut = true;

    [LIT_BACKGROUND, ...litSources].forEach(src => { new Image().src = src; });

    root.classList.add('spark-lights-out');
    torches.forEach(torch => { torch.src = TORCHES_OUT[torch.dataset.torch]; });

    document.body.setAttribute('data-effects-skip', 'all');

    earwigs = createEarwigBalls(document.querySelector('.bug-zone'), lightsOn);
}

function lightsOn() {
    if (!lightsAreOut) return;
    lightsAreOut = false;

    earwigs.scatter();

    root.classList.remove('spark-lights-out');
    torches.forEach((torch, i) => { torch.src = litSources[i]; });
    document.body.removeAttribute('data-effects-skip');
}

const level = isEffectsEnabled() ? stateManager.getIntensity() : 0;

if (level >= SETTINGS.lightsOutFrom) {
    lightsOut();
} else if (level > 0 && Math.random() < SETTINGS.swappedChance) {
    root.classList.add('spark-swapped');
}
root.classList.remove('spark-pending');

document.querySelectorAll('.sidebar-btn').forEach(link => link.addEventListener('click', lightsOn));

document.addEventListener(EVENT_INTENSITY_CHANGED, event => {
    if (event.detail.intensity !== 0) return;
    root.classList.remove('spark-swapped');
    lightsOn();
});
