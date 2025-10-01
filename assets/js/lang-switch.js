document.addEventListener("DOMContentLoaded", () => {
  const langSwitches = document.querySelectorAll(".lang-switch");

  langSwitches.forEach((switcher) => {
    const btn = switcher.querySelector("button");
    const menu = switcher.querySelector("ul");
    const codeSpan = switcher.querySelector("span#current-code, span#current-code-desktop");
    const flagImg = switcher.querySelector("img#current-flag, img#current-flag-desktop");

    if (!btn || !menu) return;

    // Открыть/закрыть меню
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("hidden");
    });

    // Клик вне — закрыть
    document.addEventListener("click", (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.add("hidden");
      }
    });

    // Выбор языка
    menu.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        const lang = li.getAttribute("data-lang");
        const code = li.textContent.trim();
        const flag = li.querySelector("img").getAttribute("src");

        if (codeSpan) codeSpan.textContent = code;
        if (flagImg) flagImg.setAttribute("src", flag);

        menu.classList.add("hidden");

        // 🔄 Определяем редирект
        let target = "/";
        if (lang === "ru") target = "/ru/";
        if (lang === "uk") target = "/uk/";

        window.location.href = target;
      });
    });
  });
});

document.querySelectorAll('[data-lang]').forEach(el => {
  el.addEventListener('click', () => {
    const selectedLang = el.getAttribute('data-lang');
    const currentPath = window.location.pathname;

    const match = currentPath.match(/^\/(en|ru|uk)\/(.+)$/);
    if (match) {
      const [, , relativePath] = match;
      window.location.href = `/${selectedLang}/${relativePath}`;
    } else {
      window.location.href = `/${selectedLang}/index.html`;
    }
  });
});
