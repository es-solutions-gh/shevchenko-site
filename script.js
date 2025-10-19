// ===== MOBILE MENU TOGGLE =====
const burgerBtn = document.getElementById('burger-btn');
const nav = document.querySelector('.nav');
const body = document.body;

// Toggle mobile menu
burgerBtn?.addEventListener('click', function (e) {
  e.stopPropagation();
  nav?.classList.toggle('open');
  body.classList.toggle('menu-open');
  
  // Блокировка скролла при открытом меню
  if (nav?.classList.contains('open')) {
    body.style.overflow = 'hidden';
  } else {
    body.style.overflow = '';
  }
});

// Закрытие меню при клике вне его
document.addEventListener('click', function (e) {
  if (nav?.classList.contains('open') && 
      !nav.contains(e.target) && 
      !burgerBtn.contains(e.target)) {
    nav.classList.remove('open');
    body.classList.remove('menu-open');
    body.style.overflow = '';
  }
});

// Закрытие меню при клике на ссылку
nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      nav.classList.remove('open');
      body.classList.remove('menu-open');
      body.style.overflow = '';
    }
  });
});

// ===== LANGUAGE SWITCHER =====

// Desktop language menu toggle
const desktopLangBtn = document.getElementById('current-lang-desktop');
const desktopLangMenu = document.getElementById('lang-menu-desktop');

desktopLangBtn?.addEventListener('click', function (e) {
  e.stopPropagation();
  desktopLangMenu?.classList.toggle('hidden');
});

// Mobile language menu toggle
const mobileLangBtn = document.getElementById('current-lang');
const mobileLangMenu = document.getElementById('lang-menu');

mobileLangBtn?.addEventListener('click', function (e) {
  e.stopPropagation();
  mobileLangMenu?.classList.toggle('hidden');
});

// Close language menus when clicking outside
document.addEventListener('click', function (e) {
  if (desktopLangMenu && 
      !desktopLangMenu.contains(e.target) && 
      e.target !== desktopLangBtn) {
    desktopLangMenu.classList.add('hidden');
  }

  if (mobileLangMenu && 
      !mobileLangMenu.contains(e.target) && 
      e.target !== mobileLangBtn) {
    mobileLangMenu.classList.add('hidden');
  }
});

// ===== LANGUAGE SWITCHING LOGIC =====
document.querySelectorAll('[data-lang]').forEach(item => {
  item.addEventListener('click', () => {
    const selectedLang = item.getAttribute('data-lang');

    // Save selected language to localStorage
    localStorage.setItem('preferredLanguage', selectedLang);

    // Cookie policy pages
    const isCookiePolicy = window.location.pathname.includes('cookie-policy');
    if (isCookiePolicy) {
      window.location.href = `/cookie-policy.${selectedLang}.html`;
      return;
    }

    const pathParts = window.location.pathname.split('/').filter(Boolean);

    let currentLang = null;
    if (['en', 'ru', 'uk'].includes(pathParts[0])) {
      currentLang = pathParts[0];
    }

    const remainingPath = currentLang ? pathParts.slice(1).join('/') : pathParts.join('/');
    const isHome = remainingPath === '' || remainingPath === 'index.html';
    const isCasePage = remainingPath.startsWith('case') && remainingPath.endsWith('.html');

    let newPath = `/${selectedLang}/`;
    if (isCasePage) {
      newPath += remainingPath;
    } else if (!isHome) {
      newPath += remainingPath;
    }

    // Save scroll position
    const scrollY = window.scrollY;
    sessionStorage.setItem('scrollPosition', scrollY);

    window.location.href = newPath;
  });
});

// ===== APPLY SAVED LANGUAGE PREFERENCE ON PAGE LOAD =====
(function() {
  const preferredLang = localStorage.getItem('preferredLanguage');
  if (!preferredLang) return;

  const pathParts = window.location.pathname.split('/').filter(Boolean);

  // Cookie policy pages
  const isCookiePolicy = window.location.pathname.includes('cookie-policy');
  if (isCookiePolicy) {
    const match = window.location.pathname.match(/cookie-policy\.([a-z]{2})\.html/);
    const currentLang = match ? match[1] : 'en';

    if (currentLang !== preferredLang) {
      window.location.href = `/cookie-policy.${preferredLang}.html`;
      return;
    }
  } else {
    // Main pages
    let currentLang = null;
    if (['en', 'ru', 'uk'].includes(pathParts[0])) {
      currentLang = pathParts[0];
    } else {
      currentLang = 'en';
    }

    if (currentLang !== preferredLang) {
      const remainingPath = currentLang && pathParts[0] === currentLang ? pathParts.slice(1).join('/') : pathParts.join('/');
      const isHome = remainingPath === '' || remainingPath === 'index.html';
      const isCasePage = remainingPath.startsWith('case') && remainingPath.endsWith('.html');

      let newPath = `/${preferredLang}/`;
      if (isCasePage) {
        newPath += remainingPath;
      } else if (!isHome) {
        newPath += remainingPath;
      }

      window.location.href = newPath;
      return;
    }
  }
})();

// ===== UPDATE LANGUAGE INDICATOR =====
(function() {
  const pathname = window.location.pathname;
  let currentLang = 'en';

  // Detect from cookie-policy filename
  if (pathname.includes('cookie-policy')) {
    const match = pathname.match(/cookie-policy\.([a-z]{2})\.html/);
    if (match) {
      currentLang = match[1];
    }
  }
  // Detect from folder structure
  else {
    const pathParts = pathname.split('/').filter(Boolean);
    if (['en', 'ru', 'uk'].includes(pathParts[0])) {
      currentLang = pathParts[0];
    }
  }

  const langConfig = {
    'en': { flag: 'ENG.svg', code: 'ENG' },
    'ru': { flag: 'RUS.svg', code: 'RUS' },
    'uk': { flag: 'UKR.svg', code: 'UKR' }
  };

  const config = langConfig[currentLang];
  if (config) {
    // Desktop
    const desktopFlag = document.getElementById('current-flag-desktop');
    const desktopCode = document.getElementById('current-code-desktop');
    if (desktopFlag) desktopFlag.src = `/assets/flags/${config.flag}`;
    if (desktopCode) desktopCode.textContent = config.code;

    // Mobile
    const mobileFlag = document.getElementById('current-flag');
    const mobileCode = document.getElementById('current-code');
    if (mobileFlag) mobileFlag.src = `/assets/flags/${config.flag}`;
    if (mobileCode) mobileCode.textContent = config.code;
  }
})();

// ===== DYNAMIC SCROLL PADDING =====
// УЛУЧШЕНО: Динамический расчет на основе высоты header
function updateScrollPadding() {
  const header = document.querySelector('.header');
  if (header) {
    const headerHeight = header.offsetHeight;
    document.documentElement.style.scrollPaddingTop = `${headerHeight + 20}px`;
  }
}

// Обновляем при загрузке
window.addEventListener('load', updateScrollPadding);

// Обновляем при изменении размера окна (с debounce)
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(updateScrollPadding, 250);
});

// ===== RESTORE SCROLL POSITION AFTER LANGUAGE SWITCH =====
window.addEventListener('load', () => {
  const savedScroll = sessionStorage.getItem('scrollPosition');
  if (savedScroll) {
    window.scrollTo(0, parseInt(savedScroll));
    sessionStorage.removeItem('scrollPosition');
  }
});

// ===== COOKIE CONSENT FUNCTIONALITY =====
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");
  const modal = document.getElementById("cookie-modal");
  const acceptBtn = document.getElementById("cookie-accept");
  const manageBtn = document.getElementById("cookie-manage");
  const closeModalBtn = document.getElementById("cookie-close-modal");
  const form = document.getElementById("cookie-form");
  const analyticsInput = document.getElementById("analytics-cookies");
  const marketingInput = document.getElementById("marketing-cookies");

  if (!banner) return; // Exit if cookie banner doesn't exist

  // Save preferences
  function savePreferences(prefs) {
    localStorage.setItem("cookie-preferences", JSON.stringify(prefs));
    console.log("Cookie preferences saved:", prefs);
  }

  // Check if preferences exist
  const savedPrefs = localStorage.getItem("cookie-preferences");
  if (!savedPrefs) {
    banner.classList.remove("hidden");
    banner.style.display = "flex";
  }

  // Accept all cookies
  acceptBtn?.addEventListener("click", () => {
    savePreferences({
      essential: true,
      analytics: true,
      marketing: true
    });
    banner.classList.add("hidden");
    banner.style.display = "none";
  });

  // Open preferences modal
  manageBtn?.addEventListener("click", () => {
    modal?.classList.remove("hidden");
    
    // Load current preferences
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      if (analyticsInput) analyticsInput.checked = prefs.analytics || false;
      if (marketingInput) marketingInput.checked = prefs.marketing || false;
    }
  });

  // Close modal
  closeModalBtn?.addEventListener("click", () => {
    modal?.classList.add("hidden");
  });

  // Save selected preferences
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    savePreferences({
      essential: true,
      analytics: analyticsInput?.checked || false,
      marketing: marketingInput?.checked || false
    });
    modal?.classList.add("hidden");
    banner.classList.add("hidden");
    banner.style.display = "none";
  });

  // Close modal on overlay click
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });
});

// ===== LAZY LOADING IMAGES =====
// НОВОЕ: Автоматическое lazy loading для всех изображений
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
});

// ===== PERFORMANCE: DEFER EXTERNAL SCRIPTS =====
// НОВОЕ: Ленивая загрузка Calendly при первом клике
let calendlyLoaded = false;

function loadCalendly(callback) {
  if (calendlyLoaded) {
    callback();
    return;
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://assets.calendly.com/assets/external/widget.css';
  document.head.appendChild(link);

  const script = document.createElement('script');
  script.src = 'https://assets.calendly.com/assets/external/widget.js';
  script.async = true;
  script.onload = () => {
    calendlyLoaded = true;
    callback();
  };
  document.head.appendChild(script);
}

// Перехватываем клики на CTA кнопки
document.addEventListener('DOMContentLoaded', () => {
  const ctaLinks = document.querySelectorAll('[onclick*="Calendly"]');
  
  ctaLinks.forEach(link => {
    // Удаляем inline onclick
    const originalOnclick = link.getAttribute('onclick');
    link.removeAttribute('onclick');
    
    // Добавляем event listener
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      loadCalendly(() => {
        if (window.Calendly) {
          Calendly.initPopupWidget({
            url: 'https://calendly.com/evgeny-shevchenko?hide_gdpr_banner=1'
          });
        }
      });
    });
  });
});

// ===== SMOOTH SCROLL POLYFILL FOR OLDER BROWSERS =====
// НОВОЕ: Плавная прокрутка для всех якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Игнорируем пустые якоря
    if (href === '#' || href === '#!') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      
      const header = document.querySelector('.header');
      const headerHeight = header ? header.offsetHeight : 70;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Закрываем мобильное меню если открыто
      if (nav?.classList.contains('open')) {
        nav.classList.remove('open');
        body.classList.remove('menu-open');
        body.style.overflow = '';
      }
    }
  });
});

// ===== ESCAPE KEY TO CLOSE MODALS =====
// НОВОЕ: Закрытие модалок по ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'Esc') {
    // Close mobile menu
    if (nav?.classList.contains('open')) {
      nav.classList.remove('open');
      body.classList.remove('menu-open');
      body.style.overflow = '';
    }
    
    // Close language menus
    desktopLangMenu?.classList.add('hidden');
    mobileLangMenu?.classList.add('hidden');
    
    // Close cookie modal
    const cookieModal = document.getElementById('cookie-modal');
    if (cookieModal && !cookieModal.classList.contains('hidden')) {
      cookieModal.classList.add('hidden');
    }
  }
});

// ===== TOUCH FRIENDLY: PREVENT DOUBLE-TAP ZOOM ON BUTTONS =====
// НОВОЕ: Отключаем двойной тап для зума на кнопках (iOS)
document.addEventListener('DOMContentLoaded', () => {
  const touchElements = document.querySelectorAll('button, .cta-link, .linkbtn, .burger');
  
  touchElements.forEach(element => {
    element.addEventListener('touchend', (e) => {
      e.preventDefault();
      element.click();
    }, { passive: false });
  });
});

// ===== VIEWPORT HEIGHT FIX FOR MOBILE BROWSERS =====
// НОВОЕ: Исправляем 100vh на мобильных (учитываем адресную строку)
function setVhProperty() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVhProperty();
window.addEventListener('resize', setVhProperty);

// ===== CONSOLE INFO =====
console.log('🚀 Mobile optimized scripts loaded successfully');
console.log('📱 Viewport:', window.innerWidth, 'x', window.innerHeight);
console.log('🌐 Language:', localStorage.getItem('preferredLanguage') || 'en');