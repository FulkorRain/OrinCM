const comments = {
    "home-content": [
        {
            user: "ulan_gershovich",
            website: "",
            websiteUrl: "",
            text: "hey that's my jeep hahahahaah guess they aint building no malls any time soon!!"
        },

        {
            user: "TruthWolf23",
            website: "irreplaceablespark",
            websiteUrl: "../html/spark.html",
            text: "Absolute horseshit. Anyone who isn't brainwashed can see the lazy photoshopping. Another excuse to import marxist third-worlders from Canadumb! For any sheep somehow still confused about what's going on, I've laid the whole plan out. How about you publish this story if you have some balls and actually care about TRUTH!!!"
        },
        {
            user: "FlannelFan5",
            website: "",
            websiteUrl: "",
            text: "I'm really scared. How is this much rain even possible and what is with some of these comments?? People are dead wat is wrong with you"
        },
        {
            user: "Dancing_qu33n",
            website: "",
            websiteUrl: "",
            text: "Does any one no if they take Costco membership card in the US?"
        }
    ],
    "kneeling-hub-content": [
        {
            user: "Vanquished_Burrito",
            website: "",
            websiteUrl: "",
            text: "Who pulled the pok? hehe"
        },
        {
            user: "ambr051a",
            website: "",
            websiteUrl: "",
            text: "When I lived near Hartsorn Creek this place slapped so hard. The perfectly calibrated amount of grease for the end of a night out drinking, and you were already there for the cheap booze so you didn’t even need to leave your seat! Genius business model."
        }
    ],
    "statue-content": [
        {
            user: "Reyna",
            website: "waxwing basin",
            websiteUrl: "",
            text: "I always found this statue so creepy!! I have to pass it on my way to work every day…."
        },
        {
            user: "wastefulfocus83",
            website: "",
            websiteUrl: "",
            text: "Actually ת is Tav means 400 and מ mem means “water” or “languages/tongues” so the plaque is really saying 400 languages (spoken accross Canada) for 99 years so far. It is beutiful message and it is why his plaque it’s was written in 2 languages."
        },
        {
            user: "Gamer☢☢☢natioN",
            website: "",
            websiteUrl: "",
            text: "What you serious? Herbew goes back to front idiot"
        }
    ]
};

const container = document.querySelector('.comment-container');

function renderComments(targetId) {
    container.innerHTML = '';

    const currentComments = comments[targetId];

    if (currentComments) {
        currentComments.forEach(comment => {
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
}

renderComments('home-content');

document.querySelectorAll('.sidebar-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault(); 

        const targetId = button.getAttribute('data-target');
        
        document.querySelectorAll('.content-page').forEach(page => {
            page.style.display = 'none';
        });

        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.style.display = 'block';
        }
        renderComments(targetId);
    });
});