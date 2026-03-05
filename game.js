// ══════════════════════════════════════════════════════════════
//  ACCOUNT LEVEL SYSTEM  (BTD6-style XP progression)
// ══════════════════════════════════════════════════════════════

const AccountLevel = (() => {
  // XP thresholds per level (cumulative) — level 1 = 0 XP, level 100 = ~2.5M
  function _xpForLevel(lvl) {
    if (lvl <= 1) return 0;
    // Exponential curve: roughly 500 * (1.18^level)
    return Math.floor(500 * Math.pow(1.18, lvl - 1));
  }
  function _totalXpForLevel(lvl) {
    let total = 0;
    for (let i = 2; i <= lvl; i++) total += _xpForLevel(i);
    return total;
  }
  function getLevelFromXP(xp) {
    let lvl = 1;
    while (_totalXpForLevel(lvl + 1) <= xp) lvl++;
    return Math.min(lvl, 100);
  }
  function getXPProgress(xp) {
    const lvl = getLevelFromXP(xp);
    if (lvl >= 100) return { level:100, current:0, needed:0, pct:1 };
    const base = _totalXpForLevel(lvl);
    const next = _totalXpForLevel(lvl + 1);
    return { level:lvl, current:xp - base, needed:next - base, pct:(xp - base)/(next - base) };
  }

  // XP rewards per game action
  const XP_TABLE = {
    kill: 1,           // per enemy killed
    bossKill: 50,      // per boss
    waveClear: 30,     // per wave
    perfectWave: 60,   // wave with no lives lost
    mapComplete: 500,  // finishing a map
    surviveWaves: 2,   // per wave survived (difficulty multiplier applied)
  };

  // Level-up unlocks catalog
  const LEVEL_UNLOCKS = {
    1:   { type:'title',   value:'ROOKIE',        display:'Title: Rookie' },
    3:   { type:'tower',   value:'sniper',         display:'Tower Unlocked: Sniper' },
    5:   { type:'title',   value:'SURVIVOR',       display:'Title: Survivor' },
    7:   { type:'tower',   value:'freezer',        display:'Tower Unlocked: Freezer' },
    10:  { type:'tower',   value:'rocketeer',      display:'Tower Unlocked: Rocketeer' },
    12:  { type:'title',   value:'VETERAN',        display:'Title: Veteran' },
    15:  { type:'tower',   value:'drone_bay',      display:'AIR TOWER: Drone Bay' },
    18:  { type:'tower',   value:'flamer',         display:'Tower Unlocked: Flamethrower' },
    20:  { type:'title',   value:'WARLORD',        display:'Title: Warlord' },
    22:  { type:'tower',   value:'apache',         display:'AIR TOWER: Apache Gunship' },
    25:  { type:'tower',   value:'tesla',          display:'Tower Unlocked: Tesla Coil' },
    28:  { type:'tower',   value:'mortar',         display:'Tower Unlocked: Mortar' },
    30:  { type:'title',   value:'COMMANDER',      display:'Title: Commander' },
    32:  { type:'tower',   value:'stormwing',      display:'AIR TOWER: Stormwing Jet' },
    35:  { type:'tower',   value:'venom',          display:'Tower Unlocked: Venom Tower' },
    38:  { type:'tower',   value:'laser',          display:'Tower Unlocked: Laser Tower' },
    40:  { type:'title',   value:'ELITE',          display:'Title: Elite' },
    42:  { type:'tower',   value:'stratobomber',   display:'AIR TOWER: Strato Bomber' },
    45:  { type:'tower',   value:'phantom',        display:'Tower Unlocked: Phantom Sniper' },
    48:  { type:'tower',   value:'omega',          display:'Tower Unlocked: Omega Cannon' },
    50:  { type:'title',   value:'LEGEND',         display:'Title: Legend' },
    52:  { type:'tower',   value:'spectre',        display:'AIR TOWER: Spectre AC-130' },
    55:  { type:'tower',   value:'temporal',       display:'Tower Unlocked: Time Distorter' },
    58:  { type:'tower',   value:'reaper',         display:'Tower Unlocked: Soul Reaper' },
    60:  { type:'title',   value:'IMMORTAL',       display:'Title: Immortal' },
    65:  { type:'tower',   value:'sky_fortress',   display:'AIR TOWER: Sky Fortress' },
    70:  { type:'title',   value:'GOD OF WAR',     display:'Title: God of War' },
    80:  { type:'title',   value:'UNTOUCHABLE',    display:'Title: Untouchable' },
    90:  { type:'title',   value:'TRANSCENDENT',   display:'Title: Transcendent' },
    100: { type:'title',   value:'THE LAST BASTION',display:'Title: The Last Bastion' },
  };

  const TITLES = [
    {min:1,  title:'ROOKIE'},
    {min:5,  title:'SURVIVOR'},
    {min:12, title:'VETERAN'},
    {min:20, title:'WARLORD'},
    {min:30, title:'COMMANDER'},
    {min:40, title:'ELITE'},
    {min:50, title:'LEGEND'},
    {min:60, title:'IMMORTAL'},
    {min:70, title:'GOD OF WAR'},
    {min:80, title:'UNTOUCHABLE'},
    {min:90, title:'TRANSCENDENT'},
    {min:100,title:'THE LAST BASTION'},
  ];

  function getTitle(level) {
    for (let i = TITLES.length - 1; i >= 0; i--) {
      if (level >= TITLES[i].min) return TITLES[i].title;
    }
    return 'ROOKIE';
  }

  // Level badge color
  function getLevelColor(level) {
    if (level >= 90) return '#ff00ff';
    if (level >= 70) return '#ff1744';
    if (level >= 50) return '#ffd700';
    if (level >= 30) return '#ff6d00';
    if (level >= 15) return '#7c4dff';
    if (level >= 5)  return '#00bcd4';
    return '#78909c';
  }

  // In-memory state (synced with PlayFab)
  let _xp = 0, _level = 1;

  function load(xp) {
    _xp = xp || 0;
    _level = getLevelFromXP(_xp);
  }
  function getXP() { return _xp; }
  function getLevel() { return _level; }

  // Award XP and return level-ups that occurred
  function awardXP(amount) {
    const oldLevel = _level;
    _xp += amount;
    _level = getLevelFromXP(_xp);
    const levelUps = [];
    for (let l = oldLevel + 1; l <= _level; l++) {
      if (LEVEL_UNLOCKS[l]) levelUps.push({ level: l, ...LEVEL_UNLOCKS[l] });
    }
    return levelUps;
  }

  function getProgress() { return getXPProgress(_xp); }
  function getUnlockAt(level) { return LEVEL_UNLOCKS[level]; }

  return { load, getXP, getLevel, getTitle, getProgress, getLevelColor, awardXP, XP_TABLE, LEVEL_UNLOCKS };
})();


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
  let _livesAtWaveStart = 0;
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
    const _savedXP = PF.isLoggedIn()
      ? (PF.playerData?.AccountXP || 0)
      : parseInt(localStorage.getItem('ztd_xp') || '0');
    AccountLevel.load(_savedXP);
    _updateLevelHUD();
    score  = 0; kills = 0; wave = 0;
    towers = []; enemies = []; bullets = [];
    waveActive = false; waveSpawnQueue = []; spawnTimer = 0;
    currentWaveIndex = 0; gameOver = false; victory = false;
    godMode = false; selectedTower = null; placingTower = null;
    totalCoinsEarned = 0; shakeAmount = 0; killFeed = [];
    interestAccum = 0; lastPlaced = null;

    waves = generateWaves(map.id, map.waves, map.waveModifier);

    _buildMapCache();
    _buildMinimap();
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

  // ── Pre-render a single path tile to an offscreen canvas ──────────────────
  function _makePathTile(T, type, theme) {
    // type: 'h' | 'v' | 'tl'|'tr'|'bl'|'br' (corner: which quadrant is INSIDE the curve)
    const oc = document.createElement('canvas');
    oc.width = oc.height = T;
    const g = oc.getContext('2d');

    // Theme road colors
    const RC = {
      graveyard: { base:'#5a4428', mid:'#6b5535', edge:'#3a2810', border:'#2a1e08', stone:'#7a6845', light:'rgba(255,220,160,0.12)', crack:'rgba(0,0,0,0.22)' },
      urban:     { base:'#4a4a4a', mid:'#5c5c5c', edge:'#2a2a2a', border:'#1a1a1a', stone:'#6e6e6e', light:'rgba(255,255,255,0.06)', crack:'rgba(0,0,0,0.3)' },
      volcanic:  { base:'#3c1800', mid:'#501e00', edge:'#7a1800', border:'#1e0800', stone:'#6a2800', light:'rgba(255,80,0,0.1)', crack:'rgba(255,60,0,0.25)' },
      arctic:    { base:'#a0c0dc', mid:'#b8d4ec', edge:'#d8eeff', border:'#6080a0', stone:'#c8e0f4', light:'rgba(255,255,255,0.2)', crack:'rgba(200,235,255,0.35)' },
      hell:      { base:'#580000', mid:'#700000', edge:'#bb0000', border:'#2a0000', stone:'#880000', light:'rgba(255,30,0,0.12)', crack:'rgba(255,0,0,0.3)' },
      nuclear:   { base:'#364e00', mid:'#4a6800', edge:'#78a800', border:'#1c2e00', stone:'#5a7000', light:'rgba(120,220,0,0.1)', crack:'rgba(100,200,0,0.3)' },
      shadow:    { base:'#1c0040', mid:'#280060', edge:'#6000cc', border:'#0c0020', stone:'#380080', light:'rgba(140,0,255,0.1)', crack:'rgba(120,0,255,0.35)' },
      omega:     { base:'#2a0006', mid:'#400008', edge:'#cc0020', border:'#140002', stone:'#580012', light:'rgba(255,0,30,0.12)', crack:'rgba(255,0,30,0.4)' },
    };
    const rc = RC[theme] || RC.graveyard;

    const isCorner = ['tl','tr','bl','br'].includes(type);

    g.save();
    if (isCorner) {
      // ── CORNER TILE ────────────────────────────────────────────────────────
      // Fill full tile with base road color
      g.fillStyle = rc.base;
      g.fillRect(0, 0, T, T);

      // Determine pivot corner
      const px = type === 'tl' || type === 'bl' ? T : 0;
      const py = type === 'tl' || type === 'tr' ? T : 0;

      // Road width = full tile; outer arc clips off the unwanted corner triangle
      // Inner arc radius = T * 0.18, outer arc radius = T * 0.18 + T = T * 1.18
      // But we want the road to fill the tile in a curve: use a thick arc stroke

      // Outer border
      g.beginPath();
      g.arc(px, py, T * 0.95, 0, Math.PI * 2);
      g.fillStyle = rc.border;
      g.fill();

      // Road surface (inner fill of the bent road)
      g.beginPath();
      g.moveTo(px === 0 ? 0 : T, 0);
      g.lineTo(px === 0 ? T : 0, 0);
      g.lineTo(px === 0 ? T : 0, T);
      g.lineTo(px === 0 ? 0 : T, T);
      g.closePath();
      // Clip to tile
      g.save();
      g.beginPath();
      g.rect(0, 0, T, T);
      g.clip();

      // Draw outer road edge arc
      g.beginPath();
      g.arc(px, py, T * 0.92, 0, Math.PI * 2);
      g.fillStyle = rc.edge;
      g.fill();

      // Main surface arc band
      g.beginPath();
      g.arc(px, py, T * 0.85, 0, Math.PI * 2);
      g.fillStyle = rc.base;
      g.fill();

      // Mid-tone arc
      g.beginPath();
      g.arc(px, py, T * 0.65, 0, Math.PI * 2);
      g.fillStyle = rc.mid;
      g.fill();

      // Inner hole (cut out center — inner edge of the curved road)
      g.beginPath();
      g.arc(px, py, T * 0.18, 0, Math.PI * 2);
      // Nothing — we keep it filled; the hole is the background behind

      // Inner cutout (the non-road area inside the curve) — paint ground color back
      // We will handle this after by masking: paint from center circle outward nothing
      // Actually, do it via globalCompositeOperation
      g.globalCompositeOperation = 'destination-out';
      g.beginPath();
      g.arc(px, py, T * 0.18, 0, Math.PI * 2);
      g.fill();
      g.globalCompositeOperation = 'source-over';

      // The corner "outside" area — triangle region that should be ground
      // Already transparent via arc destination-out at center
      // Now also cut out the outer square corner (90-degree wedge outside the arc)
      g.globalCompositeOperation = 'destination-out';
      // Cut a rectangle away from the "outside" corner
      const cx2 = px === 0 ? 1 : 0, cy2 = py === 0 ? 1 : 0;
      g.beginPath();
      g.arc(px, py, T * 0.18, 0, Math.PI * 2);
      g.fill();
      g.globalCompositeOperation = 'source-over';

      g.restore();

      // Center highlight on curve
      g.save();
      g.beginPath(); g.rect(0, 0, T, T); g.clip();
      g.beginPath();
      g.arc(px, py, T * 0.52, 0, Math.PI * 2);
      const cgrad = g.createRadialGradient(px, py, T*0.15, px, py, T*0.52);
      cgrad.addColorStop(0, 'rgba(0,0,0,0)');
      cgrad.addColorStop(0.7, rc.light);
      cgrad.addColorStop(1, 'rgba(0,0,0,0)');
      g.strokeStyle = rc.light;
      g.lineWidth = T * 0.08;
      g.stroke();
      g.restore();

    } else {
      // ── STRAIGHT TILE ──────────────────────────────────────────────────────
      g.fillStyle = rc.border;
      g.fillRect(0, 0, T, T);

      const isH = type === 'h';
      const x1 = isH ? 0 : T * 0.07;
      const y1 = isH ? T * 0.07 : 0;
      const x2 = isH ? T : T * 0.93;
      const y2 = isH ? T * 0.93 : T;

      // Outer edge strip
      g.fillStyle = rc.edge;
      g.fillRect(x1, y1, x2 - x1, y2 - y1);

      // Main surface
      const margin = isH ? T * 0.09 : T * 0.09;
      g.fillStyle = rc.base;
      g.fillRect(
        isH ? x1 : x1 + margin * 0.5,
        isH ? y1 + margin * 0.5 : y1,
        isH ? x2 - x1 : x2 - x1 - margin,
        isH ? y2 - y1 - margin : y2 - y1
      );

      // Center lighter band
      g.fillStyle = rc.mid;
      g.globalAlpha = 0.7;
      if (isH) {
        g.fillRect(0, T * 0.3, T, T * 0.4);
      } else {
        g.fillRect(T * 0.3, 0, T * 0.4, T);
      }
      g.globalAlpha = 1;

      // Center highlight
      g.fillStyle = rc.light;
      if (isH) {
        g.fillRect(0, T * 0.42, T, T * 0.16);
      } else {
        g.fillRect(T * 0.42, 0, T * 0.16, T);
      }

      // Edge shadow lines (road border detail)
      g.strokeStyle = 'rgba(0,0,0,0.35)';
      g.lineWidth = T * 0.03;
      if (isH) {
        g.beginPath(); g.moveTo(0, T*0.09); g.lineTo(T, T*0.09); g.stroke();
        g.beginPath(); g.moveTo(0, T*0.91); g.lineTo(T, T*0.91); g.stroke();
      } else {
        g.beginPath(); g.moveTo(T*0.09, 0); g.lineTo(T*0.09, T); g.stroke();
        g.beginPath(); g.moveTo(T*0.91, 0); g.lineTo(T*0.91, T); g.stroke();
      }
    }

    // ── SURFACE TEXTURE ──────────────────────────────────────────────────────
    const tRng = mulberry32(T * 7 + (type.charCodeAt(0) || 0));
    if (theme === 'graveyard') {
      // Dirt pebbles & cracks
      for (let i = 0; i < 8; i++) {
        const sx = tRng() * T, sy = tRng() * T;
        g.globalAlpha = 0.15 + tRng() * 0.2;
        g.fillStyle = tRng() < 0.5 ? '#6a5030' : '#8a7050';
        g.beginPath(); g.ellipse(sx, sy, 1.5 + tRng()*3, 1 + tRng()*2, tRng()*Math.PI, 0, Math.PI*2); g.fill();
      }
      // Occasional crack line
      if (tRng() < 0.4) {
        g.strokeStyle = rc.crack; g.lineWidth = 0.8; g.globalAlpha = 0.5;
        const cx = tRng()*T*0.8+T*0.1, cy = tRng()*T*0.8+T*0.1;
        g.beginPath(); g.moveTo(cx, cy);
        g.lineTo(cx+(tRng()-0.5)*T*0.5, cy+(tRng()-0.5)*T*0.5);
        g.stroke();
      }
    } else if (theme === 'arctic') {
      // Ice crack lines
      for (let i = 0; i < 3; i++) {
        if (tRng() < 0.5) {
          g.strokeStyle = 'rgba(220,245,255,0.45)'; g.lineWidth = 0.7; g.globalAlpha = 0.6;
          const fx = tRng()*T, fy = tRng()*T;
          g.beginPath(); g.moveTo(fx, fy); g.lineTo(fx+(tRng()-0.5)*T*0.5, fy+(tRng()-0.5)*T*0.4); g.stroke();
        }
      }
      // Snow sparkle dots
      for (let i = 0; i < 5; i++) {
        g.globalAlpha = 0.2 + tRng()*0.3;
        g.fillStyle = '#ffffff';
        g.beginPath(); g.arc(tRng()*T, tRng()*T, 0.8+tRng()*1.5, 0, Math.PI*2); g.fill();
      }
    } else if (theme === 'volcanic' || theme === 'hell') {
      // Lava glow cracks
      for (let i = 0; i < 4; i++) {
        if (tRng() < 0.35) {
          const gx = tRng()*T, gy = tRng()*T;
          const gl = g.createRadialGradient(gx, gy, 0, gx, gy, T*0.18);
          gl.addColorStop(0, theme==='hell'?'rgba(255,40,0,0.6)':'rgba(255,120,0,0.5)');
          gl.addColorStop(1, 'rgba(0,0,0,0)');
          g.fillStyle = gl; g.beginPath(); g.arc(gx, gy, T*0.18, 0, Math.PI*2); g.fill();
        }
      }
    } else if (theme === 'urban') {
      // Asphalt noise
      for (let i = 0; i < 12; i++) {
        g.globalAlpha = 0.06 + tRng()*0.1;
        g.fillStyle = tRng()<0.5 ? '#333' : '#777';
        g.fillRect(tRng()*T, tRng()*T, 1+tRng()*3, 1+tRng()*2);
      }
    } else if (theme === 'nuclear') {
      // Green glow patches
      for (let i = 0; i < 3; i++) {
        if (tRng() < 0.3) {
          const gx = tRng()*T, gy = tRng()*T;
          const gl = g.createRadialGradient(gx, gy, 0, gx, gy, T*0.15);
          gl.addColorStop(0, 'rgba(140,230,0,0.35)');
          gl.addColorStop(1, 'rgba(80,180,0,0)');
          g.fillStyle = gl; g.beginPath(); g.arc(gx, gy, T*0.15, 0, Math.PI*2); g.fill();
        }
      }
    } else if (theme === 'shadow') {
      // Purple sparkles
      for (let i = 0; i < 5; i++) {
        g.globalAlpha = 0.15 + tRng()*0.25;
        g.fillStyle = tRng()<0.5 ? '#9900ff' : '#cc00ff';
        g.beginPath(); g.arc(tRng()*T, tRng()*T, 0.5+tRng()*2, 0, Math.PI*2); g.fill();
      }
    } else if (theme === 'omega') {
      // Red circuit lines
      if (tRng() < 0.5) {
        g.strokeStyle = 'rgba(220,0,30,0.3)'; g.lineWidth = 0.8;
        const isH2 = type === 'h';
        g.beginPath(); g.moveTo(isH2?0:T*0.5, isH2?T*0.5:0); g.lineTo(isH2?T:T*0.5, isH2?T*0.5:T); g.stroke();
      }
    }
    g.globalAlpha = 1;
    g.restore();
    return oc;
  }

  // ── Determine tile type from path context ─────────────────────────────────
  function _getPathTileType(path, idx) {
    const [c, r] = path[idx];
    const prev = idx > 0 ? path[idx-1] : null;
    const next = idx < path.length-1 ? path[idx+1] : null;

    const fromDir = prev ? { dc: c - prev[0], dr: r - prev[1] } : null;
    const toDir   = next ? { dc: next[0] - c, dr: next[1] - r } : null;

    // If only one neighbor, it's a straight matching that direction
    const dir = toDir || fromDir;
    if (!toDir || !fromDir) {
      return (dir.dc !== 0) ? 'h' : 'v';
    }

    // Straight
    if (fromDir.dc === toDir.dc || fromDir.dr === toDir.dr) {
      return (toDir.dc !== 0) ? 'h' : 'v';
    }

    // Corner: determine which quadrant pivot is at
    // The "inside" corner pivot is where from-direction and to-direction both point
    // coming FROM left (dc=1) and going UP (dr=-1) → pivot at top-right → 'tr'
    // coming FROM right (dc=-1) and going UP (dr=-1) → pivot at top-left → 'tl'
    // coming FROM left (dc=1) and going DOWN (dr=1) → pivot at bottom-right → 'br'
    // coming FROM right (dc=-1) and going DOWN → pivot at bottom-left → 'bl'
    // coming FROM up (dr=1) and going RIGHT (dc=1) → pivot at bottom-right → 'br'
    // coming FROM up (dr=1) and going LEFT (dc=-1) → pivot at bottom-left → 'bl'
    // coming FROM down (dr=-1) and going RIGHT → pivot at top-right → 'tr'
    // coming FROM down (dr=-1) and going LEFT → pivot at top-left → 'tl'

    const fd = fromDir, td = toDir;
    if ((fd.dc===1&&td.dr===-1)||(fd.dr===1&&td.dc===1)) return 'br';
    if ((fd.dc===-1&&td.dr===-1)||(fd.dr===1&&td.dc===-1)) return 'bl';
    if ((fd.dc===1&&td.dr===1)||(fd.dr===-1&&td.dc===1)) return 'tr';
    if ((fd.dc===-1&&td.dr===1)||(fd.dr===-1&&td.dc===-1)) return 'tl';

    return 'h'; // fallback
  }

  function _renderMap(c) {
    const w = map.cols * tileSize, h = map.rows * tileSize;
    const theme = map.theme || 'graveyard';
    const T = tileSize;
    const rng  = mulberry32(42);
    const rng2 = mulberry32(99);
    const rng3 = mulberry32(17);

    // ── THEME PALETTES ───────────────────────────────────────────────────────
    const THEMES = {
      graveyard: {
        sky1:'#0e1f0b', sky2:'#162614', sky3:'#0a150a',
        grass1:'#1a3312', grass2:'#1f3d16', grass3:'#243f18', grassDark:'#0f2009',
        path1:'#5c4a2e', path2:'#6b5738', pathEdge:'#3a2c18', pathDark:'#2a1e0e',
        pathStone:'#7a6848', pathCrack:'rgba(0,0,0,0.35)',
        fog:'rgba(130,190,110,0.06)', vignette:'rgba(0,0,0,0.5)',
        ambient:'rgba(100,180,80,0.04)',
      },
      urban: {
        sky1:'#101012', sky2:'#161618', sky3:'#0a0a0c',
        grass1:'#1a1a1c', grass2:'#202022', grass3:'#252527', grassDark:'#111113',
        path1:'#525252', path2:'#636363', pathEdge:'#282828', pathDark:'#181818',
        pathStone:'#6e6e6e', pathCrack:'rgba(0,0,0,0.4)',
        fog:null, vignette:'rgba(0,0,0,0.55)',
        ambient:'rgba(200,200,255,0.02)',
      },
      volcanic: {
        sky1:'#160500', sky2:'#1e0800', sky3:'#100300',
        grass1:'#1c0900', grass2:'#221000', grass3:'#280d00', grassDark:'#0f0500',
        path1:'#4a2000', path2:'#5c2a00', pathEdge:'#8b2000', pathDark:'#200800',
        pathStone:'#6e3000', pathCrack:'rgba(255,60,0,0.3)',
        fog:'rgba(255,60,0,0.04)', vignette:'rgba(0,0,0,0.5)',
        ambient:'rgba(255,80,0,0.06)',
      },
      arctic: {
        sky1:'#0c1828', sky2:'#10203a', sky3:'#081420',
        grass1:'#c8dff0', grass2:'#d5e8f8', grass3:'#e0eeff', grassDark:'#9ab8d0',
        path1:'#a8c8e0', path2:'#c0d8ee', pathEdge:'#e8f4ff', pathDark:'#6a90b0',
        pathStone:'#d8eaf8', pathCrack:'rgba(200,235,255,0.4)',
        fog:'rgba(200,230,255,0.07)', vignette:'rgba(5,15,35,0.5)',
        ambient:'rgba(180,220,255,0.05)',
      },
      hell: {
        sky1:'#100000', sky2:'#180000', sky3:'#0c0000',
        grass1:'#200000', grass2:'#280000', grass3:'#300000', grassDark:'#150000',
        path1:'#600000', path2:'#780000', pathEdge:'#cc0000', pathDark:'#300000',
        pathStone:'#8a0000', pathCrack:'rgba(255,0,0,0.35)',
        fog:'rgba(255,20,0,0.05)', vignette:'rgba(0,0,0,0.55)',
        ambient:'rgba(200,0,0,0.07)',
      },
      nuclear: {
        sky1:'#0a1200', sky2:'#0f1800', sky3:'#080e00',
        grass1:'#182200', grass2:'#1e2c00', grass3:'#253400', grassDark:'#0e1600',
        path1:'#3a5800', path2:'#4e7000', pathEdge:'#7aaa00', pathDark:'#1e3000',
        pathStone:'#607800', pathCrack:'rgba(120,200,0,0.35)',
        fog:'rgba(100,200,0,0.04)', vignette:'rgba(0,0,0,0.5)',
        ambient:'rgba(120,220,0,0.05)',
      },
      shadow: {
        sky1:'#020206', sky2:'#04040e', sky3:'#010104',
        grass1:'#080818', grass2:'#0c0c22', grass3:'#100e28', grassDark:'#040410',
        path1:'#1e0048', path2:'#2a0066', pathEdge:'#6600cc', pathDark:'#0e0022',
        pathStone:'#380080', pathCrack:'rgba(140,0,255,0.4)',
        fog:'rgba(80,0,200,0.05)', vignette:'rgba(0,0,0,0.6)',
        ambient:'rgba(100,0,200,0.06)',
      },
      omega: {
        sky1:'#000004', sky2:'#00000a', sky3:'#000002',
        grass1:'#04000c', grass2:'#080014', grass3:'#0a0018', grassDark:'#020008',
        path1:'#300008', path2:'#480010', pathEdge:'#dd0025', pathDark:'#180004',
        pathStone:'#600015', pathCrack:'rgba(255,0,35,0.45)',
        fog:'rgba(200,0,30,0.06)', vignette:'rgba(0,0,0,0.6)',
        ambient:'rgba(200,0,30,0.07)',
      },
    };
    const th = THEMES[theme] || THEMES.graveyard;

    // ── 1. SKY / BASE GRADIENT ───────────────────────────────────────────────
    const grad = c.createLinearGradient(0, 0, w*0.3, h);
    grad.addColorStop(0, th.sky1);
    grad.addColorStop(0.45, th.sky2);
    grad.addColorStop(1, th.sky3);
    c.fillStyle = grad;
    c.fillRect(0, 0, w, h);

    // ── 2. GROUND TILES (non-path) — Pre-rendered per-tile rich ground ─────────
    // Pre-render 8 grass tile variants for variety
    const GRASS_VARIANTS = 8;
    const grassTiles = [];
    for (let v = 0; v < GRASS_VARIANTS; v++) {
      const gt = document.createElement('canvas');
      gt.width = gt.height = T;
      const gg = gt.getContext('2d');
      const gRng = mulberry32(v * 1337 + 42);
      const colors = [th.grass1, th.grass2, th.grass3, th.grassDark];

      // Base fill
      gg.fillStyle = colors[v % colors.length];
      gg.fillRect(0, 0, T, T);

      // Subtle variation patches
      for (let p = 0; p < 4; p++) {
        gg.fillStyle = colors[(v + p + 1) % colors.length];
        gg.globalAlpha = 0.2 + gRng()*0.25;
        gg.beginPath();
        gg.ellipse(gRng()*T, gRng()*T, T*(0.2+gRng()*0.4), T*(0.15+gRng()*0.3), gRng()*Math.PI, 0, Math.PI*2);
        gg.fill();
      }
      gg.globalAlpha = 1;

      if (theme === 'graveyard') {
        // Lush grass blades in clusters
        const bladeColors = ['#2a4816','#336120','#1e3a10','#3d7225','#2a5518'];
        for (let b = 0; b < 14; b++) {
          const bx = gRng()*T, by = T*0.7 + gRng()*T*0.3;
          const bh = T*0.12 + gRng()*T*0.2;
          const lean = (gRng()-0.5)*T*0.08;
          gg.strokeStyle = bladeColors[Math.floor(gRng()*bladeColors.length)];
          gg.lineWidth = 1 + gRng()*1.2;
          gg.lineCap = 'round';
          gg.globalAlpha = 0.55 + gRng()*0.4;
          gg.beginPath();
          gg.moveTo(bx, by);
          gg.quadraticCurveTo(bx + lean*0.5, by - bh*0.55, bx + lean, by - bh);
          gg.stroke();
        }
        // Occasional small flowers
        if (gRng() < 0.25) {
          const fx = T*0.2 + gRng()*T*0.6, fy = T*0.2 + gRng()*T*0.5;
          const flColors = ['#ffe066','#ff8888','#ffbbee','#ffffff'];
          const flC = flColors[Math.floor(gRng()*flColors.length)];
          for (let petal = 0; petal < 5; petal++) {
            const pa = (petal/5)*Math.PI*2;
            gg.fillStyle = flC; gg.globalAlpha = 0.7;
            gg.beginPath(); gg.ellipse(fx+Math.cos(pa)*T*0.05, fy+Math.sin(pa)*T*0.05, T*0.04, T*0.025, pa, 0, Math.PI*2); gg.fill();
          }
          gg.fillStyle = '#ffe066'; gg.globalAlpha = 0.9;
          gg.beginPath(); gg.arc(fx, fy, T*0.025, 0, Math.PI*2); gg.fill();
        }
        // Small stones
        if (gRng() < 0.2) {
          gg.fillStyle = '#6a7060'; gg.globalAlpha = 0.5;
          gg.beginPath(); gg.ellipse(T*0.15+gRng()*T*0.7, T*0.3+gRng()*T*0.5, T*0.055+gRng()*T*0.04, T*0.035+gRng()*T*0.03, gRng()*Math.PI, 0, Math.PI*2); gg.fill();
        }
      } else if (theme === 'urban') {
        // Cracked concrete / asphalt
        for (let cr = 0; cr < 4; cr++) {
          gg.strokeStyle = gRng()<0.5?'rgba(0,0,0,0.2)':'rgba(180,180,180,0.1)';
          gg.lineWidth = 0.5 + gRng()*1.2;
          gg.globalAlpha = 0.3 + gRng()*0.4;
          const sx = gRng()*T, sy = gRng()*T;
          gg.beginPath(); gg.moveTo(sx, sy);
          let cx2=sx, cy2=sy;
          for (let s=0; s<3; s++){cx2+=(gRng()-0.5)*T*0.5; cy2+=(gRng()-0.5)*T*0.5; gg.lineTo(cx2,cy2);}
          gg.stroke();
        }
        // Debris specks
        for (let d = 0; d < 8; d++) {
          gg.fillStyle = gRng()<0.5?'#333':'#666';
          gg.globalAlpha = 0.15 + gRng()*0.2;
          gg.fillRect(gRng()*T, gRng()*T, 1+gRng()*3, 1+gRng()*2);
        }
      } else if (theme === 'arctic') {
        // Snow texture - bumps and sparkles
        for (let s = 0; s < 8; s++) {
          const sg2 = gg.createRadialGradient(gRng()*T, gRng()*T, 0, gRng()*T, gRng()*T, T*0.2);
          sg2.addColorStop(0, 'rgba(255,255,255,0.4)'); sg2.addColorStop(1, 'rgba(230,245,255,0)');
          gg.fillStyle = sg2; gg.beginPath(); gg.ellipse(gRng()*T, gRng()*T, T*0.12+gRng()*T*0.1, T*0.07+gRng()*T*0.06, gRng()*Math.PI, 0, Math.PI*2); gg.fill();
        }
        // Ice sparkle dots
        for (let sp = 0; sp < 6; sp++) {
          gg.fillStyle = '#ffffff'; gg.globalAlpha = 0.3 + gRng()*0.5;
          gg.beginPath(); gg.arc(gRng()*T, gRng()*T, 0.5+gRng()*1.5, 0, Math.PI*2); gg.fill();
        }
        // Frozen grass tuft
        if (gRng() < 0.3) {
          const bx = T*0.2+gRng()*T*0.6;
          for (let b = 0; b < 4; b++) {
            gg.strokeStyle = '#aaccdd'; gg.lineWidth = 1; gg.globalAlpha = 0.5;
            gg.beginPath(); gg.moveTo(bx+(b-2)*T*0.06, T*0.85); gg.lineTo(bx+(b-2)*T*0.06+(gRng()-0.5)*T*0.04, T*0.6); gg.stroke();
          }
        }
      } else if (theme === 'volcanic') {
        // Ash and cinder ground
        for (let ash = 0; ash < 6; ash++) {
          gg.fillStyle = gRng()<0.5?'#3a2010':'#4a2818';
          gg.globalAlpha = 0.3+gRng()*0.3;
          gg.beginPath(); gg.ellipse(gRng()*T, gRng()*T, T*0.05+gRng()*T*0.1, T*0.03+gRng()*T*0.07, gRng()*Math.PI, 0, Math.PI*2); gg.fill();
        }
        // Lava crack glow
        if (gRng() < 0.3) {
          const gl2 = gg.createRadialGradient(gRng()*T, gRng()*T, 0, gRng()*T, gRng()*T, T*0.2);
          gl2.addColorStop(0, 'rgba(255,80,0,0.4)'); gl2.addColorStop(1, 'rgba(200,30,0,0)');
          gg.fillStyle = gl2; gg.beginPath(); gg.arc(gRng()*T, gRng()*T, T*0.2, 0, Math.PI*2); gg.fill();
        }
      } else if (theme === 'hell') {
        // Scorched ground
        for (let s = 0; s < 5; s++) {
          gg.fillStyle = gRng()<0.5?'#1a0000':'#2a0400';
          gg.globalAlpha = 0.4+gRng()*0.4;
          gg.beginPath(); gg.ellipse(gRng()*T, gRng()*T, T*0.06+gRng()*T*0.12, T*0.04+gRng()*T*0.08, gRng()*Math.PI, 0, Math.PI*2); gg.fill();
        }
        // Ember glow
        if (gRng() < 0.35) {
          gg.fillStyle = gRng()<0.5?'#ff2200':'#ff6600'; gg.globalAlpha = 0.2+gRng()*0.25;
          gg.beginPath(); gg.arc(gRng()*T, gRng()*T, 1+gRng()*2, 0, Math.PI*2); gg.fill();
        }
      } else if (theme === 'nuclear') {
        // Irradiated ground with glowing patches
        for (let b = 0; b < 12; b++) {
          const bx = gRng()*T, by = T*0.6 + gRng()*T*0.4;
          gg.strokeStyle = gRng()<0.5?'#3a6800':'#507800';
          gg.lineWidth = 1; gg.lineCap = 'round'; gg.globalAlpha = 0.4+gRng()*0.4;
          gg.beginPath(); gg.moveTo(bx, by); gg.quadraticCurveTo(bx+(gRng()-0.5)*T*0.08, by-T*0.06, bx+(gRng()-0.5)*T*0.06, by-T*0.15); gg.stroke();
        }
        if (gRng() < 0.25) {
          const ggl = gg.createRadialGradient(gRng()*T, gRng()*T, 0, gRng()*T, gRng()*T, T*0.18);
          ggl.addColorStop(0, 'rgba(140,220,0,0.45)'); ggl.addColorStop(1, 'rgba(80,160,0,0)');
          gg.fillStyle = ggl; gg.beginPath(); gg.arc(gRng()*T, gRng()*T, T*0.18, 0, Math.PI*2); gg.fill();
        }
      } else if (theme === 'shadow') {
        // Dark void ground with purple wisps
        for (let s = 0; s < 4; s++) {
          const gl3 = gg.createRadialGradient(gRng()*T, gRng()*T, 0, gRng()*T, gRng()*T, T*0.2);
          gl3.addColorStop(0, 'rgba(100,0,200,0.2)'); gl3.addColorStop(1, 'rgba(50,0,120,0)');
          gg.fillStyle = gl3; gg.beginPath(); gg.ellipse(gRng()*T, gRng()*T, T*0.15+gRng()*T*0.1, T*0.1+gRng()*T*0.08, gRng()*Math.PI, 0, Math.PI*2); gg.fill();
        }
        for (let sp = 0; sp < 4; sp++) {
          gg.fillStyle = gRng()<0.5?'#6600cc':'#9900ff'; gg.globalAlpha = 0.1+gRng()*0.2;
          gg.beginPath(); gg.arc(gRng()*T, gRng()*T, 0.5+gRng()*1.5, 0, Math.PI*2); gg.fill();
        }
      } else if (theme === 'omega') {
        // Void metal / corrupted ground
        for (let s = 0; s < 5; s++) {
          gg.strokeStyle = 'rgba(200,0,30,0.15)'; gg.lineWidth = 0.5; gg.globalAlpha = 0.4+gRng()*0.4;
          gg.beginPath(); gg.moveTo(gRng()*T, gRng()*T); gg.lineTo(gRng()*T, gRng()*T); gg.stroke();
        }
        if (gRng() < 0.2) {
          gg.fillStyle = '#ff0020'; gg.globalAlpha = 0.08+gRng()*0.12;
          gg.beginPath(); gg.arc(gRng()*T, gRng()*T, T*0.1+gRng()*T*0.1, 0, Math.PI*2); gg.fill();
        }
      }
      gg.globalAlpha = 1;
      grassTiles.push(gt);
    }

    // Draw ground tiles using pre-rendered variants
    for (let row = 0; row < map.rows; row++) {
      for (let col = 0; col < map.cols; col++) {
        if (map.pathSet.has(`${col},${row}`)) continue;
        const v = rng();
        const tx = col * T, ty = row * T;
        const tileIdx = Math.floor(v * GRASS_VARIANTS);
        c.drawImage(grassTiles[tileIdx], tx, ty);
      }
    }

    // ── 3. GROUND LARGE PATCHES (adds biome depth) ───────────────────────────
    for (let i = 0; i < 80; i++) {
      const gx = rng2() * w, gy = rng2() * h;
      const col = Math.floor(gx / T), row = Math.floor(gy / T);
      if (map.pathSet.has(`${col},${row}`)) continue;
      c.globalAlpha = 0.08 + rng2() * 0.14;
      c.fillStyle = th.grass3;
      c.beginPath();
      c.ellipse(gx, gy, T*(0.4+rng2()*0.8), T*(0.25+rng2()*0.5), rng2()*Math.PI, 0, Math.PI*2);
      c.fill();
    }
    c.globalAlpha = 1;

    // ── 4. THEME-SPECIFIC GROUND FEATURES ────────────────────────────────────
    if (theme === 'graveyard') {
      // Misty wisps
      for (let i = 0; i < 8; i++) {
        const gx = rng3()*w, gy = rng3()*h;
        const col = Math.floor(gx/T), row = Math.floor(gy/T);
        if (map.pathSet.has(`${col},${row}`)) continue;
        const g = c.createRadialGradient(gx, gy, 0, gx, gy, T*1.2);
        g.addColorStop(0, 'rgba(140,200,120,0.12)');
        g.addColorStop(1, 'rgba(140,200,120,0)');
        c.fillStyle = g; c.fillRect(gx-T*1.2, gy-T*1.2, T*2.4, T*2.4);
      }
    }
    if (theme === 'arctic') {
      // Snow mounds
      for (let i = 0; i < 18; i++) {
        const ix = rng3()*w, iy = rng3()*h;
        const col2 = Math.floor(ix/T), row2 = Math.floor(iy/T);
        if (map.pathSet.has(`${col2},${row2}`)) continue;
        c.globalAlpha = 0.5 + rng3()*0.4;
        const sg = c.createRadialGradient(ix, iy, 0, ix, iy, T*0.8);
        sg.addColorStop(0, '#f0f8ff');
        sg.addColorStop(0.5, '#d8eeff');
        sg.addColorStop(1, 'rgba(180,220,255,0)');
        c.fillStyle = sg;
        c.beginPath();
        c.ellipse(ix, iy, T*(0.5+rng3()*0.7), T*(0.3+rng3()*0.35), rng3()*Math.PI, 0, Math.PI*2);
        c.fill();
      }
      c.globalAlpha = 1;
    }
    if (theme === 'volcanic' || theme === 'hell') {
      // Lava cracks in ground
      const lavaColor = theme === 'hell' ? '#cc0000' : '#dd4400';
      for (let i = 0; i < 16; i++) {
        const sx = rng3()*w, sy = rng3()*h;
        const col2 = Math.floor(sx/T), row2 = Math.floor(sy/T);
        if (map.pathSet.has(`${col2},${row2}`)) continue;
        c.globalAlpha = 0.25 + rng3()*0.3;
        c.strokeStyle = lavaColor; c.lineWidth = 1.5; c.lineCap = 'round';
        c.beginPath(); c.moveTo(sx, sy);
        let cx2=sx, cy2=sy;
        for(let j=0;j<4;j++){cx2+=(rng3()-0.5)*T*1.5; cy2+=(rng3()-0.5)*T*1.2; c.lineTo(cx2,cy2);}
        c.stroke();
      }
      c.globalAlpha = 1;
    }
    if (theme === 'nuclear') {
      // Glowing radioactive pools
      for (let i = 0; i < 12; i++) {
        const px = rng3()*w, py = rng3()*h;
        const col2 = Math.floor(px/T), row2 = Math.floor(py/T);
        if (map.pathSet.has(`${col2},${row2}`)) continue;
        const pg = c.createRadialGradient(px, py, 0, px, py, T*0.7);
        pg.addColorStop(0, 'rgba(150,230,0,0.35)');
        pg.addColorStop(0.6, 'rgba(100,180,0,0.15)');
        pg.addColorStop(1, 'rgba(80,150,0,0)');
        c.fillStyle = pg;
        c.beginPath();
        c.ellipse(px, py, T*(0.45+rng3()*0.5), T*(0.25+rng3()*0.3), rng3()*Math.PI, 0, Math.PI*2);
        c.fill();
      }
    }
    if (theme === 'shadow' || theme === 'omega') {
      // Void rifts
      const riftColor = theme === 'omega' ? 'rgba(220,0,30,0.3)' : 'rgba(120,0,255,0.25)';
      for (let i = 0; i < 10; i++) {
        const sx = rng3()*w, sy = rng3()*h;
        c.globalAlpha = 0.6 + rng3()*0.35;
        c.strokeStyle = riftColor; c.lineWidth = 2; c.lineCap = 'round';
        c.beginPath(); c.moveTo(sx, sy);
        let cx2=sx, cy2=sy;
        for(let j=0;j<6;j++){cx2+=(rng3()-0.5)*T*1.8; cy2+=(rng3()-0.5)*T*1.5; c.lineTo(cx2,cy2);}
        c.stroke();
      }
      c.globalAlpha = 1;
    }
    if (theme === 'urban') {
      // Cracked asphalt lines
      for (let i = 0; i < 20; i++) {
        const sx = rng3()*w, sy = rng3()*h;
        const col2 = Math.floor(sx/T), row2 = Math.floor(sy/T);
        if (map.pathSet.has(`${col2},${row2}`)) continue;
        c.globalAlpha = 0.15 + rng3()*0.2;
        c.strokeStyle = '#888'; c.lineWidth = 0.8;
        c.beginPath(); c.moveTo(sx, sy);
        let cx2=sx, cy2=sy;
        for(let j=0;j<3;j++){cx2+=(rng3()-0.5)*T; cy2+=(rng3()-0.5)*T; c.lineTo(cx2,cy2);}
        c.stroke();
      }
      c.globalAlpha = 1;
    }

    // ── 5. PATH — Tile-by-tile rendering (straight + corners) ────────────────
    const tileCache = {};
    ['h','v','tl','tr','bl','br'].forEach(type => {
      tileCache[type] = _makePathTile(T, type, theme);
    });
    map.path.forEach(([pc, pr], idx) => {
      const type = _getPathTileType(map.path, idx);
      const tile = tileCache[type];
      if (tile) c.drawImage(tile, pc * T, pr * T);
    });


    // ── 6. DECORATIONS on non-path tiles (rich themed art) ──────────────────
    {
      let placed = 0;
      const decRng = mulberry32(55);
      const maxDeco = Math.min(80, map.cols * map.rows * 0.18);
      for (let row = 0; row < map.rows && placed < maxDeco; row++) {
        for (let col = 0; col < map.cols && placed < maxDeco; col++) {
          if (map.pathSet.has(`${col},${row}`)) continue;
          if (decRng() < 0.13) {
            const dx = col*T + T*0.2 + decRng()*T*0.6, dy = row*T + T*0.2 + decRng()*T*0.6;
            c.globalAlpha = 0.7 + decRng()*0.3;
            _drawMapDeco(c, theme, dx, dy, T * 0.42, decRng);
            c.globalAlpha = 1;
            placed++;
          }
        }
      }
    }

    // ── 7. AMBIENT GLOW OVERLAY ──────────────────────────────────────────────
    if (th.ambient) {
      c.fillStyle = th.ambient;
      c.fillRect(0, 0, w, h);
    }

    // ── 8. EDGE VIGNETTE ─────────────────────────────────────────────────────
    const vg = c.createRadialGradient(w/2, h/2, h*0.15, w/2, h/2, h*0.9);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, th.vignette);
    c.fillStyle = vg;
    c.fillRect(0, 0, w, h);

    // Fog overlay
    if (th.fog) {
      c.fillStyle = th.fog;
      c.fillRect(0, 0, w, h);
    }

    // ── 9. PATH EDGE SHADOWS — drop shadow from path onto adjacent grass ────
    map.path.forEach(([pc, pr]) => {
      [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dc, dr]) => {
        const nc = pc+dc, nr = pr+dr;
        if (nc<0||nc>=map.cols||nr<0||nr>=map.rows) return;
        if (map.pathSet.has(`${nc},${nr}`)) return;
        const fromX = pc*T+T/2, fromY = pr*T+T/2;
        const shiftX = (nc-pc)*T*0.5, shiftY = (nr-pr)*T*0.5;
        const sg = c.createRadialGradient(fromX+shiftX*0.2, fromY+shiftY*0.2, 0, fromX+shiftX*0.2, fromY+shiftY*0.2, T*0.7);
        sg.addColorStop(0, 'rgba(0,0,0,0.3)');
        sg.addColorStop(1, 'rgba(0,0,0,0)');
        c.fillStyle = sg;
        c.fillRect(nc*T, nr*T, T, T);
      });
    });

    // ── 10. START / END PORTALS ──────────────────────────────────────────────
    const [sc, sr] = map.path[0];
    const [ec, er] = map.path[map.path.length-1];
    _drawPortal(c, sc*T, sr*T, T, '#27ae60', '#2ecc71', 'START');
    _drawPortal(c, ec*T, er*T, T, '#c0392b', '#e74c3c', 'END');
  }

  function _drawPortal(c, x, y, s, col1, col2, label) {
    const cx = x + s/2, cy = y + s/2, r = s * 0.44;
    // Glow
    c.save();
    const glow = c.createRadialGradient(cx, cy, r*0.3, cx, cy, r*1.4);
    glow.addColorStop(0, col2 + '55');
    glow.addColorStop(1, col1 + '00');
    c.fillStyle = glow;
    c.fillRect(x - s*0.4, y - s*0.4, s*1.8, s*1.8);
    // Ring
    c.strokeStyle = col2;
    c.lineWidth = s * 0.07;
    c.beginPath(); c.arc(cx, cy, r, 0, Math.PI*2); c.stroke();
    c.strokeStyle = col1;
    c.lineWidth = s * 0.04;
    c.beginPath(); c.arc(cx, cy, r * 0.75, 0, Math.PI*2); c.stroke();
    // Fill
    c.fillStyle = col1 + 'aa';
    c.beginPath(); c.arc(cx, cy, r * 0.68, 0, Math.PI*2); c.fill();
    c.fillStyle = col2 + '55';
    c.beginPath(); c.arc(cx, cy, r * 0.5, 0, Math.PI*2); c.fill();
    // Label
    c.font = `bold ${Math.floor(s*0.28)}px monospace`;
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = '#fff';
    c.shadowBlur = 6; c.shadowColor = '#000';
    c.fillText(label, cx, cy);
    c.shadowBlur = 0;
    c.restore();
  }

  // ── Minimap ───────────────────────────────────
  let minimapCanvas = null, minimapCtx = null;
  const MM_W = 120, MM_H = 72;

  function _buildMinimap() {
    let mm = document.getElementById('minimap');
    if (!mm) {
      mm = document.createElement('div');
      mm.id = 'minimap';
      mm.innerHTML = '<canvas id="mmCanvas"></canvas><div id="minimap-label">MINIMAP</div>';
      document.querySelector('.canvas-wrap').appendChild(mm);
    }
    minimapCanvas = document.getElementById('mmCanvas');
    minimapCanvas.width  = MM_W;
    minimapCanvas.height = MM_H;
    minimapCtx = minimapCanvas.getContext('2d');
  }

  function _drawMinimap() {
    if (!minimapCtx || !map) return;
    const c = minimapCtx;
    const scX = MM_W / map.cols, scY = MM_H / map.rows;
    c.clearRect(0, 0, MM_W, MM_H);

    // BG
    c.fillStyle = map.bgColor || '#1a2a15';
    c.fillRect(0, 0, MM_W, MM_H);

    // Path
    c.strokeStyle = map.pathColor || '#4a3820';
    c.lineWidth = Math.max(scX, scY) * 0.88;
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath();
    map.path.forEach(([pc,pr],i)=>{
      const px=(pc+0.5)*scX, py=(pr+0.5)*scY;
      i===0?c.moveTo(px,py):c.lineTo(px,py);
    });
    c.stroke();

    // Towers (cyan dots)
    towers.forEach(t => {
      const mx=t.tileX*scX+scX/2, my=t.tileY*scY+scY/2;
      c.beginPath(); c.arc(mx, my, 2, 0, Math.PI*2);
      c.fillStyle = t.def.ownerOnly ? t.def.color : '#22d3ee';
      c.fill();
    });

    // Enemies (red/gold dots)
    enemies.forEach(e => {
      if (e.dead) return;
      const ex=(e.x/tileSize)*scX, ey=(e.y/tileSize)*scY;
      c.beginPath(); c.arc(ex, ey, e.isBoss?3:1.5, 0, Math.PI*2);
      c.fillStyle = e.isBoss?'#f1c40f':'#ef4444';
      c.fill();
    });

    // Border
    c.strokeStyle = 'rgba(6,182,212,0.25)';
    c.lineWidth = 1;
    c.strokeRect(0.5, 0.5, MM_W-1, MM_H-1);
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
    killFeed = killFeed.filter(k => k.age < 4.0);
    killFeed.forEach(k => k.age += rawDt);

    // Spawn queue
    if (waveActive && waveSpawnQueue.length > 0) {
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        const e = waveSpawnQueue.shift();
        if (e) {
          enemies.push(new Enemy(e.type, map.path, tileSize, wave, map.waveModifier));
          spawnTimer = Math.max(0.18, (e.interval || 0.5) * 0.88);
        } else {
          spawnTimer = 0.5;
        }
      }
    }

    // Wave complete check
    if (waveActive && waveSpawnQueue.length === 0 && enemies.length === 0) {
      waveActive = false;

      // Interest income between waves (5% of current gold, min 10)
      const interest = Math.max(15, Math.floor(money * 0.06));
      money += interest;
      _updateHUD();
      _floatText(`+${interest} INTEREST EARNED`, 'gold');

      if (currentWaveIndex >= waves.length) {
        _triggerVictory();
        return;
      }
      // XP for wave clear
      const _perfectWave = lives >= _livesAtWaveStart;
      const _waveXP = AccountLevel.XP_TABLE.waveClear
        + wave * AccountLevel.XP_TABLE.surviveWaves
        + (_perfectWave ? AccountLevel.XP_TABLE.perfectWave : 0);
      const _luWave = AccountLevel.awardXP(_waveXP);
      _luWave.forEach(lu => _handleLevelUp(lu));
      if (_perfectWave) _floatText('PERFECT WAVE! +60 XP', '#00e5ff');
      _updateLevelHUD();
      const waveBtn = document.getElementById('btnStartWave');
      waveBtn.textContent = '▶ SEND WAVE';
      waveBtn.classList.add('pulse-green');
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
        _floatText('STOMP!', 'red');
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
        // Award XP
        const _killXP = e.isBoss
          ? AccountLevel.XP_TABLE.bossKill
          : AccountLevel.XP_TABLE.kill;
        const _luKill = AccountLevel.awardXP(_killXP);
        _luKill.forEach(lu => _handleLevelUp(lu));
        kills++;
        totalCoinsEarned += e.reward;
        _spawnDmgNum(e.x, e.y, `+${e.reward}`, false);
        if (e.isBoss) {
          shakeAmount = 18;
          killFeed.unshift({ text:`${e.name} KILLED`, age:0, boss:true });
          _floatText(`${e.name} DEFEATED! +${e.reward}`, 'gold');
        } else if (kills % 50 === 0) {
          killFeed.unshift({ text:`${kills} KILLS`, age:0, boss:false });
          _spawnStreakPop(`💀 ${kills} KILLS!`);
        } else if (kills % 10 === 0) {
          killFeed.unshift({ text:`${kills} KILLS`, age:0, boss:false });
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

      // Draw tower preview using canvas art
      ctx.globalAlpha = 0.7;
      const previewFn = (typeof TowerArt !== 'undefined' && TowerArt[placingTower.id]) || null;
      if (previewFn) previewFn(ctx, col*tileSize+tileSize/2, row*tileSize+tileSize/2, tileSize, placingTower.color);
      ctx.globalAlpha = 1;
      // Cost label
      ctx.font = `bold ${Math.floor(tileSize*0.28)}px sans-serif`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = money >= placingTower.cost ? '#2ecc71' : '#e74c3c';
      ctx.fillText(`$${placingTower.cost}`, col*tileSize+tileSize/2, row*tileSize+tileSize*0.82);
      // AIR badge on preview
      if (placingTower.isAir) {
        ctx.font = `bold ${Math.floor(tileSize*0.22)}px 'Barlow Condensed', sans-serif`;
        ctx.fillStyle = '#00e5ff';
        ctx.fillText('AIR', col*tileSize+tileSize/2, row*tileSize+tileSize*0.18);
      }
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

    // Minimap
    _drawMinimap();
  }

  function _spawnStreakPop(text) {
    const el = document.createElement('div');
    el.className = 'streak-pop';
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1900);
  }

  function _updateBossBar() {
    const bar   = document.getElementById('bossBar');
    const boss  = enemies.find(e => e.isBoss && !e.dead);
    if (boss) {
      bar.classList.add('visible');
      document.getElementById('bossBarLabel').textContent = boss.name;
      document.getElementById('bossBarHp').textContent    = `${Math.ceil(boss.hp)} / ${boss.maxHp}`;
      document.getElementById('bossBarFill').style.width  = `${(boss.hp / boss.maxHp) * 100}%`;
    } else {
      bar.classList.remove('visible');
    }
  }

  function _drawKillFeed(c) {
    if (killFeed.length === 0) return;
    const W = canvas.width;
    killFeed.slice(0, 6).forEach((k, i) => {
      const alpha = Math.max(0, 1 - k.age / 4.0);
      c.save();
      c.globalAlpha = alpha;
      const fs = k.boss ? 13 : 11;
      c.font = `700 ${fs}px 'Barlow Condensed', sans-serif`;
      const tw = c.measureText(k.text).width;
      const px = W - 14, py = 16 + i * 20;
      // Pill bg
      c.fillStyle = k.boss ? 'rgba(80,60,0,0.7)' : 'rgba(60,0,0,0.6)';
      c.beginPath();
      c.roundRect(px - tw - 14, py - fs*0.7, tw + 18, fs*1.5, 4);
      c.fill();
      // Dot
      c.fillStyle = k.boss ? '#f1c40f' : '#e74c3c';
      c.beginPath(); c.arc(px - tw - 6, py + fs*0.05, 3.5, 0, Math.PI*2); c.fill();
      // Text
      c.fillStyle = k.boss ? '#f1c40f' : '#ff8080';
      c.textAlign = 'right';
      c.fillText(k.text, px, py + fs*0.35);
      c.restore();
    });
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
        UI.toast(`${placingTower.name} PLACED!`, 'green');
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
    if (col < 0 || col >= map.cols || row < 0 || row >= map.rows) return false;
    if (towers.some(t => t.tileX === col && t.tileY === row)) return false;
    // Air towers can be placed over path tiles
    const isPath = map.pathSet.has(`${col},${row}`);
    if (isPath && !placingTower?.isAir) return false;
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
    UI.toast(`UP: ${selectedTower.def.upgrades[selectedTower.level - 1].name}!`, 'green');
  }

  function sellTower() {
    if (!selectedTower) return;
    const val = selectedTower.getSellValue();
    money += val;
    towers = towers.filter(t => t !== selectedTower);
    if (lastPlaced === selectedTower) lastPlaced = null;
    deselectTower();
    _updateHUD();
    UI.toast(`SOLD FOR $${val}`, 'gold');
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
    _livesAtWaveStart = lives;
    lastPlaced  = null; // can't undo across waves
    _updateHUD();
    _updateWavePreview();
    document.getElementById('btnStartWave').classList.remove('pulse-green');
    UI.announceWave(wave, waveData.isBossWave);
  }

  function toggleSpeed() {
    const speeds = [1, 2, 3, 4];
    const idx = speeds.indexOf(speed);
    speed = speeds[(idx + 1) % speeds.length];
    const btn = document.getElementById('btnSpeed');
    btn.textContent = speed + '×';
    btn.dataset.spd = speed;
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
    shakeAmount = 18;
    PF.saveGameResult(wave, score, kills, totalCoinsEarned, AccountLevel.getXP(), false);
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
    // Big XP bonus for completing the map
    const _victoryLUs = AccountLevel.awardXP(AccountLevel.XP_TABLE.mapComplete);
    _victoryLUs.forEach(lu => _handleLevelUp(lu));
    PF.saveGameResult(wave, score, kills, totalCoinsEarned, AccountLevel.getXP(), true);
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
      font-family:'Barlow Condensed',sans-serif; font-size:22px; font-weight:700; letter-spacing:4px;
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
    _updateLevelHUD();

    // Lives danger pulse
    const livesPill = document.getElementById('hudLives').parentElement;
    if (lives <= 3) {
      livesPill.classList.add('lives-danger');
      livesPill.style.borderColor = '';
    } else if (lives <= 8) {
      livesPill.classList.remove('lives-danger');
      livesPill.style.borderColor = 'rgba(251,191,36,0.5)';
    } else {
      livesPill.classList.remove('lives-danger');
      livesPill.style.borderColor = '';
    }
  }


  function _handleLevelUp(lu) {
    const col = AccountLevel.getLevelColor(lu.level);
    // Dramatic level-up overlay
    const el = document.createElement('div');
    el.className = 'levelup-toast';
    el.style.borderColor = col;
    el.style.boxShadow = `0 0 50px ${col}44`;
    el.innerHTML = `
      <div class="lu-big" style="color:${col}">LEVEL ${lu.level}</div>
      <div class="lu-sub">${AccountLevel.getTitle(lu.level)}</div>
      ${lu.display ? `<div class="lu-unlock">🔓 ${lu.display}</div>` : ''}
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
    // Update HUD
    _updateLevelHUD();
    // If it unlocks a tower, refresh tower palette
    if (lu.type === 'tower') UI.updateTowerPalette(map);
  }

  function _updateLevelHUD() {
    const prog = AccountLevel.getProgress();
    const lvlEl = document.getElementById('hudAcctLevel');
    const barEl = document.getElementById('hudXPBar');
    const titleEl = document.getElementById('hudAcctTitle');
    if (lvlEl) {
      lvlEl.textContent = prog.level;
      lvlEl.style.color = AccountLevel.getLevelColor(prog.level);
    }
    if (barEl) {
      barEl.style.width = (prog.pct * 100).toFixed(1) + '%';
      barEl.style.background = AccountLevel.getLevelColor(prog.level);
    }
    if (titleEl) titleEl.textContent = AccountLevel.getTitle(prog.level);
  }

    function _updateWavePreview() {
    const panel = document.getElementById('wavePreview');
    if (currentWaveIndex >= waves.length) {
      panel.innerHTML = '<span style="color:var(--grn2);font-family:var(--f-mono);font-size:10px;letter-spacing:1px">✓ ALL WAVES CLEARED</span>';
      return;
    }
    const next = waves[currentWaveIndex];
    const counts = {};
    next.enemies.forEach(g => { counts[g.type] = (counts[g.type] || 0) + g.count; });

    let html = `<div style="font-family:var(--f-mono);font-size:9px;color:var(--txt2);letter-spacing:1px;margin-bottom:5px;display:flex;align-items:center;justify-content:space-between">
      <span>WAVE ${next.number}/${waves.length}</span>
      <span style="color:var(--txt3)">${Object.values(counts).reduce((a,b)=>a+b,0)} units</span>
    </div>`;

    if (next.isBossWave) {
      html += '<div class="wp-boss-tag">⚠ BOSS WAVE</div>';
    }

    Object.entries(counts).forEach(([type, count]) => {
      const def = ENEMY_TYPES[type];
      const imm = def.immunities?.length ? `<span style="color:var(--txt3);font-size:8px">[${def.immunities.slice(0,2).join(',')}${def.immunities.length>2?'…':''}]</span>` : '';
      html += `<div class="wp-enemy-row">
        <div class="wp-e-dot" style="background:${def.color||'#888'}"></div>
        <div class="wp-e-name">${def.name} ${imm}</div>
        <div class="wp-e-count">×${count}</div>
      </div>`;
    });
    panel.innerHTML = html;
  }

  // ── Owner commands ─────────────────────────────
  function ownerAddMoney(amount) {
    money += amount;
    _updateHUD();
    _floatText(`+$${amount} OWNER CASH`, 'gold');
  }

  function ownerSkipWave() {
    enemies = []; bullets = [];
    waveActive = false; waveSpawnQueue = [];
    _floatText('WAVE SKIPPED', 'green');
  }

  function ownerNukeEnemies() {
    // Dramatic nuke effect
    shakeAmount = 30;
    enemies.forEach(e => { e.hp = 0; e.dead = true; });
    bullets = [];
    _floatText('NUKE ACTIVATED', 'red');
    setTimeout(() => {
      enemies = []; waveActive = false; waveSpawnQueue = [];
    }, 100);
  }

  function ownerGodMode() {
    godMode = !godMode;
    _floatText(godMode ? 'GOD MODE ON' : 'GOD MODE OFF', godMode?'green':'red');
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
    const levels = [1, 2, 4, 8, 12, 16, 1];
    ownerSpeedLevel = (ownerSpeedLevel + 1) % levels.length;
    speed = levels[ownerSpeedLevel];
    const btn = document.getElementById('btnSpeed');
    btn.textContent = speed + '×';
    btn.dataset.spd = speed;
    _floatText(`⚡ SPEED: ${speed}×`, speed >= 12 ? 'red' : 'gold');
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

// ── Map Decoration Renderer ───────────────────────────────
function _drawMapDeco(ctx, theme, x, y, s, rng) {
  ctx.save();
  ctx.translate(x, y);
  const p = rng();
  const S = s / 10;

  switch (theme) {
    case 'graveyard': {
      if (p < 0.33) {
        const tw = S*8, th2 = S*13;
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath(); ctx.ellipse(S, S*5, tw*0.5, S*1.5, 0, 0, Math.PI*2); ctx.fill();
        const sg = ctx.createLinearGradient(-tw/2, -th2/2, tw/2, th2/2);
        sg.addColorStop(0, '#8a9a8c'); sg.addColorStop(1, '#5a6a5c');
        ctx.fillStyle = sg;
        ctx.beginPath(); ctx.roundRect(-tw/2, -th2*0.35, tw, th2*0.85, S*1.5); ctx.fill();
        ctx.beginPath(); ctx.arc(0, -th2*0.35, tw/2, Math.PI, 0); ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = S*0.8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, -th2*0.2); ctx.lineTo(0, th2*0.25); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-S*2.5, -th2*0.05); ctx.lineTo(S*2.5, -th2*0.05); ctx.stroke();
        ctx.fillStyle = '#3a6a30'; ctx.globalAlpha = 0.35;
        ctx.beginPath(); ctx.ellipse(-S*2, -th2*0.28, S*2, S, 0.3, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;
      } else if (p < 0.66) {
        ctx.strokeStyle = '#3a2c18'; ctx.lineWidth = S*2.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, S*12); ctx.lineTo(0, -S*2); ctx.stroke();
        [[(-S*6), -S*7, -S*2, -S*4], [S*5, -S*6, -S, -S*3], [-S*4, -S*2, -S, S], [S*3, -S, S*0.5, S*2]].forEach(([bx, by, ox, oy]) => {
          ctx.lineWidth = S*1.2;
          ctx.beginPath(); ctx.moveTo(ox, oy); ctx.quadraticCurveTo(ox+(bx-ox)*0.5, oy+(by-oy)*0.3+S, bx, by); ctx.stroke();
        });
        ctx.lineWidth = S;
        [[-S*3,S*12],[-S*1.5,S*13],[S*2,S*13],[S*3.5,S*12]].forEach(([rx,ry]) => {
          ctx.beginPath(); ctx.moveTo(0, S*10); ctx.quadraticCurveTo(rx*0.5, S*11.5, rx, ry); ctx.stroke();
        });
      } else {
        const wg = ctx.createRadialGradient(0, 0, 0, 0, 0, S*8);
        wg.addColorStop(0, 'rgba(160,220,140,0.5)'); wg.addColorStop(1, 'rgba(100,180,80,0)');
        ctx.fillStyle = wg; ctx.beginPath(); ctx.arc(0, 0, S*8, 0, Math.PI*2); ctx.fill();
        for (let m = 0; m < 3; m++) {
          const mx = (m-1)*S*4, my = S*5;
          ctx.fillStyle = '#c0392b';
          ctx.beginPath(); ctx.arc(mx, my-S*2.5, S*2.5, Math.PI, 0); ctx.fill();
          ctx.fillStyle = '#922b21'; ctx.fillRect(mx-S*0.8, my-S*2.5, S*1.6, S*3);
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.beginPath(); ctx.arc(mx-S, my-S*3.5, S*0.6, 0, Math.PI*2); ctx.fill();
        }
      }
      break;
    }
    case 'urban': {
      if (p < 0.3) {
        const bh = S*(6+rng()*6), bw = S*(7+rng()*5);
        const bg2 = ctx.createLinearGradient(-bw/2, -bh, bw/2, 0);
        bg2.addColorStop(0, '#4a4a4a'); bg2.addColorStop(1, '#333');
        ctx.fillStyle = bg2;
        ctx.beginPath(); ctx.moveTo(-bw/2, S*8); ctx.lineTo(-bw/2, -bh+rng()*S*4); ctx.lineTo(-bw/4, -bh-rng()*S*3);
        ctx.lineTo(bw/4, -bh+rng()*S*2); ctx.lineTo(bw/2, -bh+rng()*S*4); ctx.lineTo(bw/2, S*8); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        for (let wr = 0; wr < 2; wr++) for (let wc = 0; wc < 2; wc++) {
          if (rng() < 0.6) ctx.fillRect(-bw/2+S*1.5+wc*S*3.5, -bh*0.7+wr*S*4, S*2.5, S*2.5);
        }
      } else if (p < 0.6) {
        ctx.fillStyle = '#555'; ctx.beginPath(); ctx.roundRect(-S*7, -S*2, S*14, S*6, S*1.5); ctx.fill();
        ctx.fillStyle = '#444'; ctx.beginPath(); ctx.roundRect(-S*5, -S*5, S*10, S*4, S); ctx.fill();
        ctx.fillStyle = 'rgba(100,150,180,0.25)';
        ctx.fillRect(-S*4.5, -S*4.5, S*4, S*3); ctx.fillRect(S*0.5, -S*4.5, S*4, S*3);
        [[-S*5,S*4],[S*5,S*4]].forEach(([wx,wy]) => {
          ctx.fillStyle='#222'; ctx.beginPath(); ctx.arc(wx,wy,S*2.5,0,Math.PI*2); ctx.fill();
          ctx.fillStyle='#444'; ctx.beginPath(); ctx.arc(wx,wy,S*1.2,0,Math.PI*2); ctx.fill();
        });
      } else {
        ctx.strokeStyle = '#666'; ctx.lineWidth = S*1.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, S*12); ctx.lineTo(0, -S*6); ctx.quadraticCurveTo(S, -S*10, S*5, -S*11); ctx.stroke();
        ctx.fillStyle = rng()<0.5 ? '#ffe082' : '#333';
        ctx.beginPath(); ctx.ellipse(S*5, -S*11, S*2, S*1.2, 0, 0, Math.PI*2); ctx.fill();
      }
      break;
    }
    case 'volcanic': {
      if (p < 0.4) {
        ctx.fillStyle = '#2a1000';
        const n = 6+Math.floor(rng()*4);
        const pts = Array.from({length:n}, (_,i) => { const a=(i/n)*Math.PI*2-Math.PI/2, r2=S*(5+rng()*6); return [Math.cos(a)*r2, Math.sin(a)*r2*0.7-S*2]; });
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); pts.forEach(([px,py])=>ctx.lineTo(px,py)); ctx.closePath(); ctx.fill();
        ctx.fillStyle='#4a2000'; ctx.globalAlpha=0.6;
        ctx.beginPath(); ctx.moveTo(pts[0][0]*0.6,pts[0][1]*0.6); pts.slice(0,3).forEach(([px,py])=>ctx.lineTo(px*0.6,py*0.6)); ctx.closePath(); ctx.fill(); ctx.globalAlpha=1;
      } else if (p < 0.7) {
        const lg2 = ctx.createRadialGradient(0,S*2,0,0,S*2,S*8);
        lg2.addColorStop(0,'#ff8c00'); lg2.addColorStop(0.4,'#dd4400'); lg2.addColorStop(1,'#660000');
        ctx.fillStyle=lg2; ctx.beginPath(); ctx.ellipse(0,S*3,S*7,S*4,0,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='#3a1000'; ctx.lineWidth=S*1.2;
        ctx.beginPath(); ctx.ellipse(0,S*3,S*7,S*4,0,0,Math.PI*2); ctx.stroke();
      } else {
        for (let sp=0; sp<5; sp++) {
          const sx2=(sp-2)*S*3.5, sh=S*(6+rng()*7);
          const sg2=ctx.createLinearGradient(sx2-S,S*10,sx2+S,-sh);
          sg2.addColorStop(0,'#1a0a00'); sg2.addColorStop(1,'#4a2000');
          ctx.fillStyle=sg2; ctx.beginPath(); ctx.moveTo(sx2,S*10); ctx.lineTo(sx2-S*1.5,-sh*0.3); ctx.lineTo(sx2,-sh); ctx.lineTo(sx2+S*1.5,-sh*0.3); ctx.closePath(); ctx.fill();
        }
      }
      break;
    }
    case 'arctic': {
      if (p < 0.33) {
        const cols2=['#b3e5fc','#e1f5fe','#81d4fa','#e0f7fa'];
        for (let cr=0; cr<4; cr++) {
          const cx2=(cr-1.5)*S*4+(rng()-0.5)*S*2, cy2=(rng()-0.5)*S*3, ch=S*(5+rng()*7);
          const cg=ctx.createLinearGradient(cx2,cy2,cx2,cy2-ch);
          cg.addColorStop(0,cols2[cr]+'aa'); cg.addColorStop(1,cols2[(cr+1)%4]+'dd');
          ctx.fillStyle=cg; ctx.beginPath(); ctx.moveTo(cx2,cy2+S*3); ctx.lineTo(cx2-S*2,cy2); ctx.lineTo(cx2,cy2-ch); ctx.lineTo(cx2+S*2,cy2); ctx.closePath(); ctx.fill();
        }
      } else if (p < 0.66) {
        const smg=ctx.createRadialGradient(0,S*2,0,0,S*4,S*9);
        smg.addColorStop(0,'#f0f8ff'); smg.addColorStop(0.6,'#d0e8f5'); smg.addColorStop(1,'rgba(160,210,240,0)');
        ctx.fillStyle=smg; ctx.beginPath(); ctx.ellipse(0,S*5,S*9,S*5,0,Math.PI,0); ctx.fill();
        ctx.fillStyle='#ffffff';
        for (let sp=0; sp<5; sp++) { ctx.globalAlpha=0.4+rng()*0.5; ctx.beginPath(); ctx.arc((rng()-0.5)*S*10,S*(2+rng()*5),1+rng()*2,0,Math.PI*2); ctx.fill(); }
        ctx.globalAlpha=1;
      } else {
        ctx.strokeStyle='#4a3a28'; ctx.lineWidth=S*1.5;
        ctx.beginPath(); ctx.moveTo(0,S*12); ctx.lineTo(0,-S*12); ctx.stroke();
        [[0,-S*11,S*6],[0,-S*7,S*8],[0,-S*3,S*10],[0,S,S*11]].forEach(([lx,ly,lw]) => {
          ctx.fillStyle='#2d5a1b'; ctx.globalAlpha=0.9;
          ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(lx-lw,ly+S*4); ctx.lineTo(lx+lw,ly+S*4); ctx.closePath(); ctx.fill();
          ctx.fillStyle='#e8f4ff'; ctx.globalAlpha=0.6;
          ctx.beginPath(); ctx.moveTo(lx,ly-S); ctx.lineTo(lx-lw*0.85,ly+S*3); ctx.lineTo(lx+lw*0.85,ly+S*3); ctx.closePath(); ctx.fill();
        });
        ctx.globalAlpha=1;
      }
      break;
    }
    case 'hell': {
      if (p < 0.3) {
        ctx.fillStyle='#5a0000'; ctx.beginPath(); ctx.arc(0,-S*3,S*7,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#3a0000'; ctx.beginPath(); ctx.roundRect(-S*4,S,S*8,S*6,S); ctx.fill();
        [[-S*2.5,-S*4],[S*2.5,-S*4]].forEach(([ex,ey]) => {
          ctx.fillStyle='#000'; ctx.beginPath(); ctx.ellipse(ex,ey,S*2,S*2.5,0,0,Math.PI*2); ctx.fill();
          ctx.fillStyle='#cc0000'; ctx.globalAlpha=0.7; ctx.beginPath(); ctx.arc(ex,ey,S,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
        });
        ctx.fillStyle='#8a7a6a';
        for (let t=-3; t<=3; t++) { ctx.beginPath(); ctx.moveTo(t*S*1.1,S*2); ctx.lineTo(t*S*1.1-S*0.6,S*5.5); ctx.lineTo(t*S*1.1+S*0.6,S*5.5); ctx.closePath(); ctx.fill(); }
      } else if (p < 0.65) {
        for (let fl=0; fl<3; fl++) {
          const fx=(fl-1)*S*4, fh=S*(8+rng()*6);
          const fg2=ctx.createLinearGradient(fx,S*8,fx,-fh);
          fg2.addColorStop(0,'#cc0000'); fg2.addColorStop(0.4,'#ff4400'); fg2.addColorStop(0.7,'#ff8800'); fg2.addColorStop(1,'rgba(255,200,0,0)');
          ctx.fillStyle=fg2; ctx.beginPath(); ctx.moveTo(fx-S*2.5,S*8); ctx.quadraticCurveTo(fx-S*3,S*2,fx+(rng()-0.5)*S*2,-fh); ctx.quadraticCurveTo(fx+S*3,S*2,fx+S*2.5,S*8); ctx.fill();
        }
      } else {
        ctx.fillStyle='#7a6a58';
        for (let b=0; b<6; b++) {
          const bx=(rng()-0.5)*S*12, by=S*(3+rng()*6), bl=S*(4+rng()*5);
          ctx.save(); ctx.translate(bx,by); ctx.rotate(rng()*Math.PI);
          ctx.beginPath(); ctx.roundRect(-bl/2,-S*0.7,bl,S*1.4,S*0.7); ctx.fill();
          ctx.beginPath(); ctx.arc(-bl/2,0,S*1.2,0,Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(bl/2,0,S*1.2,0,Math.PI*2); ctx.fill();
          ctx.restore();
        }
      }
      break;
    }
    case 'nuclear': {
      if (p < 0.3) {
        const bg3=ctx.createLinearGradient(-S*4,-S*6,S*4,S*8);
        bg3.addColorStop(0,'#3a5a10'); bg3.addColorStop(1,'#1e3000');
        ctx.fillStyle=bg3; ctx.beginPath(); ctx.roundRect(-S*4,-S*6,S*8,S*14,S); ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.roundRect(-S*4,-S*6,S*8,S*14,S); ctx.clip();
        for (let st=-2; st<4; st++) { ctx.fillStyle=st%2===0?'#ffc107':'#333'; ctx.fillRect(-S*5,-S*6+st*S*3,S*10,S*3); }
        ctx.restore();
        const ng=ctx.createRadialGradient(0,0,0,0,0,S*8);
        ng.addColorStop(0,'rgba(120,220,0,0.25)'); ng.addColorStop(1,'rgba(80,180,0,0)');
        ctx.fillStyle=ng; ctx.beginPath(); ctx.arc(0,0,S*8,0,Math.PI*2); ctx.fill();
      } else if (p < 0.65) {
        ctx.strokeStyle='#2a5800'; ctx.lineWidth=S*1.8; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(0,S*12); ctx.quadraticCurveTo(S*2,S*5,S*3,-S*2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(S*3,-S*2); ctx.quadraticCurveTo(-S*4,-S*8,-S*7,-S*4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(S*3,-S*2); ctx.quadraticCurveTo(S*8,-S*6,S*9,-S*2); ctx.stroke();
        ['#88dd00','#aae800','#66cc00'].forEach((col,i)=>{
          const px2=[-S*7,S*9,S*3][i],py2=[-S*4,-S*2,-S*2][i];
          const spg=ctx.createRadialGradient(px2,py2,0,px2,py2,S*3);
          spg.addColorStop(0,col); spg.addColorStop(1,col+'44');
          ctx.fillStyle=spg; ctx.beginPath(); ctx.arc(px2,py2,S*3,0,Math.PI*2); ctx.fill();
        });
      } else {
        ctx.fillStyle='#ffc107'; ctx.beginPath(); ctx.moveTo(0,-S*10); ctx.lineTo(S*9,S*4); ctx.lineTo(-S*9,S*4); ctx.closePath(); ctx.fill();
        ctx.fillStyle='#333'; ctx.font=`bold ${S*7}px monospace`; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText('☢',0,-S*2);
      }
      break;
    }
    case 'shadow': {
      if (p < 0.35) {
        const vg2=ctx.createRadialGradient(0,0,0,0,0,S*9);
        vg2.addColorStop(0,'#000000'); vg2.addColorStop(0.3,'#1a0035'); vg2.addColorStop(0.7,'#300060'); vg2.addColorStop(1,'rgba(50,0,100,0)');
        ctx.fillStyle=vg2; ctx.beginPath(); ctx.arc(0,0,S*9,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#7700dd'; ctx.globalAlpha=0.8;
        ctx.beginPath(); ctx.ellipse(0,0,S*4,S*5.5,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#000'; ctx.globalAlpha=1;
        ctx.beginPath(); ctx.ellipse(0,0,S*2,S*3.5,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#cc00ff'; ctx.globalAlpha=0.6;
        ctx.beginPath(); ctx.arc(S*0.8,-S,S,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
      } else if (p < 0.65) {
        ctx.strokeStyle='#2a0055'; ctx.lineWidth=S*2.5; ctx.lineCap='round';
        for (let t=0; t<3; t++) {
          const ox=(t-1)*S*4;
          ctx.beginPath(); ctx.moveTo(ox,S*12); ctx.bezierCurveTo(ox+(rng()-0.5)*S*6,S*6,ox+(rng()-0.5)*S*8,S*2,ox+(rng()-0.5)*S*6,-S*8); ctx.stroke();
        }
        const tg=ctx.createRadialGradient(0,-S*4,0,0,-S*4,S*5);
        tg.addColorStop(0,'rgba(150,0,255,0.3)'); tg.addColorStop(1,'rgba(80,0,180,0)');
        ctx.fillStyle=tg; ctx.beginPath(); ctx.arc(0,-S*4,S*5,0,Math.PI*2); ctx.fill();
      } else {
        ctx.fillStyle='#4a3020'; ctx.beginPath(); ctx.roundRect(-S*2,S*2,S*4,S*10,S*0.5); ctx.fill();
        const fg2=ctx.createLinearGradient(0,S*2,0,-S*6);
        fg2.addColorStop(0,'#9900dd'); fg2.addColorStop(0.5,'#cc00ff'); fg2.addColorStop(1,'rgba(200,100,255,0)');
        ctx.fillStyle=fg2; ctx.beginPath(); ctx.moveTo(-S*1.5,S*2); ctx.quadraticCurveTo(-S*2.5,-S,0,-S*6); ctx.quadraticCurveTo(S*2.5,-S,S*1.5,S*2); ctx.fill();
        const cg2=ctx.createRadialGradient(0,-S*2,0,0,-S*2,S*7);
        cg2.addColorStop(0,'rgba(180,0,255,0.3)'); cg2.addColorStop(1,'rgba(100,0,200,0)');
        ctx.fillStyle=cg2; ctx.beginPath(); ctx.arc(0,-S*2,S*7,0,Math.PI*2); ctx.fill();
      }
      break;
    }
    case 'omega': {
      if (p < 0.33) {
        const og=ctx.createLinearGradient(-S*2,S*12,S*2,-S*12);
        og.addColorStop(0,'#1a0004'); og.addColorStop(0.5,'#380008'); og.addColorStop(1,'#580010');
        ctx.fillStyle=og; ctx.beginPath(); ctx.moveTo(-S*3,S*12); ctx.lineTo(-S*2.5,S*2); ctx.lineTo(0,-S*12); ctx.lineTo(S*2.5,S*2); ctx.lineTo(S*3,S*12); ctx.closePath(); ctx.fill();
        ctx.strokeStyle='#ff0030'; ctx.lineWidth=S*0.7; ctx.globalAlpha=0.7;
        ctx.beginPath(); ctx.moveTo(-S*1.5,0); ctx.lineTo(S*1.5,0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,-S*3); ctx.lineTo(0,S*3); ctx.stroke();
        ctx.beginPath(); ctx.arc(0,0,S*2,0,Math.PI*2); ctx.stroke(); ctx.globalAlpha=1;
        const ogl=ctx.createRadialGradient(0,0,0,0,0,S*6);
        ogl.addColorStop(0,'rgba(255,0,30,0.2)'); ogl.addColorStop(1,'rgba(200,0,20,0)');
        ctx.fillStyle=ogl; ctx.beginPath(); ctx.arc(0,0,S*6,0,Math.PI*2); ctx.fill();
      } else if (p < 0.66) {
        ctx.fillStyle='#1a0005'; ctx.strokeStyle='#cc0020'; ctx.lineWidth=S*0.8;
        ctx.beginPath(); ctx.roundRect(-S*7,-S*7,S*14,S*14,S); ctx.fill(); ctx.stroke();
        for (let gc=0; gc<2; gc++) {
          const gx=(gc*2-1)*S*3, gy=S;
          ctx.strokeStyle='#880015'; ctx.lineWidth=S*0.5;
          ctx.beginPath(); ctx.arc(gx,gy,S*2.5,0,Math.PI*2); ctx.stroke();
          ctx.beginPath(); ctx.arc(gx,gy,S*1.2,0,Math.PI*2); ctx.stroke();
          for (let t=0; t<8; t++) {
            const ta=(t/8)*Math.PI*2;
            ctx.beginPath(); ctx.moveTo(gx+Math.cos(ta)*S*2.5,gy+Math.sin(ta)*S*2.5); ctx.lineTo(gx+Math.cos(ta)*S*3.2,gy+Math.sin(ta)*S*3.2); ctx.stroke();
          }
        }
      } else {
        ctx.fillStyle='#2a0008';
        ctx.beginPath(); ctx.roundRect(-S*2,-S*12,S*4,S*22,S); ctx.fill();
        ctx.beginPath(); ctx.roundRect(-S*7,-S*6,S*14,S*4,S); ctx.fill();
        const cgl=ctx.createRadialGradient(0,-S*4,0,0,-S*4,S*10);
        cgl.addColorStop(0,'rgba(220,0,30,0.25)'); cgl.addColorStop(1,'rgba(180,0,20,0)');
        ctx.fillStyle=cgl; ctx.beginPath(); ctx.arc(0,-S*4,S*10,0,Math.PI*2); ctx.fill();
      }
      break;
    }
    default:
      ctx.fillStyle='#444'; ctx.beginPath(); ctx.arc(0,0,S*5,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

// ── Simple seedable RNG ───────────────────────────────────
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 0xFFFFFFFF;
  };
}
