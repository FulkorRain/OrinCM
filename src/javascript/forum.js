function buildForumIndex() {
  const container = document.getElementById("forumContainer");
  if (!container) return;

  const table = document.createElement("table");
  table.className = "forum-table";
  table.setAttribute("cellspacing", "0");
  table.setAttribute("cellpadding", "6");

  const stripRow = document.createElement("tr");
  stripRow.className = "forum-category-header";
  const stripCell = document.createElement("th");
  stripCell.setAttribute("colspan", "4");
  stripRow.appendChild(stripCell);
  table.appendChild(stripRow);

  const colRow = document.createElement("tr");
  colRow.className = "forum-header";
  colRow.innerHTML = `
    <th align="left">Thread</th>
    <th align="left" width="10%">Posts</th>
    <th align="left" width="10%">Views</th>
    <th align="left" width="25%">Last Post</th>
  `;
  table.appendChild(colRow);

  PUBLIC_THREADS.forEach(function (thread) {
    const row = document.createElement("tr");
    row.className = "forum-row";

    const titleCell = document.createElement("td");
    const link = document.createElement("a");
    link.className = "forum-link";
    link.href = THREAD_PAGE + "?id=" + encodeURIComponent(thread.id);
    link.appendChild(document.createTextNode(thread.title));
    titleCell.appendChild(link);

    const meta = document.createElement("div");
    meta.className = "forum-description";
    meta.appendChild(
      document.createTextNode("by " + thread.author)
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

  container.appendChild(table);
  container.appendChild(buildPagination());
}

function makePageLink(label, extraClass) {
  const link = document.createElement("a");
  link.className= extraClass ? "page-link " + extraClass : "page-link";
  link.href = PAGINATION.defaultRedirect;
  link.appendChild(document.createTextNode(label));
  return link;
}

function buildPagination() {
  const nav = document.createElement("div");
  nav.className = "forum-pagination";
  nav.appendChild(makePageLink(PAGINATION.prevLabel, "page-prev"));
  for (let i = 1; i <= PAGINATION.totalPages; i++) {
    const extra = i === PAGINATION.currentPage ? "page-current" : "";
    nav.appendChild(makePageLink(String(i), extra));
  }
  nav.appendChild(makePageLink(PAGINATION.nextLabel, "page-next"));
  return nav;
}

buildForumIndex();

