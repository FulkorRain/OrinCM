function buildThreadPage(thread, forumName) {
    const container = document.getElementById("threadContainer");
    if(!container) return;

    document.title = "Bulletin Bytes - " + thread.title;

    const fragment = document.createDocumentFragment();

    const breadcrumb = document.createElement("div");
    breadcrumb.className = "breadcrumb";
    const homeLink = document.createElement("a");
    homeLink.href = "forum.html";
    homeLink.appendChild(document.createTextNode("Forum"));
    breadcrumb.appendChild(homeLink);
    breadcrumb.appendChild(document.createTextNode(" >> "));
    breadcrumb.appendChild(document.createTextNode(forumName));
    breadcrumb.appendChild(document.createTextNode(" >> "));
    breadcrumb.appendChild(document.createTextNode(thread.title));
    fragment.appendChild(breadcrumb);

    const titleBar = document.createElement("div");
    titleBar.className = "thread-title";
    titleBar.appendChild(document.createTextNode("Thread: " + thread.title));
    fragment.appendChild(titleBar);

    thread.content.forEach(function (post) {
        fragment.appendChild(buildPostTable(post));
    });

    const footer = document.createElement("div");
    footer.className = "footer";
    const returnLink = document.createElement("a");
    returnLink.href = "forum.html";
    returnLink.appendChild(document.createTextNode("Return to Forum"));
    footer.appendChild(returnLink);
    fragment.appendChild(footer);

    container.appendChild(fragment);
}

function buildPostTable(post) {
    const table = document.createElement("table");
    table.className = "post-table";
    table.setAttribute("cellspacing", "1");
    table.setAttribute("cellpadding", "0");

    const headerRow = document.createElement("tr");
    headerRow.className = "post-header";
    const headerCell = document.createElement("td");
    headerCell.appendChild(document.createTextNode(post.date));
    headerRow.appendChild(headerCell);
    table.appendChild(headerRow);

    const bodyRow = document.createElement("tr");
    const bodyCell = document.createElement("td");

    const innerTable = document.createElement("table");
    innerTable.setAttribute("width", "100%");
    innerTable.setAttribute("cellspacing", "0");
    innerTable.setAttribute("cellpadding", "0");

    const innerRow = document.createElement("tr");

    const userPanel = document.createElement("td");
    userPanel.className = "user-panel";
    userPanel.innerHTML = `
        <div class="username">${escapeHTML(post.author)}</div>
        <div class="user-title">${escapeHTML(post.userTitle)}</div>
        <img src="${escapeHTML(post.avatar)}" class="avatar" alt="avatar">
        <div class="user-stats">
            Join Date: ${escapeHTML(post.joinDate)}<br>
            Posts: ${post.postCount}<br>
            Location: ${escapeHTML(post.location)}
        </div>
    `;

    const postContent = document.createElement("td");
    postContent.className = "post-content";

    const postText = document.createElement("div");
    postText.className = "post-text";
    postText.innerHTML = post.text;

    postContent.appendChild(postText);

    if (post.signature) {
        const sig = document.createElement("div");
        sig.className = "signature";
        sig.appendChild(document.createTextNode("__________"));
        sig.appendChild(document.createElement("br"));
        sig.appendChild(document.createTextNode(post.signature));
        postContent.appendChild(sig);
    }

    innerRow.appendChild(userPanel);
    innerRow.appendChild(postContent);
    innerTable.appendChild(innerRow);
    bodyCell.appendChild(innerTable);
    bodyRow.appendChild(bodyCell);
    table.appendChild(bodyRow);
    return table;
}

//TODO: Change this to go to the 404 page.
function buildNotFound() {
    const container = document.getElementById("threadContainer");
    if (!container) return;

    const message = document.createElement("div");
    message.className = "thread-title";
    message.appendChild(document.createTextNode("Thread not found."));
    container.appendChild(message);

    const link = document.createElement("a");
    link.href = "forum.html";
    link.appendChild(document.createTextNode("Return to Forum"));
    container.appendChild(link);
}

function escapeHTML(string) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(String(string)));
    return div.innerHTML;
}

function getThreadIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("id");
    if (!raw) return null;

    const SAFE_ID_REGEX = /^[a-zA-Z0-9\-_]+$/;
    if (!SAFE_ID_REGEX.test(raw)) return null;

    return raw;
}

function findThread(id) {
    for (let i = 0; i < FORUMS.length; i++) {
        const forum = FORUMS[i];
        for (let j = 0; j < forum.threads.length; j++) {
            if(forum.threads[j].id === id) {
                return {thread: forum.threads[j], forumName: forum.name};
            }
        }
    }
    return null;
}

const threadId = getThreadIdFromUrl();

if (!threadId) {
    buildNotFound();
} else {
    const result = findThread(threadId);
    if (!result) {
        buildNotFound();
    } else if (result.thread.type === "redirect") {
        window.location.href = result.thread.redirect || "forum.html";
    } else {
        buildThreadPage(result.thread, result.forumName);
    }
}