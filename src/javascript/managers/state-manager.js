const MIN_INTENSITY = 1;
const MAX_INTENSITY = 10;
const STORAGE_KEY = 'golem_spooky_intensity';
const EFFECTS_KEY = 'golem_effects_state';

const stateManager = (() => {
    let intensity = parseInt(localStorage.getItem(STORAGE_KEY)) || MIN_INTENSITY;

    intensity = Math.min(MAX_INTENSITY, Math.max(MIN_INTENSITY, intensity));

    function _save() {
        localStorage.setItem(STORAGE_KEY, intensity);
    }

    function _loadAllEffects() {
        try {
            return JSON.parse(localStorage.getItem(EFFECTS_KEY)) || {};
        } catch {
            return {};
        }
    }

    function _saveAllEffects(effects) {
        localStorage.setItem(EFFECTS_KEY, JSON.stringify(effects));
    }

    return {
        getIntensity() {
            return intensity;
        },
        increaseIntensity() {
            if (intensity < MAX_INTENSITY) {
                intensity++;
                _save();
            }
        },
        decreaseIntensity() {
            if (intensity > MIN_INTENSITY) {
                intensity--;
                _save();
            }
        },
        getNormalized() {
            return intensity/ MAX_INTENSITY;
        },
        saveEffectState(effectId, data) {
            const effects = _loadAllEffects();
            effects[effectId] = data;
            _saveAllEffects(effects);
        },
        loadEffectState(effectId) {
            const effects= _loadAllEffects();
            return Object.hasOwn(effects, effectId) ? effects[effectId] : null;
        },
        clearEffectState(effectId) {
            const effects = _loadAllEffects();
            delete effects[effectId];
            _saveAllEffects(effects);
        },
        hasEffectState(effectId) {
            const effects = _loadAllEffects();
            return Object.hasOwn(effects, effectId);
        }
    };
})();

export {stateManager};