/**
 * Mobile navigation — burger menu toggle
 */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  if (!header) return;

  var toggle = header.querySelector(".site-header__menu-toggle");
  var nav = header.querySelector(".site-header__nav");
  var backdrop = header.querySelector(".site-header__backdrop");
  var navLinks = nav ? nav.querySelectorAll("a") : [];
  var mq = window.matchMedia("(max-width: 768px)");

  if (!toggle || !nav) return;

  function isMobile() {
    return mq.matches;
  }

  function setOpen(open) {
    header.classList.toggle("is-menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("is-nav-open", open);

    if (backdrop) {
      backdrop.hidden = !open;
      if (open) {
        backdrop.removeAttribute("tabindex");
      } else {
        backdrop.setAttribute("tabindex", "-1");
      }
    }

    if (open && navLinks.length) {
      navLinks[0].focus();
    }
  }

  function openMenu() {
    if (!isMobile()) return;
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
  }

  function toggleMenu() {
    if (!isMobile()) return;
    setOpen(!header.classList.contains("is-menu-open"));
  }

  toggle.addEventListener("click", toggleMenu);

  if (backdrop) {
    backdrop.addEventListener("click", closeMenu);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (isMobile()) closeMenu();
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && header.classList.contains("is-menu-open")) {
      closeMenu();
      toggle.focus();
    }
  });

  mq.addEventListener("change", function () {
    if (!mq.matches) closeMenu();
  });

  window.addEventListener("resize", function () {
    if (!isMobile() && header.classList.contains("is-menu-open")) {
      closeMenu();
    }
  });
})();
