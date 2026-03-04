/* ═══════════════════════════════════════════════
   owner.js — Owner Panel
   ═══════════════════════════════════════════════
   VISIBILITY RULES — READ THIS:
     - Panel trigger is ALWAYS hidden by default in HTML
     - Owner.show() is ONLY called by playfab.js → loadInventory()
       when it finds "owner_panel" in the player's PlayFab inventory
     - If the item isn't in inventory: panel doesn't exist to them
     - No console tricks, no localStorage flags, nothing
     - To grant: PlayFab Dashboard → Players → Inventory → Grant Item → owner_panel

   IN-GAME COMMANDS:
     - Only work while a round is active (Game.isRunning())
     - setInGame(true) called by game.js when round starts
     - setInGame(false) called by game.js when round ends
   ═══════════════════════════════════════════════ */

const Owner = (() => {
  let inGame       = false;
  let isOpen       = false;
  let godActive    = false;
  let speedHackIdx = 0;
  const SPEED_CYCLE = [1, 2, 4, 8];

  /* ─────────────────────────────────────────────
     INIT — wires buttons, nothing more
  ───────────────────────────────────────────── */
  function init() {
    document.getElementById('btnCloseOwner')?.addEventListener('click', close);

    document.querySelectorAll('[data-oa]').forEach(btn => {
      btn.addEventListener('click', () => _handleAction(btn.dataset.oa));
    });

    // Close panel when clicking outside it
    // justOpened flag prevents the same click that opens the panel from closing it
    let _justOpened = false;
    document.addEventListener('mousedown', e => {
      if (_justOpened) { _justOpened = false; return; }
      const panel   = document.getElementById('ownerPanel');
      const trigger = document.getElementById('ownerTrigger');
      if (isOpen && panel && trigger
          && !panel.contains(e.target)
          && !trigger.contains(e.target)) close();
    });

    // Proximity glow on the trigger button
    document.addEventListener('mousemove', _proximityGlow);

    // Wire the trigger button itself
    document.getElementById('ownerTrigger')?.addEventListener('click', toggle);

    // Panel starts hidden — show() is only called by playfab.js after inventory check
  }

  /* ─────────────────────────────────────────────
     PROXIMITY GLOW
  ───────────────────────────────────────────── */
  function _proximityGlow(e) {
    const trigger = document.getElementById('ownerTrigger');
    if (!trigger || trigger.classList.contains('hidden')) return;
    const r = trigger.getBoundingClientRect();
    const strength = Math.max(0, 1 - Math.hypot(
      e.clientX - (r.left + r.width  / 2),
      e.clientY - (r.top  + r.height / 2)
    ) / 220);
    trigger.style.setProperty('--prox', strength.toFixed(3));
    trigger.classList.toggle('prox-active', strength > 0);
  }

  /* ─────────────────────────────────────────────
     SHOW / HIDE
     show() → called by playfab.js when owner_panel found in inventory
     hide() → called by playfab.js when owner_panel NOT in inventory / logout
  ───────────────────────────────────────────── */
  function show() {
    document.getElementById('ownerTrigger')?.classList.remove('hidden');
    _syncIngameSection();
  }

  function hide() {
    document.getElementById('ownerTrigger')?.classList.add('hidden');
    document.getElementById('ownerPanel')?.classList.add('hidden');
    isOpen = false;
  }

  function toggle() { isOpen ? close() : open(); }

  function open() {
    const panel = document.getElementById('ownerPanel');
    if (!panel) return;
    _justOpened = true;
    panel.classList.remove('hidden', 'op-closing');
    panel.classList.add('op-opening');
    isOpen = true;
    const arrow = document.getElementById('otArrow');
    if (arrow) arrow.textContent = '▼';
    document.getElementById('ownerTrigger')?.classList.add('open');
    _syncIngameSection();
    _buildCosmeticButtons();
  }

  function close() {
    const panel = document.getElementById('ownerPanel');
    if (!panel) return;
    panel.classList.remove('op-opening');
    panel.classList.add('op-closing');
    setTimeout(() => {
      panel.classList.add('hidden');
      panel.classList.remove('op-closing');
    }, 300);
    isOpen = false;
    const arrow = document.getElementById('otArrow');
    if (arrow) arrow.textContent = '▲';
    document.getElementById('ownerTrigger')?.classList.remove('open');
  }

  /* ─────────────────────────────────────────────
     IN-GAME SYNC
     Called by game.js: Owner.setInGame(true/false)
  ───────────────────────────────────────────── */
  function setInGame(val) {
    inGame = val;
    _syncIngameSection();
  }

  function _syncIngameSection() {
    const s = document.getElementById('opIngame');
    if (s) s.style.display = inGame ? 'block' : 'none';
  }

  /* ─────────────────────────────────────────────
     BUILD COSMETIC BUTTONS
     Reads straight from PF.catalogItems (live PlayFab catalog)
  ───────────────────────────────────────────── */
  function _buildCosmeticButtons() {
    const container = document.getElementById('opCosmeticBtns');
    if (!container) return;
    container.innerHTML = '';

    // Only use live PlayFab catalog — no fallback
    const items = (typeof PF !== 'undefined' && PF.catalogItems?.length)
      ? PF.catalogItems
      : [];

    if (!items.length) {
      container.innerHTML = `<div class="op-catalog-empty"><span>📡</span><p>PlayFab catalog not loaded.</p></div>`;
      return;
    }

    // Owner-exclusive items first
    const ownerItems = items.filter(c =>
      c.tags?.includes('owner') || c.itemClass === 'OwnerCharacter'
    );
    // Everything else (badges, frames, effects, pets — but NOT owner_panel itself)
    const otherItems = items.filter(c =>
      !c.tags?.includes('owner') && c.itemClass !== 'OwnerCharacter' && c.itemId !== 'owner_panel'
    );

    _renderBtns(container, ownerItems, 'gold');

    if (otherItems.length) {
      const sep = document.createElement('div');
      sep.className = 'op-subsection';
      sep.textContent = 'ALL COSMETICS';
      container.appendChild(sep);
      _renderBtns(container, otherItems, 'blue');
    }
  }

  function _renderBtns(container, items, cls) {
    items.forEach(item => {
      let custom = {};
      try { custom = typeof item.custom === 'string' ? JSON.parse(item.custom) : (item.custom || {}); } catch {}
      const btn = document.createElement('button');
      btn.className = `op-btn ${cls} op-cosmetic-btn`;
      btn.innerHTML = `
        <span class="op-btn-icon">${custom.icon || '🎁'}</span>
        <div class="op-btn-info">
          <span class="op-btn-name">${item.displayName || ''}</span>
          <span class="op-btn-sub">${(item.description || '').slice(0, 52)}</span>
        </div>
        <span class="op-btn-arrow">→</span>`;
      btn.onclick = () => _grantItem(item.itemId, item.displayName);
      container.appendChild(btn);
    });
  }

  async function _grantItem(itemId, displayName) {
    const target = document.getElementById('ownerTarget')?.value.trim() || '';
    if (!target) { _log('⚠ Enter a target Player ID first', 'err'); return; }
    _log(`📡 Granting ${displayName} → ${target}…`);
    const res = await PF.serverCall('grantCatalogItem', {
      targetPlayerId: target, itemId, catalogVersion: 'ZTD_Cosmetics_v1'
    });
    _log(res.ok ? `✅ ${displayName} granted!` : `✗ ${res.msg}`, res.ok ? 'ok' : 'err');
  }

  /* ─────────────────────────────────────────────
     ACTION HANDLER
  ───────────────────────────────────────────── */
  async function _handleAction(action) {
    const target  = document.getElementById('ownerTarget')?.value.trim() || '';
    const hasT    = () => { if (!target) { _log('⚠ Enter a target Player ID first', 'err'); return false; } return true; };
    const hasGame = () => {
      const ok = typeof Game !== 'undefined' && Game.isRunning?.();
      if (!ok) _log('⚠ No active round — start a game first', 'err');
      return ok;
    };
    const pfCall = async (method, data) => {
      const res = await PF.serverCall(method, data);
      _log(res.ok ? `✅ Done!` : `✗ ${res.msg}`, res.ok ? 'ok' : 'err');
      return res;
    };

    switch (action) {

      /* ── PlayFab inventory commands ── */

      case 'giveAllTowers': {
        if (!hasT()) return;
        _log('🗼 Granting all towers…');
        const ids = TOWER_DEFS.filter(d => !d.ownerOnly).map(d => d.id);
        const res = await PF.serverCall('giveAllTowers', { targetPlayerId: target, towerIds: ids });
        _log(res.ok ? `✅ ${ids.length} towers granted!` : `✗ ${res.msg}`, res.ok ? 'ok' : 'err');
        break;
      }

      case 'giveOwnerTowers': {
        if (!hasT()) return;
        _log('👑 Granting all 3 owner characters…');
        let ok = true;
        for (const id of ['cosmetic_shadow_commander','cosmetic_neon_warden','cosmetic_void_hunter']) {
          const r = await PF.serverCall('grantCatalogItem', { targetPlayerId: target, itemId: id, catalogVersion: 'ZTD_Cosmetics_v1' });
          if (!r.ok) { ok = false; _log(`✗ ${id}: ${r.msg}`, 'err'); }
          else _log(`✅ ${id} granted!`, 'ok');
        }
        if (ok) _log('✅ All 3 owner characters granted!', 'ok');
        break;
      }

      case 'unlockAllMaps': {
        if (!hasT()) return;
        _log('🗺 Unlocking all maps…');
        const mapIds = typeof MAPS !== 'undefined' ? MAPS.map(m => m.id) : [];
        await pfCall('unlockAllPerks', { targetPlayerId: target, mapIds });
        break;
      }

      case 'giveCoins': {
        if (!hasT()) return;
        const amount = parseInt(document.getElementById('ownerCoinAmt')?.value) || 0;
        _log(`💰 Giving ${amount} coins → ${target}…`);
        await pfCall('giveCoins', { targetPlayerId: target, amount });
        break;
      }

      case 'makeOwner': {
        if (!hasT()) return;
        if (!confirm(`Grant OWNER status to "${target}"? Cannot be undone.`)) return;
        _log(`👑 Promoting ${target}…`);
        await pfCall('makeOwner', { targetPlayerId: target });
        break;
      }

      case 'resetPlayer': {
        if (!hasT()) return;
        if (!confirm(`RESET ALL data for "${target}"? CANNOT BE UNDONE.`)) return;
        _log(`⚠ Resetting ${target}…`);
        await pfCall('resetPlayer', { targetPlayerId: target });
        break;
      }

      /* ── Live in-game commands ── */

      case 'addIngameMoney': {
        if (!hasGame()) return;
        const amt = parseInt(document.getElementById('ownerIngameMoney')?.value) || 0;
        Game.ownerAddMoney(amt);
        _log(`✅ +$${amt} added to round`, 'ok');
        break;
      }

      case 'setLives': {
        if (!hasGame()) return;
        const lives = parseInt(document.getElementById('ownerLivesAmt')?.value) || 99;
        Game.ownerSetLives(lives);
        _log(`✅ Lives set to ${lives}`, 'ok');
        break;
      }

      case 'skipWave': {
        if (!hasGame()) return;
        Game.ownerSkipWave();
        _log('✅ Wave skipped!', 'ok');
        break;
      }

      case 'godMode': {
        if (!hasGame()) return;
        godActive = !godActive;
        Game.ownerGodMode(godActive);
        document.querySelector('[data-oa="godMode"]').style.outline = godActive ? '2px solid #2ecc71' : '';
        _log(`✅ God Mode: ${godActive ? 'ON 🛡' : 'OFF'}`, 'ok');
        break;
      }

      case 'nukeEnemies': {
        if (!hasGame()) return;
        Game.ownerNukeEnemies();
        _log('✅ 💥 All enemies annihilated!', 'ok');
        break;
      }

      case 'freezeAll': {
        if (!hasGame()) return;
        Game.ownerFreezeAll(10);
        _log('✅ ❄️ All enemies frozen for 10s!', 'ok');
        break;
      }

      case 'speedHack': {
        if (!hasGame()) return;
        speedHackIdx = (speedHackIdx + 1) % SPEED_CYCLE.length;
        const spd = SPEED_CYCLE[speedHackIdx];
        Game.ownerSpeedHack(spd);
        const btn = document.querySelector('[data-oa="speedHack"]');
        if (btn) btn.textContent = `⚡ Speed: ${spd}×`;
        _log(`✅ Speed set to ${spd}×`, 'ok');
        break;
      }

      case 'spawnBoss': {
        if (!hasGame()) return;
        const type = document.getElementById('ownerBossType')?.value || 'boss_zombie_king';
        Game.ownerSpawnBoss(type);
        _log(`✅ 👑 ${type} spawned!`, 'ok');
        break;
      }

      case 'maxAllTowers': {
        if (!hasGame()) return;
        Game.ownerMaxAllTowers();
        _log('✅ All placed towers maxed!', 'ok');
        break;
      }

      default:
        _log(`⚠ Unknown action: ${action}`, 'err');
    }
  }

  /* ─────────────────────────────────────────────
     LOG
  ───────────────────────────────────────────── */
  function _log(msg, type = '') {
    const log = document.getElementById('ownerLog');
    if (!log) return;
    log.querySelector('.op-placeholder')?.remove();
    const el = document.createElement('div');
    el.className = 'op-log-entry ' + type;
    el.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    log.insertBefore(el, log.firstChild);
    while (log.children.length > 50) log.lastChild.remove();
  }

  return { init, show, hide, toggle, open, close, setInGame };
})();
