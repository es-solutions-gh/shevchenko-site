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

// Restore scroll position after language switch
window.addEventListener('load', () => {
  const savedScroll = sessionStorage.getItem('scrollPosition');
  if (savedScroll) {
    window.scrollTo(0, parseInt(savedScroll));
    sessionStorage.removeItem('scrollPosition');
  }
});