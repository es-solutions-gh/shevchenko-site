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

  // Always initialize modal handlers (even if banner is missing)
  if (manageBtn && modal) {
    manageBtn.addEventListener("click", () => {
      if (banner) banner.classList.add("hidden");
      
      // КРИТИЧНО: force reflow перед снятием .hidden для Chrome
      void modal.offsetHeight;
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
});
