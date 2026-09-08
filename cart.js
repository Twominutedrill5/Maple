// cart.js — Maple's Dog Grooming
// Simple client-side cart for selecting services before booking.
// Persists to localStorage so the selection survives navigation between pages.

(function () {
  const STORAGE_KEY = "maples-grooming-cart";

  /** @type {{id: string, name: string, price: number, qty: number}[]} */
  let cart = loadCart();

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Could not read cart from storage:", err);
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error("Could not save cart:", err);
    }
  }

  function addToCart(id, name, price) {
    const existing = cart.find((item) => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id, name, price, qty: 1 });
    }
    saveCart();
    renderCart();
  }

  function changeQty(id, delta) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter((i) => i.id !== id);
    }
    saveCart();
    renderCart();
  }

  function removeItem(id) {
    cart = cart.filter((i) => i.id !== id);
    saveCart();
    renderCart();
  }

  function subtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function totalCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function formatMoney(n) {
    return `$${n.toFixed(2)}`;
  }

  function renderCart() {
    const itemsList = document.getElementById("cart-items");
    const emptyMsg = document.getElementById("cart-empty");
    const subtotalEl = document.getElementById("cart-subtotal");
    const countEl = document.getElementById("cart-count");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (!itemsList) return; // cart markup not on this page

    // Clear existing rendered items (but keep the empty-state <li> node to reuse)
    itemsList.querySelectorAll(".cart-item").forEach((el) => el.remove());

    if (cart.length === 0) {
      if (emptyMsg) emptyMsg.style.display = "block";
    } else {
      if (emptyMsg) emptyMsg.style.display = "none";
      cart.forEach((item) => {
        const li = document.createElement("li");
        li.className = "cart-item";
        li.innerHTML = `
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatMoney(item.price)} each</div>
          </div>
          <div class="cart-item-controls">
            <button class="qty-btn" data-action="dec" aria-label="Decrease quantity">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-action="inc" aria-label="Increase quantity">+</button>
            <button class="remove-item" data-action="remove" aria-label="Remove ${item.name}">Remove</button>
          </div>
        `;
        li.querySelector('[data-action="inc"]').addEventListener("click", () =>
          changeQty(item.id, 1)
        );
        li.querySelector('[data-action="dec"]').addEventListener("click", () =>
          changeQty(item.id, -1)
        );
        li.querySelector('[data-action="remove"]').addEventListener("click", () =>
          removeItem(item.id)
        );
        itemsList.appendChild(li);
      });
    }

    if (subtotalEl) subtotalEl.textContent = formatMoney(subtotal());
    if (countEl) countEl.textContent = String(totalCount());
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

    syncCardButtons();
  }

  // Keep each service card's "Add to Cart" button / qty stepper in sync
  // with the current cart state (so it reflects reality on page load too).
  function syncCardButtons() {
    document.querySelectorAll(".cart-action").forEach((el) => {
      const id = el.dataset.serviceId;
      const item = cart.find((i) => i.id === id);
      const addBtn = el.querySelector(".add-to-cart");
      const stepper = el.querySelector(".qty-stepper");
      const qtyValue = el.querySelector(".qty-value");

      if (item) {
        if (addBtn) addBtn.hidden = true;
        if (stepper) stepper.hidden = false;
        if (qtyValue) qtyValue.textContent = String(item.qty);
      } else {
        if (addBtn) addBtn.hidden = false;
        if (stepper) stepper.hidden = true;
      }
    });
  }

  function openCart() {
    document.getElementById("cart-drawer")?.classList.add("open");
    document.getElementById("cart-overlay")?.classList.add("open");
    document.getElementById("cart-drawer")?.setAttribute("aria-hidden", "false");
    document.getElementById("cart-toggle")?.setAttribute("aria-expanded", "true");
  }

  function closeCart() {
    document.getElementById("cart-drawer")?.classList.remove("open");
    document.getElementById("cart-overlay")?.classList.remove("open");
    document.getElementById("cart-drawer")?.setAttribute("aria-hidden", "true");
    document.getElementById("cart-toggle")?.setAttribute("aria-expanded", "false");
  }

  function handleCheckout() {
    // Placeholder until the booking calendar tool is wired up.
    // For now, stash the cart and send the customer to the booking/contact
    // page, where the future booking tool can read `maples-grooming-cart`
    // from localStorage and pre-fill the requested services.
    window.location.href = "/contact.html";
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Each service card's cart-action wrapper holds both the "Add to Cart"
    // button and the qty stepper; only one is visible at a time.
    document.querySelectorAll(".cart-action").forEach((wrapper) => {
      const name = wrapper.dataset.name;
      const price = parseFloat(wrapper.dataset.price);
      const id = wrapper.dataset.serviceId;

      wrapper.querySelector(".add-to-cart")?.addEventListener("click", () => {
        addToCart(id, name, price);
      });

      wrapper
        .querySelector('.qty-stepper [data-action="inc"]')
        ?.addEventListener("click", () => changeQty(id, 1));

      wrapper
        .querySelector('.qty-stepper [data-action="dec"]')
        ?.addEventListener("click", () => changeQty(id, -1));
    });

    document.getElementById("cart-toggle")?.addEventListener("click", openCart);
    document.getElementById("cart-close")?.addEventListener("click", closeCart);
    document.getElementById("cart-overlay")?.addEventListener("click", closeCart);
    document.getElementById("checkout-btn")?.addEventListener("click", handleCheckout);

    renderCart();
  });
})();
