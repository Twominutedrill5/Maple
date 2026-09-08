// back-to-top.js — Maple's Dog Grooming
// Shows a floating button once the page is scrolled down a bit;
// clicking it scrolls smoothly back to the top.

(function () {
  const SHOW_AFTER_PX = 300;

  function toggleVisibility(btn) {
    if (window.scrollY > SHOW_AFTER_PX) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    toggleVisibility(btn); // in case the page loads already scrolled

    window.addEventListener("scroll", () => toggleVisibility(btn), {
      passive: true,
    });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
})();
