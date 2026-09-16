// follow-us.js — Maple's Dog Grooming
// Sticky "Follow Us" widget: rotates through gallery photos and links to the
// studio's social profile.
//
// TEMPLATE SETUP: set FOLLOW_URL to the real profile URL. The widget is
// always visible; while FOLLOW_URL is empty it simply renders without an
// href, so it shows in the design without being a link that goes nowhere.

(function () {
  // `focus` is the vertical focal point for the square crop — the default
  // centre lands on the dog's body in portrait shots and cuts the head off.
  // focus   = vertical focal point (lower % pulls the crop toward the head)
  // focusX  = horizontal focal point, for landscape shots where the dog
  //           stands off to one side and a centred square crop misses it.
  const GALLERY_IMAGES = [
    { src: "/assets/two_pups.jpg", focus: "50%" },
    { src: "/assets/poodle_trim.jpg", focus: "30%" },
    { src: "/assets/pup_comb.jpg", focus: "50%", focusX: "60%" },
    { src: "/assets/pit_bath.jpg", focus: "50%" },
    { src: "/assets/puppy_trim.jpg", focus: "40%", focusX: "65%" },
    { src: "/assets/husky_brush_deshedding.jpg", focus: "40%", focusX: "100%" },
    { src: "/assets/lab_brushed.avif", focus: "50%", focusX: "75%" },
    { src: "/assets/dog_brush.avif", focus: "50%" },
    { src: "/assets/husky_groom.jpg", focus: "25%" },
    { src: "/assets/lab_shep_mix.jpg", focus: "25%" },
  ];
  const ROTATE_MS = 3000;

  // PLACEHOLDER — e.g. "https://www.instagram.com/yourstudio/"
  const FOLLOW_URL = "";
  const FOLLOW_NETWORK = "Instagram";

  document.addEventListener("DOMContentLoaded", () => {
    const widget = document.getElementById("follow-us-widget");
    const img = document.getElementById("follow-us-photo-img");
    if (!widget || !img) return;

    widget.setAttribute("aria-label", "Follow us on " + FOLLOW_NETWORK);

    // The markup ships with no href, so with JS off (or no URL configured)
    // the widget is a plain panel rather than a link to nowhere.
    if (FOLLOW_URL) {
      widget.href = FOLLOW_URL;
      widget.target = "_blank";
      widget.rel = "noopener noreferrer";
    }

    let index = 0;
    setInterval(() => {
      index = (index + 1) % GALLERY_IMAGES.length;
      img.style.opacity = "0";
      setTimeout(() => {
        const next = GALLERY_IMAGES[index];
        img.src = next.src;
        img.style.setProperty("--focus", next.focus || "50%");
        img.style.setProperty("--focus-x", next.focusX || "50%");
        img.style.opacity = "1";
      }, 300);
    }, ROTATE_MS);
  });
})();
