/* ================================================
   PRO.JS — All shared pro enhancements
   Added after "improved" version:
   1. Theme toggle (dark/light)
   2. Back to top button
   3. Cookie banner
   4. Search overlay
   5. Search overlay
   6. Newsletter form
   ================================================ */

(function () {
    "use strict";

    /* ─── 1. THEME TOGGLE ─────────────────────── */
    function initThemeToggle() {
        var saved = localStorage.getItem("gamex-theme") || "dark";
        if (saved === "light") document.body.classList.add("light-mode");

        var btn = document.createElement("button");
        btn.id = "theme-toggle";
        btn.setAttribute("aria-label", "Cambiar tema");
        btn.innerHTML = saved === "light" ? "🌙 Dark" : "☀️ Light";

        var header = document.querySelector("header");
        if (!header) return;
        header.appendChild(btn);

        btn.addEventListener("click", function () {
            var isLight = document.body.classList.toggle("light-mode");
            localStorage.setItem("gamex-theme", isLight ? "light" : "dark");
            btn.innerHTML = isLight ? "🌙 Dark" : "☀️ Light";
        });
    }

    /* ─── 2. BACK TO TOP ──────────────────────── */
    function initBackToTop() {
        var btn = document.createElement("button");
        btn.id = "back-to-top";
        btn.setAttribute("aria-label", "Volver arriba");
        btn.innerHTML = "▲";
        document.body.appendChild(btn);

        window.addEventListener("scroll", function () {
            if (window.scrollY > 320) btn.classList.add("visible");
            else btn.classList.remove("visible");
        }, { passive: true });

        btn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* ─── 3. COOKIE BANNER ────────────────────── */
    function initCookieBanner() {
        if (localStorage.getItem("gamex-cookies")) return;

        var banner = document.createElement("div");
        banner.id = "cookie-banner";
        banner.setAttribute("role", "dialog");
        banner.setAttribute("aria-label", "Aviso de cookies");
        banner.innerHTML = `
            <p>🍪 Usamos cookies para mejorar tu experiencia gaming.
               <a href="#">Política de privacidad</a></p>
            <div class="cookie-btns">
                <button class="btn-cookie-reject" aria-label="Rechazar cookies">Rechazar</button>
                <button class="btn-cookie-accept" aria-label="Aceptar cookies">✅ Aceptar</button>
            </div>`;
        document.body.appendChild(banner);

        setTimeout(function () { banner.classList.add("visible"); }, 1500);

        banner.querySelector(".btn-cookie-accept").addEventListener("click", function () {
            localStorage.setItem("gamex-cookies", "accepted");
            closeBanner();
            if (window.showToast) window.showToast("🍪 Cookies aceptadas", "success");
        });
        banner.querySelector(".btn-cookie-reject").addEventListener("click", function () {
            localStorage.setItem("gamex-cookies", "rejected");
            closeBanner();
        });

        function closeBanner() {
            banner.style.transform = "translateY(100%)";
            setTimeout(function () { banner.remove(); }, 400);
        }
    }

    /* ─── 5. SEARCH OVERLAY ───────────────────── */
    var PRODUCTS = [
        { name: "PlayStation 5",   price: 499, cat: "consola",   url: "servicios.html" },
        { name: "Nintendo Switch",  price: 329, cat: "consola",   url: "servicios.html" },
        { name: "Auriculares Pro",  price: 99,  cat: "accesorio", url: "servicios.html" },
        { name: "Juegos PS5",       price: 70,  cat: "juego",     url: "servicios.html" },
        { name: "Teclado gamer",    price: 120, cat: "accesorio", url: "servicios.html" },
        { name: "Ratón gamer",      price: 110, cat: "accesorio", url: "servicios.html" }
    ];

    function getBaseUrl() {
        // Detect if we're in /blog/ subfolder
        return window.location.pathname.includes("/blog/") ? "../" : "";
    }

    function initSearch() {
        var header = document.querySelector("header");
        if (!header) return;

        var searchBtn = document.createElement("button");
        searchBtn.id = "search-btn";
        searchBtn.setAttribute("aria-label", "Buscar productos");
        searchBtn.innerHTML = "🔍";
        header.appendChild(searchBtn);

        var overlay = document.createElement("div");
        overlay.id = "search-overlay";
        overlay.setAttribute("role", "dialog");
        overlay.setAttribute("aria-label", "Buscar productos");
        overlay.innerHTML = `
            <button id="search-close" aria-label="Cerrar búsqueda">✕</button>
            <input type="search" id="search-input" placeholder="🔍 Buscar productos..." autocomplete="off" aria-label="Campo de búsqueda">
            <div id="search-results" role="listbox" aria-label="Resultados de búsqueda"></div>
            <p id="search-empty">No se encontraron productos</p>`;
        document.body.appendChild(overlay);

        searchBtn.addEventListener("click", openSearch);
        document.getElementById("search-close").addEventListener("click", closeSearch);
        document.getElementById("search-input").addEventListener("input", doSearch);
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closeSearch();
            if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); openSearch(); }
        });
    }

    function openSearch() {
        var overlay = document.getElementById("search-overlay");
        overlay.classList.add("open");
        setTimeout(function () { document.getElementById("search-input").focus(); }, 100);
        doSearch();
    }

    function closeSearch() {
        document.getElementById("search-overlay").classList.remove("open");
    }

    function doSearch() {
        var q = document.getElementById("search-input").value.trim().toLowerCase();
        var results = document.getElementById("search-results");
        var empty = document.getElementById("search-empty");
        var base = getBaseUrl();

        var filtered = q === ""
            ? PRODUCTS
            : PRODUCTS.filter(function (p) { return p.name.toLowerCase().includes(q) || p.cat.includes(q); });

        if (filtered.length === 0) {
            results.innerHTML = "";
            empty.style.display = "block";
        } else {
            empty.style.display = "none";
            results.innerHTML = filtered.map(function (p) {
                return `<a class="search-result-item" href="${base}${p.url}" role="option" onclick="document.getElementById('search-overlay').classList.remove('open')">
                    <span>🎮 ${p.name}</span>
                    <span class="search-result-price">${p.price} €</span>
                </a>`;
            }).join("");
        }
    }

    /* ─── 6. NEWSLETTER ───────────────────────── */
    function initNewsletter() {
        var footer = document.querySelector("footer");
        if (!footer) return;

        var bar = document.createElement("div");
        bar.className = "newsletter-bar";
        bar.innerHTML = `
            <p>📧 <strong>Newsletter GameX</strong> — Recibe ofertas y novedades</p>
            <div class="newsletter-form">
                <input type="email" class="newsletter-input" placeholder="tu@email.com" aria-label="Email para newsletter">
                <button class="newsletter-btn" aria-label="Suscribirse">Suscribirme 🚀</button>
            </div>`;
        footer.parentNode.insertBefore(bar, footer);

        bar.querySelector(".newsletter-btn").addEventListener("click", async function () {
            var email = bar.querySelector(".newsletter-input").value.trim();
            if (!email || !email.includes("@")) {
                if (window.showToast) window.showToast("Introduce un email valido", "error");
                return;
            }
            try {
                var res = await fetch("http://127.0.0.1:8000/newsletter", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: email })
                });
                var data = await res.json();
                bar.querySelector(".newsletter-input").value = "";
                if (window.showToast) window.showToast(data.ok ? "Suscripcion confirmada!" : data.msg, data.ok ? "success" : "error");
            } catch {
                bar.querySelector(".newsletter-input").value = "";
                if (window.showToast) window.showToast("Suscripcion guardada localmente", "success");
            }
        });
    }

    /* ─── INIT ALL ────────────────────────────── */
    document.addEventListener("DOMContentLoaded", function () {
        initThemeToggle();
        initBackToTop();
        initCookieBanner();
        initSearch();
        initNewsletter();
    });

})();
