const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelectorAll(".nav a");
const checkoutButtons = document.querySelectorAll("[data-checkout]");
const paymentStatus = document.querySelector(".mp-status");
const productTabs = document.querySelectorAll("[data-product-tab]");
const productPanels = document.querySelectorAll("[data-product-panel]");
const heroSlides = document.querySelectorAll(".hero-slide");
const categoryLinks = document.querySelectorAll("[data-open-category]");
const cartToggle = document.querySelector(".cart-toggle");
const cartDrawer = document.querySelector(".cart-drawer");
const cartBackdrop = document.querySelector("[data-cart-backdrop]");
const cartClose = document.querySelector("[data-cart-close]");
const cartItems = document.querySelector("[data-cart-items]");
const cartEmpty = document.querySelector("[data-cart-empty]");
const cartCount = document.querySelector("[data-cart-count]");
const cartSubtotal = document.querySelector("[data-cart-subtotal]");
const cartShipping = document.querySelector("[data-cart-shipping]");
const cartPixDiscount = document.querySelector("[data-cart-pix-discount]");
const cartCoupon = document.querySelector("[data-cart-coupon]");
const cartTotal = document.querySelector("[data-cart-total]");
const cartStatus = document.querySelector("[data-cart-status]");
const cartCheckout = document.querySelector("[data-cart-checkout]");
const paymentMethods = document.querySelectorAll("[data-payment-method]");
const paymentNote = document.querySelector("[data-payment-note]");
const zipInput = document.querySelector("[data-zip-input]");
const shippingButton = document.querySelector("[data-shipping-button]");
const shippingMessage = document.querySelector("[data-shipping-message]");
const couponInput = document.querySelector("[data-coupon-input]");
const couponButton = document.querySelector("[data-coupon-button]");
const couponMessage = document.querySelector("[data-coupon-message]");

const CART_STORAGE_KEY = "duo-active-cart";
const PIX_DISCOUNT_RATE = 0.05;
const sizeOptions = [
  { value: "Unico", label: "Unico - veste 36 ao 40" },
  { value: "G", label: "G - veste 42 ao 44" },
  { value: "GG", label: "GG - veste 44 ao 46" },
];

let cart = [];
let selectedPaymentMethod = "pix";
let shippingAmount = 0;
let couponDiscount = 0;

const syncHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 18);
};

menuButton.addEventListener("click", () => {
  const isOpen = header.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

const setProductTab = (selectedTab) => {
  const selectedCategory = selectedTab.dataset.productTab;

  productTabs.forEach((tab) => {
    const isActive = tab === selectedTab;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  productPanels.forEach((panel) => {
    const shouldShow = selectedCategory === "all" || panel.dataset.productPanel === selectedCategory;
    panel.hidden = !shouldShow;
    panel.classList.toggle("active", shouldShow);
  });
};

productTabs.forEach((tab) => {
  tab.addEventListener("click", () => setProductTab(tab));
});

const initialProductTab = document.querySelector("[data-product-tab].active");
if (initialProductTab) setProductTab(initialProductTab);

let activeHeroSlide = 0;
let heroSlideTimer;

const showHeroSlide = (index) => {
  if (!heroSlides.length) return;
  activeHeroSlide = (index + heroSlides.length) % heroSlides.length;

  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === activeHeroSlide);
  });
};

const startHeroSlider = () => {
  if (heroSlides.length <= 1) return;
  window.clearInterval(heroSlideTimer);
  heroSlideTimer = window.setInterval(() => showHeroSlide(activeHeroSlide + 1), 4200);
};

categoryLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const tab = document.querySelector(`[data-product-tab="${link.dataset.openCategory}"]`);
    if (tab) setProductTab(tab);
  });
});

showHeroSlide(0);
startHeroSlider();

const formatMoney = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const getCartSubtotal = () =>
  cart.reduce((total, item) => total + Number(item.unit_price) * Number(item.quantity), 0);

const getCartQuantity = () => cart.reduce((total, item) => total + Number(item.quantity), 0);

const getOrderSummary = () => {
  const subtotal = roundMoney(getCartSubtotal());
  const pixDiscount = selectedPaymentMethod === "pix" ? roundMoney(subtotal * PIX_DISCOUNT_RATE) : 0;
  const coupon = Math.min(roundMoney(couponDiscount), subtotal - pixDiscount);
  const total = roundMoney(Math.max(0, subtotal + shippingAmount - pixDiscount - coupon));

  return {
    subtotal,
    shipping: shippingAmount,
    pixDiscount,
    coupon,
    total,
  };
};

const saveCart = () => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

const loadCart = () => {
  try {
    const storedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    cart = Array.isArray(storedCart)
      ? storedCart
          .map((item) => ({
            id: String(item.id || ""),
            title: String(item.title || ""),
            size: String(item.size || ""),
            quantity: Math.max(1, Number.parseInt(item.quantity, 10) || 1),
            unit_price: Number(item.unit_price),
          }))
          .filter((item) => item.id && item.title && item.size && Number.isFinite(item.unit_price))
      : [];
  } catch {
    cart = [];
  }
};

const showCartStatus = (message = "") => {
  if (cartStatus) cartStatus.textContent = message;
};

const showPaymentStatus = (message = "") => {
  if (paymentStatus) paymentStatus.textContent = message;
};

const updatePaymentNote = () => {
  if (selectedPaymentMethod === "pix") {
    paymentNote.textContent = "Voce economiza 5% pagando via PIX.";
  } else {
    paymentNote.textContent = "Parcele em ate 6x.";
  }
};

const openCart = () => {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartBackdrop.hidden = false;
  document.body.classList.add("cart-open");
};

const closeCart = () => {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartBackdrop.hidden = true;
  document.body.classList.remove("cart-open");
};

const renderCart = () => {
  const summary = getOrderSummary();
  const quantity = getCartQuantity();

  cartCount.textContent = String(quantity);
  cartSubtotal.textContent = formatMoney(summary.subtotal);
  cartShipping.textContent = formatMoney(summary.shipping);
  cartPixDiscount.textContent = `-${formatMoney(summary.pixDiscount)}`;
  cartCoupon.textContent = `-${formatMoney(summary.coupon)}`;
  cartTotal.textContent = formatMoney(summary.total);
  cartEmpty.hidden = cart.length > 0;
  cartCheckout.disabled = cart.length === 0;
  updatePaymentNote();

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <article class="cart-line">
          <div class="cart-line-top">
            <div>
              <h3>${escapeHtml(item.title)}</h3>
              <p>Tamanho ${escapeHtml(item.size)} | Quantidade ${item.quantity}</p>
            </div>
            <strong class="cart-line-price">${formatMoney(item.unit_price * item.quantity)}</strong>
          </div>
          <div class="cart-line-controls">
            <div class="cart-qty" aria-label="Quantidade">
              <button class="cart-qty-button" type="button" data-cart-decrease="${escapeHtml(item.id)}">-</button>
              <strong>${item.quantity}</strong>
              <button class="cart-qty-button" type="button" data-cart-increase="${escapeHtml(item.id)}">+</button>
            </div>
            <button class="cart-line-remove" type="button" data-cart-remove="${escapeHtml(item.id)}">Remover</button>
          </div>
        </article>
      `
    )
    .join("");
};

const updateCartItem = (id, action) => {
  const item = cart.find((cartItem) => cartItem.id === id);
  if (!item) return;

  if (action === "increase") item.quantity += 1;
  if (action === "decrease") item.quantity -= 1;

  cart = cart.filter((cartItem) => cartItem.quantity > 0);
  saveCart();
  renderCart();
};

const removeCartItem = (id) => {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
};

const ensureProductSizeFields = () => {
  checkoutButtons.forEach((button) => {
    const productCard = button.closest(".product-card");
    const buyRow = button.closest(".buy-row");
    if (!productCard || !buyRow) return;

    if (!productCard.querySelector("[data-size-select]")) {
      const field = document.createElement("label");
      field.className = "size-field";
      field.innerHTML = `
        Tamanho
        <select data-size-select aria-label="Escolha o tamanho">
          <option value="">Escolha seu tamanho</option>
          ${sizeOptions.map((size) => `<option value="${size.value}">${size.label}</option>`).join("")}
        </select>
      `;
      buyRow.before(field);
    }

    if (!productCard.querySelector("[data-product-message]")) {
      const message = document.createElement("p");
      message.className = "product-message";
      message.dataset.productMessage = "";
      message.setAttribute("role", "status");
      message.setAttribute("aria-live", "polite");
      buyRow.after(message);
    }
  });
};

const addToCart = (button) => {
  const productCard = button.closest(".product-card");
  const sizeSelect = productCard?.querySelector("[data-size-select]");
  const message = productCard?.querySelector("[data-product-message]");
  const title = button.dataset.title;
  const unitPrice = Number(button.dataset.price);
  const size = sizeSelect?.value || "";

  if (!size) {
    if (message) message.textContent = "Escolha o tamanho antes de adicionar.";
    sizeSelect?.focus();
    return;
  }

  if (!title || !Number.isFinite(unitPrice) || unitPrice <= 0) {
    if (message) message.textContent = "Nao foi possivel adicionar este produto.";
    return;
  }

  const id = `${title}-${size}`;
  const existingItem = cart.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id,
      title,
      size,
      quantity: 1,
      unit_price: unitPrice,
    });
  }

  saveCart();
  renderCart();
  showCartStatus("");
  if (message) message.textContent = "Produto adicionado ao carrinho.";
  openCart();
};

const calculateShipping = () => {
  const zip = zipInput.value.replace(/\D/g, "");

  if (zip && zip.length !== 8) {
    shippingMessage.textContent = "Confira o CEP digitado.";
    zipInput.focus();
    return;
  }

  shippingAmount = 0;
  shippingMessage.textContent = "Frete calculado na proxima atualizacao.";
  renderCart();
};

const applyCoupon = () => {
  const couponCode = couponInput.value.trim();
  couponDiscount = 0;
  couponMessage.textContent = couponCode
    ? "Cupom ainda nao disponivel para esta compra."
    : "Digite um cupom para aplicar quando a promocao estiver ativa.";
  renderCart();
};

const startCheckout = async () => {
  if (!cart.length) {
    showCartStatus("Adicione pelo menos um produto ao carrinho.");
    return;
  }

  const summary = getOrderSummary();
  cartCheckout.disabled = true;
  cartCheckout.textContent = "Abrindo pagamento...";
  showCartStatus("");
  showPaymentStatus("");

  try {
    const response = await fetch("/api/create-preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payment_method: selectedPaymentMethod,
        shipping: summary.shipping,
        coupon_code: couponInput.value.trim(),
        items: cart.map((item) => ({
          title: item.title,
          size: item.size,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        summary: {
          subtotal: summary.subtotal,
          pix_discount: summary.pixDiscount,
          coupon_discount: summary.coupon,
          total: summary.total,
        },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.init_point) {
      throw new Error(data.error || "Nao foi possivel iniciar o pagamento.");
    }

    window.location.href = data.init_point;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Checkout indisponivel no momento. Tente novamente ou chame no WhatsApp.";
    showCartStatus(message);
    showPaymentStatus(message);
    cartCheckout.disabled = false;
    cartCheckout.textContent = "Continuar para pagamento";
  }
};

checkoutButtons.forEach((button) => {
  button.addEventListener("click", () => addToCart(button));
});

cartItems.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const increaseId = target.dataset.cartIncrease;
  const decreaseId = target.dataset.cartDecrease;
  const removeId = target.dataset.cartRemove;

  if (increaseId) updateCartItem(increaseId, "increase");
  if (decreaseId) updateCartItem(decreaseId, "decrease");
  if (removeId) removeCartItem(removeId);
});

paymentMethods.forEach((input) => {
  input.addEventListener("change", () => {
    selectedPaymentMethod = input.value;
    renderCart();
  });
});

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);
cartCheckout.addEventListener("click", startCheckout);
shippingButton.addEventListener("click", calculateShipping);
couponButton.addEventListener("click", applyCoupon);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

ensureProductSizeFields();
loadCart();
renderCart();
