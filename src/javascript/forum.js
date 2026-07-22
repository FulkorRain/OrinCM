const THREAD_PAGE = 'thread.html';
const PLACEHOLDER_LABEL = '[content coming soon]';

function buildForumIndex() {
    const container = document.getElementById("forumContainer");
    if (!container) return;

    const fragment = document.createDocumentFragment();
    FORUMS.forEach(function (forum) {
        const categoryTable = document.createElement("table");
        categoryTable.className = "forum-table";
        categoryTable.setAttribute("cellspacing", "0");
        categoryTable.setAttribute("cellpadding", "6");
        categoryTable.style.marginBottom = "15px";

        const headerRow = document.createElement("tr");
        headerRow.className = "forum-category-header";
        headerRow.innerHTML = `
            <th align="left" colspan="4">${escapeHTML(forum.name)}</th>
        `;
        categoryTable.appendChild(headerRow);

        const colRow = document.createElement("tr");
        colRow.className = "forum-header";
        colRow.innerHTML = `
            <th align="left">Thread</th>
            <th align="left" width="10%">Posts</th>
            <th align="left" width="10%">Views</th>
            <th align="left" width="25%">Last Post</th>
        `;
        categoryTable.appendChild(colRow);

        forum.threads.forEach(function (thread) {
            const row = document.createElement("tr");
            row.className = "forum-row";

            const href = buildThreadHref(thread);

            const titleCell = document.createElement("td");
            
            const link = document.createElement("a");
            link.className = "forum-link";
            link.href = href;
            link.appendChild(document.createTextNode(thread.title));

            titleCell.appendChild(link);
            if (thread.type === "redirect" && thread.placeholder) {
                const badge = document.createElement("span");
                badge.className = "placeholder-badge";
                badge.appendChild(document.createTextNode(" " + PLACEHOLDER_LABEL));
                titleCell.appendChild(badge);
            }

            const meta = document.createElement("div");
            meta.className = "forum-description";
            meta.appendChild(document.createTextNode("by " + thread.author + " - " + thread.displayDate));
            titleCell.appendChild(meta);


            const postsCell = document.createElement("td");
            postsCell.setAttribute("align", "center");
            postsCell.appendChild(document.createTextNode(thread.posts));

            const viewsCell = document.createElement("td");
            viewsCell.setAttribute("align", "center");
            viewsCell.appendChild(document.createTextNode(thread.views));

            const lastPostCell = document.createElement("td");
            lastPostCell.setAttribute("algin", "center");
            lastPostCell.appendChild(document.createTextNode(thread.lastPost || "-"));

            row.appendChild(titleCell);
            row.appendChild(postsCell);
            row.appendChild(viewsCell);
            row.appendChild(lastPostCell);

            categoryTable.appendChild(row);
        });

        fragment.appendChild(categoryTable);
    });

    container.appendChild(fragment);
}

function buildThreadHref(thread) {
    if (thread.type === 'redirect'){
        return thread.redirect || "#";
    }
    return THREAD_PAGE + "?id=" + encodeURIComponent(thread.id);
}

function escapeHTML(string) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(string));
    return div.innerHTML;
}

buildForumIndex();