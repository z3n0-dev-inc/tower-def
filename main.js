/* ═══════════════════════════════════════════════
   main.js — Bootstrap
   ═══════════════════════════════════════════════ */

window.addEventListener('DOMContentLoaded', async () => {
  // Init both panels — they stay hidden until PlayFab inventory
  // confirms the correct item exists (owner_panel / mod_panel)
  Owner.init();
  Mod.init();

  // Init UI — handles login, auto-login, leaderboard, shop etc.
  // playfab.js loadInventory() calls Owner.show() / Mod.show() as needed
  await UI.init();

  console.log('%c🧟 Zombie Tower Defence', 'color:#e74c3c;font-size:18px;font-weight:bold');
  console.log('%cPlayFab Title: 100286 | Catalog: ZTD_Cosmetics_v1', 'color:#2ecc71');
  console.log('%cPanels: owner_panel → 👑 Owner | mod_panel → 🛡 Mod', 'color:#f5b215');
});

