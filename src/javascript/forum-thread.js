const SEARCH_MAX_LENGTH  = 100;
const SEARCH_COOLDOWN_MS = 1000;

const SAFE_PATH_REGEX = /^\/[a-zA-Z0-9\-_/.]*$|^#$/;

let lastSearchTime = 0;


function searchThreads(query) {
  const results = [];

  for (let i = 0; i < SEARCH_THREADS.length; i++) {
    const thread = SEARCH_THREADS[i];
    if(thread.keywords.includes(query)) {
      results.push(thread);
    }
  }

  return results;
}

function buildThreadHref(thread) {
  if (thread.type === "redirect") {
    return isSafePath(thread.redirect) ? thread.redirect : "#";
  }
  return THREAD_PAGE + "?id=" + encodeURIComponent(thread.id);
}

function isSafePath(url) {
  return typeof url === "string" && SAFE_PATH_REGEX.test(url);
}

function showNoResults(panel, query) {
  const msg = document.createElement("div");
  msg.className = "search-no-results";
  msg.appendChild(
    document.createTextNode(
      query ? 'No results found for "' + query + '".' : "No results found."
    )
  );
  panel.appendChild(msg);
  panel.appendChild(buildClearButton());
}

function showResultsTable(panel, results) {
  const heading = document.createElement("div");
  heading.className = "search-results-heading";
  heading.appendChild(
    document.createTextNode(results.length + " result(s) found")
  );
  panel.appendChild(heading);

  const table = document.createElement("table");
  table.className = "forum-table";
  table.setAttribute("cellspacing", "0");
  table.setAttribute("cellpadding", "6");

  const headerRow = document.createElement("tr");
  headerRow.className = "forum-header";
  headerRow.innerHTML = `
    <th align="left">Thread</th>
    <th align="left" width="10%">Posts</th>
    <th align="left" width="10%">Views</th>
    <th align="left" width="25%">Last Post</th>
  `;
  table.appendChild(headerRow);

  results.forEach(function (thread) {
    const row = document.createElement("tr");
    row.className = "forum-row";

    const titleCell = document.createElement("td");
    const link = document.createElement("a");
    link.className = "forum-link";
    link.href = buildThreadHref(thread);
    link.appendChild(document.createTextNode(thread.title || "[ page ]"));
    titleCell.appendChild(link);

    const meta = document.createElement("div");
    meta.className = "forum-description";
    meta.appendChild(
      document.createTextNode(
        "by " + thread.author
      )
    );
    titleCell.appendChild(meta);

    const postsCell = document.createElement("td");
    postsCell.setAttribute("align", "center");
    postsCell.appendChild(document.createTextNode(thread.posts));

    const viewsCell = document.createElement("td");
    viewsCell.setAttribute("align", "center");
    viewsCell.appendChild(document.createTextNode(thread.views));

    const lastPostCell = document.createElement("td");
    lastPostCell.setAttribute("align", "center");
    lastPostCell.appendChild(document.createTextNode(thread.lastPost || "—"));

    row.appendChild(titleCell);
    row.appendChild(postsCell);
    row.appendChild(viewsCell);
    row.appendChild(lastPostCell);
    table.appendChild(row);
  });

  panel.appendChild(table);
  panel.appendChild(buildClearButton());
}

function buildClearButton() {
  const button = document.createElement("button");
  button.className = "retro-button";
  button.style.marginTop = "10px";
  button.appendChild(document.createTextNode("← Back to Forums"));
  button.addEventListener("click", resetSearch);
  return button;
}

function resetSearch() {
  const panel = document.getElementById("searchResults");
  const forumContainer = document.getElementById("forumContainer");
  const searchInput = document.getElementById("searchInput");
  const errorEl = document.getElementById("searchError");

  while (panel.firstChild) panel.removeChild(panel.firstChild);
  panel.style.display = "none";
  forumContainer.style.display = "block";

  if (searchInput) searchInput.value = "";
  if (errorEl) errorEl.textContent = "";
}

const searchForm = document.getElementById("searchForm");

if (searchForm) {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const errorEl    = document.getElementById("searchError");
    const panel      = document.getElementById("searchResults");
    const forumContainer = document.getElementById("forumContainer");

    const now = Date.now();
    if (now - lastSearchTime < SEARCH_COOLDOWN_MS) {
      errorEl.textContent = "Please wait a moment before searching again.";
      return;
    }
    lastSearchTime = now;

    const rawInput = document.getElementById("searchInput").value;
    if (rawInput.length > SEARCH_MAX_LENGTH) {
      errorEl.textContent = "Search query is too long.";
      return;
    }

    const query = rawInput.trim().toLowerCase();

    errorEl.textContent = "";
    while (panel.firstChild) panel.removeChild(panel.firstChild);

    if (!query) {
      panel.style.display = "block";
      forumContainer.style.display = "none";
      showNoResults(panel, "");
      return;
    }

    const results = searchThreads(query);

    if (results.length === 1 && results[0].type === "redirect") {
      window.location.href = buildThreadHref(results[0]);
      return;
    }

    panel.style.display = "block";
    forumContainer.style.display = "none";

    if (results.length === 0) {
      showNoResults(panel, query);
    } else {
      showResultsTable(panel, results);
    }
  });
}