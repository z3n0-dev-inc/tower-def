/* ═══════════════════════════════════════════════
   game.js — Core game loop, state, rendering (improved)
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
  let placingTower = null;
  let mouseX = 0, mouseY = 0;
  let hoverTile = null;
  let godMode = false;
  let lastTime = 0, raf = null;
  let totalCoinsEarned = 0;
  let targetMode = 'first';

  // Screen shake
  let shakeAmount = 0, shakeX = 0, shakeY = 0;

  // Kill feed (recent kills shown HUD right)
  let killFeed = [];

  // Interest income accumulator
  let interestAccum = 0;

  // Map render cache
  let mapCanvas = null, mapCtx = null;

  // Last placed tower (for undo)
  let lastPlaced = null;

  // ── Public API ─────────────────────────────────
  function init(mapId) {
    map = getMap(mapId);
    if (!map) return;

    canvas = document.getElementById('gameCanvas');
    ctx    = canvas.getContext('2d');

    tileSize = Math.min(
      Math.floor((window.innerWidth - 220) / map.cols),
      Math.floor((window.innerHeight - 52) / map.rows)
    );

    canvas.width  = map.cols * tileSize;
    canvas.height = map.rows * tileSize;

    money  = map.startGold;
    lives  = map.livesStart;
    score  = 0; kills = 0; wave = 0;
    towers = []; enemies = []; bullets = [];
    waveActive = false; waveSpawnQueue = []; spawnTimer = 0;
    currentWaveIndex = 0; gameOver = false; victory = false;
    godMode = false; selectedTower = null; placingTower = null;
    totalCoinsEarned = 0; shakeAmount = 0; killFeed = [];
    interestAccum = 0; lastPlaced = null;

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
    for (let i = 0; i < 400; i++) {
      const gx = rng() * w, gy = rng() * h;
      c.fillRect(gx, gy, rng() < 0.3 ? 3 : 2, rng() < 0.3 ? 3 : 2);
    }

    // Grid lines (faint)
    c.strokeStyle = 'rgba(0,0,0,0.07)';
    c.lineWidth = 0.5;
    for (let col = 0; col <= map.cols; col++) {
      c.beginPath(); c.moveTo(col*tileSize,0); c.lineTo(col*tileSize,h); c.stroke();
    }
    for (let row = 0; row <= map.rows; row++) {
      c.beginPath(); c.moveTo(0,row*tileSize); c.lineTo(w,row*tileSize); c.stroke();
    }

    // Draw path with width
    c.save();
    // Outer edge glow
    c.strokeStyle = 'rgba(0,0,0,0.3)';
    c.lineWidth = tileSize * 0.92 + 6;
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (let i = 0; i < map.path.length - 1; i++) {
      const [c1,r1] = map.path[i], [c2,r2] = map.path[i+1];
      c.beginPath();
      c.moveTo(c1*tileSize+tileSize/2, r1*tileSize+tileSize/2);
      c.lineTo(c2*tileSize+tileSize/2, r2*tileSize+tileSize/2);
      c.stroke();
    }
    // Path fill
    c.strokeStyle = map.pathColor;
    c.lineWidth = tileSize * 0.88;
    for (let i = 0; i < map.path.length - 1; i++) {
      const [c1,r1] = map.path[i], [c2,r2] = map.path[i+1];
      c.beginPath();
      c.moveTo(c1*tileSize+tileSize/2, r1*tileSize+tileSize/2);
      c.lineTo(c2*tileSize+tileSize/2, r2*tileSize+tileSize/2);
      c.stroke();
    }
    c.restore();

    // Decorations on grass tiles
    const decRng = mulberry32(99);
    const decos = map.decorations || [];
    if (decos.length > 0) {
      c.font = `${Math.floor(tileSize * 0.52)}px serif`;
      c.textAlign = 'center'; c.textBaseline = 'middle';
      let placed = 0;
      for (let row = 0; row < map.rows && placed < 28; row++) {
        for (let col = 0; col < map.cols && placed < 28; col++) {
          if (!map.pathSet.has(`${col},${row}`) && decRng() < 0.07) {
            c.globalAlpha = 0.5;
            c.fillText(decos[Math.floor(decRng() * decos.length)],
              col*tileSize+tileSize/2, row*tileSize+tileSize/2);
            c.globalAlpha = 1;
            placed++;
          }
        }
      }
    }

    // Start / End markers
    const [sc, sr] = map.path[0];
    const [ec, er] = map.path[map.path.length-1];

    c.font = `bold ${Math.floor(tileSize*0.45)}px sans-serif`;
    c.textAlign = 'center'; c.textBaseline = 'middle';

    c.fillStyle = '#27ae60';
    c.beginPath();
    c.roundRect(sc*tileSize+2, sr*tileSize+2, tileSize-4, tileSize-4, 4);
    c.fill();
    c.fillStyle = '#fff';
    c.fillText('START', sc*tileSize+tileSize/2, sr*tileSize+tileSize/2);

    c.fillStyle = '#c0392b';
    c.beginPath();
    c.roundRect(ec*tileSize+2, er*tileSize+2, tileSize-4, tileSize-4, 4);
    c.fill();
    c.fillStyle = '#fff';
    c.fillText('END', ec*tileSize+tileSize/2, er*tileSize+tileSize/2);
  }

  // ── Game Loop ──────────────────────────────────
  function _loop(ts) {
    raf = requestAnimationFrame(_loop);
    const rawDt = Math.min((ts - lastTime) / 1000, 0.05);
    lastTime = ts;
    const dt = rawDt * speed;
    _update(dt, rawDt);
    _draw();
  }

  function _update(dt, rawDt) {
    if (gameOver || victory) return;

    // Screen shake decay
    shakeAmount = Math.max(0, shakeAmount - rawDt * 12);
    shakeX = (Math.random() - 0.5) * shakeAmount;
    shakeY = (Math.random() - 0.5) * shakeAmount;

    // Kill feed age-out
    killFeed = killFeed.filter(k => k.age < 3.5);
    killFeed.forEach(k => k.age += rawDt);

    // Spawn queue
    if (waveActive && waveSpawnQueue.length > 0) {
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        const e = waveSpawnQueue.shift();
        if (e) {
          enemies.push(new Enemy(e.type, map.path, tileSize, wave, map.waveModifier));
          spawnTimer = e.interval || 0.5;
        } else {
          spawnTimer = 0.5;
        }
      }
    }

    // Wave complete check
    if (waveActive && waveSpawnQueue.length === 0 && enemies.length === 0) {
      waveActive = false;

      // Interest income between waves (5% of current gold, min 10)
      const interest = Math.max(10, Math.floor(money * 0.05));
      money += interest;
      _updateHUD();
      _floatText(`+${interest} interest 📈`, 'gold');

      if (currentWaveIndex >= waves.length) {
        _triggerVictory();
        return;
      }
      document.getElementById('btnStartWave').classList.add('pulse-green');
    }

    // Update enemies + collect pending boss spawns
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.update(dt, enemies);

      // Boss summon: inject new enemies at current position
      if (e.pendingSpawns && e.pendingSpawns.length > 0) {
        const spawn = e.pendingSpawns.shift();
        const minion = new Enemy(spawn.type, map.path, tileSize, wave, map.waveModifier);
        minion.pathIndex = Math.max(0, spawn.pathIndex - 1);
        minion.isSummoned = true;
        minion.x = e.x + (Math.random() - 0.5) * tileSize;
        minion.y = e.y + (Math.random() - 0.5) * tileSize;
        minion._updateTarget && minion._updateTarget();
        enemies.push(minion);
      }

      // Boss stomp shockwave: slow all nearby enemies and shake screen
      if (e.stompTrigger) {
        e.stompTrigger = false;
        shakeAmount = 12;
        _floatText('💥 STOMP!', 'red');
        // All player's bullets get cleared (shockwave knocks them away)
        bullets = bullets.filter(b => Math.hypot(b.x - e.x, b.y - e.y) > 80);
      }
    }

    // Enemies reaching end: deduct lives
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      if (e.reachedEnd && !e._lifeLost) {
        e._lifeLost = true;
        if (!godMode) {
          lives -= e.isBoss ? 3 : 1;
          shakeAmount = e.isBoss ? 16 : 6;
          if (lives <= 0) { lives = 0; _triggerGameOver(); return; }
        }
        _updateHUD();
      }
    }

    // Collect dead enemies for rewards
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      if (e.dead && !e.reachedEnd && !e._rewarded) {
        e._rewarded = true;
        money += e.reward;
        score += e.reward * (e.isBoss ? 10 : 1);
        kills++;
        totalCoinsEarned += e.reward;
        _spawnDmgNum(e.x, e.y, `+${e.reward}💰`, false);
        if (e.isBoss) {
          shakeAmount = 18;
          killFeed.unshift({ text:`💀 ${e.name}`, age:0, boss:true });
          _floatText(`🎉 ${e.name} defeated! +${e.reward}`, 'gold');
        } else if (kills % 10 === 0) {
          killFeed.unshift({ text:`⚡ ${kills} kills!`, age:0, boss:false });
        }
        _updateHUD();
      }
    }

    enemies = enemies.filter(e => !e.dead && !e.reachedEnd);

    // Aura towers: compute buffs for nearby towers
    towers.forEach(t => t.auraBuff = 1.0);
    towers.forEach(t => {
      if (t.def.aura) {
        towers.forEach(other => {
          if (other === t) return;
          const d = Math.hypot(other.x - t.x, other.y - t.y);
          if (d <= t.range * 0.8) {
            other.auraBuff = Math.max(other.auraBuff, 1.0 + (t.def.auraBonus || 0.5));
          }
        });
      }
    });

    // Update towers
    const liveEnemies = enemies.filter(e => !e.dead);
    towers.forEach(t => {
      t.targetMode = targetMode;
      t.update(dt, liveEnemies);
      while (t.bullets.length > 0) bullets.push(t.bullets.shift());
    });

    // Update bullets
    for (let i = bullets.length - 1; i >= 0; i--) bullets[i].update(dt);
    bullets = bullets.filter(b => !b.dead);
  }

  function _draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    if (shakeAmount > 0) ctx.translate(shakeX, shakeY);

    // Map
    ctx.drawImage(mapCanvas, 0, 0);

    // Placement preview
    if (placingTower && hoverTile) {
      const [col, row] = hoverTile;
      const canPlace = _canPlace(col, row);

      ctx.fillStyle = canPlace ? 'rgba(39,174,96,0.32)' : 'rgba(192,57,43,0.32)';
      ctx.fillRect(col*tileSize, row*tileSize, tileSize, tileSize);

      // Range circle
      ctx.beginPath();
      ctx.arc(col*tileSize+tileSize/2, row*tileSize+tileSize/2, placingTower.range, 0, Math.PI*2);
      ctx.strokeStyle = canPlace ? 'rgba(39,174,96,0.55)' : 'rgba(192,57,43,0.55)';
      ctx.fillStyle   = canPlace ? 'rgba(39,174,96,0.06)' : 'rgba(192,57,43,0.06)';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      ctx.font = `${Math.floor(tileSize*0.55)}px serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(placingTower.icon, col*tileSize+tileSize/2, row*tileSize+tileSize/2);

      // Cost label
      ctx.font = `bold ${Math.floor(tileSize*0.28)}px sans-serif`;
      ctx.fillStyle = money >= placingTower.cost ? '#2ecc71' : '#e74c3c';
      ctx.fillText(`💰${placingTower.cost}`, col*tileSize+tileSize/2, row*tileSize+tileSize*0.82);
    }

    // Hover: show range for tower under cursor
    if (!placingTower && hoverTile) {
      const [col, row] = hoverTile;
      const hovered = towers.find(t => t.tileX === col && t.tileY === row);
      if (hovered && !hovered.selected) {
        ctx.beginPath();
        ctx.arc(hovered.x, hovered.y, hovered.range, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    towers.forEach(t => t.draw(ctx));
    enemies.forEach(e => e.draw(ctx));
    bullets.forEach(b => b.draw(ctx));

    // Hover tile highlight (when not placing)
    if (!placingTower && hoverTile) {
      const [col, row] = hoverTile;
      ctx.strokeStyle = 'rgba(255,255,255,0.09)';
      ctx.lineWidth = 1;
      ctx.strokeRect(col*tileSize+0.5, row*tileSize+0.5, tileSize-1, tileSize-1);
    }

    // Kill feed (drawn on canvas, top-right)
    _drawKillFeed(ctx);

    ctx.restore();

    // Boss bar (DOM overlay, updated each frame)
    _updateBossBar();
  }

  function _updateBossBar() {
    const bar   = document.getElementById('bossBar');
    const boss  = enemies.find(e => e.isBoss && !e.dead);
    if (boss) {
      bar.classList.add('visible');
      document.getElementById('bossBarLabel').textContent = `${boss.icon} ${boss.name}`;
      document.getElementById('bossBarHp').textContent    = `${Math.ceil(boss.hp)} / ${boss.maxHp}`;
      document.getElementById('bossBarFill').style.width  = `${(boss.hp / boss.maxHp) * 100}%`;
    } else {
      bar.classList.remove('visible');
    }
  }

  function _drawKillFeed(c) {
    if (killFeed.length === 0) return;
    const W = canvas.width;
    killFeed.slice(0, 5).forEach((k, i) => {
      const alpha = Math.max(0, 1 - k.age / 3.5);
      c.globalAlpha = alpha;
      c.font = `bold ${k.boss ? 14 : 12}px var(--f-hdr)`;
      c.textAlign = 'right';
      c.fillStyle = k.boss ? '#f1c40f' : '#e74c3c';
      c.fillText(k.text, W - 12, 18 + i * 22);
    });
    c.globalAlpha = 1;
    c.textAlign = 'left';
  }

  // ── Events ─────────────────────────────────────
  function _bindEvents() {
    canvas.onclick      = _onCanvasClick;
    canvas.onmousemove  = _onMouseMove;
    canvas.oncontextmenu = e => { e.preventDefault(); _cancelPlacement(); };
    canvas.onmouseleave  = () => { hoverTile = null; };

    document.getElementById('btnStartWave').onclick = startNextWave;
    document.getElementById('btnSpeed').onclick     = toggleSpeed;
    document.getElementById('btnBackMenu').onclick  = () => {
      if (confirm('Return to menu? Progress will be saved.')) {
        stopGame(); UI.showScreen('menu');
      }
    };
    document.getElementById('btnUpgrade').onclick  = upgradeTower;
    document.getElementById('btnSell').onclick     = sellTower;
    document.getElementById('btnDeselect').onclick = deselectTower;
    document.getElementById('btnRetry').onclick    = () => {
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
      if (nextIndex < MAPS.length) UI.startGame(MAPS[nextIndex].id);
      else { stopGame(); UI.showScreen('menu'); }
    };
    document.getElementById('btnVicMenu').onclick = () => {
      document.getElementById('victoryScreen').classList.add('hidden');
      stopGame(); UI.showScreen('menu');
    };

    document.querySelectorAll('.tgt-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.tgt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        targetMode = btn.dataset.tgt;
        if (selectedTower) selectedTower.targetMode = targetMode;
      };
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', _onKey);
  }

  function _onKey(e) {
    if (!raf) return; // game not running
    switch (e.key) {
      case ' ':     e.preventDefault(); startNextWave(); break;
      case 'Escape': _cancelPlacement(); deselectTower(); break;
      case 'u': case 'U': _undoLastTower(); break;
      case 's': case 'S': if (selectedTower) sellTower(); break;
      case 'g': case 'G': if (selectedTower) upgradeTower(); break;
      case '1': document.querySelectorAll('.tgt-btn')[0]?.click(); break;
      case '2': document.querySelectorAll('.tgt-btn')[1]?.click(); break;
      case '3': document.querySelectorAll('.tgt-btn')[2]?.click(); break;
      case '4': document.querySelectorAll('.tgt-btn')[3]?.click(); break;
    }
  }

  function _onMouseMove(e) {
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    mouseX = (e.clientX - rect.left) * scaleX;
    mouseY = (e.clientY - rect.top)  * scaleY;

    const col = Math.floor(mouseX / tileSize);
    const row = Math.floor(mouseY / tileSize);
    hoverTile = (col >= 0 && col < map.cols && row >= 0 && row < map.rows) ? [col, row] : null;
  }

  function _onCanvasClick(e) {
    if (!hoverTile) return;
    const [col, row] = hoverTile;

    if (placingTower) {
      if (_canPlace(col, row)) {
        if (money < placingTower.cost) { UI.toast('Not enough money!', 'red'); return; }
        const t = new Tower(placingTower, col, row, tileSize);
        towers.push(t);
        lastPlaced = t;
        money -= placingTower.cost;
        _updateHUD();
        UI.toast(`${placingTower.icon} ${placingTower.name} placed!`, 'green');
      } else {
        UI.toast("Can't place there!", 'red');
      }
      _cancelPlacement();
      return;
    }

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
    if (cost === null) { UI.toast('Already max level!', 'gold'); return; }
    if (money < cost) { UI.toast('Not enough money!', 'red'); return; }
    money -= cost;
    selectedTower.upgrade();
    UI.showTowerInfo(selectedTower);
    _updateHUD();
    UI.toast(`⬆ ${selectedTower.def.upgrades[selectedTower.level - 1].name}!`, 'green');
  }

  function sellTower() {
    if (!selectedTower) return;
    const val = selectedTower.getSellValue();
    money += val;
    towers = towers.filter(t => t !== selectedTower);
    if (lastPlaced === selectedTower) lastPlaced = null;
    deselectTower();
    _updateHUD();
    UI.toast(`💰 Sold for ${val}`, 'gold');
  }

  function deselectTower() {
    towers.forEach(t => t.selected = false);
    selectedTower = null;
    document.getElementById('selPanel').style.display = 'none';
  }

  function _undoLastTower() {
    if (!lastPlaced || !towers.includes(lastPlaced)) return;
    const refund = lastPlaced.def.cost;
    towers = towers.filter(t => t !== lastPlaced);
    money += refund;
    if (selectedTower === lastPlaced) deselectTower();
    lastPlaced = null;
    _updateHUD();
    UI.toast('↩ Tower refunded', 'gold');
  }

  function startNextWave() {
    if (waveActive) return;
    if (currentWaveIndex >= waves.length) return;

    const waveData = waves[currentWaveIndex];
    wave = waveData.number;
    currentWaveIndex++;

    waveSpawnQueue = [];
    waveData.enemies.forEach(group => {
      for (let i = 0; i < group.count; i++) {
        waveSpawnQueue.push({ type: group.type, interval: group.interval });
      }
    });

    waveActive  = true;
    spawnTimer  = 0.5;
    lastPlaced  = null; // can't undo across waves
    _updateHUD();
    _updateWavePreview();
    document.getElementById('btnStartWave').classList.remove('pulse-green');
    UI.announceWave(wave, waveData.isBossWave);
  }

  function toggleSpeed() {
    const speeds = [1, 2, 3];
    const idx = speeds.indexOf(speed);
    speed = speeds[(idx + 1) % speeds.length];
    document.getElementById('btnSpeed').textContent = speed + '×';
  }

  function stopGame() {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    document.removeEventListener('keydown', _onKey);
    const bar = document.getElementById('bossBar');
    if (bar) bar.classList.remove('visible');
  }

  function _triggerGameOver() {
    gameOver = true;
    stopGame();
    shakeAmount = 24;
    PF.saveGameResult(wave, score, kills, totalCoinsEarned);
    UI.unlockMap(map.id, false);

    setTimeout(() => {
      document.getElementById('goWave').textContent  = wave;
      document.getElementById('goScore').textContent = score.toLocaleString();
      document.getElementById('goKills').textContent = kills;
      document.getElementById('goCoins').textContent = totalCoinsEarned;
      document.getElementById('gameOverScreen').classList.remove('hidden');
    }, 700);
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
    const rect   = canvas.getBoundingClientRect();
    const scaleX = rect.width  / canvas.width;
    const scaleY = rect.height / canvas.height;
    const parent = canvas.parentElement.getBoundingClientRect();
    el.style.left = (x * scaleX + rect.left - parent.left) + 'px';
    el.style.top  = (y * scaleY + rect.top  - parent.top) + 'px';
    document.getElementById('dmgLayer').appendChild(el);
    setTimeout(() => el.remove(), 950);
  }

  function _floatText(msg, type = '') {
    const colors = { gold:'var(--amber3)', red:'var(--red2)', green:'var(--grn2)', '':'var(--txt)' };
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; top:80px; left:50%; transform:translateX(-50%);
      font-family:var(--f-hdr); font-size:20px; letter-spacing:3px;
      color:${colors[type]||colors['']}; text-shadow:0 2px 8px rgba(0,0,0,0.8);
      pointer-events:none; z-index:9000;
      animation:floatUp 1.8s ease-out forwards;
    `;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1900);
    if (!document.getElementById('_floatKf')) {
      const s = document.createElement('style'); s.id = '_floatKf';
      s.textContent = `@keyframes floatUp{from{opacity:1;transform:translateX(-50%) translateY(0)}to{opacity:0;transform:translateX(-50%) translateY(-55px)}}`;
      document.head.appendChild(s);
    }
  }

  function _updateHUD() {
    document.getElementById('hudMoney').textContent = money;
    document.getElementById('hudLives').textContent = lives;
    document.getElementById('hudWave').textContent  = wave || '—';
    document.getElementById('hudKills').textContent = kills;
    document.getElementById('hudScore').textContent = score.toLocaleString();

    // Flash lives red if low
    const livesEl = document.getElementById('hudLives');
    livesEl.parentElement.style.borderColor = lives <= 3 ? 'rgba(231,76,60,0.7)' : '';
  }

  function _updateWavePreview() {
    const panel = document.getElementById('wavePreview');
    if (currentWaveIndex >= waves.length) {
      panel.innerHTML = '<span style="color:#2ecc71">✓ All waves cleared!</span>';
      return;
    }
    const next = waves[currentWaveIndex];
    const counts = {};
    next.enemies.forEach(g => { counts[g.type] = (counts[g.type] || 0) + g.count; });
    let html = `<div class="wp-row"><span>WAVE ${next.number}/${waves.length}</span>${next.isBossWave ? '<strong style="color:#f1c40f">⚠ BOSS</strong>' : ''}</div>`;
    Object.entries(counts).forEach(([type, count]) => {
      const def = ENEMY_TYPES[type];
      html += `<div class="wp-row"><span>${def.icon} ${def.name}</span><strong>×${count}</strong></div>`;
    });
    panel.innerHTML = html;
  }

  // ── Owner commands ─────────────────────────────
  function ownerAddMoney(amount) {
    money += amount;
    _updateHUD();
    _floatText(`+$${amount} OWNER CASH 💰`, 'gold');
  }

  function ownerSkipWave() {
    enemies = []; bullets = [];
    waveActive = false; waveSpawnQueue = [];
    _floatText('⏭ WAVE SKIPPED', 'green');
  }

  function ownerNukeEnemies() {
    // Dramatic nuke effect
    shakeAmount = 30;
    enemies.forEach(e => { e.hp = 0; e.dead = true; });
    bullets = [];
    _floatText('☢️ NUKE ACTIVATED', 'red');
    setTimeout(() => {
      enemies = []; waveActive = false; waveSpawnQueue = [];
    }, 100);
  }

  function ownerGodMode() {
    godMode = !godMode;
    _floatText(godMode ? '🛡 GOD MODE ON' : '🛡 GOD MODE OFF', godMode?'green':'red');
    return godMode;
  }

  function ownerFreezeAll() {
    enemies.forEach(e => {
      e.slowTimer = 10;
      e.speed = e.baseSpeed * 0.05;
      e.flashTimer = 10;
    });
    _floatText('❄️ ALL ENEMIES FROZEN!', 'green');
    shakeAmount = 8;
  }

  let ownerSpeedLevel = 0;
  function ownerSpeedHack() {
    const levels = [1, 2, 4, 8, 1];
    ownerSpeedLevel = (ownerSpeedLevel + 1) % levels.length;
    speed = levels[ownerSpeedLevel];
    document.getElementById('btnSpeed').textContent = speed + '×';
    _floatText(`⚡ SPEED: ${speed}×`, 'gold');
    return speed;
  }

  function ownerSpawnBoss(bossType) {
    if (!map) return;
    const boss = new Enemy(bossType, map.path, tileSize, wave || 1, map.waveModifier || 1);
    enemies.push(boss);
    shakeAmount = 14;
    UI.announceWave(wave || 1, true);
  }

  function ownerMaxAllTowers() {
    towers.forEach(t => {
      while (t.level < t.def.maxUpgrade) {
        t.upgrade();
      }
    });
    _floatText('⬆ ALL TOWERS MAXED!', 'gold');
    shakeAmount = 10;
  }

  function ownerSetLives(amount) {
    lives = amount;
    _updateHUD();
    _floatText(`❤️ LIVES SET TO ${amount}`, 'green');
  }

  return {
    init, stopGame, selectTowerToPlace,
    upgradeTower, sellTower, deselectTower,
    startNextWave, toggleSpeed,
    ownerAddMoney, ownerSkipWave, ownerNukeEnemies, ownerGodMode,
    ownerFreezeAll, ownerSpeedHack, ownerSpawnBoss, ownerMaxAllTowers, ownerSetLives,
    get money()  { return money;  },
    get lives()  { return lives;  },
    get wave()   { return wave;   },
    get score()  { return score;  },
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
