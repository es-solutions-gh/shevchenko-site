document.addEventListener("DOMContentLoaded", () => {
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
      
      // ФИНАЛЬНОЕ ИСПРАВЛЕНИЕ: Используем класс .show вместо снятия .hidden
      modal.classList.add("show");
      modal.classList.remove("modal-hidden", "hidden");
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("show");
      modal.classList.add("modal-hidden");
    });
  }

  // Close modal on backdrop click
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
        modal.classList.add("modal-hidden");
      }
    });
  }

  if (form && modal) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.setItem("cookie-consent", "custom");
      modal.classList.remove("show");
      modal.classList.add("modal-hidden");
      if (banner) banner.classList.add("hidden");
    });
  }

  const acceptAllBtn = document.getElementById("cookie-accept");
  if (acceptAllBtn && banner) {
    acceptAllBtn.addEventListener("click", () => {
      localStorage.setItem("cookie-consent", "all");
      banner.classList.add("hidden");
      if (modal) {
        modal.classList.remove("show");
        modal.classList.add("modal-hidden");
      }
    });
  }
});
