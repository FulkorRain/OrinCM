const CART_STORAGE_KEY = "pgpCart";

export function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
    } catch(err) {
        console.warn("Could not load local storage:", err);
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
        console.warn("Could not save cart to local storage:", err);
    }

    updateCartBadge();
    renderCartDrawer();
}

export function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({id: product.id, name: product.name, price: product.price, qty: 1});
    }

    saveCart(cart);
}

export function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
}

export function clearCart() {
    saveCart([]);
}

export function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

export function cartTotal(cart) {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

const cartCountElement = document.getElementById("cart-count");

function updateCartBadge() {
    if (!cartCountElement) return;
    const cart = getCart();
    const totalQty = cart.reduce((total, item) => total + item.qty, 0);

    cartCountElement.textContent = totalQty;
    cartCountElement.hidden = totalQty === 0;
}

const cartFab = document.getElementById("cart-fab");
const cartOverlay = document.getElementById("cart-overlay");
const cartDrawer = document.getElementById("cart-drawer");
const cartDrawerClose = document.getElementById("cart-drawer-close");
const cartDrawerItemsElement = document.getElementById("cart-drawer-items");
const cartDrawerEmptyElement = document.getElementById("cart-drawer-empty");
const cartDrawerSubtotalElement = document.getElementById("cart-drawer-subtotal");

function renderCartDrawer() {
    if (!cartDrawerItemsElement) return;
    
    const cart = getCart();

    if (cart.length === 0) {
        cartDrawerItemsElement.innerHTML = "";
        if (cartDrawerEmptyElement) cartDrawerEmptyElement.hidden = false;
        if (cartDrawerSubtotalElement) cartDrawerSubtotalElement.hidden = true;
        return;
    }

    if (cartDrawerEmptyElement) cartDrawerEmptyElement.hidden = true;
    if (cartDrawerSubtotalElement) cartDrawerSubtotalElement.hidden = false;

    cartDrawerItemsElement.innerHTML = cart.map(item => 
    `
    <div class="cart-drawer__item">
        <div class="cart-drawer__item-info">
            <span class="cart-drawer__item-name">${item.name}</span>
            <span class="cart-drawer__item-qty">x ${item.qty}</span>
        </div>
        <span class="cart-drawer__item-price">${formatPrice(item.price * item.qty)}</span>
        <button type="button" class="cart-drawer__item-remove" data-product-id="${item.id}" aria-label="Remove ${item.name}">X</button>
    </div>
    `).join("");

    if (cartDrawerSubtotalElement) {
        cartDrawerSubtotalElement.querySelector(".cart-drawer__subtotal-amount").textContent = formatPrice(cartTotal(cart));
    }
}

function openCartDrawer() {
    renderCartDrawer();
    cartDrawer.classList.add("is-open");
    cartOverlay.classList.add("is-open");
    cartDrawer.setAttribute("aria-hidden", false);
}

function closeCartDrawer() {
    cartDrawer.classList.remove("is-open");
    cartOverlay.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");
}

if(cartFab) cartFab.addEventListener("click", openCartDrawer);
if(cartDrawerClose) cartDrawerClose.addEventListener("click", closeCartDrawer);
if(cartOverlay) cartOverlay.addEventListener("click", closeCartDrawer);

if (cartDrawerItemsElement) {
    cartDrawerItemsElement.addEventListener("click", (event) => {
        const removeBtn = event.target.closest(".cart-drawer__item-remove");
        if (!removeBtn) return;
        removeFromCart(removeBtn.dataset.productId);
    });
}

updateCartBadge();