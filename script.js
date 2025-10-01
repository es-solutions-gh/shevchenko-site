// Toggle mobile nav menu
document.getElementById('burger-btn')?.addEventListener('click', function () {
  const nav = document.querySelector('.nav');
  nav?.classList.toggle('open');
});

// Toggle desktop language menu
document.getElementById('current-lang-desktop')?.addEventListener('click', function () {
  document.getElementById('lang-menu-desktop')?.classList.toggle('hidden');
});

// Toggle mobile language menu
document.getElementById('current-lang')?.addEventListener('click', function () {
  document.getElementById('lang-menu')?.classList.toggle('hidden');
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

    window.location.href = newPath;
  });
});