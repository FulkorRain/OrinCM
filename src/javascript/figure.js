import {gsap} from "gsap";

const startDelayMs = 2500;
const travelDuration = 3.5;
const edgeBuffer = 100;

function getStartTransform(element) {
    const rect = element.getBoundingClientRect();

    const y = (window.innerHeight - rect.top) + edgeBuffer;

    const x = (window.innerWidth / 6) - edgeBuffer; 

    return {x , y};
}

const waveSwitchMinMs = 200;
const waveSwitchMaxMs = 800;

let waveRandomizerTimeoutId = null;

function scheduleNextWaveSwitch(footerElement) {
    const delay = waveSwitchMinMs + Math.random() * (waveSwitchMaxMs - waveSwitchMinMs);
    waveRandomizerTimeoutId = setTimeout(() => {
        const showCurvy = Math.random() < 0.5;
        footerElement.classList.toggle("wave-show-curvy", showCurvy);
        footerElement.classList.toggle("wave-show-jagged", !showCurvy);

        if (footerElement.classList.contains("is-waving")) {
            scheduleNextWaveSwitch(footerElement);
        }
    }, delay);
}

function stopWaveRandomizer() {
    if (waveRandomizerTimeoutId !== null) {
        clearTimeout(waveRandomizerTimeoutId);
        waveRandomizerTimeoutId = null;
    }
}

function playFigureRise() {
    const riseElement = document.getElementById("figureRise");
    const glitchElement = document.getElementById("figureGlitch");
    const footerElement = document.querySelector("footer");

    const waveStartDelaySeconds = 0.5;

    if(!riseElement || !glitchElement) return null;

    const prefersReducedMotion = false;
    let timeline;

    if(prefersReducedMotion) {
        gsap.set(riseElement, {opacity: 0});
        timeline = gsap.to(riseElement, {
            opacity: 1,
            duration: 1,
            delay: startDelayMs / 1000
        });
    } else {
        const start = getStartTransform(riseElement);
        gsap.set(riseElement, {x: start.x, y:start.y});

        timeline = gsap.timeline({delay: startDelayMs/ 1000});

        timeline.call(() => glitchElement.classList.add("is-glitching"));

        timeline.to(riseElement, {
            y: 100,
            duration: travelDuration,
            ease: "power2.out"
        });

        timeline.call(() => {
            footerElement.classList.add("is-waving");
            scheduleNextWaveSwitch(footerElement);
        }, null, waveStartDelaySeconds);

    }

    const cleanup = () => {
        if (timeline) timeline.kill();
        stopWaveRandomizer();
    }

    window.addEventListener("beforeunload", cleanup, {once: true});


    return cleanup;
}


document.addEventListener("DOMContentLoaded", playFigureRise);