import {gsap} from "gsap";

const startDelayMs = 100;
const travelDuration = 2.5;
const edgeBuffer = 100;

function getStartTransform(element) {
    const rect = element.getBoundingClientRect();

    const y = (window.innerHeight - rect.top) + edgeBuffer;

    const x = (window.innerWidth / 6) - edgeBuffer; 

    return {x , y};
}

const waveSwitchMinMs = 100;
const waveSwitchMaxMs = 300;

let waveRandomizerTimeoutId = null;

function scheduleNextWaveSwitch(footerElement) {
    const delay = waveSwitchMinMs + Math.random() * (waveSwitchMaxMs - waveSwitchMinMs);
    waveRandomizerTimeoutId = setTimeout(() => {
        const showCurvy = Math.random() < 0.8;
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
    const staticSound = document.getElementById("static");

    const waveStartDelaySeconds = 0.5;
    const soundDelaySeconds = 3;

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

        timeline.call(() => {    
            if (staticSound) {
                staticSound.loop = true;
                staticSound.currentTime = 0;
                const playPromise = staticSound.play();
                if (playPromise) {
                    playPromise.catch((error) => {
                        console.error("Error playing static sound:", error);
                    });
                }
            }
        }, null, 0);

        timeline.call(() => {
            glitchElement.classList.add("is-glitching");
        }, null, soundDelaySeconds);

        timeline.to(riseElement, {
            x: 0,
            y: 100,
            duration: travelDuration,
            ease: "power2.out"
        });

        timeline.call(() => {
            footerElement.classList.add("is-waving");
            scheduleNextWaveSwitch(footerElement);
        }, null, waveStartDelaySeconds + soundDelaySeconds);

        // TODO: implement once we have landing page to redirect to
        const redirectUrl = "../index.html";
        const redirectDelaySeconds = 1;
        timeline.call(() => {
            window.location.href = redirectUrl;
        }, null, `-=${redirectDelaySeconds}`);

    }

    const cleanup = () => {
        if (timeline) timeline.kill();
        stopWaveRandomizer();

        if (staticSound) {
            staticSound.pause();
            staticSound.currentTime = 0;
        }
    }

    window.addEventListener("beforeunload", cleanup, {once: true});


    return cleanup;
}


document.addEventListener("DOMContentLoaded", playFigureRise);