class EffectManager {
    constructor() {
        this.activeEffects = [];
    }

    addEffect(effect) {
        this.activeEffects.push(effect);
    }

    removeEffect(effect) {
        this.activeEffects = this.activeEffects.filter(e => e.name !== effect);
    }

    update() {
        this.activeEffects.forEach(effect => {
            if (effect.update) {
                effect.update();
            }
        });
    }
}

export const effectManager = new EffectManager();