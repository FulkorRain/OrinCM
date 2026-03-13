

const comments = [
    {
        user: "",
        website: "[Conspiracy Site]",
        websiteUrl: "#",
        text: "Absolute horseshit. Anyone who isn't brainwashed can see the lazy photoshopping. Another excuse to import marxist third-worlders from Canadumb! For any sheep somehow still confused about what's going on, I've laid the whole plan out. How about you publish this story if you have some balls and actually care about TRUTH!!!"
    },
    {
        user: "",
        website: "",
        websiteUrl: "",
        text: "I'm really scared. How is this much rain even possible and what is with some of these comments?? People are dead wat is wrong with you"
    },
    {
        user: "",
        website: "",
        websiteUrl: "",
        text: "Does any one no if they take Costco membership card in the US?"
    }
];

const container = document.querySelector('.comment-container');

function renderComments() {
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment-entry';
        
        commentDiv.innerHTML = `
            <p>Commenter: ${comment.user}</p>
            <p>Website: ${comment.website ? `<a href="${comment.websiteUrl}" style="color: blue; font-weight: bold;">${comment.website}</a>` : ''}</p>
            <p>${comment.text}</p>
            <br>
        `;
        
        container.appendChild(commentDiv);
    });
}

renderComments();