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
      if (banner) banner.classList.add("hidden"); // hide banner first
      modal.style.display = "flex";               // ensure modal is rendered
      void modal.offsetHeight;                    // force reflow (for Chrome)
      modal.classList.remove("hidden");           // show modal
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  if (form && modal && banner) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      localStorage.setItem("cookie-consent", "custom");
      modal.classList.add("hidden");
      banner.classList.add("hidden");
    });
  }

  const acceptAllBtn = document.getElementById("cookie-accept");
  if (acceptAllBtn && banner && modal) {
    acceptAllBtn.addEventListener("click", () => {
      localStorage.setItem("cookie-consent", "all");
      banner.classList.add("hidden");
      modal.classList.add("hidden");
    });
  }
});