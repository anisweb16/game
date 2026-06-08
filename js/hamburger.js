// ===== HAMBURGER MENU =====
document.addEventListener("DOMContentLoaded", function () {
    const nav = document.querySelector("nav");
    if (!nav) return;

    // Create hamburger button
    const hamburger = document.createElement("button");
    hamburger.className = "hamburger";
    hamburger.setAttribute("aria-label", "Menu");
    hamburger.innerHTML = "<span></span><span></span><span></span>";

    // Insert before nav
    const header = document.querySelector("header");
    header.insertBefore(hamburger, nav);

    hamburger.addEventListener("click", function () {
        hamburger.classList.toggle("open");
        nav.classList.toggle("open");
    });

    // Close menu when a link is clicked
    nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            hamburger.classList.remove("open");
            nav.classList.remove("open");
        });
    });

    // Close menu on resize to desktop
    window.addEventListener("resize", function () {
        if (window.innerWidth > 600) {
            hamburger.classList.remove("open");
            nav.classList.remove("open");
        }
    });
});
