const toggle = document.getElementById("theme-toggle");
const root = document.documentElement;

function getPreferredTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  if (toggle) toggle.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
}

// Set theme on load
applyTheme(getPreferredTheme());

// Toggle on click
if (toggle) {
  toggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  });
}
