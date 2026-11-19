import '../styles/effects.css';

import {
    stateManager,
    MIN_INTENSITY,
    MAX_INTENSITY,
    EVENT_INTENSITY_CHANGED,
    EVENT_INFECTION_CURED
} from './managers/state-manager.js';
import { isEffectsEnabled } from './managers/targets.js';
import { DIRECTOR, DIRECTOR_EFFECTS } from './managers/effect-config.js';
import { director } from './managers/director.js';

import { chaosText } from './effects/chaos-text.js';
import { corruptText } from './effects/text-corruption.js';
import { permanentCorruption } from './effects/permanent-corruption.js';
import { flicker } from './effects/flicker.js';
import { screenShake } from './effects/screen-shake.js';
import { imageWarp } from './effects/image-warp.js';
import { screenDecay } from './effects/screen-decay.js';
import { permanentDissolve } from './effects/permanent-dissolve.js';
import { messageSwap } from './effects/message-swap.js';
import { permanentDecay } from './effects/permanent_decay.js';

const LAB = {
    startLevel: 5,
    refreshMs: 250,
    noteMs: 4000,
    storageKeys: [
        'golem_spooky_intensity',
        'golem_effects_state',
        'golem_infection_cured',
        'golem_page_visits'
    ],
    overrideKey: 'golem_effects_override'
};

const EFFECTS = [
    {
        effect: chaosText,
        name: 'Chaos Text',
        info: 'Scrambles up to 6 visible text blocks with block glyphs for a second or two, then restores them.'
    },
    {
        effect: corruptText,
        name: 'Text Corruption',
        info: 'Hieroglyph glitches hit one text block in short bursts, with a pause between bursts. Runs until stopped.',
        startArgs: [undefined, { pauseMinMs: 2500, pauseMaxMs: 4000 }]
    },
    {
        effect: permanentCorruption,
        name: 'Permanent Corruption',
        info: 'Replaces a fixed set of characters with glyphs and keeps them that way. Saved across reloads.'
    },
    {
        effect: flicker,
        name: 'Flicker',
        info: 'Flickers the whole page. Scanlines are added at level 8 and a vignette at level 10.'
    },
    {
        effect: screenShake,
        name: 'Screen Shake',
        info: 'Shakes the stage. Gets stronger at levels 6 and 10.'
    },
    {
        effect: imageWarp,
        name: 'Image Warp',
        info: 'Stretches, skews and color-shifts one visible image.'
    },
    {
        effect: screenDecay,
        name: 'Screen Decay',
        info: 'Dark squares eat away at the screen, up to 20% coverage. Not saved.'
    },
    {
        effect: permanentDissolve,
        name: 'Permanent Dissolve',
        info: 'The banner image dissolves over the screen in blocks. Saved across reloads.'
    },
    {
        effect: messageSwap,
        name: 'Message Swap',
        info: 'Replaces one long piece of text with a message for a few seconds. It needs text of 30+ characters on screen.'
    },
    {
        effect: permanentDecay,
        name: 'Permanent Decay',
        info: 'One section of the page slowly fills with dead squares. Saved across reloads.'
    }
];

const levelSlider = document.getElementById('level-slider');
const levelValue = document.getElementById('level-value');
const banner = document.getElementById('lab-banner');
const noteElement = document.getElementById('lab-note');
const effectList = document.getElementById('effect-list');
const activeCount = document.getElementById('active-count');
const directorButton = document.getElementById('director-toggle');
const startAllButton = document.getElementById('start-all');
const stopAllButton = document.getElementById('stop-all');
const cureButton = document.getElementById('cure-button');
const resetButton = document.getElementById('reset-button');

const cards = [];

function buildCards() {
    EFFECTS.forEach(item => {
        const settings = DIRECTOR_EFFECTS[item.effect.id] || {};

        const card = document.createElement('div');
        card.className = 'effect-card';
        card.innerHTML = `
            <div class="effect-card__top">
                <span class="effect-dot"></span>
                <h3 class="effect-card__name">${item.name}</h3>
                <span class="badge">${settings.mode || 'manual'}</span>
                <span class="badge badge--level">level ${item.effect.minIntensity}+</span>
            </div>
            <p class="effect-card__info">${item.info}</p>
            <div class="effect-card__controls">
                <button type="button" class="btn btn--small effect-toggle">Start</button>
                <label class="effect-pool">
                    <input type="checkbox" class="effect-pool__box"> Director may use
                </label>
            </div>
        `;

        effectList.appendChild(card);
        const entry = {
            item,
            dot: card.querySelector('.effect-dot'),
            levelBadge: card.querySelector('.badge--level'),
            button: card.querySelector('.effect-toggle'),
            pool: card.querySelector('.effect-pool__box')
        };

        const allowed = settings.enabled !== false;
        entry.pool.checked = allowed;
        entry.pool.disabled = !allowed;
        if (!allowed) entry.pool.title ='Disabled in DIRECTOR_EFFECTS';
        entry.button.addEventListener('click', () => toggleEffect(item));
        entry.pool.addEventListener('change', updateSkipList);

        cards.push(entry);
    });
}

function startEffect(item) {
    const {effect} = item;
    if (effect.restore) stateManager.clearEffectState(effect.id);

    const started = effect.start(...(item.startArgs || []));
    if (!started) {
        showNote(`${item.name} did not start. Check the level, the red banner, or whether its targets are on screen`);
    }
}

function toggleEffect(item) {
    if (item.effect.isActive()) item.effect.stop();
    else startEffect(item);
    refresh();
}

function startAll() {
    EFFECTS.forEach(item => {
        if (!item.effect.isActive()) startEffect(item);
    });
    refresh();
}

function stopAll() {
    EFFECTS.forEach(({effect}) => {
        if (effect.isActive()) effect.stop();
    })
}

function syncLevel() {
    const level = stateManager.getIntensity();
    levelSlider.value = level;
    levelValue.textContent = level;
}

function setLevel(value) {
    stateManager.setIntensity(value);
    syncLevel();
}

function updateSkipList() {
    const skipped = cards.filter(entry => !entry.pool.checked).map(entry => entry.item.effect.id);
    document.body.setAttribute(director.skipAttribute, skipped.join(','));
}

function toggleDirector() {
    if (director.isRunning()) director.stop();
    else director.start();
    refresh();
}

let noteTimer = null;

function showNote(text) {
    noteElement.textContent = text;
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => {noteElement.textContent = '';}, LAB.noteMs)
}

function updateBanner() {
    const problems = [];

    if (!isEffectsEnabled()) {
        problems.push('Effects are switched OFF. Press Reset everything, or load this page with ?effects=on');
    }

    if (stateManager.isCured()) {
        problems.push('This browser is marked as CURED, so the level is locked at 0. Press Reset everything');
    }

    banner.textContent = problems.join(' ');
    banner.hidden = problems.length === 0;
}

function refresh() {
    const level = stateManager.getIntensity();
    const directorOn = director.isRunning();
    let activeTotal = 0;
    cards.forEach(({item, dot, levelBadge, button}) => {
        const active = item.effect.isActive();
        if (active) activeTotal++;

        dot.classList.toggle('is-on', active);
        levelBadge.classList.toggle('is-met', level >= item.effect.minIntensity);
        button.textContent = active ? 'Stop' : 'Start';
        button.classList.toggle('btn--stop', active);
        button.disabled = directorOn;
    });


    activeCount.textContent = activeTotal;
    startAllButton.disabled = directorOn;
    directorButton.textContent = directorOn ? 'Stop Director' : 'Start Director';
    directorButton.classList.toggle('btn--stop', directorOn);
}

function testCure() {
    stateManager.cure();
    updateBanner();
    refresh();
    showNote('Cured. Everything stopped. Levels stay locked until you push Reset Everything.');
}

function resetEverything() {
    director.stop();
    stopAll();

    try{
        LAB.storageKeys.forEach(key => localStorage.removeItem(key));
        localStorage.removeItem(LAB.overrideKey);
        sessionStorage.removeItem(LAB.overrideKey);
    } catch {

    }

    location.assign(location.pathname);
}

function restoreSaved() {
    EFFECTS.forEach(({effect}) => {
        if (effect.restore && stateManager.hasEffectState(effect.id)) effect.restore();
    });
}

function init() {
    buildCards();
    updateSkipList();

    levelSlider.min = MIN_INTENSITY;
    levelSlider.max = MAX_INTENSITY;

    levelSlider.addEventListener('input', () => setLevel(Number(levelSlider.value)));
    document.querySelectorAll('[data-level]').forEach(button => {
        button.addEventListener('click', () => setLevel(Number(button.dataset.level)))
    });
    directorButton.addEventListener('click', toggleDirector);
    startAllButton.addEventListener('click', startAll);
    stopAllButton.addEventListener('click', stopAll);
    cureButton.addEventListener('click', testCure);
    resetButton.addEventListener('click', resetEverything);

    document.addEventListener(EVENT_INTENSITY_CHANGED, () => {
        syncLevel();
        updateBanner();
        refresh();
    });

    document.addEventListener(EVENT_INFECTION_CURED, () => {
        updateBanner();
        refresh();
    });

    if (stateManager.getStoredIntensity() < MIN_INTENSITY) {
        stateManager.setIntensity(LAB.startLevel);
    }

    syncLevel();
    updateBanner();
    restoreSaved();
    refresh();
    setInterval(refresh, LAB.refreshMs);
}

init();

