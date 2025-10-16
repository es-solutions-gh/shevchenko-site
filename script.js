// Toggle mobile nav menu
document.getElementById('burger-btn')?.addEventListener('click', function () {
  const nav = document.querySelector('.nav');
  nav?.classList.toggle('open');
});

// Toggle desktop language menu
document.getElementById('current-lang-desktop')?.addEventListener('click', function (e) {
  e.stopPropagation();
  document.getElementById('lang-menu-desktop')?.classList.toggle('hidden');
});

// Toggle mobile language menu
document.getElementById('current-lang')?.addEventListener('click', function (e) {
  e.stopPropagation();
  document.getElementById('lang-menu')?.classList.toggle('hidden');
});

// Close language menus when clicking outside
document.addEventListener('click', function (e) {
  const desktopMenu = document.getElementById('lang-menu-desktop');
  const mobileMenu = document.getElementById('lang-menu');
  const desktopBtn = document.getElementById('current-lang-desktop');
  const mobileBtn = document.getElementById('current-lang');

  if (desktopMenu && !desktopMenu.contains(e.target) && e.target !== desktopBtn) {
    desktopMenu.classList.add('hidden');
  }

  if (mobileMenu && !mobileMenu.contains(e.target) && e.target !== mobileBtn) {
    mobileMenu.classList.add('hidden');
  }
});

// Global language switcher — сохраняет текущий путь (главная или case)
document.querySelectorAll('[data-lang]').forEach(item => {
  item.addEventListener('click', () => {
    const selectedLang = item.getAttribute('data-lang'); // 'en', 'ru', 'uk'

    // Save selected language to localStorage
    localStorage.setItem('preferredLanguage', selectedLang);

    // Если это cookie policy, меняем только язык в имени файла
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

    // Удаляем язык из пути
    const remainingPath = currentLang ? pathParts.slice(1).join('/') : pathParts.join('/');
    const isHome = remainingPath === '' || remainingPath === 'index.html';

    // Если это кейс, сохраняем имя файла
    const isCasePage = remainingPath.startsWith('case') && remainingPath.endsWith('.html');

    let newPath = `/${selectedLang}/`;
    if (isCasePage) {
      // Для кейсов переходим на тот же файл в другой языковой папке
      newPath += remainingPath;
    } else if (!isHome) {
      // Для других страниц (если будут)
      newPath += remainingPath;
    }

    // Save current scroll position
    const scrollY = window.scrollY;
    sessionStorage.setItem('scrollPosition', scrollY);

    window.location.href = newPath;
  });
});

// Apply saved language preference on page load
(function() {
  const preferredLang = localStorage.getItem('preferredLanguage');
  if (!preferredLang) return;

  const pathParts = window.location.pathname.split('/').filter(Boolean);

  // Check if we're on a cookie policy page
  const isCookiePolicy = window.location.pathname.includes('cookie-policy');
  if (isCookiePolicy) {
    // Extract current language from cookie-policy.XX.html
    const match = window.location.pathname.match(/cookie-policy\.([a-z]{2})\.html/);
    const currentLang = match ? match[1] : 'en';

    if (currentLang !== preferredLang) {
      window.location.href = `/cookie-policy.${preferredLang}.html`;
      return;
    }
  } else {
    // Check current language for main pages
    let currentLang = null;
    if (['en', 'ru', 'uk'].includes(pathParts[0])) {
      currentLang = pathParts[0];
    } else {
      // Root index.html defaults to 'en'
      currentLang = 'en';
    }

    if (currentLang !== preferredLang) {
      // Build new path with preferred language
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

// Update language indicator based on current page
(function() {
  const pathname = window.location.pathname;
  let currentLang = 'en'; // default

  // Detect language from cookie-policy filename
  if (pathname.includes('cookie-policy')) {
    const match = pathname.match(/cookie-policy\.([a-z]{2})\.html/);
    if (match) {
      currentLang = match[1];
    }
  }
  // Detect language from folder structure (en/, ru/, uk/)
  else {
    const pathParts = pathname.split('/').filter(Boolean);
    if (['en', 'ru', 'uk'].includes(pathParts[0])) {
      currentLang = pathParts[0];
    }
  }

  // Language code to flag and display name mapping
  const langConfig = {
    'en': { flag: 'ENG.svg', code: 'ENG' },
    'ru': { flag: 'RUS.svg', code: 'RUS' },
    'uk': { flag: 'UKR.svg', code: 'UKR' }
  };

  const config = langConfig[currentLang];
  if (config) {
    // Update desktop button
    const desktopFlag = document.getElementById('current-flag-desktop');
    const desktopCode = document.getElementById('current-code-desktop');
    if (desktopFlag) desktopFlag.src = `/assets/flags/${config.flag}`;
    if (desktopCode) desktopCode.textContent = config.code;

    // Update mobile button
    const mobileFlag = document.getElementById('current-flag');
    const mobileCode = document.getElementById('current-code');
    if (mobileFlag) mobileFlag.src = `/assets/flags/${config.flag}`;
    if (mobileCode) mobileCode.textContent = config.code;
  }

  // Adjust scroll padding per language
  const scrollPadding = {
    'en': '100px',
    'ru': '120px',
    'uk': '110px'
  };

  if (scrollPadding[currentLang]) {
    document.documentElement.style.scrollPaddingTop = scrollPadding[currentLang];
  }
})();

// Restore scroll position after language switch
window.addEventListener('load', () => {
  const savedScroll = sessionStorage.getItem('scrollPosition');
  if (savedScroll) {
    window.scrollTo(0, parseInt(savedScroll));
    sessionStorage.removeItem('scrollPosition');
  }
});