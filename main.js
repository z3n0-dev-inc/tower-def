/* ═══════════════════════════════════════════════
   main.js — Bootstrap
   ═══════════════════════════════════════════════ */

window.addEventListener('DOMContentLoaded', async () => {
  // Init owner panel wiring (buttons, close, proximity glow)
  // Panel stays hidden until playfab.js finds "owner_panel" in inventory
  Owner.init();

  // Sync trigger arrow with open/close state
  const trigger = document.getElementById('ownerTrigger');
  const panel   = document.getElementById('ownerPanel');
  if (trigger && panel) {
    trigger.onclick = () => {
      const wasOpen = !panel.classList.contains('hidden');
      Owner.toggle();
      const arrow = document.getElementById('otArrow');
      if (arrow) arrow.textContent = wasOpen ? '▲' : '▼';
      trigger.classList.toggle('open', !wasOpen);
    };
  }

  // Init UI — handles login, auto-login, leaderboard, shop etc.
  // playfab.js loadInventory() will call Owner.show() if owner_panel is in inventory
  await UI.init();

  console.log('%c🧟 Zombie Tower Defence', 'color:#e74c3c;font-size:18px;font-weight:bold');
  console.log('%cPlayFab Title: 100286 | Catalog: ZTD_Cosmetics_v1', 'color:#2ecc71');
});
