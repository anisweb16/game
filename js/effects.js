// ===== PAGE TRANSITIONS (instant nav, no loader delay) =====
(function () {
    // Inject styles
    var style = document.createElement("style");
    style.textContent = `
        /* Page fade-in on load */
        body { animation: pageIn .22s ease both; }
        @keyframes pageIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        /* Top progress bar */
        #nav-bar {
            position: fixed; top: 0; left: 0; height: 3px; width: 0;
            background: linear-gradient(90deg, #19A2FF, #FF2266);
            z-index: 99999; border-radius: 0 2px 2px 0;
            transition: width .3s ease, opacity .3s ease;
            pointer-events: none;
        }
        #nav-bar.go   { width: 85%; }
        #nav-bar.done { width: 100%; opacity: 0; }
    `;
    document.head.appendChild(style);

    // Top bar element
    var bar = document.createElement("div");
    bar.id = "nav-bar";
    document.body.appendChild(bar);

    // Intercept all internal nav links
    document.addEventListener("click", function (e) {
        var a = e.target.closest("a");
        if (!a) return;
        var href = a.getAttribute("href");
        if (!href) return;
        // Skip external, anchor, mailto, js links
        if (href.startsWith("http") || href.startsWith("#") ||
            href.startsWith("mailto") || href.startsWith("javascript")) return;

        e.preventDefault();
        // Start bar
        bar.className = "";
        bar.style.width = "0";
        bar.style.opacity = "1";
        setTimeout(function () { bar.classList.add("go"); }, 10);

        // Fade out body
        document.body.style.transition = "opacity .15s ease";
        document.body.style.opacity = "0";

        // Navigate
        setTimeout(function () {
            window.location.href = href;
        }, 180);
    }, true);

    // On page load: complete bar
    window.addEventListener("pageshow", function () {
        document.body.style.opacity = "1";
        bar.classList.add("done");
        setTimeout(function () { bar.className = ""; bar.style.width = "0"; }, 400);
    });
})();



// ===== PARTICLES BACKGROUND =====
(function () {
    const canvas = document.createElement("canvas");
    canvas.id = "particles-canvas";
    const style = document.createElement("style");
    style.textContent = `
        #particles-canvas {
            position: fixed; top: 0; left: 0;
            width: 100%; height: 100%;
            pointer-events: none; z-index: 0; opacity: 0.35;
        }
        body > *:not(#particles-canvas):not(#toast-container):not(#nav-bar) {
            position: relative; z-index: 1;
        }
    `;
    document.head.appendChild(style);
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext("2d");
    let particles = [];
    const COUNT = 55;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < COUNT; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            color: Math.random() > 0.5 ? "#19A2FF" : "#FF2266",
            alpha: Math.random() * 0.6 + 0.2
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(function (p) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        });

        // Draw lines between close particles
        ctx.globalAlpha = 0.08;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = "#19A2FF";
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }
    draw();
})();

// ===== SCROLL ANIMATIONS =====
(function () {
    const style = document.createElement("style");
    style.textContent = `
        .fade-in-up {
            opacity: 0; transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .fade-in-up.visible {
            opacity: 1; transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    function addFadeTargets() {
        const selectors = [
            "section", "article", ".card-product",
            ".contact-card", ".article-banner", "h1", "h2",
            ".top3", "blockquote", ".comment-fake", ".reasons li"
        ];
        selectors.forEach(function (sel) {
            document.querySelectorAll(sel).forEach(function (el) {
                if (!el.classList.contains("banner") && !el.classList.contains("banner-animated")) {
                    el.classList.add("fade-in-up");
                }
            });
        });

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll(".fade-in-up").forEach(function (el) {
            observer.observe(el);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addFadeTargets);
    } else {
        addFadeTargets();
    }
})();

// ===== TOAST NOTIFICATIONS =====
(function () {
    const container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);

    const style = document.createElement("style");
    style.textContent = `
        #toast-container {
            position: fixed; bottom: 28px; right: 24px;
            display: flex; flex-direction: column; gap: 10px;
            z-index: 99997;
        }
        .toast {
            background: #12141Bee;
            border: 1px solid #19A2FF66;
            color: #f2f2f2;
            font-family: 'Orbitron', Arial, sans-serif;
            font-size: 0.82em;
            padding: 12px 20px 12px 14px;
            border-radius: 12px;
            box-shadow: 0 0 18px #19A2FF44;
            display: flex; align-items: center; gap: 10px;
            min-width: 220px; max-width: 300px;
            animation: toastIn 0.4s ease;
            cursor: pointer;
        }
        .toast.success { border-color: #19A2FF88; }
        .toast.error   { border-color: #FF226688; }
        .toast.info    { border-color: #19A2FF44; }
        .toast-icon { font-size: 1.3em; flex-shrink: 0; }
        .toast-msg { flex: 1; }
        @keyframes toastIn {
            from { opacity: 0; transform: translateX(60px); }
            to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes toastOut {
            to { opacity: 0; transform: translateX(60px); }
        }
    `;
    document.head.appendChild(style);

    window.showToast = function (message, type) {
        type = type || "info";
        const icons = { success: "✅", error: "❌", info: "🎮" };
        const toast = document.createElement("div");
        toast.className = "toast " + type;
        toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-msg">${message}</span>`;
        container.appendChild(toast);
        toast.addEventListener("click", function () { removeToast(toast); });
        setTimeout(function () { removeToast(toast); }, 3500);
    };

    function removeToast(toast) {
        toast.style.animation = "toastOut 0.35s ease forwards";
        setTimeout(function () { toast.remove(); }, 350);
    }
})();
