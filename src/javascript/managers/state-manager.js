import {LOGGING} from './effect-config.js';

const MIN_INTENSITY = 1;
const MAX_INTENSITY = 10;
const CURED_INTENSITY = 0;
const STORAGE_KEY = 'golem_spooky_intensity';
const EFFECTS_KEY = 'golem_effects_state';
const DEFAULT_PAGE_ID = 'home';

const EVENT_INTENSITY_CHANGED = 'intensity-changed';
const EVENT_INFECTION_CURED = 'infection-cured';

const memoryFallback = {};

function _storageGet(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return Object.hasOwn(memoryFallback, key) ? memoryFallback[key] : null;
    }
}

function _storageSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch {
        memoryFallback[key] = String(value);
    }
}

function _storageRemove(key) {
    try {
        localStorage.removeItem(key);
    } catch {
        delete memoryFallback[key];
    }
}

function _emit(name, detail= {}) {
    if (name === EVENT_INTENSITY_CHANGED && LOGGING.logLevelChanges) {
        const note = detail.suppressed ? ' (suppressed by Inspect, a reload brings it back)' : detail.intensity === CURED_INTENSITY ? ' (cured) ' : '';
        console.log(`[effects] level ${detail.previous} -> ${detail.intensity}${note}`);
    }
    document.dispatchEvent(new CustomEvent(name, {detail}));
}

function _clamp(value) {
    return Math.min(MAX_INTENSITY, Math.max(MIN_INTENSITY, value));
}

function _readStoredIntensity() {
    const parsed = parseInt(_storageGet(STORAGE_KEY), 10);
    if (Number.isNaN(parsed)) return MIN_INTENSITY;
    return Math.min(MAX_INTENSITY, Math.max(CURED_INTENSITY, parsed));
}

function _getPageId() {
    const fromBody = document.body ? document.body.dataset.pageId : undefined;
    if (fromBody) return fromBody;
    const path = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '');
    return path || DEFAULT_PAGE_ID;
}

function _loadAllEffects() {
    try {
        const parsed = JSON.parse(_storageGet(EFFECTS_KEY));
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

function _saveAllEffects(all) {
    _storageSet(EFFECTS_KEY, JSON.stringify(all));
} 

const stateManager = (() => {
    let intensity = _readStoredIntensity();
    let suppressed = false;

    function _setIntensity(next) {
        if (suppressed) return;
        if (intensity === CURED_INTENSITY) return;
        if (!Number.isFinite(next)) return;
        next = _clamp(Math.round(next));
        if (next === intensity) return;

        const previous = intensity;
        intensity = next;
        _storageSet(STORAGE_KEY, intensity);
        _emit(EVENT_INTENSITY_CHANGED, {intensity, previous, suppressed: false});
    }

    window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY) {
            const previous = intensity;
            intensity = _readStoredIntensity();
            if (!suppressed && intensity !== previous) {
                _emit (EVENT_INTENSITY_CHANGED, {intensity, previous, suppressed: false});
            }
        } else if (event.key === EFFECTS_KEY && event.newValue === null && !suppressed) {
            _emit(EVENT_INFECTION_CURED);
        }
    });

    return {
        getIntensity () {
            return suppressed ? 0 : intensity;
        },
        getStoredIntensity() {
            return intensity;
        },
        getNormalized() {
            return (suppressed ? 0 : intensity) / MAX_INTENSITY;
        },
        isSuppressed() {
            return suppressed;
        },
        isCured() {
            return intensity === CURED_INTENSITY;
        },
        getPageId() {
            return _getPageId();
        },
        setIntensity(value) {
            _setIntensity(value);
        },
        increaseIntensity() {
            _setIntensity(intensity + 1); 
        },
        decreaseIntensity() {
            _setIntensity(intensity - 1);
        },
        suppress() {
            if (suppressed) return;
            const previous = intensity;
            suppressed = true;
            _emit (EVENT_INTENSITY_CHANGED,{intensity: 0, previous, suppressed: true});
        },
        cure() {
            if (suppressed) return;
            if (intensity === CURED_INTENSITY) return;
            const previous = intensity;
            _storageRemove(EFFECTS_KEY);
            _emit(EVENT_INFECTION_CURED);

            intensity = CURED_INTENSITY;
            _storageSet(STORAGE_KEY, intensity);
            _emit(EVENT_INTENSITY_CHANGED, {intensity, previous, suppressed: false});
        },
        saveEffectState(effectId, data) {
            if (suppressed || intensity === CURED_INTENSITY) return;
            const all = _loadAllEffects();
            const pageId = _getPageId();
            if (!all[pageId]) all[pageId] = {};
            all[pageId][effectId] = data;
            _saveAllEffects(all);
        },
        loadEffectState(effectId) {
            const page = _loadAllEffects()[_getPageId()];
            return page && Object.hasOwn(page, effectId) ? page[effectId] : null;
        },
        clearEffectState(effectId) {
            if (suppressed) return;
            const all = _loadAllEffects();
            const pageId = _getPageId();
            if (!all[pageId]) return;
            delete all[pageId][effectId];
            if (Object.keys(all[pageId]).length === 0) delete all[pageId];
            _saveAllEffects(all);
        },
        hasEffectState(effectId) {
            const page = _loadAllEffects()[_getPageId()];
            return !!page && Object.hasOwn(page, effectId);
        }
    }
   
})();

export {stateManager, MIN_INTENSITY, MAX_INTENSITY, CURED_INTENSITY, EVENT_INTENSITY_CHANGED, EVENT_INFECTION_CURED};