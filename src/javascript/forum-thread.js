const SEARCH_MAX_LENGTH = 100;
const SEARCH_COOLDOWN_MS = 1000;

let lastSearchTime = 0;

function searchForums(query) {
  const results = [];
  
  FORUMS.forEach(function (forum) {
    const forumNameMatch = forum.name.toLowerCase().includes(query);

    forum.threads.forEach(function (thread) {
      const titleMatch = thread.title.toLowerCase().includes(query);

      if (titleMatch || forumNameMatch) {
        results.push({thread: thread, forumName: forum.name});
      }
    });
  });

  return results;
}

function renderSearchResults(results, query) {
  const panel = document.getElementById("searchResults");
  const forumContainer = document.getElementById("forumContainer");
  if (!panel) return;

  while (panel.firstChild) {
    panel.removeChild(panel.firstChild);
  }

  panel.style.display = "block";
  forumContainer.style.display = "none";

  if (results.length === 0 ) {
    const noResults = document.createElement("div");
    noResults.className = "search-no-results";
    noResults.appendChild(document.createTextNode('No Results found for "' + query + '".'));
    panel.appendChild(noResults);
    return;
  }

  const heading = document.createElement("div");
  heading.className = "search-results-heading";
  heading.appendChild(document.createTextNode('Search results for "' + query + '" - ' + results.length + ' thread(s) found'));
  panel.appendChild(heading);

  const table = document.createElement("table");
  table.className = "forum-table";
  table.setAttribute("cellspacing", "0");
  table.setAttribute("cellpadding", "6");

  const headerRow = document.createElement("tr");
  headerRow.className = "forum-header";
  headerRow.innerHTML = `
    <th align="left">Thread</th>
    <th align="left" width="15%">Forum</th>
    <th align="left" width="10%">Posts</th>
    <th align="left" width="25%">Last Post</th>
  `;
  table.appendChild(headerRow);

  results.forEach(function (result){
    const row = document.createElement("tr");
    row.className = "forum-row";

    const titleCell = document.createElement("td");
    const link = document.createElement("a");
    link.className = "forum-link";
    link.href = buildThreadHref(result.thread);
    link.appendChild(document.createTextNode(result.thread.title));
    titleCell.appendChild(link);

    const meta = document.createElement("div");
    meta.className = "forum-description";
    meta.appendChild(document.createTextNode("by " + result.thread.author + " - " + result.thread.displayDate));
    titleCell.appendChild(meta);

    const forumCell = document.createElement("td");
    forumCell.appendChild(document.createTextNode(result.forumName));

    const postsCell = document.createElement("td");
    postsCell.setAttribute("align", "center");
    postsCell.appendChild(document.createTextNode(result.thread.posts));

    const lastPostCell = document.createElement("td");
    lastPostCell.setAttribute("align", "center");
    lastPostCell.appendChild(document.createTextNode(result.thread.lastPost || "-"))

    row.appendChild(titleCell);
    row.appendChild(forumCell);
    row.appendChild(postsCell);
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
  button.appendChild(document.createTextNode("Back to Forums"));

  button.addEventListener("click", resetSearch);

  return button;
}

function resetSearch () {
    const panel = document.getElementById("searchResults");
    const forumContainer = document.getElementById("forumContainer");
    const searchInput = document.getElementById("searchInput");
    const errorElement = document.getElementById("searchError");

    panel.style.display = "none";
    forumContainer.style.display = "block";

    if (searchInput) searchInput.value = "";
    if (errorElement) errorElement.value = "";
}

function buildThreadHref(thread) {
  if (thread.type === "redirect") {
    return thread.redirect || "#";
  }

  return THREAD_PAGE + "?id=" + encodeURIComponent(thread.id);
}

const searchForm = document.getElementById("searchForm");
if (searchForm) {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const errorElement = document.getElementById("searchError");

    const now = Date.now();
    if (now - lastSearchTime < SEARCH_COOLDOWN_MS) {
      errorElement.textContent = "Please wait a moment before searching again.";
      return;
    }
    lastSearchTime = now;

    const rawInput = document.getElementById("searchInput").value;

    if (rawInput.length > SEARCH_MAX_LENGTH) {
      errorElement.textContent = "Search query is too long";
      return;
    }

    const query = rawInput.trim().toLowerCase();

    if (!query) {
      resetSearch();
      return;
    }

    errorElement.textContent = "";
    
    const results = searchForums(query);
    renderSearchResults(results, query);
  });
}