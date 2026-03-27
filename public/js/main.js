// Auto-refresh prices every 30 seconds on the home page
(function () {
  const isHome = document.querySelector(".coins-grid");
  if (!isHome) return;

  let countdown = 5;
  const badge = document.createElement("div");
  badge.style.cssText = `
    position: fixed; bottom: 1.5rem; right: 1.5rem;
    background: rgba(12,17,32,0.9); border: 1px solid rgba(0,229,255,0.2);
    color: #5a6880; font-family: 'Space Mono', monospace; font-size: 0.68rem;
    padding: 0.5rem 1rem; border-radius: 6px; letter-spacing: 0.08em;
    backdrop-filter: blur(8px); z-index: 999;
    transition: color 0.3s;
  `;
  document.body.appendChild(badge);

  function updateBadge() {
    badge.textContent = `AUTO-REFRESH IN ${countdown}s`;
    if (countdown <= 5) badge.style.color = "#00e5ff";
    else badge.style.color = "#5a6880";
  }

  updateBadge();
  const interval = setInterval(() => {
    countdown--;
    updateBadge();
    if (countdown <= 0) {
      window.location.reload();
    }
  }, 1000);
})();

// Uppercase search input as user types
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
  searchInput.addEventListener('input', function () {
    const pos = this.selectionStart;
    this.value = this.value.toUpperCase();
    this.setSelectionRange(pos, pos);
  });
}
