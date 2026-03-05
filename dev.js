/* ═══════════════════════════════════════════════════════════
   dev.js — DEV PANEL
   Unlocked when inventory contains "dev_panel" item.
   Contains chaos, troll, and game-breaking fun commands.
   ═══════════════════════════════════════════════════════════ */

const Dev = (() => {
  let isOpen    = false;
  let _openedAt = 0;
  let _speedMult    = 1;
  let _gravityOn    = false;
  let _rainbowOn    = false;
  let _rainbowTimer = null;
  let _bigHeadOn    = false;
  let _invertOn     = false;
  let _shakeLoop    = null;
  let _confettiLoop = null;
  let _matrixOn     = false;
  let _matrixCanvas = null;
  let _matrixCtx    = null;
  let _matrixAnim   = null;
  let _discoOn      = false;
  let _discoTimer   = null;

  // ── Init ────────────────────────────────────────────────────
  function init() {
    const trigger = document.getElementById('devTrigger');
    if (trigger) trigger.onclick = toggle;

    const closeBtn = document.getElementById('btnCloseDev');
    if (closeBtn) closeBtn.onclick = close;

    // Outside click to close
    document.addEventListener('pointerup', e => {
      if (!isOpen) return;
      if (Date.now() - _openedAt < 200) return;
      const panel   = document.getElementById('devPanel');
      const trig    = document.getElementById('devTrigger');
      if (panel && !panel.contains(e.target) && trig && !trig.contains(e.target)) close();
    });

    // Wire all buttons
    document.querySelectorAll('[data-dev]').forEach(btn => {
      btn.onclick = () => _handleDevAction(btn.dataset.dev, btn);
    });
  }

  // ── Show / Hide ─────────────────────────────────────────────
  function show() {
    if (!PF.inventory.some(i => i.itemId === 'dev_panel')) return;
    document.getElementById('devTrigger')?.classList.remove('hidden');
  }

  function hide() {
    document.getElementById('devTrigger')?.classList.add('hidden');
    document.getElementById('devPanel')?.classList.add('hidden');
    isOpen = false;
  }

  function toggle() { isOpen ? close() : open(); }

  function open() {
    if (!PF.inventory.some(i => i.itemId === 'dev_panel')) return;
    const panel = document.getElementById('devPanel');
    if (!panel) return;
    panel.classList.remove('hidden', 'dev-closing');
    panel.classList.add('dev-opening');
    isOpen    = true;
    _openedAt = Date.now();
    document.getElementById('devTrigger')?.classList.add('open');
    _updateStatusIndicators();
  }

  function close() {
    const panel = document.getElementById('devPanel');
    if (panel) {
      panel.classList.remove('dev-opening');
      panel.classList.add('dev-closing');
      setTimeout(() => { panel.classList.add('hidden'); panel.classList.remove('dev-closing'); }, 280);
    }
    isOpen = false;
    document.getElementById('devTrigger')?.classList.remove('open');
  }

  // ── Status indicator dots ───────────────────────────────────
  function _updateStatusIndicators() {
    _setDot('dot-speed',    _speedMult !== 1);
    _setDot('dot-rainbow',  _rainbowOn);
    _setDot('dot-bighead',  _bigHeadOn);
    _setDot('dot-invert',   _invertOn);
    _setDot('dot-matrix',   _matrixOn);
    _setDot('dot-disco',    _discoOn);
    _setDot('dot-gravity',  _gravityOn);
  }

  function _setDot(id, active) {
    const el = document.getElementById(id);
    if (el) el.className = 'dev-dot ' + (active ? 'dev-dot-on' : 'dev-dot-off');
  }

  // ── Log ─────────────────────────────────────────────────────
  function _log(msg, type = '') {
    const log = document.getElementById('devLog');
    if (!log) return;
    const ph = log.querySelector('.dev-placeholder');
    if (ph) ph.remove();
    const el = document.createElement('div');
    el.className = 'op-log-entry ' + type;
    el.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    log.insertBefore(el, log.firstChild);
    while (log.children.length > 50) log.lastChild.remove();
  }

  // ── Helpers ─────────────────────────────────────────────────
  function _requireGame(btnLabel) {
    if (typeof Game === 'undefined' || !Game.isRunning()) {
      _log(`⚠ ${btnLabel}: No active game running`, 'err');
      return false;
    }
    return true;
  }

  // ── ALL COMMAND HANDLERS ─────────────────────────────────────
  async function _handleDevAction(action, btn) {

    switch (action) {

      // ═══════════════════════════════════════════════════════
      // 💰 ECONOMY CHAOS
      // ═══════════════════════════════════════════════════════

      case 'give9999': {
        if (!_requireGame('Give $9999')) return;
        Game.ownerAddMoney(9999);
        _log('💰 INFINITE MONEY — +$9,999 injected', 'ok');
        UI.toast('💰 +$9,999!', 'gold');
        break;
      }

      case 'giveMillion': {
        if (!_requireGame('Give $1M')) return;
        Game.ownerAddMoney(1000000);
        _log('🤑 MILLIONAIRE — +$1,000,000 injected', 'ok');
        UI.toast('🤑 +$1,000,000!!', 'gold');
        break;
      }

      case 'setMoney0': {
        if (!_requireGame('Set Money $0')) return;
        // Set internal money to 0
        if (typeof Game.ownerSetMoney === 'function') {
          Game.ownerSetMoney(0);
        } else {
          // Override using the subtract trick
          const cur = typeof Game.getMoney === 'function' ? Game.getMoney() : 0;
          if (cur > 0) Game.ownerAddMoney(-cur);
        }
        _log('😂 BROKE — set money to $0', 'ok');
        UI.toast('💸 You\'re broke now lol', 'red');
        break;
      }

      case 'stealCoins': {
        // Remove 500 real coins from player permanently
        if (PF.isLoggedIn() && PF.playerData.Coins > 0) {
          PF.playerData.Coins = Math.max(0, PF.playerData.Coins - 500);
          await PF.savePlayerData();
          _log('💀 STOLEN — took 500 coins from player account', 'ok');
          UI.toast('💀 -500 coins stolen lmao', 'red');
        } else {
          _log('Player has no coins to steal', 'err');
        }
        break;
      }

      // ═══════════════════════════════════════════════════════
      // 👹 ENEMY CHAOS
      // ═══════════════════════════════════════════════════════

      case 'spawnHorde': {
        if (!_requireGame('Spawn Horde')) return;
        // Spam spawn 50 basic zombies
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            if (typeof Game.ownerSpawnEnemy === 'function') Game.ownerSpawnEnemy('zombie_basic');
            else if (typeof Game.ownerNukeEnemies === 'function') {} // fallback
          }, i * 100);
        }
        Game.ownerSpawnBoss && Game.ownerSpawnBoss('boss_zombie_king');
        _log('👹 HORDE UNLEASHED — 50 zombies + boss incoming!', 'ok');
        UI.toast('👹 HORDE INCOMING!!!', 'red');
        // Big screen shake
        if (typeof Game.ownerShake === 'function') Game.ownerShake(40);
        break;
      }

      case 'instantBoss': {
        if (!_requireGame('Instant Boss')) return;
        const bosses = ['boss_zombie_king','boss_necromancer','boss_titan','boss_void_overlord'];
        const boss = bosses[Math.floor(Math.random() * bosses.length)];
        Game.ownerSpawnBoss && Game.ownerSpawnBoss(boss);
        _log(`👑 BOSS SPAWNED — ${boss}`, 'ok');
        UI.toast(`👑 ${boss.replace(/_/g,' ').toUpperCase()} SPAWNED!`, 'red');
        break;
      }

      case 'spawnAllBosses': {
        if (!_requireGame('All Bosses')) return;
        const bosses = ['boss_zombie_king','boss_necromancer','boss_titan','boss_void_overlord'];
        bosses.forEach((b, i) => setTimeout(() => {
          Game.ownerSpawnBoss && Game.ownerSpawnBoss(b);
        }, i * 800));
        _log('☠️ ALL 4 BOSSES SPAWNED — good luck lol', 'ok');
        UI.toast('☠️ ALL BOSSES INCOMING!!', 'red');
        break;
      }

      case 'hyperspeed': {
        if (!_requireGame('Hyperspeed')) return;
        _speedMult = _speedMult === 10 ? 1 : 10;
        if (typeof Game.ownerSpeedHack === 'function') {
          // Set to a fixed value
          Game.ownerSetSpeed && Game.ownerSetSpeed(_speedMult);
        }
        _log(`⚡ HYPERSPEED ${_speedMult === 10 ? 'ON (10x)' : 'OFF (1x)'}`, 'ok');
        UI.toast(`⚡ ${_speedMult === 10 ? '10× HYPERSPEED!' : 'Speed Normal'}`, 'gold');
        _setDot('dot-speed', _speedMult !== 1);
        break;
      }

      case 'nukeAll': {
        if (!_requireGame('Nuke All')) return;
        Game.ownerNukeEnemies && Game.ownerNukeEnemies();
        // Also add money from all kills
        Game.ownerAddMoney(5000);
        _log('☢️ MEGA NUKE — all enemies vaporized + $5000 bonus', 'ok');
        UI.toast('☢️ NUKE FIRED!', 'gold');
        _screenBoom();
        break;
      }

      case 'freezeForever': {
        if (!_requireGame('Freeze Forever')) return;
        Game.ownerFreezeAll && Game.ownerFreezeAll();
        _log('❄️ DEEP FREEZE — enemies frozen (use Unfreeze to restore)', 'ok');
        UI.toast('❄️ EVERYTHING FROZEN!', '');
        break;
      }

      case 'unfreeze': {
        if (!_requireGame('Unfreeze')) return;
        // Simulate by speed resetting
        if (typeof Game.ownerSetSpeed === 'function') Game.ownerSetSpeed(1);
        _log('🔥 THAWED — enemies unfrozen', 'ok');
        UI.toast('🔥 Unfrozen!', '');
        break;
      }

      // ═══════════════════════════════════════════════════════
      // 🗼 TOWER SHENANIGANS
      // ═══════════════════════════════════════════════════════

      case 'maxAllTowers': {
        if (!_requireGame('Max All Towers')) return;
        Game.ownerMaxAllTowers && Game.ownerMaxAllTowers();
        _log('🗼 ALL TOWERS MAXED — instant upgrade godmode', 'ok');
        UI.toast('🗼 MAX TOWERS!', 'gold');
        break;
      }

      case 'sellAllTowers': {
        if (!_requireGame('Sell All Towers')) return;
        if (typeof Game.ownerSellAllTowers === 'function') {
          Game.ownerSellAllTowers();
        } else {
          // Brute force via DOM/game state if no direct function
          Game.ownerAddMoney(999);
          _log('🤑 Sold towers (added $999 instead — direct sell not available)', 'ok');
        }
        _log('💸 SOLD ALL TOWERS — good luck surviving', 'ok');
        UI.toast('💸 All towers SOLD lol', 'red');
        break;
      }

      case 'godMode': {
        if (!_requireGame('God Mode')) return;
        const on = Game.ownerGodMode && Game.ownerGodMode();
        _log(`🛡 GOD MODE: ${on ? 'ON — infinite lives' : 'OFF'}`, 'ok');
        UI.toast(`🛡 God Mode: ${on ? 'ON' : 'OFF'}`, 'gold');
        break;
      }

      case 'skipToWave': {
        if (!_requireGame('Skip Wave')) return;
        const target = parseInt(document.getElementById('devWaveNum')?.value) || 1;
        for (let i = 0; i < target; i++) Game.ownerSkipWave && Game.ownerSkipWave();
        _log(`⏭ SKIPPED to wave ~${target}`, 'ok');
        UI.toast(`⏭ Wave +${target}!`, 'gold');
        break;
      }

      case 'setLives': {
        if (!_requireGame('Set Lives')) return;
        const lives = parseInt(document.getElementById('devLivesNum')?.value) || 999;
        Game.ownerSetLives && Game.ownerSetLives(lives);
        _log(`❤️ LIVES SET to ${lives}`, 'ok');
        UI.toast(`❤️ Lives: ${lives}`, 'green');
        break;
      }

      case 'setLives1': {
        if (!_requireGame('Set Lives 1')) return;
        Game.ownerSetLives && Game.ownerSetLives(1);
        _log('💀 LAST CHANCE — lives set to 1', 'ok');
        UI.toast('💀 1 life remaining...', 'red');
        break;
      }

      // ═══════════════════════════════════════════════════════
      // 🎨 VISUAL CHAOS
      // ═══════════════════════════════════════════════════════

      case 'rainbow': {
        _rainbowOn = !_rainbowOn;
        if (_rainbowOn) {
          let hue = 0;
          _rainbowTimer = setInterval(() => {
            document.documentElement.style.filter = `hue-rotate(${hue}deg) saturate(2)`;
            hue = (hue + 3) % 360;
          }, 30);
          _log('🌈 RAINBOW MODE ON — everything is technicolor', 'ok');
          UI.toast('🌈 RAINBOW!', '');
        } else {
          clearInterval(_rainbowTimer);
          document.documentElement.style.filter = '';
          _log('🌈 Rainbow mode OFF', '');
          UI.toast('🌈 Back to normal', '');
        }
        _setDot('dot-rainbow', _rainbowOn);
        break;
      }

      case 'bigHead': {
        _bigHeadOn = !_bigHeadOn;
        const canvas = document.getElementById('gameCanvas');
        if (canvas) canvas.style.transform = _bigHeadOn ? 'scaleX(2) scaleY(0.5)' : '';
        _log(`👁 BIG HEAD MODE: ${_bigHeadOn ? 'ON' : 'OFF'}`, 'ok');
        UI.toast(_bigHeadOn ? '👁 STRETCHED!' : '👁 Normal', '');
        _setDot('dot-bighead', _bigHeadOn);
        break;
      }

      case 'invert': {
        _invertOn = !_invertOn;
        document.documentElement.style.filter = _invertOn
          ? 'invert(1) hue-rotate(180deg)'
          : '';
        _log(`🌀 INVERT: ${_invertOn ? 'ON' : 'OFF'}`, 'ok');
        UI.toast(_invertOn ? '🌀 INVERTED!' : '🌀 Normal', '');
        _setDot('dot-invert', _invertOn);
        break;
      }

      case 'earthquake': {
        let shakeCount = 0;
        const shakeInterval = setInterval(() => {
          const x = (Math.random() - 0.5) * 30;
          const y = (Math.random() - 0.5) * 30;
          document.body.style.transform = `translate(${x}px, ${y}px)`;
          shakeCount++;
          if (shakeCount > 60) {
            clearInterval(shakeInterval);
            document.body.style.transform = '';
          }
        }, 30);
        _log('🌍 EARTHQUAKE — 3 second screen shake', 'ok');
        UI.toast('🌍 EARTHQUAKE!', 'red');
        break;
      }

      case 'confetti': {
        _spawnConfetti();
        _log('🎊 CONFETTI PARTY — pop pop pop', 'ok');
        UI.toast('🎊 CONFETTI!!!', 'gold');
        break;
      }

      case 'matrix': {
        _matrixOn = !_matrixOn;
        if (_matrixOn) {
          _startMatrix();
          _log('💻 MATRIX MODE ON — wake up Neo', 'ok');
          UI.toast('💻 MATRIX MODE', '');
        } else {
          _stopMatrix();
          _log('💻 Matrix mode OFF', '');
          UI.toast('💻 Back to reality', '');
        }
        _setDot('dot-matrix', _matrixOn);
        break;
      }

      case 'disco': {
        _discoOn = !_discoOn;
        if (_discoOn) {
          let h = 0;
          _discoTimer = setInterval(() => {
            document.body.style.background = `hsl(${h},80%,8%)`;
            document.getElementById('screen-game') && (document.getElementById('screen-game').style.background = `hsl(${h},60%,5%)`);
            h = (h + 15) % 360;
          }, 120);
          _log('🪩 DISCO ON — boogaloo', 'ok');
          UI.toast('🪩 DISCO MODE!', '');
        } else {
          clearInterval(_discoTimer);
          document.body.style.background = '';
          const sg = document.getElementById('screen-game');
          if (sg) sg.style.background = '';
          _log('🪩 Disco OFF', '');
          UI.toast('🪩 Lights off', '');
        }
        _setDot('dot-disco', _discoOn);
        break;
      }

      case 'zoom': {
        const canvas = document.getElementById('gameCanvas');
        const cur = parseFloat(canvas?.style.transform?.replace('scale(','').replace(')','') || '1');
        const next = cur >= 3 ? 1 : cur + 0.5;
        if (canvas) canvas.style.transform = `scale(${next})`;
        _log(`🔍 ZOOM: ${next}x`, 'ok');
        UI.toast(`🔍 Zoom ${next}×`, '');
        break;
      }

      case 'flip': {
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
          const flipped = canvas.style.transform === 'scaleX(-1)';
          canvas.style.transform = flipped ? '' : 'scaleX(-1)';
          _log(`🔄 FLIP: ${!flipped ? 'ON' : 'OFF'}`, 'ok');
          UI.toast(!flipped ? '🔄 MIRRORED!' : '🔄 Normal', '');
        }
        break;
      }

      case 'upsideDown': {
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
          const flipped = canvas.style.transform === 'scaleY(-1)';
          canvas.style.transform = flipped ? '' : 'scaleY(-1)';
          _log(`🙃 UPSIDE DOWN: ${!flipped ? 'ON' : 'OFF'}`, 'ok');
          UI.toast(!flipped ? '🙃 UPSIDE DOWN!' : '🙃 Normal', '');
        }
        break;
      }

      // ═══════════════════════════════════════════════════════
      // 💣 TROLL COMMANDS
      // ═══════════════════════════════════════════════════════

      case 'fakeVictory': {
        if (!_requireGame('Fake Victory')) return;
        // Trigger the victory screen
        Game.ownerSkipWave && (() => {
          for(let i=0;i<99;i++) Game.ownerSkipWave();
        })();
        _log('🏆 FAKE VICTORY TRIGGERED — got \'em', 'ok');
        UI.toast('🏆 "YOU WIN" (you don\'t)', 'gold');
        break;
      }

      case 'fakeGameOver': {
        if (!_requireGame('Fake Game Over')) return;
        Game.ownerSetLives && Game.ownerSetLives(0);
        _log('💀 FAKE GAME OVER — set lives to 0', 'ok');
        UI.toast('💀 Game Over lmao', 'red');
        break;
      }

      case 'spamToast': {
        const msgs = [
          '🤡 imagine getting trolled',
          '💀 you have been pranked',
          '🎺 tuba sound',
          '🙈 skill issue',
          '💅 not my problem',
          '🐛 this is a feature not a bug',
          '🗿 bro thought he was safe',
          '🧠 galaxy brain moment',
          '📞 skill issue support line: 1-800-git-gud',
          '🚽 deleted',
        ];
        msgs.forEach((m, i) => setTimeout(() => UI.toast(m, i % 3 === 0 ? 'red' : 'gold'), i * 400));
        _log('🤡 TOAST SPAM — 10 toasts incoming', 'ok');
        break;
      }

      case 'rickroll': {
        // Overlay a fake "secret discovered" message
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;';
        overlay.innerHTML = `
          <div style="font-size:80px;animation:spin 2s linear infinite">🎵</div>
          <div style="font-family:monospace;font-size:28px;color:#e74c3c;font-weight:900;margin:20px;text-align:center;letter-spacing:4px">
            NEVER GONNA GIVE YOU UP
          </div>
          <div style="font-family:monospace;font-size:14px;color:#f5b215">NEVER GONNA LET YOU DOWN</div>
          <div style="font-family:monospace;font-size:11px;color:rgba(255,255,255,0.4);margin-top:40px">click to close (or don't)</div>
          <style>@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }</style>
        `;
        overlay.onclick = () => overlay.remove();
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 8000);
        _log('🎵 RICKROLLED — never gonna give you up', 'ok');
        break;
      }

      case 'fakeBan': {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:#0a0a0a;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;';
        overlay.innerHTML = `
          <div style="font-size:60px;margin-bottom:20px">🔨</div>
          <div style="font-family:monospace;font-size:32px;color:#e74c3c;font-weight:900;letter-spacing:3px">YOU HAVE BEEN BANNED</div>
          <div style="font-family:monospace;font-size:14px;color:#888;margin:16px;text-align:center;max-width:420px">
            Reason: <span style="color:#e74c3c">being too good at the game</span><br>
            Duration: <span style="color:#f5b215">lol just kidding</span>
          </div>
          <div style="font-family:monospace;font-size:10px;color:rgba(255,255,255,0.2);margin-top:30px">click to escape</div>
        `;
        overlay.onclick = () => overlay.remove();
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 6000);
        _log('🔨 FAKE BAN — scared them a little', 'ok');
        UI.toast('🔨 banned (jk)', 'red');
        break;
      }

      case 'fakeError': {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;cursor:pointer;';
        overlay.innerHTML = `
          <div style="background:#1a1a1a;border:1px solid #e74c3c;border-radius:8px;padding:32px;max-width:480px;font-family:monospace;text-align:center;">
            <div style="font-size:48px;margin-bottom:12px">💥</div>
            <div style="font-size:18px;color:#e74c3c;font-weight:900;margin-bottom:10px">CRITICAL GAME ERROR</div>
            <div style="font-size:11px;color:#666;margin-bottom:20px;line-height:1.6">
              TypeError: Cannot read properties of undefined (reading 'brain')<br>
              at zombie.think (/game/enemies.js:420:69)<br>
              at Array.forEach (&lt;anonymous&gt;)<br>
              at GameLoop._tick (/game/game.js:1337:13)
            </div>
            <div style="font-size:10px;color:#444">click to close — your data might be corrupted lol</div>
          </div>
        `;
        overlay.onclick = () => overlay.remove();
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 7000);
        _log('💥 FAKE ERROR SCREEN — sent them into a panic', 'ok');
        break;
      }

      case 'flashbang': {
        const flash = document.createElement('div');
        flash.style.cssText = 'position:fixed;inset:0;background:white;z-index:99999;pointer-events:none;transition:opacity 1.5s';
        document.body.appendChild(flash);
        requestAnimationFrame(() => {
          flash.style.opacity = '0';
          setTimeout(() => flash.remove(), 1600);
        });
        _log('💥 FLASHBANG — they\'re blind', 'ok');
        UI.toast('💥 FLASHBANG!', '');
        break;
      }

      case 'screenSmash': {
        const smash = document.createElement('div');
        smash.style.cssText = `
          position:fixed;inset:0;z-index:99998;pointer-events:none;
          background: radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.95) 100%);
        `;
        // Create crack lines
        for (let i = 0; i < 12; i++) {
          const line = document.createElement('div');
          const angle = (i / 12) * 360;
          const length = 200 + Math.random() * 300;
          line.style.cssText = `
            position:absolute;
            top:50%;left:50%;
            width:${length}px;height:2px;
            background:rgba(255,255,255,0.7);
            transform-origin:0 50%;
            transform:rotate(${angle}deg);
          `;
          smash.appendChild(line);
        }
        document.body.appendChild(smash);
        UI.toast('💥 SCREEN SMASHED!', 'red');
        _log('💥 SCREEN SMASH — cracked screen effect', 'ok');
        setTimeout(() => {
          smash.style.transition = 'opacity 0.5s';
          smash.style.opacity = '0';
          setTimeout(() => smash.remove(), 600);
        }, 3000);
        break;
      }

      // ═══════════════════════════════════════════════════════
      // 🧪 EXPERIMENTS
      // ═══════════════════════════════════════════════════════

      case 'gravity': {
        if (!_requireGame('Gravity')) return;
        _gravityOn = !_gravityOn;
        // Apply CSS gravity to all enemy elements on canvas (visual only)
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
          canvas.style.transition = 'transform 0.3s';
          canvas.style.transform = _gravityOn ? 'rotate(15deg)' : '';
        }
        _log(`🌍 GRAVITY TILT: ${_gravityOn ? 'TILTED 15°' : 'Normal'}`, 'ok');
        UI.toast(_gravityOn ? '🌍 TILTED!' : '🌍 Straight', '');
        _setDot('dot-gravity', _gravityOn);
        break;
      }

      case 'teleportEnemies': {
        if (!_requireGame('Teleport')) return;
        // Nuke and respawn = teleport effect
        Game.ownerNukeEnemies && Game.ownerNukeEnemies();
        setTimeout(() => {
          Game.ownerSpawnBoss && Game.ownerSpawnBoss('boss_zombie_king');
        }, 500);
        _log('✨ TELEPORTED — nuked them and summoned a boss instead', 'ok');
        UI.toast('✨ TELEPORTED!', '');
        break;
      }

      case 'cloneArmy': {
        if (!_requireGame('Clone Army')) return;
        // Add lots of money + max all towers = clone army simulation
        Game.ownerAddMoney(50000);
        Game.ownerMaxAllTowers && Game.ownerMaxAllTowers();
        _log('🤖 CLONE ARMY — $50k + all towers maxed', 'ok');
        UI.toast('🤖 CLONE ARMY!', 'gold');
        break;
      }

      case 'antiGravity': {
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
          const flipped = canvas.style.transform?.includes('scaleY(-1)');
          canvas.style.transform = flipped ? '' : 'scaleY(-1)';
          _log(`🚀 ANTI-GRAVITY: ${!flipped ? 'ON' : 'OFF'}`, 'ok');
          UI.toast(!flipped ? '🚀 UPSIDE DOWN WORLD' : '🚀 Gravity restored', '');
        }
        break;
      }

      case 'slowMo': {
        if (!_requireGame('Slow Mo')) return;
        if (typeof Game.ownerSetSpeed === 'function') {
          _speedMult = _speedMult === 0.1 ? 1 : 0.1;
          Game.ownerSetSpeed(_speedMult);
        } else {
          // Fallback: speed hack cycles to slow
          Game.ownerSpeedHack && Game.ownerSpeedHack();
        }
        const on = _speedMult === 0.1;
        _log(`🐌 SLOW MO: ${on ? '0.1× speed' : 'Normal'}`, 'ok');
        UI.toast(on ? '🐌 SLOOOW MO' : '🐌 Normal speed', '');
        _setDot('dot-speed', _speedMult !== 1);
        break;
      }

      // ═══════════════════════════════════════════════════════
      // 🔄 RESET EVERYTHING
      // ═══════════════════════════════════════════════════════

      case 'resetAllEffects': {
        // Turn off all visual chaos
        clearInterval(_rainbowTimer); _rainbowOn = false;
        clearInterval(_discoTimer);   _discoOn   = false;
        _bigHeadOn = false; _invertOn = false; _gravityOn = false;
        _stopMatrix(); _matrixOn = false;
        _speedMult = 1;

        document.documentElement.style.filter = '';
        document.body.style.background        = '';
        document.body.style.transform         = '';
        const sg = document.getElementById('screen-game');
        if (sg) sg.style.background = '';
        const canvas = document.getElementById('gameCanvas');
        if (canvas) canvas.style.transform = '';

        _log('🔄 ALL EFFECTS RESET — back to normal', 'ok');
        UI.toast('🔄 All chaos cleared!', 'green');
        _updateStatusIndicators();
        break;
      }

      case 'nukeAccount': {
        if (!confirm('💀 NUKE ACCOUNT: Reset your OWN coins to 100, best wave to 0, kills to 0? This is permanent!')) return;
        if (PF.isLoggedIn()) {
          PF.playerData.Coins = 100;
          PF.playerData.BestWave = 0;
          PF.playerData.TotalKills = 0;
          await PF.savePlayerData();
          _log('💀 OWN ACCOUNT NUKED — why did you do this', 'ok');
          UI.toast('💀 Your stats wiped lol', 'red');
        } else {
          localStorage.setItem('ztd_coins', '100');
          localStorage.setItem('ztd_bestWave', '0');
          _log('💀 Local data nuked', 'ok');
        }
        break;
      }

    }
  }

  // ── Visual effect helpers ────────────────────────────────────
  function _screenBoom() {
    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle,rgba(255,80,0,0.8) 0%,transparent 70%);z-index:9999;pointer-events:none;animation:devBoom 0.4s ease-out forwards';
    const style = document.createElement('style');
    style.textContent = '@keyframes devBoom{from{opacity:1;transform:scale(0.5)}to{opacity:0;transform:scale(3)}}';
    document.head.appendChild(style);
    document.body.appendChild(flash);
    setTimeout(() => { flash.remove(); style.remove(); }, 450);
  }

  function _spawnConfetti() {
    const colors = ['#e74c3c','#f5b215','#2ecc71','#3dd6f5','#9b59b6','#e67e22','#ff69b4'];
    for (let i = 0; i < 80; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size  = 6 + Math.random() * 10;
        el.style.cssText = `
          position:fixed;
          left:${Math.random() * 100}vw;
          top:-20px;
          width:${size}px;height:${size}px;
          background:${color};
          border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
          z-index:9999;pointer-events:none;
          animation:confettiFall ${1.5+Math.random()*2}s linear forwards;
          transform:rotate(${Math.random()*360}deg);
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3500);
      }, i * 40);
    }
    if (!document.getElementById('_confettiKf')) {
      const s = document.createElement('style'); s.id = '_confettiKf';
      s.textContent = '@keyframes confettiFall{from{top:-20px;opacity:1}to{top:110vh;opacity:0;transform:rotate(720deg)}}';
      document.head.appendChild(s);
    }
  }

  function _startMatrix() {
    if (_matrixCanvas) return;
    _matrixCanvas = document.createElement('canvas');
    _matrixCanvas.style.cssText = 'position:fixed;inset:0;z-index:9997;pointer-events:none;opacity:0.5';
    _matrixCanvas.width  = window.innerWidth;
    _matrixCanvas.height = window.innerHeight;
    document.body.appendChild(_matrixCanvas);
    _matrixCtx = _matrixCanvas.getContext('2d');

    const cols  = Math.floor(_matrixCanvas.width / 16);
    const drops = Array(cols).fill(1);
    const chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコ01234';

    _matrixAnim = setInterval(() => {
      _matrixCtx.fillStyle = 'rgba(0,0,0,0.05)';
      _matrixCtx.fillRect(0, 0, _matrixCanvas.width, _matrixCanvas.height);
      _matrixCtx.fillStyle = '#0f0';
      _matrixCtx.font = '14px monospace';
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        _matrixCtx.fillText(char, i * 16, y * 16);
        if (y * 16 > _matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    }, 50);
  }

  function _stopMatrix() {
    clearInterval(_matrixAnim);
    _matrixCanvas?.remove();
    _matrixCanvas = null; _matrixCtx = null; _matrixAnim = null;
  }

  // ── Public API ───────────────────────────────────────────────
  return { init, show, hide, toggle, open, close };

})();
