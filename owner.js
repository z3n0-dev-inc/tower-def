/* ═══════════════════════════════════════════════
   owner.js — Owner Panel
   - Green "OWNER PANEL" button in bottom corner
   - Floats open from button origin with spring anim
   - Only visible if PlayFab grants IsOwner = true
   - All catalog cosmetics granting via server
   ═══════════════════════════════════════════════ */

const Owner = (() => {
  let inGame   = false;
  let isOpen   = false;

  function init() {
    document.getElementById('ownerTrigger').onclick  = toggle;
    document.getElementById('btnCloseOwner').onclick = close;
    document.querySelectorAll('[data-oa]').forEach(btn => {
      btn.onclick = () => _handleAction(btn.dataset.oa);
    });
    // Close if clicking outside
    document.addEventListener('mousedown', e => {
      const panel   = document.getElementById('ownerPanel');
      const trigger = document.getElementById('ownerTrigger');
      if (isOpen && !panel.contains(e.target) && !trigger.contains(e.target)) close();
    });
  }

  function show() {
    document.getElementById('ownerTrigger').classList.remove('hidden');
    _syncIngameSection();
  }

  function hide() {
    document.getElementById('ownerTrigger').classList.add('hidden');
    document.getElementById('ownerPanel').classList.add('hidden');
    isOpen = false;
  }

  function toggle() {
    isOpen ? close() : open();
  }

  function open() {
    const panel = document.getElementById('ownerPanel');
    panel.classList.remove('hidden');
    panel.classList.remove('op-closing');
    panel.classList.add('op-opening');
    isOpen = true;
    const arrow = document.getElementById('otArrow');
    if (arrow) arrow.textContent = '▼';
    document.getElementById('ownerTrigger').classList.add('open');
    _syncIngameSection();
    _populateCosmeticButtons();
  }

  function close() {
    const panel = document.getElementById('ownerPanel');
    panel.classList.remove('op-opening');
    panel.classList.add('op-closing');
    setTimeout(() => {
      panel.classList.add('hidden');
      panel.classList.remove('op-closing');
    }, 280);
    isOpen = false;
    const arrow = document.getElementById('otArrow');
    if (arrow) arrow.textContent = '▲';
    document.getElementById('ownerTrigger').classList.remove('open');
  }

  function setInGame(val) {
    inGame = val;
    _syncIngameSection();
  }

  function _syncIngameSection() {
    const s = document.getElementById('opIngame');
    if (s) s.style.display = inGame ? 'block' : 'none';
  }

  // Dynamically build cosmetic grant buttons from catalog
  function _populateCosmeticButtons() {
    const container = document.getElementById('opCosmeticBtns');
    if (!container) return;
    container.innerHTML = '';

    const ownerCosmetics = PF.catalogItems.filter(c =>
      c.tags.includes('owner') || c.itemClass === 'OwnerCharacter'
    );

    if (ownerCosmetics.length === 0) {
      container.innerHTML = '<span style="color:var(--txt2);font-size:12px">No catalog loaded yet.</span>';
      return;
    }

    ownerCosmetics.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'op-btn gold';
      btn.dataset.oa = 'giveCatalogItem';
      btn.dataset.itemId = item.itemId;
      btn.innerHTML = `${item.custom?.icon || '🎁'} Give: ${item.displayName}`;
      btn.onclick = () => _grantCatalogItem(item.itemId, item.displayName);
      container.appendChild(btn);
    });
  }

  async function _grantCatalogItem(itemId, displayName) {
    const target = document.getElementById('ownerTarget').value.trim();
    if (!target) { _log('Enter a target Player ID first', 'err'); return; }
    _log(`Granting ${displayName} to ${target}…`);
    const res = await PF.serverCall('grantCatalogItem', {
      targetPlayerId: target,
      itemId,
      catalogVersion: 'ZTD_Cosmetics_v1',
    });
    _log(res.ok ? `✓ ${displayName} granted!` : `✗ ${res.msg}`, res.ok ? 'ok' : 'err');
  }

  async function _handleAction(action) {
    const target = document.getElementById('ownerTarget').value.trim();

    switch (action) {
      case 'giveAllTowers': {
        if (!target) { _log('Enter a target Player ID', 'err'); return; }
        _log('Granting all towers…');
        const allIds = TOWER_DEFS.filter(d => !d.ownerOnly).map(d => d.id);
        const res = await PF.serverCall('giveAllTowers', { targetPlayerId:target, towerIds:allIds });
        _log(res.ok ? `✓ All towers granted (${allIds.length})` : `✗ ${res.msg}`, res.ok ? 'ok' : 'err');
        break;
      }

      case 'unlockAllPerks': {
        if (!target) { _log('Enter a target Player ID', 'err'); return; }
        _log('Unlocking all perks…');
        const res = await PF.serverCall('unlockAllPerks', { targetPlayerId:target });
        _log(res.ok ? '✓ All perks unlocked' : `✗ ${res.msg}`, res.ok ? 'ok' : 'err');
        break;
      }

      case 'giveCoins': {
        if (!target) { _log('Enter a target Player ID', 'err'); return; }
        const amount = parseInt(document.getElementById('ownerCoinAmt').value) || 0;
        _log(`Giving ${amount} coins to ${target}…`);
        const res = await PF.serverCall('giveCoins', { targetPlayerId:target, amount });
        _log(res.ok ? `✓ ${amount} coins granted` : `✗ ${res.msg}`, res.ok ? 'ok' : 'err');
        break;
      }

      case 'addIngameMoney': {
        const amt = parseInt(document.getElementById('ownerIngameMoney').value) || 0;
        if (Game.isRunning()) { Game.ownerAddMoney(amt); _log(`✓ Added $${amt} in-game`, 'ok'); }
        else _log('No active game', 'err');
        break;
      }

      case 'skipWave': {
        if (Game.isRunning()) { Game.ownerSkipWave(); _log('✓ Wave skipped', 'ok'); }
        else _log('No active game', 'err');
        break;
      }

      case 'godMode': {
        if (Game.isRunning()) { Game.ownerGodMode(); _log('✓ God Mode toggled', 'ok'); }
        else _log('No active game', 'err');
        break;
      }

      case 'nukeEnemies': {
        if (Game.isRunning()) { Game.ownerNukeEnemies(); _log('✓ All enemies nuked', 'ok'); }
        else _log('No active game', 'err');
        break;
      }

      case 'makeOwner': {
        if (!target) { _log('Enter a target Player ID', 'err'); return; }
        if (!confirm(`Grant OWNER to ${target}? Cannot be undone.`)) return;
        _log(`Granting owner to ${target}…`);
        const res = await PF.serverCall('makeOwner', { targetPlayerId:target });
        _log(res.ok ? '✓ Owner status granted' : `✗ ${res.msg}`, res.ok ? 'ok' : 'err');
        break;
      }

      case 'resetPlayer': {
        if (!target) { _log('Enter a target Player ID', 'err'); return; }
        if (!confirm(`RESET all data for ${target}? CANNOT BE UNDONE.`)) return;
        _log(`Resetting ${target}…`);
        const res = await PF.serverCall('resetPlayer', { targetPlayerId:target });
        _log(res.ok ? '✓ Player reset' : `✗ ${res.msg}`, res.ok ? 'ok' : 'err');
        break;
      }
    }
  }

  function _log(msg, type='') {
    const log = document.getElementById('ownerLog');
    const ph  = log.querySelector('.op-placeholder');
    if (ph) ph.remove();
    const el = document.createElement('div');
    el.className = 'op-log-entry ' + type;
    el.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    log.insertBefore(el, log.firstChild);
    while (log.children.length > 25) log.lastChild.remove();
  }

  return { init, show, hide, toggle, open, close, setInGame };
})();
