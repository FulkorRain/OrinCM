const routes = {
  wow: "thread.html",
  creative: "thread.html",
  home: "forum.html",
  forum: "forum.html",
};

const SEARCH_MAX_LENGTH = 100;
const SEARCH_COOLDOWN_MS = 1000;
const ALLOWED_PATH_REGEX = /^\/[a-zA-Z0-9\-_/]*$/;

function cleanText(str) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function isSafePath(url) {
  return typeof url === "string" && ALLOWED_PATH_REGEX.test(url);
}

let lastSearchTime = 0;

const searchForm = document.getElementById("searchForm");

if (searchForm) {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const error = document.getElementById("searchError");

    const now = Date.now();
    if (now - lastSearchTime < SEARCH_COOLDOWN_MS) {
      error.textContent = "Please wait a moment before searching again.";
      return;
    }
    lastSearchTime = now;

    const input = document
      .getElementById("searchInput")
      .value.trim()
      .toLowerCase();

    if (input.length > SEARCH_MAX_LENGTH) {
      error.textContent = "Search query is too long";
      return;
    }

    if (!input) return;

    error.textContent = "";

    if (Object.hasOwn(routes, input)) {
        const destination = routes[input];

        if (!isSafePath(destination)) {
            error.textContent = "Something went wrong. Please try again.";
            return;
        }

        window.location.href = destination;
    } else {
        //TODO: change this to a search page result later on.
        error.textContent = "The page or forum you searched for does not exist";
    }
  });
}
