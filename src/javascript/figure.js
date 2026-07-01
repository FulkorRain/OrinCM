import {gsap} from "gsap";

const startDelayMs = 2500;
const travelDuration = 3.5;
const edgeBuffer = 100;

function getStartTransform(element) {
    const rect = element.getBoundingClientRect();

    const y = (window.innerHeight - rect.top) + edgeBuffer;

    const viewportCenterX = window.innerWidth / 2;
    const viewportRightX = window.innerWidth;
    const targetScreenX = gsap.utils.random(viewportCenterX, viewportRightX);
    const x = targetScreenX - rect.left;

    return {x , y};
}

function playFigureRise() {
    const riseElement = document.getElementById("figureRise");
    const glitchElement = document.getElementById("figureGlitch");

    if(!riseElement || !glitchElement) return null;

    // const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
        const footerElement = document.querySelector("footer");
        gsap.set(riseElement, {x: start.x, y:start.y});

        timeline = gsap.timeline({delay: startDelayMs/ 1000});

        timeline.call(() => glitchElement.classList.add("is-glitching"));
        timeline.call(() => footerElement.classList.add("is-waving"));

        timeline.to(riseElement, {
            x: 0,
            y: 0,
            duration: travelDuration,
            ease: "power2.out"
        });

        // timeline.call(() => glitchElement.classList.remove("is-glitching"));
    }

    const cleanup = () => {
        if (timeline) timeline.kill();
    }

    window.addEventListener("beforeunload", cleanup, {once: true});


    return cleanup;
}

document.addEventListener("DOMContentLoaded", playFigureRise);