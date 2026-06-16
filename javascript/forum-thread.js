const routes = {
    "wow": "thread.html",
    "creative": "thread.html",
    "home": "forum.html",
    "forum": "forum.html"
};

const searchForm = document.getElementById("searchForm");

if (searchForm) {

    searchForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const input = document
            .getElementById("searchInput")
            .value
            .trim()
            .toLowerCase();

        const error = document.getElementById("searchError");

        if (routes[input]) {
            console.log("Navigating to: " + routes[input]);

            window.location.href = routes[input];

        } else {

            error.textContent =
                "The page or forum you searched for does not exist.";

        }

    });

}