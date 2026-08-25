document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("modular-overlay");

    document.getElementById("overlay-button").addEventListener("click", () => {
        overlay.remove();
        document.body.classList.remove("no-scroll");
    });
});