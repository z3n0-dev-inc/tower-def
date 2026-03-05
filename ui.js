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
    _initInfiniteTab();
    _initMapEditor();

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
      const diffStars = '⭐'.repeat(map.difficulty);
      card.innerHTML = `
        <div class="map-preview">
          <canvas id="prev-${map.id}" width="230" height="110"></canvas>
          ${locked ? '<div class="map-lock-overlay">🔒</div>' : ''}
          <div class="map-badge ${locked?'map-badge-lock':'map-badge-open'}">${locked?'LOCKED':'OPEN'}</div>
        </div>
        <div class="map-info">
          <div class="map-name">${map.name}</div>
          <div class="map-diff" style="color:var(--txt2);font-size:10px">${diffStars} DIFFICULTY ${map.difficulty}</div>
          <div class="map-waves-chip">🌊 ${map.waves} WAVES</div>
          <div class="map-waves" style="margin-top:3px">${map.description}</div>
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

    // Ground towers by rarity
    const rarityOrder = ['basic','advanced','special','legendary'];
    rarityOrder.forEach(rarity => {
      const defs = TOWER_DEFS.filter(d => !d.ownerOnly && !d.isAir && d.rarity === rarity);
      if (!defs.length) return;
      const sep = document.createElement('div');
      sep.className = `tp-sep tp-sep-${rarity}`;
      sep.textContent = rarity;
      palette.appendChild(sep);
      defs.forEach(def => {
        const owned = allOwned.has(def.id) || def.shopCost === 0;
        _addPaletteItem(palette, def, owned, false);
      });
    });

    // Air towers section
    const airDefs = TOWER_DEFS.filter(d => !d.ownerOnly && d.isAir);
    if (airDefs.length) {
      const airSep = document.createElement('div');
      airSep.className = 'tp-sep tp-sep-air';
      airSep.innerHTML = '✈ AIR';
      palette.appendChild(airSep);
      airDefs.forEach(def => {
        const owned = allOwned.has(def.id) || def.shopCost === 0;
        _addPaletteItem(palette, def, owned, false);
      });
    }

    // Owner-only towers
    if (PF.isOwner || TOWER_DEFS.some(d => d.ownerOnly && allOwned.has(d.id))) {
      const ownerDefs = TOWER_DEFS.filter(d => d.ownerOnly && allOwned.has(d.id));
      if (ownerDefs.length) {
        const sep = document.createElement('div');
        sep.className = 'tp-sep'; sep.style.color = 'var(--neon)';
        sep.textContent = 'OWNER';
        palette.appendChild(sep);
        ownerDefs.forEach(def => _addPaletteItem(palette, def, true, true));
      }
    }
  }

  // Dim towers player can't currently afford (called on HUD money update)
  function refreshCanAfford(money) {
    const items = document.querySelectorAll('#towerPalette .tp-item:not(.locked)');
    items.forEach(item => {
      const def = TOWER_DEFS.find(d => d.id === item.dataset.id);
      if (!def) return;
      const couldAffordBefore = !item.classList.contains('cant-afford');
      const canAffordNow = money >= def.cost;

      if (!canAffordNow) {
        item.classList.add('cant-afford');
        item.classList.remove('affordable', 'just-affordable');
      } else {
        // Was cant-afford, now can afford → fire the unlock glow animation
        if (!couldAffordBefore) {
          item.classList.remove('just-affordable');
          // Force reflow to restart animation
          void item.offsetWidth;
          item.classList.add('just-affordable');
          // Remove after animation completes so it can re-trigger next time
          setTimeout(() => item.classList.remove('just-affordable'), 700);
        }
        item.classList.remove('cant-afford');
        item.classList.add('affordable');
      }
    });
  }

  function _addPaletteItem(palette, def, owned, isOwnerItem) {
    const item = document.createElement('div');
    item.className = 'tp-item' + (owned ? '' : ' locked');
    item.dataset.id = def.id;
    item.dataset.rarity = def.rarity;
    if (isOwnerItem) item.style.borderColor = def.color;

    const costColor = isOwnerItem ? def.color : '';
    const dps = (def.damage * def.fireRate).toFixed(1);
    const ecoChip = def.isEconomy
      ? (def.isFarm ? `<div class="tp-eco-chip">$${def.incomePerRound}/rd</div>`
                    : `<div class="tp-eco-chip">BANK</div>`)
      : '';

    item.innerHTML = `
      <div class="tp-icon">${def.icon}${def.isAir ? '<span class="tp-air-badge">AIR</span>' : ''}</div>
      <div class="tp-name">${def.name}</div>
      <div class="tp-cost" style="color:${costColor}">${owned ? '💰'+def.cost : '🔒'}</div>
      ${ecoChip}
      ${!owned ? '<div class="tp-locked-icon">🔒</div>' : ''}
      ${owned ? `<div class="tp-tip">
        <div class="tp-tip-name">${def.name}</div>
        <div class="tp-tip-desc">${def.desc || ''}</div>
        ${def.isEconomy ? `<div class="tp-tip-stat"><span>${def.isFarm?'Income/Round':'Bank Cap'}</span><strong>${def.isFarm?'$'+def.incomePerRound+'/rd':'$'+(def.bankCap||7000).toLocaleString()}</strong></div>` : `
        <div class="tp-tip-stat"><span>DMG</span><strong>${def.damage}</strong></div>
        <div class="tp-tip-stat"><span>RNG</span><strong>${def.range}</strong></div>
        <div class="tp-tip-stat"><span>DPS</span><strong>${dps}</strong></div>
        ${def.splash>0?`<div class="tp-tip-stat"><span>SPLASH</span><strong>${def.splash}</strong></div>`:''}
        ${def.slow>0?`<div class="tp-tip-stat"><span>SLOW</span><strong>${Math.round(def.slow*100)}%</strong></div>`:''}
        ${def.chain>0?`<div class="tp-tip-stat"><span>CHAIN</span><strong>×${def.chain}</strong></div>`:''}`}
      </div>` : ''}
    `;
    if (owned) item.onclick = () => Game.selectTowerToPlace(def.id);
    else item.onclick = () => toast('Buy this tower in the Shop first!', 'gold');
    palette.appendChild(item);
  }

  // ── TOWER INFO ────────────────────────────────
  function showTowerInfo(tower) {
    const panel  = document.getElementById('selPanel');
    const info   = document.getElementById('selInfo');
    const upgBtn = document.getElementById('btnUpgrade');
    const price  = document.getElementById('upgradePrice');
    panel.style.display = 'block';

    const upgCost = tower.getUpgradeCost();
    const nextUpg = tower.level < tower.def.maxUpgrade ? tower.def.upgrades[tower.level] : null;
    const upgName = nextUpg ? nextUpg.name : 'MAX LEVEL';

    // Upgrade path nodes
    const maxUp = tower.def.maxUpgrade;
    let upgPath = '<div class="upg-path">';
    for (let i = 0; i < maxUp; i++) {
      if (i > 0) upgPath += `<div class="upg-line${i <= tower.level ? ' done' : ''}"></div>`;
      const cls = i < tower.level ? 'done' : (i === tower.level ? 'current' : 'future');
      upgPath += `<div class="upg-node ${cls}" title="${tower.def.upgrades[i]?.name||''}">${i+1}</div>`;
    }
    upgPath += '</div>';

    // Economy tower display
    if (tower.isEconomy) {
      const isBankMode = tower.isBank || tower.bankMode;
      const pct = isBankMode && tower.bankCap > 0 ? Math.round(tower.bankBalance / tower.bankCap * 100) : 0;
      const nextDesc = nextUpg?.desc || '';

      info.innerHTML = `
        <div class="si-name">${tower.def.icon} ${tower.def.name}</div>
        <div style="margin-bottom:4px">
          <span class="rarity-${tower.def.rarity}">${tower.def.rarity.toUpperCase()}</span>
          &nbsp;<span style="color:var(--txt2);font-size:10px">Lv ${tower.level}/${maxUp}</span>
        </div>
        ${maxUp > 0 ? upgPath : ''}
        ${tower.isFarm && !tower.bankMode ? `
          <div class="eco-stat"><span>💰 Income/Round</span><strong style="color:#4ade80">$${tower.incomePerRound}</strong></div>
          <div class="eco-stat"><span>📈 Total Earned</span><strong style="color:#fbbf24">$${tower.totalEarned}</strong></div>
        ` : ''}
        ${isBankMode ? `
          <div class="eco-stat"><span>🏦 Balance</span><strong style="color:#4ade80">$${tower.bankBalance.toLocaleString()}</strong></div>
          <div class="eco-stat"><span>📊 Cap</span><strong style="color:var(--txt2)">$${tower.bankCap.toLocaleString()}</strong></div>
          <div class="eco-stat"><span>💹 Rate</span><strong style="color:#4ade80">${Math.round((tower.bankRate||0.15)*100)}%/round</strong></div>
          <div class="bank-bar-wrap"><div class="bank-bar-fill" style="width:${pct}%"></div><span class="bank-bar-pct">${pct}%</span></div>
          <button id="btnWithdraw" class="withdraw-btn" style="${tower.bankBalance>0?'':'opacity:0.4;cursor:not-allowed'}" ${tower.bankBalance<=0?'disabled':''}>
            💸 WITHDRAW $${tower.bankBalance.toLocaleString()}
          </button>
        ` : ''}
        ${nextDesc ? `<div style="font-size:10px;color:var(--txt2);margin-top:4px;font-style:italic">Next: ${nextDesc}</div>` : ''}
        <div style="border-top:1px solid rgba(255,255,255,0.06);margin-top:6px;padding-top:5px;font-family:var(--f-mono);font-size:10px;color:var(--txt2)">
          SELL <strong style="color:var(--amber3)">💰${tower.getSellValue()}</strong>
          <span style="opacity:0.45;margin-left:3px">[S]</span>
        </div>
        ${upgCost ? `<div style="color:var(--amber3);font-size:10px;margin-top:3px;font-family:var(--f-mono)">⬆ ${upgName} <span style="opacity:0.45">[G]</span></div>` : ''}
      `;

      // Wire withdraw button
      const wBtn = document.getElementById('btnWithdraw');
      if (wBtn) {
        wBtn.onclick = () => {
          if (tower.bankBalance <= 0) return;
          if (typeof Game !== 'undefined') {
            Game.withdrawBank(tower);
            showTowerInfo(tower);
          }
        };
      }
    } else {
      const auraMult = tower.auraBuff || 1;
      const effDmg = Math.floor(tower.damage * auraMult);
      const dps = (tower.damage * tower.fireRate * auraMult).toFixed(1);
      const buffed = auraMult > 1.0;

      const statBar = (label, val, maxVal, color) => `
        <div class="sbar-row">
          <span class="sbar-lbl">${label}</span>
          <div class="sbar-track"><div class="sbar-fill" style="width:${Math.min(100,val/maxVal*100).toFixed(1)}%;background:${color}"></div></div>
          <span class="sbar-val">${val}</span>
        </div>`;

      info.innerHTML = `
        <div class="si-name">${tower.def.icon} ${tower.def.name}</div>
        <div style="margin-bottom:4px">
          <span class="rarity-${tower.def.rarity}">${tower.def.rarity.toUpperCase()}</span>
          &nbsp;<span style="color:var(--txt2);font-size:10px">Lv ${tower.level}/${maxUp}</span>
          ${buffed ? ' <span style="color:#f1c40f;font-size:9px;letter-spacing:1px">⬆ BUFFED</span>' : ''}
        </div>
        ${maxUp > 0 ? upgPath : ''}
        ${statBar('DMG', effDmg, 600, 'var(--red2)')}
        ${statBar('RNG', Math.floor(tower.range), 350, 'var(--cyan2)')}
        ${statBar('DPS', parseFloat(dps), 200, 'var(--amber2)')}
        ${tower.splash>0 ? statBar('SPLASH', Math.floor(tower.splash), 200, '#f97316') : ''}
        ${tower.slow>0   ? statBar('SLOW', Math.floor(tower.slow*100)+'%', '100%', '#60a5fa') : ''}
        ${tower.chain>0  ? `<div style="font-size:10px;color:var(--txt2);font-family:var(--f-mono)">CHAIN: <strong style="color:var(--cyan3)">×${tower.chain}</strong></div>` : ''}
        ${tower.burn>0   ? `<div style="font-size:10px;color:var(--txt2);font-family:var(--f-mono)">BURN: <strong style="color:#f97316">${tower.burn}/s</strong></div>` : ''}
        <div style="border-top:1px solid rgba(255,255,255,0.06);margin-top:6px;padding-top:5px;font-family:var(--f-mono);font-size:10px;color:var(--txt2)">
          SELL <strong style="color:var(--amber3)">💰${tower.getSellValue()}</strong>
          <span style="opacity:0.45;margin-left:3px">[S]</span>
        </div>
        ${upgCost ? `<div style="color:var(--amber3);font-size:10px;margin-top:3px;font-family:var(--f-mono)">⬆ ${upgName} <span style="opacity:0.45">[G]</span></div>` : ''}
      `;
    }

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
          <div class="sc-desc" style="font-family:var(--f-body);font-size:11.5px;font-weight:400">${def.desc}</div>
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
      // Level/XP
      if (typeof AccountLevel !== 'undefined') {
        AccountLevel.load(d.AccountXP || 0);
        _updateProfileLevelUI();
      }

      // Cosmetics from inventory using catalog details
      _renderCosmeticInventory();

    } else {
      authBox.classList.remove('hidden');
      profilePanel.classList.add('hidden');
    }
  }

  function _updateProfileLevelUI() {
    if (typeof AccountLevel === 'undefined') return;
    const prog = AccountLevel.getProgress();
    const col  = AccountLevel.getLevelColor(prog.level);
    const title = AccountLevel.getTitle(prog.level);
    const badge = document.getElementById('pAcctLevelBadge');
    if (badge) {
      badge.textContent  = prog.level;
      badge.style.color  = col;
      badge.style.borderColor = col;
      badge.style.boxShadow = `0 0 12px ${col}55`;
    }
    const titleEl = document.getElementById('pAcctTitle');
    if (titleEl) titleEl.textContent = title;
    const xpCur = document.getElementById('pXPCurrent');
    if (xpCur) xpCur.textContent = prog.level >= 100 ? 'MAX LEVEL' : `${prog.current.toLocaleString()} XP`;
    const xpNeed = document.getElementById('pXPNeeded');
    if (xpNeed) xpNeed.textContent = prog.level >= 100 ? '' : `/ ${prog.needed.toLocaleString()}`;
    const xpBar = document.getElementById('pXPBar');
    if (xpBar) { xpBar.style.width = (prog.pct*100).toFixed(1)+'%'; xpBar.style.background = col; }
    // Next unlock
    const nextUnlockEl = document.getElementById('pNextUnlock');
    if (nextUnlockEl && prog.level < 100) {
      const nextLvl = Object.keys(AccountLevel.LEVEL_UNLOCKS)
        .map(Number).sort((a,b)=>a-b).find(l => l > prog.level);
      if (nextLvl) {
        const un = AccountLevel.LEVEL_UNLOCKS[nextLvl];
        nextUnlockEl.textContent = `LVL ${nextLvl}: ${un.display}`;
      }
    }
    // Games played
    const gamesEl = document.getElementById('pGamesPlayed');
    if (gamesEl) gamesEl.textContent = PF.playerData?.GamesPlayed || 0;
    const mapsEl = document.getElementById('pMapsCompleted');
    if (mapsEl) mapsEl.textContent = PF.playerData?.MapsCompleted || 0;
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
        if (btn.dataset.tab === 'infinite')    _refreshInfiniteLb();
        if (btn.dataset.tab === 'editor')      _initMapEditor();
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
  const _WAVE_TAGLINES = [
    'INCOMING!', 'BRACE YOURSELF!', 'HERE THEY COME!',
    'DEFEND THE BASE!', 'NO MERCY!', 'HOLD THE LINE!',
    'THEY MULTIPLY!', 'STAY SHARP!', 'PREPARE FOR IMPACT!',
  ];
  function announceWave(num, isBoss) {
    const el     = document.getElementById('waveAnnounce');
    const numEl  = document.getElementById('waNum');
    const subEl  = document.getElementById('waSub');
    const eyeEl  = document.getElementById('waEyebrow');
    if (!el) return;
    numEl.textContent = num;
    if (isBoss) {
      eyeEl.textContent = '⚠ BOSS —';
      subEl.textContent = 'BRACE FOR IMPACT!';
      numEl.className = 'wa-number boss';
      subEl.className = 'wa-tagline boss';
    } else {
      eyeEl.textContent = 'WAVE';
      subEl.textContent = _WAVE_TAGLINES[Math.floor(Math.random() * _WAVE_TAGLINES.length)];
      numEl.className = 'wa-number';
      subEl.className = 'wa-tagline';
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
      font-family:'Barlow Condensed',sans-serif;font-size:16px;font-weight:600;letter-spacing:2.5px;
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

  // ── INFINITE MODE ─────────────────────────────
  function _initInfiniteTab() {
    const card = document.getElementById('infiniteCard');
    const btn  = document.getElementById('btnPlayInfinite');
    if (!card || !btn) return;
    setTimeout(() => {
      const c = document.getElementById('prev-infinite');
      if (c) drawMapPreview(c, getMap('infinite'));
    }, 0);
    card.onclick = btn.onclick = () => { startGame('infinite'); };
    _refreshInfiniteLb();
  }

  function _refreshInfiniteLb() {
    const el = document.getElementById('infiniteLb');
    if (!el) return;
    let lb = [];
    try { lb = Game.getInfiniteLeaderboard ? Game.getInfiniteLeaderboard() : JSON.parse(localStorage.getItem('ztd_infinite_lb')||'[]'); } catch(e){}
    if (!lb.length) { el.innerHTML = '<span style="color:var(--txt2)">No runs yet. Be the first!</span>'; return; }
    el.innerHTML = lb.slice(0,15).map((e,i)=>`
      <div style="display:flex;gap:12px;align-items:center;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
        <span style="color:${i<3?'#f1c40f':'var(--txt2)'};font-weight:700;min-width:22px">#${i+1}</span>
        <span style="flex:1;color:var(--txt)">${e.name||'ANON'}</span>
        <span style="color:var(--amber3)">Wave ${e.wave}</span>
        <span style="color:var(--txt3);font-size:9px">${new Date(e.date).toLocaleDateString()}</span>
      </div>`).join('');
  }

  // ── MAP EDITOR ────────────────────────────────
  let _edState = {
    cols:20, rows:12, tiles:null, tool:'path',
    spawn:null, end:null, theme:'graveyard',
    history:[], painting:false,
  };

  function _initMapEditor() {
    const canvas = document.getElementById('editorCanvas');
    if (!canvas || canvas._edInited) return;
    canvas._edInited = true;

    const TSIZE = 32;
    const cols = _edState.cols, rows = _edState.rows;
    canvas.width  = cols * TSIZE;
    canvas.height = rows * TSIZE;
    _edState.tiles = Array.from({length:rows}, ()=>Array(cols).fill(0));

    const ctx = canvas.getContext('2d');
    function _edRender() {
      const T = TSIZE;
      ctx.fillStyle = '#1a2a15';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      // Grid
      ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=0.5;
      for(let r=0;r<=rows;r++){ctx.beginPath();ctx.moveTo(0,r*T);ctx.lineTo(cols*T,r*T);ctx.stroke();}
      for(let c=0;c<=cols;c++){ctx.beginPath();ctx.moveTo(c*T,0);ctx.lineTo(c*T,rows*T);ctx.stroke();}
      // Path tiles
      for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
        if (_edState.tiles[r][c]===1) {
          const bg=ctx.createLinearGradient(c*T,r*T,c*T+T,r*T+T);
          bg.addColorStop(0,'#8a6a40'); bg.addColorStop(1,'#5a4020');
          ctx.fillStyle=bg; ctx.fillRect(c*T,r*T,T,T);
          ctx.strokeStyle='rgba(0,0,0,0.3)'; ctx.lineWidth=0.5;
          ctx.strokeRect(c*T+0.5,r*T+0.5,T-1,T-1);
        }
      }
      // Spawn
      if (_edState.spawn) {
        const [sc,sr]=_edState.spawn;
        ctx.fillStyle='rgba(39,174,96,0.7)';ctx.fillRect(sc*T,sr*T,T,T);
        ctx.fillStyle='#fff';ctx.font=`bold ${T*0.5}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText('S',sc*T+T/2,sr*T+T/2);
      }
      // End
      if (_edState.end) {
        const [ec,er]=_edState.end;
        ctx.fillStyle='rgba(192,57,43,0.7)';ctx.fillRect(ec*T,er*T,T,T);
        ctx.fillStyle='#fff';ctx.font=`bold ${T*0.5}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText('E',ec*T+T/2,er*T+T/2);
      }
    }

    function _edGetCell(e) {
      const rect=canvas.getBoundingClientRect();
      const x=(e.clientX-rect.left)*cols*TSIZE/rect.width;
      const y=(e.clientY-rect.top)*rows*TSIZE/rect.height;
      return [Math.floor(x/TSIZE), Math.floor(y/TSIZE)];
    }

    function _edApply(c,r) {
      if(c<0||c>=cols||r<0||r>=rows) return;
      const t=_edState.tool;
      if(t==='path')  { _edState.tiles[r][c]=1; }
      if(t==='erase') { _edState.tiles[r][c]=0; if(_edState.spawn&&_edState.spawn[0]===c&&_edState.spawn[1]===r)_edState.spawn=null; if(_edState.end&&_edState.end[0]===c&&_edState.end[1]===r)_edState.end=null; }
      if(t==='spawn') { _edState.tiles[r][c]=1; _edState.spawn=[c,r]; }
      if(t==='end')   { _edState.tiles[r][c]=1; _edState.end=[c,r]; }
      _edValidate();
      _edRender();
    }

    canvas.onmousedown=e=>{ _edState.painting=true; const [c,r]=_edGetCell(e); _edApply(c,r); };
    canvas.onmousemove=e=>{ if(_edState.painting){ const [c,r]=_edGetCell(e); _edApply(c,r); }};
    canvas.onmouseup=canvas.onmouseleave=()=>{ _edState.painting=false; };

    document.querySelectorAll('.ed-tool').forEach(b=>b.onclick=()=>{
      document.querySelectorAll('.ed-tool').forEach(x=>x.classList.remove('active'));
      b.classList.add('active'); _edState.tool=b.dataset.tool;
    });

    document.getElementById('edClear').onclick=()=>{ _edState.tiles=Array.from({length:rows},()=>Array(cols).fill(0)); _edState.spawn=null; _edState.end=null; _edValidate(); _edRender(); };
    document.getElementById('edUndo').onclick=()=>{
      if(_edState.history.length===0) return;
      _edState.tiles=_edState.history.pop();
      _edValidate(); _edRender();
    };
    document.getElementById('edPlay').onclick=()=>{ _edLaunchCustom(); };
    document.getElementById('edTheme')?.addEventListener('change',e=>{ _edState.theme=e.target.value; _edRender(); });

    _edRender();
  }

  function _edValidate() {
    const hasPath = _edState.tiles.some(r=>r.some(c=>c===1));
    const ok = hasPath && _edState.spawn && _edState.end;
    const btn = document.getElementById('edPlay');
    if(btn) btn.disabled = !ok;
    const st = document.getElementById('edStatus');
    if(st){
      if(!hasPath) st.textContent='Draw a path first';
      else if(!_edState.spawn) st.textContent='Set a spawn point (🟢)';
      else if(!_edState.end) st.textContent='Set an end point (🔴)';
      else st.textContent='✅ Ready to test!';
    }
  }

  function _edLaunchCustom() {
    if(!_edState.spawn||!_edState.end) return;
    // Build path from BFS/flood fill connected path tiles starting from spawn
    const cols=_edState.cols, rows=_edState.rows;
    const tiles=_edState.tiles;
    const [sc,sr]=_edState.spawn;
    const [ec,er]=_edState.end;
    // Build adjacency list and BFS
    const visited=new Set();
    const queue=[[sc,sr,[]]];
    let foundPath=null;
    const key=(c,r)=>`${c},${r}`;
    visited.add(key(sc,sr));
    while(queue.length&&!foundPath){
      const [c,r,path]=queue.shift();
      const np=[...path,[c,r]];
      if(c===ec&&r===er){ foundPath=np; break; }
      [[0,-1],[0,1],[-1,0],[1,0]].forEach(([dc,dr])=>{
        const nc=c+dc,nr=r+dr;
        if(nc<0||nc>=cols||nr<0||nr>=rows) return;
        if(tiles[nr][nc]!==1) return;
        const k=key(nc,nr);
        if(visited.has(k)) return;
        visited.add(k); queue.push([nc,nr,np]);
      });
    }
    if(!foundPath||foundPath.length<3){ toast('No valid path from Spawn→End!','red'); return; }

    // Create custom map
    const customMap = {
      id:'custom', name:'CUSTOM MAP', theme:_edState.theme||'graveyard',
      difficulty:3, waves:20, unlocked:true,
      description:'Your custom map',
      bgColor:'#1a2a15', pathColor:'#6b5530',
      cols, rows, path:foundPath,
      startGold:200, livesStart:20, waveModifier:1.5,
    };
    // Inject into MAPS temporarily
    const existing=MAPS.findIndex(m=>m.id==='custom');
    if(existing>=0) MAPS[existing]=customMap; else MAPS.push(customMap);
    startGame('custom');
  }

  // ── PUBLIC ────────────────────────────────────
  return {
    init, showScreen, startGame,
    updateTowerPalette, showTowerInfo,
    unlockMap, unlockNextMap,
    announceWave, toast, refreshCanAfford,
    addOwnedTower: id => { ownedTowers.add(id); _saveLocalProgress(); },
    get ownedTowers() { return ownedTowers; },
  };

})();
