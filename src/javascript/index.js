import { corruptText } from "./effects/text-corruption.js";
import {addToCart, formatPrice} from "./cart.js";

document.addEventListener('DOMContentLoaded', () => {
    
    const link = document.querySelector("#news-link");

    if (link) {
        link.classList.add('corruptable-text');
        corruptText(link.parentElement);
    } else {
        console.log('no link');
    }

});

function placeholderBanner(label) {
    const svg = 
        `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400">
            <rect width="100%" height="100%" fill="#6b4c3a"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="sans-serif" font-size="32" fill="#e8ded1">${label}</text>
        </svg>`;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

const STORE_TABS = [
    {
        id: "announcements",
        bannerImage: "src/assets/images/index_banner.png",
        bannerAlt: "Index Banner",
        articleHTML: `
            <p>I'm excited to present our comic books, Space Dracula and The Demon Gate. These are from a set of stories called the Triptych Files which are a long time in the making soon to feature a board game set in this world of weird espionage horror.</p>
            <p>I've long been interested in the combination of spies and monsters. I remembered only recently that i'd actually written some short stories in a similair vein way back in the 90s when i was like 12 years old. I even managed to get one published in a local Alberta paper. and i was delighted to see that their website is amazingly <a href ="src/html/news.html"><span id="news-link">still online</span></a>! Very old-school haha. There's something uniquely charming about Web 1.0</p>
        `,
        products: []
    },
    {
        id: "space-dracula",
        bannerImage: placeholderBanner("SPACE DRACULA - BANNER PLACEHOLDER"),
        bannerAlt: "Space Dracula Banner",
        articleHTML: `<p>Space Dracula description...</p>`,
        products: [
            {id: "space-dracula-game", name: "Space Dracula - Game", price: 9.99},
            {id: "space-dracula-comic", name: "Space Dracula - Comic", price: 9.99}
        ]
    },
    {
        id: "demon-gate",
        bannerImage: placeholderBanner("DEMON GATE - BANNER PLACEHOLDER"),
        bannerAlt: "Demon Gate Banner",
        articleHTML: `<p>Demon Gate description...</p>`,
        products: [
            {id: "demon-gate-game", name: "Demon Gate - Game", price: 9.99},
            {id: "demon-gate-comic", name: "Demon Gate - Comic", price: 9.99},
        ]
    },
    {
        id: "super-villians",
        bannerImage: placeholderBanner("SuperVillians - BANNER PLACEHOLDER"),
        bannerAlt: "SuperVillians Banner",
        articleHTML: `<p>SuperVillians description...</p>`,
        products: [
            {id: "super-villians-game", name: "SuperVillians - Game", price: 9.99},
            {id: "super-villians-comic", name: "SuperVillians - Comic", price: 9.99}
        ]
    }
];

const ADD_TO_CART_LABEL = "Add to Cart"
const ADDED_FEEDBACK_TEXT = "Added!";
const ADDED_FEEDBACK_MS = 900;

const tabButtons = document.querySelectorAll("[data-target]");
const tabContentElement = document.getElementById("tab-content");
const productActionsElement = document.getElementById("product-actions");
const bannerImageElement = document.getElementById("banner-image");

if (!tabContentElement || !productActionsElement || !bannerImageElement) {
    console.warn("One or more tab-system elements are missing");
}

const PRODUCTS_BY_ID = new Map();
STORE_TABS.forEach(tab => {
    tab.products.forEach(p => PRODUCTS_BY_ID.set(p.id, p));
});

function showAddedFeedback(buttonElement, product) {
    const priceRow = buttonElement.querySelector(".product-add-btn__row--price");
    if (!priceRow) return;

    buttonElement.disabled = true;
    buttonElement.classList.add("just-added");
    priceRow.textContent = ADDED_FEEDBACK_TEXT;

    setTimeout(() => {
        priceRow.textContent = `${formatPrice(product.price)} - ${ADD_TO_CART_LABEL}`;
        buttonElement.disabled = false;
        buttonElement.classList.remove("just-added");
    }, ADDED_FEEDBACK_MS);
}

productActionsElement.addEventListener("click", (event) => {
    const buttonElement = event.target.closest(".product-add-btn");
    if (!buttonElement) return;

    const product = PRODUCTS_BY_ID.get(buttonElement.dataset.productId);
    if (!product) {
        console.error(`No product found for id "${buttonElement.dataset.productId}"`);
        return;
    }

    addToCart(product);
    showAddedFeedback(buttonElement, product);
});

function renderTab(tabId) {
    const tab = STORE_TABS.find(t => t.id === tabId);
    if (!tab) {
        console.error(`No tab data found for "${tabId}"`);
        return;
    }

    tabContentElement.innerHTML = tab.articleHTML;
    productActionsElement.innerHTML = tab.products.length ? tab.products.map(p =>
        `
        <button type="button" class="mailing-list-button product-add-btn" data-product-id="${p.id}">
            <span class="product-add-btn__row product-add-btn__row--name">${p.name}</span>
            <span class="product-add-btn__row product-add-btn__row--price">${formatPrice(p.price)} - ${ADD_TO_CART_LABEL}</span>
        </button>
        `).join("") : "";

    if (bannerImageElement) {
        bannerImageElement.src = tab.bannerImage;
        bannerImageElement.alt = tab.bannerAlt;
    }

    tabButtons.forEach(btn => {
        const isActive = btn.dataset.tab === tabId;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive);
    });
}

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => renderTab(btn.dataset.target));
});

const initiallyActive = document.querySelector("[data-target].active") || tabButtons[0];
if (initiallyActive) {
    renderTab(initiallyActive.dataset.target);
}

