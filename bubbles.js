// bubbles.js — Maple's Dog Grooming
// Injects the decorative soap-bubble layer. Kept in JS rather than markup so
// the bubbles live in one place instead of being pasted into all five pages.
//
// Skipped entirely on phones and when the OS asks for reduced motion — on a
// small screen sixteen drifting bubbles crowd the content and cost battery
// for decoration nobody asked for. The layer is built/torn down on demand,
// so rotating a tablet does the right thing either way.

(function () {
  const COUNT = 16;
  const MIN_SIZE = 10;
  const MAX_SIZE = 56;
  const MIN_DURATION = 17; // seconds
  const MAX_DURATION = 34;

  // Matches the site's mobile breakpoint: bubbles above it, none below.
  const ENABLE_QUERY = "(min-width: 769px)";
  const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

  const rand = (min, max) => min + Math.random() * (max - min);

  function shouldRun() {
    return (
      window.matchMedia(ENABLE_QUERY).matches &&
      !window.matchMedia(REDUCED_QUERY).matches
    );
  }

  function teardown() {
    const existing = document.querySelector(".bubbles");
    if (existing) existing.remove();
  }

  function build() {
    // No layer at all rather than a hidden or frozen one — nothing to
    // animate, nothing in the DOM.
    if (!shouldRun()) return teardown();
    if (document.querySelector(".bubbles")) return;

    const layer = document.createElement("div");
    layer.className = "bubbles";
    layer.setAttribute("aria-hidden", "true");

    for (let i = 0; i < COUNT; i++) {
      const bubble = document.createElement("span");
      const size = rand(MIN_SIZE, MAX_SIZE);

      bubble.className = "bubble";
      bubble.style.width = size + "px";
      bubble.style.height = size + "px";
      bubble.style.left = rand(0, 100) + "%";
      bubble.style.setProperty("--drift", rand(-70, 70) + "px");
      bubble.style.animationDuration = rand(MIN_DURATION, MAX_DURATION) + "s";
      // Negative delay starts each bubble mid-flight, so the page doesn't
      // open with every bubble queued at the bottom edge.
      bubble.style.animationDelay = -rand(0, MAX_DURATION) + "s";

      layer.appendChild(bubble);
    }

    document.body.appendChild(layer);
  }

  document.addEventListener("DOMContentLoaded", () => {
    build();

    // Re-evaluate on rotate/resize and if the motion preference changes,
    // so the layer appears or disappears instead of being stuck.
    [ENABLE_QUERY, REDUCED_QUERY].forEach((query) => {
      const mq = window.matchMedia(query);
      const onChange = () => (shouldRun() ? build() : teardown());
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else mq.addListener(onChange); // older Safari
    });
  });
})();
