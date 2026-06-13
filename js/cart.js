/**
 * cart.js — GameX Store shared cart
 * Works on ALL pages. Renders a cart icon in the header.
 * Clicking it navigates to cart.html
 */

(function () {
    "use strict";

    var STORAGE_KEY = "gamex-cart-v2";

    /* ── Helpers ─────────────────────────────── */
    function load() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
        catch (e) { return []; }
    }

    function save(cart) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }

    function totalQty(cart) {
        return cart.reduce(function (s, i) { return s + i.qty; }, 0);
    }

    /* ── Public API ──────────────────────────── */
    window.GamexCart = {

        get: load,

        add: function (product) {
            var cart = load();
            var existing = cart.find(function (i) { return i.id === product.id; });
            if (existing) {
                existing.qty++;
            } else {
                cart.push({
                    id:       product.id,
                    name:     product.name,
                    price:    product.price,
                    oldPrice: product.oldPrice || null,
                    img:      product.img,
                    brand:    product.brand,
                    qty:      1
                });
            }
            save(cart);
            window.GamexCart.updateBadge();
            if (window.showToast) {
                window.showToast("🛒 " + product.name + " añadido", "success");
            }
        },

        remove: function (id) {
            save(load().filter(function (i) { return i.id !== id; }));
            window.GamexCart.updateBadge();
        },

        change: function (id, delta) {
            var cart = load();
            var item = cart.find(function (i) { return i.id === id; });
            if (!item) return;
            item.qty += delta;
            if (item.qty <= 0) cart = cart.filter(function (i) { return i.id !== id; });
            save(cart);
            window.GamexCart.updateBadge();
        },

        clear: function () {
            save([]);
            window.GamexCart.updateBadge();
        },

        updateBadge: function () {
            var badge = document.getElementById("gc-badge");
            if (!badge) return;
            var qty = totalQty(load());
            badge.textContent = qty;
            badge.style.display = qty > 0 ? "flex" : "none";
        },

        /* Inject cart button into header */
        injectButton: function () {
            var header = document.querySelector("header");
            if (!header || document.getElementById("gc-btn")) return;

            /* Detect if inside a subdirectory (e.g. blog/) */
            var inSubdir = window.location.pathname.split("/").some(function(p){ return p === "blog"; });
            var base = inSubdir ? "../" : "";

            var btn = document.createElement("a");
            btn.id        = "gc-btn";
            btn.href      = base + "cart.html";
            btn.setAttribute("aria-label", "Ver carrito");
            btn.innerHTML =
                '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>' +
                '<line x1="3" y1="6" x2="21" y2="6"/>' +
                '<path d="M16 10a4 4 0 01-8 0"/>' +
                '</svg>' +
                '<span id="gc-badge" style="display:none">0</span>';
            header.appendChild(btn);
            window.GamexCart.updateBadge();
        }
    };

    /* Auto-inject on DOMContentLoaded */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            window.GamexCart.injectButton();
        });
    } else {
        window.GamexCart.injectButton();
    }

    /* Re-sync badge on storage changes (cross-tab) */
    window.addEventListener("storage", function (e) {
        if (e.key === STORAGE_KEY) window.GamexCart.updateBadge();
    });

})();
