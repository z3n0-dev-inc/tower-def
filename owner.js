/* ═══════════════════════════════════════════════
   owner.js — Owner Panel (FULLY WORKING)
   - Shows only when PlayFab grants IsOwner = true
   - Hover/proximity animation on trigger button
   - Grant owner cosmetics via PlayFab inventory
   - Give all towers, unlock all maps, give coins
   - Live in-game commands: money, skip, god mode, nuke, freeze, speedhack
   ═══════════════════════════════════════════════ */

const Owner = (() => {
  let inGame = false;
  let isOpen = false;
  let _openedAt = 0;
  let proximityInterval = null;

  function init() {
    document.getElementById('ownerTrigger').onclick = toggle;
    document.getElementById('btnCloseOwner').onclick = close;

    // Bind static action buttons via data-oa
    document.querySelectorAll('[data-oa]').forEach(btn => {
      btn.onclick = () => _handleAction(btn.dataset.oa);
    });

    // Close on outside click.
    // Use 'pointerup' + timestamp guard so the same tap that opens the panel
    // doesn't immediately close it (mousedown fires before onclick).
    document.addEventListener('pointerup', e => {
      if (!isOpen) return;
      if (Date.now() - _openedAt < 200) return;
      const panel   = document.getElementById('ownerPanel');
      const trigger = document.getElementById('ownerTrigger');
      if (!panel || !trigger) return;
      if (!panel.contains(e.target) && !trigger.contains(e.target)) close();
    });

    // Proximity glow effect: detect mouse near the trigger button
    document.addEventListener('mousemove', _handleProximity);
  }

  // ── Proximity hover magic ─────────────────────
  function _handleProximity(e) {
    const trigger = document.getElementById('ownerTrigger');
    if (!trigger || trigger.classList.contains('hidden')) return;
    const rect = trigger.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    const maxDist = 200;

    if (dist < maxDist) {
      const strength = 1 - (dist / maxDist);
      trigger.style.setProperty('--prox', strength.toFixed(3));
      trigger.classList.add('prox-active');
    } else {
      trigger.style.setProperty('--prox', '0');
      trigger.classList.remove('prox-active');
    }
  }

  // ── Show / Hide ────────────────────────────────
  function show() {
    document.getElementById('ownerTrigger').classList.remove('hidden');
    _syncIngameSection();
  }

  function hide() {
    document.getElementById('ownerTrigger').classList.add('hidden');
    document.getElementById('ownerPanel').classList.add('hidden');
    isOpen = false;
  }

  function toggle() { isOpen ? close() : open(); }

  function open() {
    const panel = document.getElementById('ownerPanel');
    panel.classList.remove('hidden', 'op-closing');
    panel.classList.add('op-opening');
    isOpen = true;
    document.getElementById('otArrow').textContent = '▼';
    document.getElementById('ownerTrigger').classList.add('open');
    _syncIngameSection();
    _populateCosmeticButtons();
    // Stamp time so outside-click guard ignores the opening event
    _openedAt = Date.now();
  }

  function close() {
    const panel = document.getElementById('ownerPanel');
    panel.classList.remove('op-opening');
    panel.classList.add('op-closing');
    setTimeout(() => { panel.classList.add('hidden'); panel.classList.remove('op-closing'); }, 300);
    isOpen = false;
    document.getElementById('otArrow').textContent = '▲';
    document.getElementById('ownerTrigger').classList.remove('open');
  }

  function setInGame(val) { inGame = val; _syncIngameSection(); }

  function _syncIngameSection() {
    const s = document.getElementById('opIngame');
    if (s) s.style.display = inGame ? 'block' : 'none';
  }

  // ── Cosmetic buttons from PlayFab catalog ─────
  function _populateCosmeticButtons() {
    const container = document.getElementById('opCosmeticBtns');
    if (!container) return;
    container.innerHTML = '';

    // Filter for owner/exclusive items in the catalog
    const ownerItems = PF.catalogItems.filter(c =>
      c.tags.includes('owner') || c.itemClass === 'OwnerCharacter'
    );

    if (ownerItems.length === 0) {
      container.innerHTML = `
        <div class="op-catalog-empty">
          <span>📡</span>
          <p>Catalog not loaded from PlayFab.<br>Check your network & Title ID.</p>
        </div>`;
      return;
    }

    ownerItems.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'op-btn gold op-cosmetic-btn';
      btn.innerHTML = `
        <span class="op-btn-icon">${item.custom?.icon || '🎁'}</span>
        <div class="op-btn-info">
          <span class="op-btn-name">${item.displayName}</span>
          <span class="op-btn-sub">${item.description?.slice(0,50) || ''}</span>
        </div>
        <span class="op-btn-arrow">→</span>
      `;
      btn.onclick = () => _grantCatalogItem(item.itemId, item.displayName);
      container.appendChild(btn);
    });

    // Also show all cosmetics section for badges/effects
    const allCosmetics = PF.catalogItems.filter(c =>
      !c.tags.includes('owner') && c.itemClass !== 'OwnerCharacter'
    );
    if (allCosmetics.length > 0) {
      const hdr = document.createElement('div');
      hdr.className = 'op-subsection';
      hdr.textContent = 'ALL COSMETICS';
      container.appendChild(hdr);
      allCosmetics.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'op-btn blue op-cosmetic-btn';
        btn.innerHTML = `
          <span class="op-btn-icon">${item.custom?.icon || '🎁'}</span>
          <div class="op-btn-info">
            <span class="op-btn-name">${item.displayName}</span>
            <span class="op-btn-sub">${item.itemClass || 'Cosmetic'}</span>
          </div>
          <span class="op-btn-arrow">→</span>
        `;
        btn.onclick = () => _grantCatalogItem(item.itemId, item.displayName);
        container.appendChild(btn);
      });
    }
  }

  async function _grantCatalogItem(itemId, displayName) {
    const target = document.getElementById('ownerTarget').value.trim();
    if (!target) { _log('Enter a target Player ID first', 'err'); return; }
    _log(`Granting ${displayName} → ${target}…`);
    const res = await PF.serverCall('grantCatalogItem', {
      targetPlayerId: target,
      itemId,
      catalogVersion: 'ZTD_Cosmetics_v1',
    });
    _log(res.ok ? `✅ ${displayName} granted!` : `✗ ${res.msg}`, res.ok ? 'ok' : 'err');
  }

  // ── Action handler ────────────────────────────
  async function _handleAction(action) {
    const target = document.getElementById('ownerTarget').value.trim();

    switch (action) {

      // ── Give All Towers ──────────────────────
      case 'giveAllTowers': {
        if (!target) { _log('Enter a target Player ID', 'err'); return; }
        _log('Granting all non-owner towers…');
        const allIds = TOWER_DEFS.filter(d => !d.ownerOnly).map(d => d.id);
        const res = await PF.serverCall('giveAllTowers', { targetPlayerId:target, towerIds:allIds });
        _log(res.ok ? `✅ All ${allIds.length} towers granted!` : `✗ ${res.msg}`, res.ok?'ok':'err');
        break;
      }

      // ── Give ALL Owner Towers (all 3 owner cosmetics) ──
      case 'giveOwnerTowers': {
        if (!target) { _log('Enter a target Player ID', 'err'); return; }
        const ownerItems = ['cosmetic_shadow_commander','cosmetic_neon_warden','cosmetic_void_hunter'];
        _log('Granting all 3 owner characters…');
        let allOk = true;
        for (const itemId of ownerItems) {
          const res = await PF.serverCall('grantCatalogItem', {
            targetPlayerId: target, itemId, catalogVersion: 'ZTD_Cosmetics_v1'
          });
          if (!res.ok) { allOk = false; _log(`✗ ${itemId}: ${res.msg}`, 'err'); }
        }
        if (allOk) _log('✅ All 3 owner characters granted!', 'ok');
        break;
      }

      // ── Unlock All Maps ──────────────────────
      case 'unlockAllMaps': {
        if (!target) { _log('Enter a target Player ID', 'err'); return; }
        _log('Unlocking all 8 maps…');
        const allMapIds = MAPS.map(m => m.id);
        const res = await PF.serverCall('unlockAllPerks', {
          targetPlayerId: target,
          mapIds: allMapIds,
        });
        _log(res.ok ? '✅ All 8 maps unlocked!' : `✗ ${res.msg}`, res.ok?'ok':'err');
        break;
      }

      // ── Give Coins ───────────────────────────
      case 'giveCoins': {
        if (!target) { _log('Enter a target Player ID', 'err'); return; }
        const amount = parseInt(document.getElementById('ownerCoinAmt').value) || 0;
        _log(`Sending ${amount} coins → ${target}…`);
        const res = await PF.serverCall('giveCoins', { targetPlayerId:target, amount });
        _log(res.ok ? `✅ ${amount} coins granted!` : `✗ ${res.msg}`, res.ok?'ok':'err');
        break;
      }

      // ── Make Owner ───────────────────────────
      case 'makeOwner': {
        if (!target) { _log('Enter a target Player ID', 'err'); return; }
        if (!confirm(`Grant OWNER status to "${target}"? This cannot be undone.`)) return;
        _log(`Promoting ${target} to Owner…`);
        const res = await PF.serverCall('makeOwner', { targetPlayerId:target });
        _log(res.ok ? '✅ Owner status granted!' : `✗ ${res.msg}`, res.ok?'ok':'err');
        break;
      }

      // ── Reset Player ─────────────────────────
      case 'resetPlayer': {
        if (!target) { _log('Enter a target Player ID', 'err'); return; }
        if (!confirm(`RESET all data for "${target}"? THIS CANNOT BE UNDONE.`)) return;
        _log(`Resetting ${target}…`);
        const res = await PF.serverCall('resetPlayer', { targetPlayerId:target });
        _log(res.ok ? '✅ Player reset to default.' : `✗ ${res.msg}`, res.ok?'ok':'err');
        break;
      }

      // ── IN-GAME COMMANDS ─────────────────────
      case 'addIngameMoney': {
        const amt = parseInt(document.getElementById('ownerIngameMoney').value) || 0;
        if (!Game.isRunning()) { _log('No active game', 'err'); return; }
        Game.ownerAddMoney(amt);
        _log(`✅ +$${amt} added to current round`, 'ok');
        break;
      }

      case 'skipWave': {
        if (!Game.isRunning()) { _log('No active game', 'err'); return; }
        Game.ownerSkipWave();
        _log('✅ Wave skipped!', 'ok');
        break;
      }

      case 'godMode': {
        if (!Game.isRunning()) { _log('No active game', 'err'); return; }
        const on = Game.ownerGodMode();
        _log(`✅ God Mode: ${on?'ON 🛡':'OFF'}`, 'ok');
        break;
      }

      case 'nukeEnemies': {
        if (!Game.isRunning()) { _log('No active game', 'err'); return; }
        Game.ownerNukeEnemies();
        _log('✅ 💥 ALL enemies annihilated!', 'ok');
        break;
      }

      case 'freezeAll': {
        if (!Game.isRunning()) { _log('No active game', 'err'); return; }
        Game.ownerFreezeAll();
        _log('✅ ❄️ ALL enemies frozen for 10s!', 'ok');
        break;
      }

      case 'speedHack': {
        if (!Game.isRunning()) { _log('No active game', 'err'); return; }
        const spd = Game.ownerSpeedHack();
        _log(`✅ ⚡ Speed set to ${spd}x`, 'ok');
        break;
      }

      case 'spawnBoss': {
        if (!Game.isRunning()) { _log('No active game', 'err'); return; }
        const bossType = document.getElementById('ownerBossType')?.value || 'boss_zombie_king';
        Game.ownerSpawnBoss(bossType);
        _log(`✅ 👑 ${bossType} spawned!`, 'ok');
        break;
      }

      case 'maxAllTowers': {
        if (!Game.isRunning()) { _log('No active game', 'err'); return; }
        Game.ownerMaxAllTowers();
        _log('✅ All placed towers maxed!', 'ok');
        break;
      }

      case 'setLives': {
        if (!Game.isRunning()) { _log('No active game', 'err'); return; }
        const lives = parseInt(document.getElementById('ownerLivesAmt')?.value) || 99;
        Game.ownerSetLives(lives);
        _log(`✅ Lives set to ${lives}`, 'ok');
        break;
      }
    }
  }

  // ── Log ───────────────────────────────────────
  function _log(msg, type='') {
    const log = document.getElementById('ownerLog');
    const ph  = log.querySelector('.op-placeholder');
    if (ph) ph.remove();
    const el = document.createElement('div');
    el.className = 'op-log-entry ' + type;
    el.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    log.insertBefore(el, log.firstChild);
    while (log.children.length > 30) log.lastChild.remove();
  }

  return { init, show, hide, toggle, open, close, setInGame };
})();
