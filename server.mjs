const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelectorAll(".nav a");
const checkoutButtons = document.querySelectorAll("[data-checkout]");
const paymentStatus = document.querySelector(".mp-status");
const productTabs = document.querySelectorAll("[data-product-tab]");
const productPanels = document.querySelectorAll("[data-product-panel]");
const heroSlides = document.querySelectorAll(".hero-slide");
const categoryLinks = document.querySelectorAll("[data-open-category]");

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

const formatError = (message) => {
  if (!paymentStatus) return;
  paymentStatus.textContent = message;
};

const startCheckout = async (button) => {
  const title = button.dataset.title;
  const unitPrice = Number(button.dataset.price);
  const originalText = button.textContent;

  button.disabled = true;
  button.textContent = "Abrindo checkout...";
  formatError("");

  try {
    const response = await fetch("/api/create-preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        quantity: 1,
        unit_price: unitPrice,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.init_point) {
      throw new Error(data.error || "Não foi possível iniciar o pagamento.");
    }

    window.location.href = data.init_point;
  } catch (error) {
    formatError(
      "Checkout indisponível no momento. Verifique a configuração do Mercado Pago ou chame no WhatsApp."
    );
    button.disabled = false;
    button.textContent = originalText;
  }
};

checkoutButtons.forEach((button) => {
  button.addEventListener("click", () => startCheckout(button));
});
