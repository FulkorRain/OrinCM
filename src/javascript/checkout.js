import {getCart, removeFromCart, formatPrice, cartTotal} from "./cart.js";

const CHECKOUT_API_URL = "https://us-central1-prairiegolem.cloudfunctions.net/checkout/create-checkout-session";

const checkoutItemsElement = document.getElementById("checkout-items");
const checkoutEmptyMessageElement = document.getElementById("checkout-empty-message");
const checkoutTotalRowElement = document.getElementById("checkout-total-row");
const checkoutTotalAmountElement = document.getElementById("checkout-total-amount");
const placeOrderButton = document.getElementById("place-order-button");
const PLACE_ORDER_LABEL = placeOrderButton.textContent;

function renderCheckout() {
    const cart = getCart();

    if (cart.length === 0) {
        checkoutItemsElement.innerHTML = "";
        checkoutTotalAmountElement.textContent = "$0.00";
        checkoutEmptyMessageElement.hidden = false;
        checkoutTotalRowElement.hidden = true;
        placeOrderButton.hidden = true;
        return;
    }

    checkoutEmptyMessageElement.hidden = true;
    checkoutTotalRowElement.hidden = false;
    placeOrderButton.hidden = false;

    checkoutItemsElement.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <div class="checkout-item__info">
                <span class="checkout-item__name">${item.name}</span>
                <span class="checkout-item__qty">Qty: ${item.qty}</span>
            </div>
            <div class="checkout-item__actions">
                <span class="checkout-item__price">${formatPrice(item.price * item.qty)}</span>
                <button type="button" class="checkout-item__remove" data-product-id="${item.id}" aria-label="Remove ${item.name}">X</button>
            </div>
        </div>
    `).join("");

    checkoutTotalAmountElement.textContent = formatPrice(cartTotal(cart));
}

checkoutItemsElement.addEventListener("click", (event) => {
    const removeBtn = event.target.closest(".checkout-item__remove");
    if (!removeBtn) return;
    removeFromCart(removeBtn.dataset.productId);
    renderCheckout();
});

placeOrderButton.addEventListener("click", async () => {
    const cart = getCart();
    if (cart.length === 0) return;

    placeOrderButton.disabled = true;
    placeOrderButton.textContent = "Redirecting to payment...";

    try {
        const response = await fetch(CHECKOUT_API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({cart})
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();

        if (!data.url) {
            throw new Error("No checkout URL returned from server.");
        }

        window.location.href = data.url;
    } catch (err) {
        console.error("Checkout failed:", err);
        alert("Something went wrong starting checkout. Please try again.");
        placeOrderButton.disabled = false;
        placeOrderButton.textContent = PLACE_ORDER_LABEL;
    }
});

renderCheckout();