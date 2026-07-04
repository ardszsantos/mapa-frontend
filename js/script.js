"use strict";

// lista de produtos da loja
const products = [
  { id: 1, name: "Placa de Vídeo RTX 5060 8GB", category: "gpu", icon: "🎮", price: 2499.9, featured: true, description: "GPU de última geração com DLSS 4, ray tracing e 8GB GDDR7. Ideal para jogos em 1080p/1440p com alta taxa de quadros." },
  { id: 2, name: "Processador Intel Core i7 12ª Geração", category: "cpu", icon: "⚙️", price: 1899.9, featured: true, description: "12 núcleos híbridos, alto desempenho em jogos e produtividade. Compatível com soquete LGA1700." },
  { id: 3, name: "Teclado Mecânico RGB Switch Red", category: "periferico", icon: "⌨️", price: 349.9, featured: false, description: "Switches lineares silenciosos, iluminação RGB customizável e estrutura em alumínio." },
  { id: 4, name: "Mouse Gamer 16000 DPI", category: "periferico", icon: "🖱️", price: 189.9, featured: false, description: "Sensor óptico de alta precisão, 7 botões programáveis e design ergonômico." },
  { id: 5, name: "Monitor 24'' 144Hz Full HD", category: "monitor", icon: "🖥️", price: 899.9, featured: true, description: "Painel IPS de 144Hz com 1ms de resposta, FreeSync e bordas ultrafinas." },
  { id: 6, name: "SSD NVMe 1TB Gen4", category: "armazenamento", icon: "💾", price: 549.9, featured: true, description: "Velocidades de leitura de até 7.000 MB/s. Ideal para sistema e jogos." },
  { id: 7, name: "Fonte 850W 80 Plus Gold Modular", category: "fonte", icon: "🔌", price: 699.9, featured: false, description: "Certificação 80 Plus Gold, cabos totalmente modulares e proteções OVP/OPP/SCP." },
  { id: 8, name: "Headset Gamer 7.1 Surround", category: "periferico", icon: "🎧", price: 279.9, featured: false, description: "Som surround virtual 7.1, microfone com cancelamento de ruído e almofadas em espuma viscoelástica." }
];

const $ = (id) => document.getElementById(id);

const formatPrice = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// menu hambúrguer
function initMenu() {
  const menuToggle = $("menuToggle");
  const mainNav = $("mainNav");
  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // fecha o menu ao clicar em um link
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// tema claro/escuro
function initTheme() {
  const themeToggle = $("themeToggle");
  if (!themeToggle) return;

  const saved = localStorage.getItem("techverse-theme");
  if (saved === "dark") {
    document.body.classList.add("dark-theme");
    themeToggle.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("techverse-theme", isDark ? "dark" : "light");
  });
}

// carrossel da home
function initCarousel() {
  const track = $("carouselTrack");
  const prevBtn = $("prevBtn");
  const nextBtn = $("nextBtn");
  const dotsContainer = $("carouselDots");
  if (!track || !dotsContainer) return;

  const slides = Array.from(track.children);
  let currentSlide = 0;
  let autoplayTimer = null;

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.setAttribute("aria-label", `Ir para o slide ${index + 1}`);
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  function goToSlide(index) {
    currentSlide = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
    restartAutoplay();
  }

  function restartAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  prevBtn.addEventListener("click", () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener("click", () => goToSlide(currentSlide + 1));
  restartAutoplay();
}

// monta os cards de produto
function renderProducts(list, grid) {
  grid.innerHTML = "";

  if (list.length === 0) {
    grid.innerHTML = "<p class='empty-message'>Nenhum produto encontrado para a busca.</p>";
    return;
  }

  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-thumb" aria-hidden="true">${product.icon}</div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <span class="price">${formatPrice(product.price)}</span>
        <span class="installments">em até 12x de ${formatPrice(product.price / 12)}</span>
        <button type="button" data-id="${product.id}">Ver detalhes</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function initFeatured() {
  const grid = $("featuredGrid");
  if (!grid) return;
  renderProducts(products.filter((p) => p.featured), grid);
}

// busca e filtros da página de produtos
function initProductsPage() {
  const grid = $("productsGrid");
  if (!grid) return;

  const searchInput = $("searchInput");
  const filterButtons = document.querySelectorAll(".filter-btn");
  let activeCategory = "todos";

  function applyFilters() {
    const term = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const filtered = products.filter((p) => {
      const matchCategory = activeCategory === "todos" || p.category === activeCategory;
      const matchTerm = p.name.toLowerCase().includes(term);
      return matchCategory && matchTerm;
    });
    renderProducts(filtered, grid);
  }

  function setCategory(category) {
    activeCategory = category;
    filterButtons.forEach((btn) =>
      btn.classList.toggle("active", btn.dataset.category === category)
    );
    applyFilters();
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      setCategory(btn.dataset.category);
      showToast(`Filtrando por: ${btn.textContent.trim()}`);
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  // ex: produtos.html?categoria=gpu
  const params = new URLSearchParams(window.location.search);
  const categoryParam = params.get("categoria");
  const searchParam = params.get("busca");

  if (searchParam && searchInput) searchInput.value = searchParam;

  if (categoryParam && [...filterButtons].some((b) => b.dataset.category === categoryParam)) {
    setCategory(categoryParam);
  } else {
    applyFilters();
  }
}

function initSearchRedirect() {
  const searchForm = $("searchForm");
  const searchInput = $("searchInput");
  if (!searchForm || !searchInput) return;

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // na página de produtos o filtro já é em tempo real
    if ($("productsGrid")) return;
    const term = searchInput.value.trim();
    window.location.href = `produtos.html?busca=${encodeURIComponent(term)}`;
  });
}

// modal de detalhes do produto
function initModal() {
  const modal = $("productModal");
  if (!modal) return;

  const modalTitle = $("modalTitle");
  const modalDescription = $("modalDescription");
  const modalPrice = $("modalPrice");
  const modalClose = $("modalClose");
  const modalBuy = $("modalBuy");

  document.addEventListener("click", (e) => {
    const button = e.target.closest(".product-card button[data-id]");
    if (!button) return;

    const product = products.find((p) => p.id === Number(button.dataset.id));
    if (!product) return;

    modalTitle.textContent = product.name;
    modalDescription.textContent = product.description;
    modalPrice.textContent = formatPrice(product.price);
    modal.hidden = false;
    modalClose.focus();
  });

  function closeModal() {
    modal.hidden = true;
  }

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  modalBuy.addEventListener("click", () => {
    closeModal();
    showToast("Produto adicionado ao carrinho! 🛒");
  });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// newsletter
function initNewsletter() {
  const form = $("newsletterForm");
  if (!form) return;

  const emailInput = $("newsletterEmail");
  const feedback = $("formFeedback");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!emailRegex.test(email)) {
      feedback.textContent = "Por favor, insira um e-mail válido.";
      feedback.className = "form-feedback error";
      return;
    }

    feedback.textContent = "E-mail cadastrado com sucesso! ✅";
    feedback.className = "form-feedback success";
    form.reset();
  });
}

// formulário de contato
function initContactForm() {
  const form = $("contactForm");
  if (!form) return;

  const feedback = $("contactFeedback");

  const fields = [
    {
      input: $("contactName"),
      error: $("contactNameError"),
      validate: (value) => value.trim().length >= 3,
      message: "Informe seu nome completo (mínimo de 3 caracteres)."
    },
    {
      input: $("contactEmail"),
      error: $("contactEmailError"),
      validate: (value) => emailRegex.test(value.trim()),
      message: "Informe um e-mail válido, como nome@dominio.com."
    },
    {
      input: $("contactSubject"),
      error: $("contactSubjectError"),
      validate: (value) => value !== "",
      message: "Selecione um assunto."
    },
    {
      input: $("contactMessage"),
      error: $("contactMessageError"),
      validate: (value) => value.trim().length >= 10,
      message: "A mensagem deve ter pelo menos 10 caracteres."
    }
  ];

  function validateField(field) {
    const isValid = field.validate(field.input.value);
    field.error.textContent = isValid ? "" : field.message;
    field.input.classList.toggle("invalid", !isValid);
    return isValid;
  }

  // valida ao sair do campo
  fields.forEach((field) => {
    field.input.addEventListener("blur", () => validateField(field));
    field.input.addEventListener("input", () => {
      if (field.input.classList.contains("invalid")) validateField(field);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const results = fields.map((field) => validateField(field));
    const firstInvalid = fields[results.indexOf(false)];

    if (firstInvalid) {
      firstInvalid.input.focus();
      feedback.textContent = "Corrija os campos destacados antes de enviar.";
      feedback.className = "form-feedback error";
      return;
    }

    // envio simulado, o site não tem back-end
    feedback.textContent = "Mensagem enviada com sucesso! Responderemos em até 1 dia útil. ✅";
    feedback.className = "form-feedback success";
    form.reset();
    fields.forEach((field) => field.input.classList.remove("invalid"));
    showToast("Mensagem enviada! 📨");
  });
}

// contadores da página sobre
function initCounters() {
  const counters = document.querySelectorAll(".stat-number");
  if (counters.length === 0) return;

  function animate(counter) {
    const target = Number(counter.dataset.target);
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = Math.floor(progress * target).toLocaleString("pt-BR");
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // anima quando os números aparecem na tela
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((counter) => observer.observe(counter));
}

// toast de aviso
const toast = $("toast");
let toastTimer = null;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

initMenu();
initTheme();
initCarousel();
initFeatured();
initProductsPage();
initSearchRedirect();
initModal();
initNewsletter();
initContactForm();
initCounters();
