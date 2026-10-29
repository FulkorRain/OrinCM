import {stateManager, MIN_INTENSITY, MAX_INTENSITY, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED} from './state-manager.js';
import {isEffectsEnabled, pickRandom} from './targets.js';
import {DIRECTOR, DIRECTOR_EFFECTS} from './effect-config.js';

import { chaosText } from '../effects/chaos-text.js';
import { corruptText } from '../effects/text-corruption.js';
import { permanentCorruption } from '../effects/permanent-corruption.js';
import { flicker } from '../effects/flicker.js';
import { screenShake } from '../effects/screen-shake.js';
import { imageWarp } from '../effects/image-warp.js';
import { screenDecay } from '../effects/screen-decay.js';
import { permanentDissolve } from '../effects/permanent-dissolve.js';
import {messageSwap} from '../effects/message-swap.js';
import {permanentDecay} from '../effects/permanent_decay.js';

const registry = [];
[chaosText, corruptText, permanentCorruption, flicker, screenShake, imageWarp, screenDecay, permanentDissolve, messageSwap, permanentDecay].forEach(effect => {
    const settings = DIRECTOR_EFFECTS[effect.id];
    if (!settings) {
        console.warn(`No entry for ${effect.id} in DIRECTOR_EFFECTS`);
        return;
    }
    registry.push({effect, settings});
});

let running = false;
let tickTimer = null;
let quietUntil = 0;
const cooldownUntil = {};
const burstTimers = {};

function _randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function _pickFromRange(pair) {
    return _randomBetween(pair[0], pair[1]);
}

function _progress() {
    const intensity = stateManager.getIntensity();
    return Math.max(0, Math.min(1, (intensity - MIN_INTENSITY) / (MAX_INTENSITY - MIN_INTENSITY)));
}

function _maxConcurrent() {
    let intensity = stateManager.getIntensity();
    let max = 0;
    DIRECTOR.concurrencyTiers.forEach(tier => {
        if (intensity >= tier.fromLevel) max = tier.max;
    });
    return max;
}

function _countActive() {
    return registry.filter(entry => {
        if (!entry.effect.isActive()) return false;
        return DIRECTOR.countPermanentInCap || entry.settings.mode !== 'permanent';
    }).length;
}

function _hasRoom() {
    return _countActive() < _maxConcurrent();
}


function _gapMs() {
    return DIRECTOR.gapAtLowestMs + _progress() * (DIRECTOR.gapAtHighestMs - DIRECTOR.gapAtLowestMs);
}

function _isQuiet() {
    return performance.now() < quietUntil;
}

function _noteEffectStarted() {
    quietUntil = performance.now() + _gapMs();
}

function _getSkipped() {
    const raw = document.body.getAttribute(DIRECTOR.skipAttribute) || '';
    return new Set(raw.split(',').map(item => item.trim()).filter(Boolean));
}

function _isAllowed (entry, skipped) {
    return entry.settings.enabled !== false && !skipped.has(entry.effect.id) && !skipped.has('all');
}

function _isEligible(entry, skipped) {
    return _isAllowed(entry, skipped) && stateManager.getIntensity() >= entry.effect.minIntensity;
}

function _setCooldown(entry) {
    cooldownUntil[entry.effect.id] = performance.now() + _pickFromRange(entry.settings.cooldownMs);
}

function _clearBurstTimers() {
    Object.keys(burstTimers).forEach(id => {
        clearTimeout(burstTimers[id]);
        delete burstTimers[id];
    });
}

function _syncPermanent(skipped) {
    let startedNew = false;
    registry.forEach(entry => {
        const {effect, settings} = entry;
        if (settings.mode !== 'permanent') return;
        if (effect.isActive() || !_isAllowed(entry, skipped)) return;
        if (effect.restore()) return;

        if (startedNew || _isQuiet() || !_hasRoom()) return;
        if (stateManager.getIntensity() < effect.minIntensity) return;
        if (effect.start()) {
            startedNew = true;
            _noteEffectStarted();
        }
    });
}

function _syncAmbient(skipped) {
    registry.forEach(entry => {
        if (entry.settings.mode !== 'ambient') return;
        const {effect} = entry;
        const eligible = _isEligible(entry, skipped);

        if (!eligible && effect.isActive()) {
            effect.stop();
        } else if (eligible && !effect.isActive() && !_isQuiet() && _hasRoom()) {
            if (effect.start()) _noteEffectStarted();
        }
    });
}

function _endBurst(id) {
    delete burstTimers[id];
    const entry = registry.find(item => item.effect.id === id);
    if (!entry) return;

    if (entry.effect.isActive()) entry.effect.stop();
    _setCooldown(entry);
}

function _fire(entry) {
    const {effect, settings} = entry;
    const started = effect.start();

    if (!started) {
        cooldownUntil[effect.id] = performance.now() + DIRECTOR.retryAfterFailMs;
        return;
    }

    _noteEffectStarted();

    if (settings.mode === 'burst') {
        burstTimers[effect.id] = setTimeout(() => _endBurst(effect.id), _pickFromRange(settings.durationMs));
    }
}

function _rollTemporary(skipped) {
    if (_isQuiet() || !_hasRoom()) return;

    const now = performance.now();
    const temporary = registry.filter(entry => entry.settings.mode === 'burst' || entry.settings.mode === 'once');

    const chance = DIRECTOR.chanceAtLowest + _progress() * (DIRECTOR.chanceAtHighest - DIRECTOR.chanceAtLowest);
    if (Math.random() > chance) return;

    const candidates = temporary.filter(entry => _isEligible(entry, skipped) && !entry.effect.isActive() && now >= (cooldownUntil[entry.effect.id] || 0));
    if (candidates.length === 0) return;

    _fire(pickRandom(candidates, 1)[0]);
}

function _roll() {
    if (!isEffectsEnabled()) return;
    if (stateManager.getIntensity() === 0) return;

    const skipped = _getSkipped();
    _syncPermanent(skipped);
    _syncAmbient(skipped);
    if (!document.hidden) _rollTemporary(skipped);
}

function _scheduleTick(delay) {
    tickTimer = setTimeout(_tick, delay);
}

function _tick() {
    tickTimer = null;
    if (!running) return;

    try {
        _roll();
    } catch (error) {
        console.error('Director tick failed', error);
    }

    _scheduleTick(_randomBetween(DIRECTOR.tickMinMs, DIRECTOR.tickMaxMs));
}

function startDirector() {
    if (running) return;
    running = true;

    quietUntil = performance.now() + _randomBetween(DIRECTOR.startDelayMinMs, DIRECTOR.startDelayMaxMs);
    if (isEffectsEnabled() && stateManager.getIntensity() > 0) {
        const skipped = _getSkipped();
        _syncPermanent(skipped);
        _syncAmbient(skipped);
    }
    _scheduleTick(_randomBetween(DIRECTOR.tickMinMs, DIRECTOR.tickMaxMs));
}

function stopDirector() {
    running = false;
    clearTimeout(tickTimer);
    tickTimer = null;
    _clearBurstTimers();

    registry.forEach(({effect, settings}) => {
        if (settings.mode !== 'permanent' && effect.isActive()) effect.stop();
    });
}

document.addEventListener('effect-ended', (event) => {
    const id = event.detail && event.detail.id;
    const entry = registry.find(item => item.effect.id === id);
    if (!entry) return;

    clearTimeout(burstTimers[id]);
    delete burstTimers[id];
    if (entry.settings.mode === 'once' || entry.settings.mode === 'burst') _setCooldown(entry);
});

document.addEventListener(EVENT_INTENSITY_CHANGED, (event) => {
    if (!running) return;
    if (event.detail.intensity === 0) {
        _clearBurstTimers();
        return;
    }
    if (!isEffectsEnabled()) return;

    const skipped = _getSkipped();
    _syncPermanent(skipped);
    _syncAmbient(skipped);
});

document.addEventListener(EVENT_INFECTION_CURED, _clearBurstTimers);

const director = {
    start: startDirector,
    stop: stopDirector,
    isRunning: () => running,
};

export {director};