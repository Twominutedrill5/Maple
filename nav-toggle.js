const navToggle = document.getElementById("nav-toggle");
const nav = document.getElementById("primary-nav");

if (navToggle && nav) {
  const setNavOpen = (open) => {
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  };

  navToggle.addEventListener("click", () => {
    setNavOpen(!nav.classList.contains("is-open"));
  });

  // Escape closes the menu and puts focus back on the toggle.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setNavOpen(false);
      navToggle.focus();
    }
  });
}

/* The header is transparent at the top of the page so it blends into the
   page background. Once content starts scrolling underneath it, add
   .is-scrolled to give it a translucent surface again. */
const siteHeader = document.querySelector("header");

if (siteHeader) {
  const syncHeaderSurface = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  syncHeaderSurface();
  window.addEventListener("scroll", syncHeaderSurface, { passive: true });
}
