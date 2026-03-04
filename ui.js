/* ═══════════════════════════════════════════════
   ui.js — Menu, HUD, Shop, Leaderboard, Profile
   - Auto-login on load via stored credentials
   - Cosmetic inventory from catalog.json / PlayFab
   - Owner trigger shows only after PlayFab grants
   ═══════════════════════════════════════════════ */

const UI = (() => {

  let unlockedMaps  = new Set(['graveyard']);
  let ownedTowers   = new Set(['gunner','archer']);
  let lbInterval    = null;
  let currentLbStat = 'HighScore';
  let particleCtx   = null, particleCanvas = null;
  let particles     = [];
  let autoLoginDone = false;

  // ── INIT ──────────────────────────────────────
  async function init() {
    _loadLocalProgress();
    _initMenuParticles();
    _bindMenuTabs();
    _bindAuthButtons();
    _bindShopFilters();
    _bindLbTabs();
    _startTicker();

    // Try auto-login first, then build UI
    _setAuthStatus('Reconnecting…', '');
    const didLogin = await PF.tryAutoLogin();

    if (didLogin) {
      console.log('[UI] Auto-login success');
      _syncPFProgress();
      _updateProfileUI();
      if (PF.isOwner) _showOwnerTrigger();
    } else {
      _setAuthStatus('', '');
      _updateProfileUI();
    }

    // Build menu after login attempt
    _buildMapGrid();
    _buildShop();
    _refreshLeaderboard(currentLbStat);

    // Auto-refresh leaderboard
    lbInterval = setInterval(() => _refreshLeaderboard(currentLbStat), 30000);
    autoLoginDone = true;
  }

  function _syncPFProgress() {
    // Merge PF data into local tracking
    if (PF.playerData.OwnedTowers) {
      PF.playerData.OwnedTowers.forEach(id => ownedTowers.add(id));
    }
    if (PF.playerData.UnlockedMaps) {
      PF.playerData.UnlockedMaps.forEach(id => unlockedMaps.add(id));
    }
    // Also count towers from owner cosmetics
    PF.ownersTowers().forEach(id => ownedTowers.add(id));
    _saveLocalProgress();
  }

  function _loadLocalProgress() {
    try {
      const s = JSON.parse(localStorage.getItem('ztd_progress') || '{}');
      if (s.unlockedMaps) s.unlockedMaps.forEach(id => unlockedMaps.add(id));
      if (s.ownedTowers)  s.ownedTowers.forEach(id => ownedTowers.add(id));
    } catch {}
    unlockedMaps.add('graveyard');
    ownedTowers.add('gunner');
    ownedTowers.add('archer');
  }

  function _saveLocalProgress() {
    localStorage.setItem('ztd_progress', JSON.stringify({
      unlockedMaps: [...unlockedMaps],
      ownedTowers:  [...ownedTowers],
    }));
  }

  // ── SCREENS ───────────────────────────────────
  function showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + name);
    if (el) el.classList.add('active');
    if (name === 'menu') {
      _buildMapGrid();
      _buildShop(document.querySelector('.sf.active')?.dataset.sf || 'all');
      _updateProfileUI();
      Owner.setInGame(false);
    }
    if (name === 'game') {
      Owner.setInGame(true);
    }
  }

  function startGame(mapId) {
    showScreen('game');
    setTimeout(() => Game.init(mapId), 50);
  }

  // ── OWNER TRIGGER ─────────────────────────────
  function _showOwnerTrigger() {
    const el = document.getElementById('ownerTrigger');
    el.classList.remove('hidden');
    Owner.show();
  }

  function _hideOwnerTrigger() {
    document.getElementById('ownerTrigger').classList.add('hidden');
    document.getElementById('ownerPanel').classList.add('hidden');
  }

  // Arrow flips on open
  function _setOwnerArrow(open) {
    const trigger = document.getElementById('ownerTrigger');
    const arrow   = document.getElementById('otArrow');
    if (open) { trigger.classList.add('open'); arrow.textContent = '▼'; }
    else       { trigger.classList.remove('open'); arrow.textContent = '▲'; }
  }

  // ── MAP GRID ──────────────────────────────────
  function _buildMapGrid() {
    const grid = document.getElementById('mapGrid');
    grid.innerHTML = '';
    MAPS.forEach(map => {
      const locked = !unlockedMaps.has(map.id);
      const card = document.createElement('div');
      card.className = 'map-card' + (locked ? ' locked' : '');
      card.innerHTML = `
        <div class="map-preview">
          <canvas id="prev-${map.id}" width="230" height="128"></canvas>
          ${locked ? '<div class="map-lock-overlay">🔒</div>' : ''}
        </div>
        <div class="map-info">
          <div class="map-name">${map.name}</div>
          <div class="map-diff">${'⭐'.repeat(map.difficulty)} · ${map.waves} waves</div>
          <div class="map-waves">${map.description}</div>
        </div>`;
      if (!locked) card.onclick = () => startGame(map.id);
      else card.title = 'Complete the previous map to unlock';
      grid.appendChild(card);
      setTimeout(() => {
        const c = document.getElementById(`prev-${map.id}`);
        if (c) drawMapPreview(c, map);
      }, 0);
    });
  }

  function unlockMap(mapId, unlock = true) {
    if (unlock) {
      unlockedMaps.add(mapId);
      _saveLocalProgress();
    }
  }

  function unlockNextMap(completedId) {
    const idx = MAPS.findIndex(m => m.id === completedId);
    if (idx >= 0 && idx + 1 < MAPS.length) {
      const next = MAPS[idx + 1];
      unlockedMaps.add(next.id);
      if (PF.isLoggedIn()) {
        PF.playerData.UnlockedMaps = [...unlockedMaps];
        PF.savePlayerData();
      }
      _saveLocalProgress();
      toast(`🗺 New map unlocked: ${next.name}!`, 'gold');
    }
  }

  // ── TOWER PALETTE (in-game) ───────────────────
  function updateTowerPalette(map) {
    const palette = document.getElementById('towerPalette');
    palette.innerHTML = '';

    const allOwned = new Set([
      ...ownedTowers,
      ...(PF.isLoggedIn() ? PF.ownersTowers() : []),
    ]);

    TOWER_DEFS.filter(d => !d.ownerOnly).forEach(def => {
      const owned = allOwned.has(def.id) || def.shopCost === 0;
      _addPaletteItem(palette, def, owned, false);
    });

    // Owner-only towers if player is owner or has them in inventory
    if (PF.isOwner || TOWER_DEFS.some(d => d.ownerOnly && allOwned.has(d.id))) {
      TOWER_DEFS.filter(d => d.ownerOnly && allOwned.has(d.id)).forEach(def => {
        _addPaletteItem(palette, def, true, true);
      });
    }
  }

  function _addPaletteItem(palette, def, owned, isOwnerItem) {
    const item = document.createElement('div');
    item.className = 'tp-item' + (owned ? '' : ' locked');
    item.dataset.id = def.id;
    item.title = owned ? `${def.name} — 💰${def.cost}` : '🔒 Buy in Shop';
    if (isOwnerItem) item.style.borderColor = def.color;
    item.innerHTML = `
      <div class="tp-icon">${def.icon}</div>
      <div class="tp-name">${def.name}</div>
      <div class="tp-cost" style="${isOwnerItem ? 'color:'+def.color : ''}">${owned ? '💰'+def.cost : '🔒'}</div>
      ${!owned ? '<div class="tp-locked-icon">🔒</div>' : ''}
    `;
    if (owned) item.onclick = () => Game.selectTowerToPlace(def.id);
    else item.onclick = () => toast('Buy this tower in the Shop first!', 'gold');
    palette.appendChild(item);
  }

  // ── TOWER INFO ────────────────────────────────
  // ── TOWER INFO ────────────────────────────────
  function showTowerInfo(tower) {
    const panel  = document.getElementById('selPanel');
    const info   = document.getElementById('selInfo');
    const upgBtn = document.getElementById('btnUpgrade');
    const price  = document.getElementById('upgradePrice');
    panel.style.display = 'block';

    const upgCost = tower.getUpgradeCost();
    const upgName = tower.level < tower.def.maxUpgrade
      ? tower.def.upgrades[tower.level].name : 'MAX LEVEL';
    const dps = (tower.damage * tower.fireRate * (tower.auraBuff || 1)).toFixed(1);
    const buffed = (tower.auraBuff || 1) > 1.0;

    info.innerHTML = `
      <div class="si-name">${tower.def.icon} ${tower.def.name}</div>
      <div><span class="rarity-${tower.def.rarity}">${tower.def.rarity.toUpperCase()}</span>
           &nbsp;Lv <strong>${tower.level}/${tower.def.maxUpgrade}</strong></div>
      <div>DMG: <strong>${Math.floor(tower.damage * (tower.auraBuff||1))}</strong>${buffed ? ' <span style="color:#f1c40f;font-size:10px">⬆ BUFFED</span>' : ''}</div>
      <div>RNG: <strong>${Math.floor(tower.range)}px</strong></div>
      <div>DPS: <strong style="color:var(--red2)">${dps}</strong></div>
      ${tower.splash>0?`<div>SPLASH: <strong>${Math.floor(tower.splash)}px</strong></div>`:''}
      ${tower.slow>0  ?`<div>SLOW:   <strong>${Math.floor(tower.slow*100)}%</strong></div>`:''}
      ${tower.chain>0 ?`<div>CHAIN:  <strong>×${tower.chain}</strong></div>`:''}
      ${tower.burn>0  ?`<div>BURN:   <strong>${tower.burn}/s</strong></div>`:''}
      <div style="border-top:1px solid rgba(255,255,255,0.07);margin-top:5px;padding-top:5px">
        SELL: <strong style="color:var(--amber3)">💰${tower.getSellValue()}</strong>
        <span style="font-size:10px;color:var(--txt2);margin-left:4px">[S]</span>
      </div>
      ${upgCost ? `<div style="color:var(--amber3);font-size:11px;margin-top:3px">⬆ ${upgName} <span style="font-size:10px;color:var(--txt2)">[G]</span></div>` : ''}
    `;
    if (upgCost) {
      upgBtn.style.display = 'block';
      price.textContent    = '💰' + upgCost;
      upgBtn.style.opacity = (typeof Game !== 'undefined' && Game.money >= upgCost) ? '1' : '0.5';
    } else {
      upgBtn.style.display = 'none';
    }
  }

  // ── SHOP ─────────────────────────────────────
  function _buildShop(filter = 'all') {
    document.getElementById('shopCoins').textContent = PF.getCoins();
    const allOwned = new Set([
      ...ownedTowers,
      ...(PF.isLoggedIn() ? PF.ownersTowers() : []),
    ]);
    const grid = document.getElementById('shopGrid');
    grid.innerHTML = '';
    TOWER_DEFS
      .filter(d => !d.ownerOnly && d.shopCost > 0)
      .filter(d => filter === 'all' || d.rarity === filter)
      .forEach(def => {
        const owned = allOwned.has(def.id);
        const card  = document.createElement('div');
        card.className = 'shop-card' + (owned ? ' owned' : '');
        card.innerHTML = `
          <div class="sc-rarity rarity-${def.rarity}">${def.rarity.toUpperCase()}</div>
          <div class="sc-icon">${def.icon}</div>
          <div class="sc-name">${def.name}</div>
          <div class="sc-desc">${def.desc}</div>
          <div class="sc-stats">
            <div class="sc-stat"><span>Damage</span><strong>${def.damage}</strong></div>
            <div class="sc-stat"><span>Range</span><strong>${def.range}</strong></div>
            <div class="sc-stat"><span>Fire Rate</span><strong>${def.fireRate}/s</strong></div>
            ${def.splash>0?`<div class="sc-stat"><span>Splash</span><strong>${def.splash}</strong></div>`:''}
          </div>
          <div class="sc-price">${owned ? '✓ OWNED' : '💰 ' + def.shopCost}</div>
        `;
        if (!owned) card.onclick = () => _buyTower(def);
        grid.appendChild(card);
      });
  }

  async function _buyTower(def) {
    const coins = PF.getCoins();
    if (coins < def.shopCost) { toast('Not enough coins!', 'red'); return; }
    if (!PF.isLoggedIn()) {
      const c = parseInt(localStorage.getItem('ztd_coins') || '100');
      if (c < def.shopCost) { toast('Not enough coins!', 'red'); return; }
      localStorage.setItem('ztd_coins', c - def.shopCost);
      ownedTowers.add(def.id); _saveLocalProgress();
      toast(`${def.name} unlocked!`, 'green');
      _buildShop(document.querySelector('.sf.active')?.dataset.sf || 'all');
      return;
    }
    const res = await PF.buyTower(def.id, def.shopCost);
    if (res.ok) {
      ownedTowers.add(def.id); _saveLocalProgress();
      toast(`${def.name} unlocked!`, 'green');
      _buildShop(document.querySelector('.sf.active')?.dataset.sf || 'all');
      _updateProfileUI();
    } else { toast(res.msg, 'red'); }
  }

  function _bindShopFilters() {
    document.querySelectorAll('.sf').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.sf').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _buildShop(btn.dataset.sf);
      };
    });
  }

  // ── LEADERBOARD ───────────────────────────────
  function _bindLbTabs() {
    document.querySelectorAll('.lbt').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.lbt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLbStat = btn.dataset.lb;
        _refreshLeaderboard(currentLbStat);
      };
    });
  }

  async function _refreshLeaderboard(stat) {
    const wrap = document.getElementById('lbWrap');
    if (!wrap) return;
    wrap.innerHTML = '<p class="lb-loading">Loading…</p>';
    const entries = await PF.getLeaderboard(stat, 25);
    if (!entries.length) {
      wrap.innerHTML = '<p class="lb-loading">No data yet — play a game first!</p>';
      return;
    }
    wrap.innerHTML = entries.map((e, i) => `
      <div class="lb-row">
        <span class="lb-rank rank-${i+1}">${i < 3 ? ['🥇','🥈','🥉'][i] : i+1}</span>
        <span class="lb-name">${e.DisplayName || e.PlayFabId?.slice(0,8) || 'Player'}</span>
        <span class="lb-val">${(e.StatValue||0).toLocaleString()}</span>
        <span class="lb-towers">🗼 —</span>
      </div>`).join('');
  }

  // ── AUTH / PROFILE ────────────────────────────
  function _bindAuthButtons() {
    document.getElementById('btnLogin').onclick    = _doLogin;
    document.getElementById('btnRegister').onclick = _doRegister;
    document.getElementById('btnLogout').onclick   = _doLogout;
    // Allow enter key
    ['authUser','authPass'].forEach(id => {
      document.getElementById(id).addEventListener('keydown', e => {
        if (e.key === 'Enter') _doLogin();
      });
    });
  }

  async function _doLogin() {
    const u = document.getElementById('authUser').value.trim();
    const p = document.getElementById('authPass').value;
    if (!u || !p) { _setAuthStatus('Please fill in both fields', 'err'); return; }
    _setAuthStatus('Logging in…', '');
    const res = await PF.login(u, p);
    if (res.ok) {
      _setAuthStatus('Welcome back, ' + (PF.displayName || u) + '!', 'ok');
      _syncPFProgress();
      _updateProfileUI();
      _buildShop();
      _buildMapGrid();
      if (PF.isOwner) _showOwnerTrigger();
      else _hideOwnerTrigger();
    } else {
      _setAuthStatus(res.msg, 'err');
    }
  }

  async function _doRegister() {
    const u = document.getElementById('authUser').value.trim();
    const p = document.getElementById('authPass').value;
    if (!u || !p)   { _setAuthStatus('Fill in both fields', 'err'); return; }
    if (p.length<6) { _setAuthStatus('Password must be 6+ characters', 'err'); return; }
    _setAuthStatus('Creating account…', '');
    const res = await PF.register(u, p);
    if (res.ok) {
      _setAuthStatus('Account created! Welcome, ' + u + '!', 'ok');
      _updateProfileUI();
      if (PF.isOwner) _showOwnerTrigger();
    } else {
      _setAuthStatus(res.msg, 'err');
    }
  }

  function _doLogout() {
    PF.logout();
    _updateProfileUI();
    _hideOwnerTrigger();
    _buildShop();
    _buildMapGrid();
    _setAuthStatus('', '');
    toast('Logged out', '');
  }

  function _setAuthStatus(msg, type) {
    const el = document.getElementById('authMsg');
    if (!el) return;
    el.textContent = msg;
    el.className   = 'auth-msg ' + (type || '');
  }

  // ── PROFILE UI ────────────────────────────────
  function _updateProfileUI() {
    const authBox      = document.getElementById('authBox');
    const profilePanel = document.getElementById('profilePanel');

    if (PF.isLoggedIn()) {
      authBox.classList.add('hidden');
      profilePanel.classList.remove('hidden');

      // Stats
      const d = PF.playerData;
      document.getElementById('pName').textContent        = PF.displayName || 'Survivor';
      document.getElementById('pCoins').textContent       = d.Coins || 0;
      document.getElementById('pBestWave').textContent    = d.BestWave || 0;
      document.getElementById('pTotalKills').textContent  = d.TotalKills || 0;
      document.getElementById('pTowersOwned').textContent = (d.OwnedTowers||[]).length;

      // Cosmetics from inventory using catalog details
      _renderCosmeticInventory();

    } else {
      authBox.classList.remove('hidden');
      profilePanel.classList.add('hidden');
    }
  }

  // Render cosmetic cards from PlayFab inventory + catalog
  function _renderCosmeticInventory() {
    const container = document.getElementById('cosmeticList');
    if (!container) return;
    const items = PF.getOwnedCosmeticDetails();

    if (items.length === 0) {
      container.innerHTML = '<span class="cc-empty">No cosmetics yet. Ask the owner!</span>';
      return;
    }

    container.innerHTML = '';
    items.forEach(item => {
      const isOwner = item.tags?.includes('owner') || item.itemClass === 'OwnerCharacter';
      const card = document.createElement('div');
      card.className = 'cosmetic-card' + (isOwner ? ' owner-cosmetic' : '');
      card.style.setProperty('--cc-glow', item.custom?.glowColor || '#f1c40f');
      card.innerHTML = `
        <div class="cc-icon">${item.custom?.icon || '🎁'}</div>
        <div class="cc-name">${item.displayName}</div>
        <div class="cc-rarity">${(item.custom?.rarity || 'common').toUpperCase()}</div>
        <div class="cc-type">${item.itemClass || 'Cosmetic'}</div>
        <div class="cc-desc">${item.description || ''}</div>
      `;
      container.appendChild(card);
    });
  }

  // ── MENU TABS ────────────────────────────────
  function _bindMenuTabs() {
    document.querySelectorAll('.mtab').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.mtab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab)?.classList.add('active');
        if (btn.dataset.tab === 'leaderboard') _refreshLeaderboard(currentLbStat);
        if (btn.dataset.tab === 'shop')        _buildShop(document.querySelector('.sf.active')?.dataset.sf || 'all');
        if (btn.dataset.tab === 'profile')     _updateProfileUI();
      };
    });
  }

  // ── TICKER ────────────────────────────────────
  function _startTicker() {
    const msgs = [
      '🧟 ZOMBIE TOWER DEFENCE // BUILD · SURVIVE · DOMINATE',
      '💡 TIP: Freezer + Rocketeer = maximum crowd control',
      '💡 TIP: Sell towers for 60% of total investment (incl. upgrades)',
      '⚡ TIP: Tesla Coil chains lightning to 4+ enemies simultaneously',
      '🏆 Leaderboards refresh every 30s — every kill counts',
      '👑 Owner cosmetics unlock exclusive characters and tower variants',
      '💡 TIP: Phantom Sniper ignores all armour — great vs Shielders',
      '🔒 Unlock advanced towers in the Shop with earned coins',
      '💥 TIP: Omega Cannon deals the biggest AoE splash in the game',
      '🧟 BOSS TIP: Stack freeze + burn for maximum boss damage',
      '💡 TIP: Press [Space] to send wave, [G] to upgrade, [S] to sell',
      '⭐ Complete all 5 maps to unlock the Inferno challenge',
    ];
    let i = 0;
    const el = document.getElementById('tickerText');
    if (el) {
      el.textContent = msgs[0];
      setInterval(() => { el.textContent = msgs[++i % msgs.length]; }, 7500);
    }
  }

  // ── WAVE ANNOUNCE ─────────────────────────────
  function announceWave(num, isBoss) {
    const el   = document.getElementById('waveAnnounce');
    const waveEl = document.getElementById('waWave');
    const subEl  = document.getElementById('waSub');
    document.getElementById('waNum').textContent = num;
    subEl.textContent = isBoss ? '⚠ BOSS WAVE!' : 'INCOMING!';
    if (isBoss) {
      waveEl?.classList.add('boss-wave');
      subEl.classList.add('boss-wave');
    } else {
      waveEl?.classList.remove('boss-wave');
      subEl.classList.remove('boss-wave');
    }
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 2200);
  }

  // ── TOAST ─────────────────────────────────────
  function toast(msg, type = '') {
    const el = document.createElement('div');
    const colors = { red:'var(--red2)', green:'var(--grn2)', gold:'var(--amber3)', '':'var(--txt)' };
    el.style.cssText = `
      position:fixed;top:65px;left:50%;transform:translateX(-50%);
      background:rgba(17,17,24,0.97);border:1px solid rgba(255,255,255,0.1);
      color:${colors[type]||colors['']};
      padding:9px 22px;border-radius:6px;
      font-family:var(--f-hdr);font-size:17px;letter-spacing:2px;
      z-index:9999;pointer-events:none;
      box-shadow:0 8px 24px rgba(0,0,0,0.6);
      animation:tIn 0.2s ease-out,tOut 0.3s ease-in 1.7s forwards;
    `;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2100);
    if (!document.getElementById('_toastKf')) {
      const s = document.createElement('style'); s.id = '_toastKf';
      s.textContent = `
        @keyframes tIn  { from{opacity:0;transform:translateX(-50%) translateY(-10px)} to{opacity:1;transform:translateX(-50%)} }
        @keyframes tOut { from{opacity:1} to{opacity:0;transform:translateX(-50%) translateY(-8px)} }
      `;
      document.head.appendChild(s);
    }
  }

  // ── PARTICLES ─────────────────────────────────
  function _initMenuParticles() {
    particleCanvas = document.getElementById('menuParticles');
    if (!particleCanvas) return;
    particleCtx = particleCanvas.getContext('2d');
    _resizeParticles();
    window.addEventListener('resize', _resizeParticles);
    for (let i = 0; i < 50; i++) _addParticle(true);
    _animParticles();
  }

  function _resizeParticles() {
    if (!particleCanvas) return;
    particleCanvas.width  = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function _addParticle(init = false) {
    particles.push({
      x:  Math.random() * window.innerWidth,
      y:  init ? Math.random() * window.innerHeight : window.innerHeight + 10,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(0.18 + Math.random() * 0.45),
      r:  0.8 + Math.random() * 1.8,
      a:  0.08 + Math.random() * 0.3,
      c:  Math.random() < 0.25 ? '#c0392b' : '#2a2a3a',
    });
  }

  function _animParticles() {
    requestAnimationFrame(_animParticles);
    if (!particleCtx) return;
    const W = particleCanvas.width, H = particleCanvas.height;
    particleCtx.clearRect(0, 0, W, H);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.y < -10) { particles.splice(i, 1); _addParticle(); continue; }
      particleCtx.beginPath();
      particleCtx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      particleCtx.fillStyle = p.c;
      particleCtx.globalAlpha = p.a;
      particleCtx.fill();
    }
    particleCtx.globalAlpha = 1;
  }

  // ── PUBLIC ────────────────────────────────────
  return {
    init, showScreen, startGame,
    updateTowerPalette, showTowerInfo,
    unlockMap, unlockNextMap,
    announceWave, toast,
    addOwnedTower: id => { ownedTowers.add(id); _saveLocalProgress(); },
    get ownedTowers() { return ownedTowers; },
  };

})();
