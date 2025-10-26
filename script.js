document.addEventListener("DOMContentLoaded", () => {
  // ====================
  // COOKIE CONSENT
  // ====================
  const banner = document.getElementById("cookie-banner");
  const modal = document.getElementById("cookie-modal");
  const manageBtn = document.getElementById("cookie-manage");
  const closeBtn = document.getElementById("cookie-close-modal");
  const form = document.getElementById("cookie-form");

  // Show banner only if not already accepted
  if (banner && !localStorage.getItem("cookie-consent")) {
    banner.classList.remove("hidden");
  }

  // Always initialize modal handlers
  if (manageBtn && modal) {
    manageBtn.addEventListener("click", () => {
      if (banner) banner.classList.add("hidden");
      modal.classList.remove("hidden");
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // Close modal on backdrop click
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  }

  if (form && modal) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.setItem("cookie-consent", "custom");
      modal.classList.add("hidden");
      if (banner) banner.classList.add("hidden");
    });
  }

  const acceptAllBtn = document.getElementById("cookie-accept");
  if (acceptAllBtn && banner) {
    acceptAllBtn.addEventListener("click", () => {
      localStorage.setItem("cookie-consent", "all");
      banner.classList.add("hidden");
      if (modal) modal.classList.add("hidden");
    });
  }

  // ====================
  // MOBILE MENU
  // ====================
  const burger = document.getElementById("burger-btn");
  const nav = document.querySelector(".nav");
  const body = document.body;

  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("open");
      body.classList.toggle("menu-open");
    });

    // Закрытие меню при клике на ссылку
    const navLinks = nav.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        body.classList.remove("menu-open");
      });
    });

    // Закрытие меню при клике вне его
    document.addEventListener("click", (e) => {
      if (
        !nav.contains(e.target) &&
        !burger.contains(e.target) &&
        nav.classList.contains("open")
      ) {
        nav.classList.remove("open");
        body.classList.remove("menu-open");
      }
    });
  }

  // ====================
  // LANGUAGE SWITCHER
  // ====================
  const langButtons = [
    {
      button: document.getElementById("current-lang"),
      menu: document.getElementById("lang-menu"),
      flag: document.getElementById("current-flag"),
      code: document.getElementById("current-code"),
    },
    {
      button: document.getElementById("current-lang-desktop"),
      menu: document.getElementById("lang-menu-desktop"),
      flag: document.getElementById("current-flag-desktop"),
      code: document.getElementById("current-code-desktop"),
    },
  ];

  const langData = {
    en: { flag: "/assets/flags/ENG.svg", code: "ENG", path: "/en/" },
    uk: { flag: "/assets/flags/UKR.svg", code: "UKR", path: "/uk/" },
    ru: { flag: "/assets/flags/RUS.svg", code: "RUS", path: "/ru/" },
  };

  // Определяем текущий язык из URL
  const currentPath = window.location.pathname;
  let currentLang = "en";
  if (currentPath.includes("/uk/")) currentLang = "uk";
  else if (currentPath.includes("/ru/")) currentLang = "ru";

  langButtons.forEach(({ button, menu, flag, code }) => {
    if (!button || !menu) return;

    // Устанавливаем текущий язык
    if (flag) flag.src = langData[currentLang].flag;
    if (code) code.textContent = langData[currentLang].code;

    // Открытие/закрытие меню
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("hidden");
    });

    // Выбор языка
    menu.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        const selectedLang = li.getAttribute("data-lang");
        if (selectedLang && langData[selectedLang]) {
          window.location.href = langData[selectedLang].path;
        }
      });
    });
  });

  // Закрытие меню языка при клике вне его
  document.addEventListener("click", () => {
    langButtons.forEach(({ menu }) => {
      if (menu) menu.classList.add("hidden");
    });
  });

  // ====================
  // CALENDLY WIDGET
  // ====================
  const calendlyScript = document.createElement("script");
  calendlyScript.src = "https://assets.calendly.com/assets/external/widget.js";
  calendlyScript.async = true;
  document.head.appendChild(calendlyScript);
});
