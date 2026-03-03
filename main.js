/* ═══════════════════════════════════════════════
   main.js — Bootstrap
   ═══════════════════════════════════════════════ */

window.addEventListener('DOMContentLoaded', async () => {
  // Init Owner panel first so toggle works
  Owner.init();

  // Patch owner toggle to sync arrow
  const trigger = document.getElementById('ownerTrigger');
  const panel   = document.getElementById('ownerPanel');
  if (trigger && panel) {
    const origToggle = Owner.toggle.bind(Owner);
    trigger.onclick = () => {
      const wasOpen = !panel.classList.contains('hidden');
      origToggle();
      // Sync arrow
      const arrow = document.getElementById('otArrow');
      if (arrow) arrow.textContent = wasOpen ? '▲' : '▼';
      trigger.classList.toggle('open', !wasOpen);
    };
  }

  // Init UI (handles auto-login internally)
  await UI.init();

  console.log('%c🧟 Zombie Tower Defence', 'color:#e74c3c;font-size:18px;font-weight:bold');
  console.log('%cPlayFab Title: 100286 | Catalog: ZTD_Cosmetics_v1', 'color:#2ecc71');
});
