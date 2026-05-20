(function () {
  var items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  function collapsePanel(item) {
    item.classList.remove("faq-item--open");
    var trigger = item.querySelector(".faq-item__trigger");
    var panel = item.querySelector(".faq-item__panel");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
    if (panel) {
      panel.style.maxHeight = "0";
      panel.setAttribute("aria-hidden", "true");
    }
  }

  function expandPanel(item) {
    var trigger = item.querySelector(".faq-item__trigger");
    var panel = item.querySelector(".faq-item__panel");
    if (!panel) return;

    item.classList.add("faq-item--open");
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
    panel.style.maxHeight = panel.scrollHeight + "px";
  }

  function refreshOpenPanel() {
    var open = document.querySelector(".faq-item--open");
    if (!open) return;
    var panel = open.querySelector(".faq-item__panel");
    if (panel) panel.style.maxHeight = panel.scrollHeight + "px";
  }

  items.forEach(function (item) {
    var trigger = item.querySelector(".faq-item__trigger");
    var panel = item.querySelector(".faq-item__panel");
    if (!trigger || !panel) return;

    item.classList.remove("faq-item--open");
    trigger.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
    panel.style.maxHeight = "0";

    trigger.addEventListener("click", function () {
      var isOpen = item.classList.contains("faq-item--open");

      items.forEach(function (other) {
        if (other !== item) collapsePanel(other);
      });

      if (isOpen) {
        collapsePanel(item);
      } else {
        expandPanel(item);
      }
    });
  });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshOpenPanel, 150);
  });
})();
