import {gsap} from "gsap";
import {stateManager} from "../managers/state-manager.js";

const BASE_INTERVAL_MS = 400;

let isActive = false;
let intervalId = null;

function _randomBetween(min, max) {
    return min + Math.random() * (max - min);
}

function imageWarp(sectionElement) {
    isActive = !isActive;
    const img = sectionElement.querySelector('.corruptable-image');
    if (!img) return isActive;

    if (isActive) {
        function tick() {
            const n = stateManager.getIntensity();
            gsap.to(img, {
                duration: 0.3,
                scaleX: 1 + _randomBetween(-0.06, 0.06) * n,
                scaleY: 1 + _randomBetween(-0.08, 0.08) * n,
                skewX: _randomBetween(-6, 6) * n,
                skewY: _randomBetween(-3, 3) * n,
                filter: `hue-rotate(${_randomBetween(-30, 30) * n}deg) blur(${_randomBetween(0, 2) * n}px) saturate(${1 + _randomBetween(-0.5, 0.5) * n})`,
                ease: "power1.inOut",
            });
        }
        tick();
        intervalId = setInterval(tick, BASE_INTERVAL_MS);
    } else {
        clearInterval(intervalId);
        gsap.to(img, {
            duration: 0.4,
            scaleX: 1,
            scaleY: 1,
            skewX: 0,
            skewY: 0,
            filter: 'none',
            ease: "power2.out",
        });
    }

    return isActive;
}

imageWarp.isActive = () => isActive;

export { imageWarp };