document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("modular-overlay");

    if (localStorage.getItem("contentWarningAccepted") === "true") {
        overlay.remove();
        document.body.classList.remove("no-scroll");
        return;
    }

    document.getElementById("overlay-button").addEventListener("click", () => {
        localStorage.setItem("contentWarningAccepted", "true");

        overlay.remove();
        document.body.classList.remove("no-scroll");
    });
});