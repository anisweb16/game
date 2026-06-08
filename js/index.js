document.addEventListener("DOMContentLoaded", function () {

    // ===== STATS COUNTER =====
    function animateCounter(el) {
        const target = parseInt(el.getAttribute("data-target"));
        const duration = 1800;
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(ease * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }
        requestAnimationFrame(update);
    }

    const counters = document.querySelectorAll(".stat-number");
    const statsObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { statsObserver.observe(c); });

    // ===== FEATURED CARDS HOVER SOUND EFFECT (visual) =====
    document.querySelectorAll(".featured-card").forEach(function (card) {
        card.addEventListener("mouseenter", function () {
            card.style.borderColor = "#FF2266";
        });
        card.addEventListener("mouseleave", function () {
            card.style.borderColor = "#19A2FF44";
        });
    });

    // ===== WELCOME TOAST =====
    setTimeout(function () {
        if (window.showToast) {
            window.showToast("¡Bienvenido a GameX Store! 🎮", "info");
        }
    }, 1800);

    // ===== PROMO TOAST =====
    setTimeout(function () {
        if (window.showToast) {
            window.showToast("🔥 Oferta especial esta semana", "success");
        }
    }, 4000);
});
