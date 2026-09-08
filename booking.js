// booking.js — Maple's Dog Grooming
// Front-end-only date/time picker + confirmation flow.
// There is no backend yet: nothing here actually sends or reserves
// anything. Selecting a slot just tracks it in memory, and "Confirm
// Appointment" shows an on-page thank-you and clears the cart.
// Swap this out once a real booking backend/calendar exists.

(function () {
  const CART_STORAGE_KEY = "maples-grooming-cart";

  // Business hours used to generate slots. Sunday (0) and Monday (1) are
  // closed, matching the hours block at the bottom of this page.
  const OPEN_HOUR = 9; // 9am
  const CLOSE_HOUR = 16; // last slot start time (4pm), matches 9–5 with 1hr slots
  const CLOSED_DAYS = [0, 1]; // Sun, Mon

  let selectedTime = null;

  function formatHour(hour) {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${period}`;
  }

  function generateSlotsForDate(dateStr) {
    const grid = document.getElementById("time-slot-grid");
    const hint = document.getElementById("booking-date-hint");
    if (!grid || !hint) return;

    grid.innerHTML = "";
    selectedTime = null;

    if (!dateStr) {
      hint.textContent = "Pick a date to see available times.";
      hint.hidden = false;
      return;
    }

    // Parse as local date, not UTC, to avoid off-by-one day issues.
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const weekday = date.getDay();

    if (CLOSED_DAYS.includes(weekday)) {
      hint.textContent =
        "We're closed that day — please choose Tuesday through Saturday.";
      hint.hidden = false;
      return;
    }

    hint.hidden = true;

    for (let hour = OPEN_HOUR; hour <= CLOSE_HOUR; hour++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "time-slot-btn";
      btn.textContent = formatHour(hour);
      btn.dataset.hour = String(hour);
      btn.addEventListener("click", () => selectSlot(btn));
      grid.appendChild(btn);
    }
  }

  function selectSlot(btn) {
    document
      .querySelectorAll(".time-slot-btn")
      .forEach((el) => el.classList.remove("selected"));
    btn.classList.add("selected");
    selectedTime = btn.textContent;
  }

  function showError(message) {
    const errorEl = document.getElementById("booking-error");
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearError() {
    const errorEl = document.getElementById("booking-error");
    if (!errorEl) return;
    errorEl.hidden = true;
    errorEl.textContent = "";
  }

  function getCart() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    clearError();

    const cart = getCart();
    const dateInput = document.getElementById("booking-date");
    const nameInput = document.getElementById("booking-name");
    const dateVal = dateInput ? dateInput.value : "";

    if (cart.length === 0) {
      showError(
        "Your cart is empty — please add at least one service from the Services page first."
      );
      return;
    }
    if (!dateVal) {
      showError("Please choose a date.");
      return;
    }
    if (!selectedTime) {
      showError("Please choose a time slot.");
      return;
    }

    // Front-end only: nothing is actually sent anywhere yet.
    const form = document.getElementById("booking-form");
    const successEl = document.getElementById("booking-success");
    const successName = document.getElementById("booking-success-name");
    const successDatetime = document.getElementById("booking-success-datetime");

    const [year, month, day] = dateVal.split("-").map(Number);
    const prettyDate = new Date(year, month - 1, day).toLocaleDateString(
      undefined,
      { weekday: "long", month: "long", day: "numeric" }
    );

    if (successName) successName.textContent = nameInput?.value || "there";
    if (successDatetime)
      successDatetime.textContent = `${prettyDate} at ${selectedTime}`;

    if (form) form.hidden = true;
    if (successEl) successEl.hidden = false;

    // Clear the cart now that the "appointment" is confirmed.
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (err) {
      // ignore — non-critical
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("booking-date");
    if (dateInput) {
      const today = new Date();
      dateInput.min = today.toISOString().split("T")[0];
      dateInput.addEventListener("change", () =>
        generateSlotsForDate(dateInput.value)
      );
    }

    document
      .getElementById("booking-form")
      ?.addEventListener("submit", handleSubmit);
  });
})();
