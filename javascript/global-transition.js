document.addEventListener("DOMContentLoaded", () => {
    const transitionContainer = document.querySelector(".page-transition");
    const links = document.querySelectorAll(".smooth-link");

    if (!transitionContainer) return;

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            if (link.target === "_blank" || e.ctrlKey || e.metaKey) return;

            e.preventDefault();
            const targetUrl = link.href;

            transitionContainer.classList.add("page-transition-exit");

            setTimeout(() => {
                window.location.href = targetUrl;
            }, 450);
        });
    });
});