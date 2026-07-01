const MIN_INTENSITY = 1;
const MAX_INTENSITY = 10;
const STORAGE_KEY = 'golem_spooky_intensity';

const stateManager = (() => {
    let intensity = parseInt(localStorage.getItem(STORAGE_KEY)) || MIN_INTENSITY;

    intensity = Math.min(MAX_INTENSITY, Math.max(MIN_INTENSITY, intensity));

    function _save() {
        localStorage.setItem(STORAGE_KEY, intensity);
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
        }
    };
})();

export {stateManager};