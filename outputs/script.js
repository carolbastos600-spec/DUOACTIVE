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
const shippingAddress = document.querySelector("[data-shipping-address]");
const shippingOptions = document.querySelector("[data-shipping-options]");
const couponInput = document.querySelector("[data-coupon-input]");
const couponButton = document.querySelector("[data-coupon-button]");
const couponMessage = document.querySelector("[data-coupon-message]");
const customerNameInput = document.querySelector("[data-customer-name]");
const customerEmailInput = document.querySelector("[data-customer-email]");

const CART_STORAGE_KEY = "duo-active-cart";
const PIX_DISCOUNT_RATE = 0.05;
const sizeOptions = [
  { value: "Único", label: "36–40" },
  { value: "G", label: "42–44" },
  { value: "GG", label: "44–46" },
];

let cart = [];
let selectedPaymentMethod = "pix";
let shippingAmount = 0;
let selectedShippingOption = null;
let selectedShippingAddress = null;
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

const resetShipping = (message = "Calcule o frete para continuar.") => {
  shippingAmount = 0;
  selectedShippingOption = null;
  selectedShippingAddress = null;
  if (shippingMessage) shippingMessage.textContent = message;
  if (shippingAddress) {
    shippingAddress.hidden = true;
    shippingAddress.textContent = "";
  }
  if (shippingOptions) shippingOptions.innerHTML = "";
};

const renderShippingAddress = () => {
  if (!shippingAddress || !selectedShippingAddress) return;
  const parts = [
    selectedShippingAddress.street,
    selectedShippingAddress.neighborhood,
    selectedShippingAddress.city && selectedShippingAddress.state
      ? `${selectedShippingAddress.city}/${selectedShippingAddress.state}`
      : selectedShippingAddress.city,
  ].filter(Boolean);
  shippingAddress.textContent = `${parts.join(" - ")} | CEP ${selectedShippingAddress.postal_code}`;
  shippingAddress.hidden = false;
};

const renderShippingOptions = (options = []) => {
  if (!shippingOptions) return;
  shippingOptions.innerHTML = options
    .map(
      (option) => `
        <label class="shipping-option">
          <input type="radio" name="shippingOption" value="${escapeHtml(option.service_id)}" data-shipping-option />
          <span>
            <strong>${escapeHtml(option.company)} - ${escapeHtml(option.name)}</strong>
            <small>${option.delivery_time || "-"} dias uteis</small>
          </span>
          <b>${formatMoney(option.price)}</b>
        </label>
      `
    )
    .join("");

  shippingOptions.querySelectorAll("[data-shipping-option]").forEach((input) => {
    input.addEventListener("change", () => {
      selectedShippingOption = options.find((option) => option.service_id === input.value) || null;
      shippingAmount = selectedShippingOption ? selectedShippingOption.price : 0;
      renderCart();
    });
  });
};

const updatePaymentNote = () => {
  if (selectedPaymentMethod === "pix") {
    paymentNote.textContent = "Você economiza 5% pagando via PIX.";
  } else {
    paymentNote.textContent = "Parcele em até 6x.";
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
  resetShipping("Calcule o frete novamente após alterar a quantidade.");
  saveCart();
  renderCart();
};

const removeCartItem = (id) => {
  cart = cart.filter((item) => item.id !== id);
  resetShipping("Calcule o frete novamente após remover um produto.");
  saveCart();
  renderCart();
};

const ensureProductSizeFields = () => {
  checkoutButtons.forEach((button) => {
    const productCard = button.closest(".product-card");
    const buyRow = button.closest(".buy-row");
    if (!productCard || !buyRow) return;

    if (!productCard.querySelector("[data-size-pills]")) {
      const field = document.createElement("div");
      field.className = "size-field";
      field.innerHTML = `
        <span>Tamanho</span>
        <div class="size-pill-group" data-size-pills aria-label="Escolha o tamanho">
          ${sizeOptions
            .map(
              (size) => `<button class="size-pill" type="button" data-size-value="${size.value}">${size.label}</button>`
            )
            .join("")}
        </div>
      `;
      buyRow.before(field);

      field.querySelectorAll("[data-size-value]").forEach((sizeButton) => {
        sizeButton.addEventListener("click", () => {
          productCard.dataset.selectedSize = sizeButton.dataset.sizeValue;
          field.querySelectorAll("[data-size-value]").forEach((item) => item.classList.remove("active"));
          sizeButton.classList.add("active");
          const message = productCard.querySelector("[data-product-message]");
          if (message) message.textContent = "";
        });
      });
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
  const firstSizeButton = productCard?.querySelector("[data-size-value]");
  const message = productCard?.querySelector("[data-product-message]");
  const title = button.dataset.title;
  const unitPrice = Number(button.dataset.price);
  const size = productCard?.dataset.selectedSize || "";

  if (!size) {
    if (message) message.textContent = "Escolha o tamanho antes de adicionar.";
    firstSizeButton?.focus();
    return;
  }

  if (!title || !Number.isFinite(unitPrice) || unitPrice <= 0) {
    if (message) message.textContent = "Não foi possível adicionar este produto.";
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

  resetShipping("Calcule o frete para continuar.");
  saveCart();
  renderCart();
  showCartStatus("");
  if (message) message.textContent = "Produto adicionado ao carrinho.";
  openCart();
};

const calculateShipping = async () => {
  const zip = zipInput.value.replace(/\D/g, "");

  if (!cart.length) {
    shippingMessage.textContent = "Adicione produtos ao carrinho antes de calcular o frete.";
    return;
  }

  if (zip.length !== 8) {
    shippingMessage.textContent = "Confira o CEP digitado.";
    zipInput.focus();
    return;
  }

  resetShipping("Calculando frete...");
  renderCart();
  shippingButton.disabled = true;

  try {
    const viaCepResponse = await fetch(`https://viacep.com.br/ws/${zip}/json/`);
    const viaCep = await viaCepResponse.json();
    if (!viaCepResponse.ok || viaCep.erro) throw new Error("CEP não encontrado.");

    selectedShippingAddress = {
      postal_code: zip,
      street: viaCep.logradouro || "",
      neighborhood: viaCep.bairro || "",
      city: viaCep.localidade || "",
      state: viaCep.uf || "",
    };
    renderShippingAddress();

    const response = await fetch("/api/frete/calcular", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postal_code: zip,
        address: selectedShippingAddress,
        items: cart.map((item) => ({
          title: item.title,
          size: item.size,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Não foi possível calcular o frete.");

    renderShippingOptions(data.options || []);
    shippingMessage.textContent = "Escolha uma opção de entrega.";
  } catch (error) {
    resetShipping(error instanceof Error ? error.message : "Não foi possível calcular o frete.");
  } finally {
    shippingButton.disabled = false;
    renderCart();
  }
};

const applyCoupon = () => {
  const couponCode = couponInput.value.trim();
  couponDiscount = 0;
  couponMessage.textContent = couponCode
    ? "Cupom ainda não disponível para esta compra."
    : "Digite um cupom para aplicar quando a promoção estiver ativa.";
  renderCart();
};

const startCheckout = async () => {
  if (!cart.length) {
    showCartStatus("Adicione pelo menos um produto ao carrinho.");
    return;
  }

  const customerName = customerNameInput.value.trim();
  const customerEmail = customerEmailInput.value.trim();

  if (!customerName) {
    showCartStatus("Informe seu nome para continuar.");
    customerNameInput.focus();
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    showCartStatus("Informe um e-mail válido para receber os dados do pedido.");
    customerEmailInput.focus();
    return;
  }

  if (!selectedShippingOption || !selectedShippingAddress) {
    showCartStatus("Calcule o frete e selecione uma opção de entrega.");
    zipInput.focus();
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
        customer: {
          name: customerName,
          email: customerEmail,
        },
        payment_method: selectedPaymentMethod,
        shipping: summary.shipping,
        shipping_quote: {
          ...selectedShippingOption,
          postal_code: selectedShippingAddress.postal_code,
          address: selectedShippingAddress,
        },
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
      throw new Error(data.error || "Não foi possível iniciar o pagamento.");
    }

    window.location.href = data.init_point;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Checkout indisponível no momento. Tente novamente em alguns instantes.";
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
zipInput.addEventListener("input", () => resetShipping("Calcule o frete para continuar."));
couponButton.addEventListener("click", applyCoupon);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

ensureProductSizeFields();
loadCart();
renderCart();



