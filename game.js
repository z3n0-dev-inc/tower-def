/* ═══════════════════════════════════════════════
   game.js — Core game loop, state, rendering
   ═══════════════════════════════════════════════ */

const Game = (() => {
  // ── State ──────────────────────────────────────
  let canvas, ctx, map, tileSize;
  let towers = [], enemies = [], bullets = [];
  let waves = [], currentWaveIndex = 0;
  let waveActive = false, waveSpawnQueue = [], spawnTimer = 0;
  let money, lives, score, kills, wave;
  let gameOver = false, victory = false;
  let speed = 1;
  let selectedTower = null;
  let placingTower = null;   // tower def being placed
  let mouseX = 0, mouseY = 0;
  let hoverTile = null;
  let godMode = false;
  let lastTime = 0, raf = null;
  let totalCoinsEarned = 0;
  let targetMode = 'first';

  // Map render cache
  let mapCanvas = null, mapCtx = null;

  // ── Public API ─────────────────────────────────
  function init(mapId) {
    map = getMap(mapId);
    if (!map) return;

    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    tileSize = Math.min(
      Math.floor((window.innerWidth - 220) / map.cols),
      Math.floor((window.innerHeight - 52) / map.rows)
    );

    canvas.width  = map.cols * tileSize;
    canvas.height = map.rows * tileSize;

    // Init state
    money  = map.startGold;
    lives  = map.livesStart;
    score  = 0;
    kills  = 0;
    wave   = 0;
    towers = [];
    enemies = [];
    bullets = [];
    waveActive = false;
    waveSpawnQueue = [];
    spawnTimer = 0;
    currentWaveIndex = 0;
    gameOver = false;
    victory = false;
    godMode = false;
    selectedTower = null;
    placingTower = null;
    totalCoinsEarned = 0;

    waves = generateWaves(map.id, map.waves, map.waveModifier);

    _buildMapCache();
    _bindEvents();
    _updateHUD();
    _updateWavePreview();
    UI.updateTowerPalette(map);

    if (raf) cancelAnimationFrame(raf);
    lastTime = performance.now();
    raf = requestAnimationFrame(_loop);
  }

  function _buildMapCache() {
    mapCanvas = document.createElement('canvas');
    mapCanvas.width  = map.cols * tileSize;
    mapCanvas.height = map.rows * tileSize;
    mapCtx = mapCanvas.getContext('2d');
    _renderMap(mapCtx);
  }

  function _renderMap(c) {
    const w = map.cols * tileSize, h = map.rows * tileSize;
    c.fillStyle = map.grassColor;
    c.fillRect(0, 0, w, h);

    // Grass texture dots
    c.fillStyle = map.accentColor;
    const rng = mulberry32(42);
    for (let i = 0; i < 300; i++) {
      const x = rng() * w, y = rng() * h;
      c.fillRect(x, y, 2, 2);
    }

    // Grid lines (faint)
    c.strokeStyle = 'rgba(0,0,0,0.08)';
    c.lineWidth = 0.5;
    for (let col = 0; col <= map.cols; col++) {
      c.beginPath(); c.moveTo(col*tileSize, 0); c.lineTo(col*tileSize, h); c.stroke();
    }
    for (let row = 0; row <= map.rows; row++) {
      c.beginPath(); c.moveTo(0, row*tileSize); c.lineTo(w, row*tileSize); c.stroke();
    }

    // Draw path
    c.save();
    for (let i = 0; i < map.path.length - 1; i++) {
      const [c1, r1] = map.path[i];
      const [c2, r2] = map.path[i+1];
      const x1 = c1*tileSize + tileSize/2, y1 = r1*tileSize + tileSize/2;
      const x2 = c2*tileSize + tileSize/2, y2 = r2*tileSize + tileSize/2;
      c.strokeStyle = map.pathColor;
      c.lineWidth = tileSize * 0.9;
      c.lineCap = 'round';
      c.lineJoin = 'round';
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
    }

    // Path detail (edge darkening)
    c.strokeStyle = 'rgba(0,0,0,0.25)';
    c.lineWidth = tileSize * 0.9 + 4;
    c.globalAlpha = 0.15;
    for (let i = 0; i < map.path.length - 1; i++) {
      const [c1, r1] = map.path[i];
      const [c2, r2] = map.path[i+1];
      c.beginPath();
      c.moveTo(c1*tileSize + tileSize/2, r1*tileSize + tileSize/2);
      c.lineTo(c2*tileSize + tileSize/2, r2*tileSize + tileSize/2);
      c.stroke();
    }
    c.globalAlpha = 1;
    c.restore();

    // Decorations on grass tiles
    const decRng = mulberry32(99);
    const decos = map.decorations || [];
    if (decos.length > 0) {
      c.font = `${Math.floor(tileSize * 0.55)}px serif`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      let placed = 0;
      for (let row = 0; row < map.rows && placed < 22; row++) {
        for (let col = 0; col < map.cols && placed < 22; col++) {
          if (!map.pathSet.has(`${col},${row}`) && decRng() < 0.07) {
            const deco = decos[Math.floor(decRng() * decos.length)];
            c.globalAlpha = 0.55;
            c.fillText(deco, col*tileSize + tileSize/2, row*tileSize + tileSize/2);
            c.globalAlpha = 1;
            placed++;
          }
        }
      }
    }

    // Start / End markers
    const [sc, sr] = map.path[0];
    const [ec, er] = map.path[map.path.length-1];

    c.font = `bold ${Math.floor(tileSize*0.5)}px sans-serif`;
    c.textAlign = 'center'; c.textBaseline = 'middle';

    c.fillStyle = '#27ae60';
    c.beginPath();
    c.roundRect(sc*tileSize+2, sr*tileSize+2, tileSize-4, tileSize-4, 4);
    c.fill();
    c.fillStyle = '#fff';
    c.fillText('START', sc*tileSize + tileSize/2, sr*tileSize + tileSize/2);

    c.fillStyle = '#c0392b';
    c.beginPath();
    c.roundRect(ec*tileSize+2, er*tileSize+2, tileSize-4, tileSize-4, 4);
    c.fill();
    c.fillStyle = '#fff';
    c.fillText('END', ec*tileSize + tileSize/2, er*tileSize + tileSize/2);
  }

  // ── Game Loop ──────────────────────────────────
  function _loop(ts) {
    raf = requestAnimationFrame(_loop);
    const rawDt = Math.min((ts - lastTime) / 1000, 0.05);
    lastTime = ts;
    const dt = rawDt * speed;
    _update(dt);
    _draw();
  }

  function _update(dt) {
    if (gameOver || victory) return;

    // Spawn queue
    if (waveActive && waveSpawnQueue.length > 0) {
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        const e = waveSpawnQueue.shift();
        if (e) {
          enemies.push(new Enemy(e.type, map.path, tileSize, wave, map.waveModifier));
        }
        spawnTimer = e?.interval || 0.5;
      }
    }

    // Check wave complete
    if (waveActive && waveSpawnQueue.length === 0 && enemies.every(e => e.dead)) {
      waveActive = false;
      if (currentWaveIndex >= waves.length) {
        _triggerVictory();
        return;
      }
      document.getElementById('btnStartWave').classList.add('pulse-green');
    }

    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.update(dt, enemies);
      if (e.reachedEnd && !e.dead) {
        if (!godMode) {
          lives -= e.isBoss ? 3 : 1;
          if (lives <= 0) { lives = 0; _triggerGameOver(); return; }
        }
        _updateHUD();
      }
    }
    enemies = enemies.filter(e => !e.dead || e.reachedEnd);

    // Update towers
    const liveEnemies = enemies.filter(e => !e.dead);
    towers.forEach(t => {
      t.targetMode = targetMode;
      t.update(dt, liveEnemies);
      // Collect bullets from tower
      while (t.bullets.length > 0) {
        bullets.push(t.bullets.shift());
      }
    });

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].update(dt);
    }
    bullets = bullets.filter(b => !b.dead);

    // Collect dead enemies for rewards
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      if (e.dead && !e.reachedEnd && !e._rewarded) {
        e._rewarded = true;
        money += e.reward;
        score += e.reward * (e.isBoss ? 10 : 1);
        kills++;
        totalCoinsEarned += e.reward;
        _spawnDmgNum(e.x, e.y, `+${e.reward}`, false);
        _updateHUD();
      }
    }
    enemies = enemies.filter(e => !e._rewarded || !e.dead || e.reachedEnd).filter(e => !e.reachedEnd);
  }

  function _draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Map
    ctx.drawImage(mapCanvas, 0, 0);

    // Placement preview
    if (placingTower && hoverTile) {
      const [col, row] = hoverTile;
      const canPlace = _canPlace(col, row);

      ctx.fillStyle = canPlace ? 'rgba(39,174,96,0.35)' : 'rgba(192,57,43,0.35)';
      ctx.fillRect(col*tileSize, row*tileSize, tileSize, tileSize);

      // Range preview
      ctx.beginPath();
      ctx.arc(col*tileSize + tileSize/2, row*tileSize + tileSize/2, placingTower.range, 0, Math.PI*2);
      ctx.strokeStyle = canPlace ? 'rgba(39,174,96,0.6)' : 'rgba(192,57,43,0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = `${Math.floor(tileSize*0.55)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(placingTower.icon, col*tileSize + tileSize/2, row*tileSize + tileSize/2);
    }

    // Towers
    towers.forEach(t => t.draw(ctx));

    // Enemies
    enemies.forEach(e => e.draw(ctx));

    // Bullets
    bullets.forEach(b => b.draw(ctx));

    // Mouse cursor tile highlight
    if (!placingTower && hoverTile) {
      const [col, row] = hoverTile;
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.strokeRect(col*tileSize+0.5, row*tileSize+0.5, tileSize-1, tileSize-1);
    }
  }

  // ── Events ─────────────────────────────────────
  function _bindEvents() {
    canvas.onclick = _onCanvasClick;
    canvas.onmousemove = _onMouseMove;
    canvas.oncontextmenu = e => { e.preventDefault(); _cancelPlacement(); };

    document.getElementById('btnStartWave').onclick = startNextWave;
    document.getElementById('btnSpeed').onclick = toggleSpeed;
    document.getElementById('btnBackMenu').onclick = () => {
      if (confirm('Return to menu? Progress will be saved.')) {
        stopGame();
        UI.showScreen('menu');
      }
    };
    document.getElementById('btnUpgrade').onclick = upgradeTower;
    document.getElementById('btnSell').onclick = sellTower;
    document.getElementById('btnDeselect').onclick = deselectTower;
    document.getElementById('btnRetry').onclick = () => {
      document.getElementById('gameOverScreen').classList.add('hidden');
      init(map.id);
    };
    document.getElementById('btnGoMenu').onclick = () => {
      document.getElementById('gameOverScreen').classList.add('hidden');
      stopGame(); UI.showScreen('menu');
    };
    document.getElementById('btnNextMap').onclick = () => {
      document.getElementById('victoryScreen').classList.add('hidden');
      const nextIndex = MAPS.findIndex(m => m.id === map.id) + 1;
      if (nextIndex < MAPS.length) {
        UI.startGame(MAPS[nextIndex].id);
      } else {
        stopGame(); UI.showScreen('menu');
      }
    };
    document.getElementById('btnVicMenu').onclick = () => {
      document.getElementById('victoryScreen').classList.add('hidden');
      stopGame(); UI.showScreen('menu');
    };

    // Target mode buttons
    document.querySelectorAll('.tgt-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.tgt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        targetMode = btn.dataset.tgt;
      };
    });
  }

  function _onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    mouseX = (e.clientX - rect.left) * scaleX;
    mouseY = (e.clientY - rect.top) * scaleY;

    const col = Math.floor(mouseX / tileSize);
    const row = Math.floor(mouseY / tileSize);
    if (col >= 0 && col < map.cols && row >= 0 && row < map.rows) {
      hoverTile = [col, row];
    } else {
      hoverTile = null;
    }
  }

  function _onCanvasClick(e) {
    if (!hoverTile) return;
    const [col, row] = hoverTile;

    if (placingTower) {
      if (_canPlace(col, row)) {
        if (money < placingTower.cost) {
          UI.toast('Not enough money!', 'red');
          return;
        }
        const t = new Tower(placingTower, col, row, tileSize);
        towers.push(t);
        money -= placingTower.cost;
        _updateHUD();
        UI.toast(`${placingTower.name} placed!`, 'green');
      } else {
        UI.toast("Can't place here!", 'red');
      }
      _cancelPlacement();
      return;
    }

    // Select tower
    const clicked = towers.find(t => t.tileX === col && t.tileY === row);
    if (clicked) {
      towers.forEach(t => t.selected = false);
      clicked.selected = true;
      selectedTower = clicked;
      UI.showTowerInfo(clicked);
    } else {
      deselectTower();
    }
  }

  function _canPlace(col, row) {
    if (map.pathSet.has(`${col},${row}`)) return false;
    if (towers.some(t => t.tileX === col && t.tileY === row)) return false;
    if (col < 0 || col >= map.cols || row < 0 || row >= map.rows) return false;
    return true;
  }

  function _cancelPlacement() {
    placingTower = null;
    document.querySelectorAll('.tp-item').forEach(el => el.classList.remove('selected'));
    canvas.style.cursor = 'crosshair';
  }

  // ── Actions ────────────────────────────────────
  function selectTowerToPlace(towerId) {
    const def = getTowerDef(towerId);
    if (!def) return;
    deselectTower();
    if (placingTower?.id === towerId) { _cancelPlacement(); return; }
    placingTower = def;
    canvas.style.cursor = 'none';
    document.querySelectorAll('.tp-item').forEach(el => {
      el.classList.toggle('selected', el.dataset.id === towerId);
    });
  }

  function upgradeTower() {
    if (!selectedTower) return;
    const cost = selectedTower.getUpgradeCost();
    if (cost === null) { UI.toast('Max level!', 'gold'); return; }
    if (money < cost) { UI.toast('Not enough money!', 'red'); return; }
    money -= cost;
    selectedTower.upgrade();
    UI.showTowerInfo(selectedTower);
    _updateHUD();
    UI.toast('Tower upgraded!', 'green');
  }

  function sellTower() {
    if (!selectedTower) return;
    const val = selectedTower.getSellValue();
    money += val;
    towers = towers.filter(t => t !== selectedTower);
    deselectTower();
    _updateHUD();
    UI.toast(`Sold for 💰${val}`, 'gold');
  }

  function deselectTower() {
    towers.forEach(t => t.selected = false);
    selectedTower = null;
    document.getElementById('selPanel').style.display = 'none';
  }

  function startNextWave() {
    if (waveActive) return;
    if (currentWaveIndex >= waves.length) return;

    const waveData = waves[currentWaveIndex];
    wave = waveData.number;
    currentWaveIndex++;

    // Build spawn queue
    waveSpawnQueue = [];
    waveData.enemies.forEach(group => {
      for (let i = 0; i < group.count; i++) {
        waveSpawnQueue.push({ type: group.type, interval: group.interval });
      }
    });

    waveActive = true;
    spawnTimer = 0.5;
    _updateHUD();
    _updateWavePreview();
    document.getElementById('btnStartWave').classList.remove('pulse-green');

    // Wave announce
    UI.announceWave(wave, waveData.isBossWave);
  }

  function toggleSpeed() {
    const speeds = [1, 2, 3];
    const idx = speeds.indexOf(speed);
    speed = speeds[(idx+1) % speeds.length];
    document.getElementById('btnSpeed').textContent = speed + '×';
  }

  function stopGame() {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  function _triggerGameOver() {
    gameOver = true;
    stopGame();
    // Save result
    PF.saveGameResult(wave, score, kills, totalCoinsEarned);
    UI.unlockMap(map.id, false);

    setTimeout(() => {
      document.getElementById('goWave').textContent = wave;
      document.getElementById('goScore').textContent = score.toLocaleString();
      document.getElementById('goKills').textContent = kills;
      document.getElementById('goCoins').textContent = totalCoinsEarned;
      document.getElementById('gameOverScreen').classList.remove('hidden');
    }, 600);
  }

  function _triggerVictory() {
    victory = true;
    stopGame();
    PF.saveGameResult(wave, score, kills, totalCoinsEarned);
    UI.unlockNextMap(map.id);

    const stars = score > map.waves * 200 ? '⭐⭐⭐' : score > map.waves * 100 ? '⭐⭐' : '⭐';
    setTimeout(() => {
      document.getElementById('vicStars').textContent = stars;
      document.getElementById('vicMsg').textContent = `${map.name} complete! +${totalCoinsEarned} coins`;
      document.getElementById('victoryScreen').classList.remove('hidden');
    }, 800);
  }

  function _spawnDmgNum(x, y, text, isCrit) {
    const el = document.createElement('div');
    el.className = 'dmg-num' + (isCrit ? ' crit' : '');
    el.textContent = text;
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width / canvas.width;
    const scaleY = rect.height / canvas.height;
    el.style.left = (x * scaleX + rect.left - canvas.parentElement.getBoundingClientRect().left) + 'px';
    el.style.top  = (y * scaleY + rect.top  - canvas.parentElement.getBoundingClientRect().top) + 'px';
    document.getElementById('dmgLayer').appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  function _updateHUD() {
    document.getElementById('hudMoney').textContent = money;
    document.getElementById('hudLives').textContent = lives;
    document.getElementById('hudWave').textContent  = wave || '—';
    document.getElementById('hudKills').textContent = kills;
    document.getElementById('hudScore').textContent = score.toLocaleString();
  }

  function _updateWavePreview() {
    const panel = document.getElementById('wavePreview');
    if (currentWaveIndex >= waves.length) { panel.innerHTML = '<span>All waves cleared!</span>'; return; }
    const next = waves[currentWaveIndex];
    const counts = {};
    next.enemies.forEach(g => { counts[g.type] = (counts[g.type]||0) + g.count; });
    let html = `<div class="wp-row"><span>WAVE ${next.number}/${waves.length}</span></div>`;
    Object.entries(counts).forEach(([type, count]) => {
      const def = ENEMY_TYPES[type];
      html += `<div class="wp-row"><span>${def.icon} ${def.name}</span><strong>×${count}</strong></div>`;
    });
    if (next.isBossWave) html += '<div style="color:#f1c40f;font-weight:700">⚠ BOSS WAVE</div>';
    panel.innerHTML = html;
  }

  // ── Owner commands ─────────────────────────────
  function ownerAddMoney(amount) {
    money += amount;
    _updateHUD();
  }
  function ownerSkipWave() {
    enemies.forEach(e => { e.dead = true; e._rewarded = true; });
    enemies = [];
    waveActive = false;
    waveSpawnQueue = [];
  }
  function ownerNukeEnemies() { ownerSkipWave(); }
  function ownerGodMode()     { godMode = !godMode; UI.toast('God Mode: ' + (godMode?'ON':'OFF'), godMode?'green':'red'); }

  // ── Expose ─────────────────────────────────────
  return {
    init, stopGame, selectTowerToPlace,
    upgradeTower, sellTower, deselectTower,
    startNextWave, toggleSpeed,
    ownerAddMoney, ownerSkipWave, ownerNukeEnemies, ownerGodMode,
    get money()  { return money; },
    get lives()  { return lives; },
    get wave()   { return wave; },
    get score()  { return score; },
    get mapId()  { return map?.id; },
    isRunning:   () => !!raf,
  };

})();

// ── Simple seedable RNG ───────────────────────────────────
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 0xFFFFFFFF;
  };
}
