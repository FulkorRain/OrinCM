const pageGlitchDelayMs = 2000;
const pageGlitchPlayDurationMs = 1500;
const jumpscareRedirectUrl = "/src/html/404pages/jumpscare-404.html";

let pageGlitchStartTimeoutId = null;
let pageGlitchEndTimeoutId = null;

function startPageGlitch() {
    document.body.classList.add("page-glitch-active");
    pageGlitchEndTimeoutId = setTimeout(() => {
        window.location.href=jumpscareRedirectUrl;
    }, pageGlitchPlayDurationMs);
}

function schedulePageGlitch() {
    pageGlitchStartTimeoutId = setTimeout(startPageGlitch, pageGlitchDelayMs);
}

function stopPageGlitch() {
    if (pageGlitchStartTimeoutId !== null) {
        clearTimeout(pageGlitchStartTimeoutId);
        pageGlitchStartTimeoutId = null;
    }

    if (pageGlitchEndTimeoutId !== null) {
        clearTimeout(pageGlitchEndTimeoutId);
        pageGlitchEndTimeoutId = null;
    }
}

document.addEventListener("DOMContentLoaded", schedulePageGlitch);
window.addEventListener("beforeunload", stopPageGlitch, {once: true})