const {onRequest} = require('firebase-functions/v2/https');
const {defineSecret} = require('firebase-functions/params');

const apiKey = defineSecret('EMAILOCTOPUS_API_KEY');
const listId = defineSecret('EMAILOCTOPUS_LIST_ID');

const ALLOWED_ORIGINS = [
    "https://localhost:5173", //TODO: Add github link
];

exports.subscribe = onRequest(
    {
        secrets: [apiKey, listId],
        maxInstances: 5,
        cors: ALLOWED_ORIGINS,
        invoker: 'public',
    },
    async(req, res) => {
        if (req.method !== 'POST') {
            return res.status(405).json({success: false, error: 'Method not allowed'});
        }

        const {email, firstName, lastName} = req.body || {};
        if (!email) {
            return res.status(400).json({success: false, error: 'Email is required'});
        }

        try {
            const eoResponse = await fetch(
                `https://api.emailoctopus.com/lists/${listId.value()}/contacts`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey.value()}`,
                    },
                    body: JSON.stringify({
                        email_address: email,
                        status: 'subscribed',
                        fields: {FirstName: firstName || '', LastName: lastName || ''},
                    }),
                }
            );

            const eoBody = await eoResponse.text();
            console.log('EmailOctopus Replied:', eoResponse.status, eoBody);

            if (eoResponse.ok) return res.status(200).json({success: true});
            if (eoResponse.status === 409) {
                return res.status(200).json({success:true, alreadySubscribed: true});
            }
            return res.status(eoResponse.status).json({success: false, error: 'Subscription failed'});
        } catch (err) {
            console.error('Subscribe failed:', err);
            return res.status(500).json({success: false, error: 'Server error'});
        }
    }
);

const express = require("express");
const cors = require("cors");

const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");

const CURRENCY = "cad";
const MAX_QTY_PER_ITEM = 10;
const SHIPPING_COUNTRIES = ["CA"];

const PRODUCTS = {
    "space-dracula-comic": {name: "Space Dracula - Comic", priceCents: 999, physical: true},
    "space-dracula-game": {name: "Space Dracula - Game", priceCents: 999, physical: true},
    "demon-gate-comic": {name: "Demon Gate - Comic", priceCents: 999, physical: true},
    "demon-gate-game": {name: "Demon Gate - Game", priceCents: 999, physical: true},
    "super-villians-comic": {name: "SuperVillians - Comic", priceCents: 999, physical: true},
    "super-villians-game": {name: "SuperVillians - Game", priceCents: 999, physical: true},
}

const SUCCESS_PATH = "/success.html";
const CANCEL_PATH = "/checkout.html";

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
    try {
        const stripe = require("stripe")(stripeSecretKey.value());
        const {cart} = req.body;
        if (!Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({error: "Cart is empty."});
        }

        const line_items = [];
        let needsShipping = false;

        for (const item of cart) {
            const product = PRODUCTS[item.id];
            const qty = Number.parseInt(item.qty, 10);
            if (!product || !Number.isInteger(qty) || qty < 1 || qty> MAX_QTY_PER_ITEM) {
                return res.status(400).json({error: `Invalid Cart item: ${item.id}`});
            }

            if (product.physical) needsShipping = true;


            line_items.push({
                price_data: {
                    currency: CURRENCY,
                    product_data: {name: product.name},
                    unit_amount: product.priceCents,
                },
                quantity: qty,
            });
        }

        const origin = ALLOWED_ORIGINS.includes(req.headers.origin) ? req.headers.origin : ALLOWED_ORIGINS[0];
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items,
            ... (needsShipping && {
                shipping_address_collection: {allowed_countries: SHIPPING_COUNTRIES}
            }),
            success_url: `${origin}${SUCCESS_PATH}`,
            cancel_url: `${origin}${CANCEL_PATH}`
        });

        res.json({url: session.url});
    } catch (err) {
        console.error("Stripe session creation failed:", err);
        res.status(500).json({error: "Could not start checkout."});
    }
});

exports.checkout = onRequest({secrets: [stripeSecretKey]}, app);