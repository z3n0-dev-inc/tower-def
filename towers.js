/* ═══════════════════════════════════════════════
   towers.js — Tower definitions & classes
   
   ── HOW TO TUNE DAMAGE ───────────────────────────
   Edit TOWER_DAMAGE_CONFIG below.
   Changes apply instantly to every tower in the game.
   Format: id: { damage, fireRate, range }
   ─────────────────────────────────────────────── */

const TOWER_DAMAGE_CONFIG = {
  //              damage  fireRate  range
  gunner:       { damage:  20,  fireRate: 1.4,  range: 125 },
  archer:       { damage:  14,  fireRate: 2.0,  range: 165 },
  sniper:       { damage: 100,  fireRate: 0.45, range: 270 },
  rocketeer:    { damage:  75,  fireRate: 0.65, range: 135 },
  freezer:      { damage:  12,  fireRate: 0.9,  range: 115 },
  flamer:       { damage:  10,  fireRate: 9.0,  range:  95 },
  tesla:        { damage:  50,  fireRate: 1.1,  range: 145 },
  laser:        { damage:  15,  fireRate: 16,   range: 185 },
  mortar:       { damage: 120,  fireRate: 0.32, range: 205 },
  venom:        { damage:  25,  fireRate: 1.6,  range: 145 },
  omega:        { damage: 500,  fireRate: 0.28, range: 205 },
  phantom:      { damage: 300,  fireRate: 0.85, range: 310 },
  temporal:     { damage:  35,  fireRate: 0.18, range: 999 },
  reaper:       { damage: 200,  fireRate: 1.0,  range: 205 },
  shadow_commander: { damage: 9999,  fireRate: 3.0, range: 999 },
  neon_warden:      { damage: 9999,  fireRate: 8.0, range: 999 },
  void_hunter:      { damage: 99999, fireRate: 4.0, range: 999 },
};

const TOWER_DEFS = (() => {
  const C = TOWER_DAMAGE_CONFIG;
  return [

  // ── BASIC ───────────────────────────────────────────────────────────────
  {
    id:'gunner', name:'GUNNER', icon:'🔫', rarity:'basic',
    cost:75, shopCost:0, unlocked:true,
    desc:'Rapid automatic fire. Good all-rounder.',
    color:'#3498db',
    range:C.gunner.range, fireRate:C.gunner.fireRate, damage:C.gunner.damage,
    bulletSpeed:300, bulletColor:'#f1c40f', bulletSize:4,
    splash:0, slow:0, pierce:0, maxUpgrade:4,
    upgrades:[
      { name:'Rapid Fire',    cost:80,  dmgBonus:8,   rateBonus:0.5,  rangeBonus:0  },
      { name:'Heavy Rounds',  cost:130, dmgBonus:15,  rateBonus:0.4,  rangeBonus:15 },
      { name:'Minigun',       cost:220, dmgBonus:25,  rateBonus:1.8,  rangeBonus:20 },
      { name:'DEATH MACHINE', cost:400, dmgBonus:60,  rateBonus:3.0,  rangeBonus:30, armorPierce:true },
    ],
  },
  {
    id:'archer', name:'ARCHER', icon:'🏹', rarity:'basic',
    cost:60, shopCost:0, unlocked:true,
    desc:'Long range. Great for chokepoints.',
    color:'#27ae60',
    range:C.archer.range, fireRate:C.archer.fireRate, damage:C.archer.damage,
    bulletSpeed:340, bulletColor:'#2ecc71', bulletSize:3,
    splash:0, slow:0, pierce:1, maxUpgrade:4,
    upgrades:[
      { name:'Longbow',        cost:70,  dmgBonus:8,   rateBonus:0.6,  rangeBonus:30  },
      { name:'Poison Arrows',  cost:120, dmgBonus:12,  rateBonus:0.3,  rangeBonus:20,  burnBonus:3 },
      { name:'Storm Arrows',   cost:200, dmgBonus:18,  rateBonus:1.2,  rangeBonus:35,  pierce:2 },
      { name:'ARROW STORM',    cost:380, dmgBonus:35,  rateBonus:2.0,  rangeBonus:40,  pierce:4, burnBonus:5 },
    ],
  },
  {
    id:'sniper', name:'SNIPER', icon:'🎯', rarity:'basic',
    cost:120, shopCost:250, unlocked:false,
    desc:'Extreme range, high damage, slow fire.',
    color:'#8e44ad',
    range:C.sniper.range, fireRate:C.sniper.fireRate, damage:C.sniper.damage,
    bulletSpeed:650, bulletColor:'#e8daef', bulletSize:3,
    splash:0, slow:0, pierce:2, maxUpgrade:4,
    upgrades:[
      { name:'Scope+',         cost:110, dmgBonus:40,  rateBonus:0.1,  rangeBonus:40  },
      { name:'Armour Pierce',  cost:200, dmgBonus:60,  rateBonus:0.1,  rangeBonus:25,  armorPierce:true },
      { name:'Rail Gun',       cost:350, dmgBonus:150, rateBonus:0.2,  rangeBonus:50,  pierce:5 },
      { name:'RAILCANNON',     cost:700, dmgBonus:350, rateBonus:0.35, rangeBonus:60,  pierce:10, armorPierce:true },
    ],
  },

  // ── ADVANCED ────────────────────────────────────────────────────────────
  {
    id:'rocketeer', name:'ROCKETEER', icon:'🚀', rarity:'advanced',
    cost:200, shopCost:500, unlocked:false,
    desc:'Explosive splash. Demolishes groups.',
    color:'#e67e22',
    range:C.rocketeer.range, fireRate:C.rocketeer.fireRate, damage:C.rocketeer.damage,
    bulletSpeed:210, bulletColor:'#e74c3c', bulletSize:7,
    splash:65, slow:0, pierce:0, maxUpgrade:4,
    upgrades:[
      { name:'Big Rockets',      cost:180, dmgBonus:35,  rateBonus:0.1,  rangeBonus:20,  splashBonus:20 },
      { name:'Cluster Bomb',     cost:280, dmgBonus:60,  rateBonus:0.2,  rangeBonus:15,  splashBonus:35 },
      { name:'Nuclear Warhead',  cost:480, dmgBonus:140, rateBonus:0.18, rangeBonus:25,  splashBonus:65 },
      { name:'ORBITAL STRIKE',   cost:900, dmgBonus:300, rateBonus:0.25, rangeBonus:40,  splashBonus:120, armorPierce:true },
    ],
  },
  {
    id:'freezer', name:'FREEZER', icon:'❄️', rarity:'advanced',
    cost:160, shopCost:450, unlocked:false,
    desc:'Slows enemies. Crucial support.',
    color:'#3498db',
    range:C.freezer.range, fireRate:C.freezer.fireRate, damage:C.freezer.damage,
    bulletSpeed:250, bulletColor:'#85c1e9', bulletSize:8,
    splash:55, slow:0.45, slowDuration:2.0, pierce:0, maxUpgrade:4,
    upgrades:[
      { name:'Arctic Blast',   cost:150, dmgBonus:6,   rateBonus:0.2,  rangeBonus:20,  slowBonus:0.1  },
      { name:'Deep Freeze',    cost:240, dmgBonus:12,  rateBonus:0.25, rangeBonus:25,  slowBonus:0.15 },
      { name:'Absolute Zero',  cost:380, dmgBonus:18,  rateBonus:0.35, rangeBonus:35,  slowBonus:0.2  },
      { name:'CRYO STORM',     cost:700, dmgBonus:35,  rateBonus:0.5,  rangeBonus:50,  slowBonus:0.25, splashBonus:30 },
    ],
  },
  {
    id:'flamer', name:'FLAMETHROWER', icon:'🔥', rarity:'advanced',
    cost:180, shopCost:500, unlocked:false,
    desc:'Continuous burn damage over time.',
    color:'#e74c3c',
    range:C.flamer.range, fireRate:C.flamer.fireRate, damage:C.flamer.damage,
    bulletSpeed:185, bulletColor:'#ff6b35', bulletSize:6,
    splash:22, slow:0, burn:3, pierce:0, maxUpgrade:4,
    upgrades:[
      { name:'Napalm',         cost:160, dmgBonus:5,   rateBonus:2,    rangeBonus:15,  burnBonus:2 },
      { name:'Inferno',        cost:260, dmgBonus:10,  rateBonus:3,    rangeBonus:12,  burnBonus:5 },
      { name:'Dragon Breath',  cost:420, dmgBonus:20,  rateBonus:6,    rangeBonus:22,  burnBonus:9 },
      { name:'HELLFIRE',       cost:800, dmgBonus:45,  rateBonus:10,   rangeBonus:30,  burnBonus:16, splashBonus:20 },
    ],
  },

  // ── SPECIAL ─────────────────────────────────────────────────────────────
  {
    id:'tesla', name:'TESLA COIL', icon:'⚡', rarity:'special',
    cost:350, shopCost:1200, unlocked:false,
    desc:'Chains lightning to multiple enemies.',
    color:'#f39c12',
    range:C.tesla.range, fireRate:C.tesla.fireRate, damage:C.tesla.damage,
    bulletSpeed:550, bulletColor:'#f9e79f', bulletSize:3,
    splash:0, chain:4, slow:0.2, pierce:0, maxUpgrade:4,
    upgrades:[
      { name:'Overcharge',      cost:300, dmgBonus:25,  rateBonus:0.3,  rangeBonus:20,  chainBonus:2 },
      { name:'Ball Lightning',  cost:500, dmgBonus:50,  rateBonus:0.35, rangeBonus:30,  chainBonus:3 },
      { name:'Storm God',       cost:800, dmgBonus:100, rateBonus:0.55, rangeBonus:45,  chainBonus:5 },
      { name:'THUNDER TITAN',   cost:1500,dmgBonus:200, rateBonus:0.8,  rangeBonus:60,  chainBonus:8, armorPierce:true },
    ],
  },
  {
    id:'laser', name:'LASER TOWER', icon:'🔴', rarity:'special',
    cost:400, shopCost:1500, unlocked:false,
    desc:'Continuous beam, ignores armor.',
    color:'#e74c3c',
    range:C.laser.range, fireRate:C.laser.fireRate, damage:C.laser.damage,
    bulletSpeed:999, bulletColor:'#ff0040', bulletSize:2,
    splash:0, slow:0, armorPierce:true, beam:true, pierce:0, maxUpgrade:4,
    upgrades:[
      { name:'Focused Beam',   cost:350, dmgBonus:10,  rateBonus:4,    rangeBonus:30  },
      { name:'Plasma Cutter',  cost:580, dmgBonus:20,  rateBonus:6,    rangeBonus:25  },
      { name:'Death Ray',      cost:950, dmgBonus:40,  rateBonus:10,   rangeBonus:45  },
      { name:'SOLAR CANNON',   cost:1800,dmgBonus:90,  rateBonus:18,   rangeBonus:60,  splashBonus:25 },
    ],
  },
  {
    id:'mortar', name:'MORTAR', icon:'💣', rarity:'special',
    cost:320, shopCost:1100, unlocked:false,
    desc:'Lobs shells with massive splash.',
    color:'#7f8c8d',
    range:C.mortar.range, fireRate:C.mortar.fireRate, damage:C.mortar.damage,
    bulletSpeed:155, bulletColor:'#bdc3c7', bulletSize:10,
    splash:90, slow:0, pierce:0, maxUpgrade:4,
    upgrades:[
      { name:'Heavy Shell',    cost:280, dmgBonus:55,  rateBonus:0.08, rangeBonus:30,  splashBonus:25 },
      { name:'Barrage',        cost:460, dmgBonus:90,  rateBonus:0.15, rangeBonus:25,  splashBonus:45 },
      { name:'Armageddon',     cost:750, dmgBonus:200, rateBonus:0.22, rangeBonus:45,  splashBonus:90 },
      { name:'CITY DESTROYER', cost:1400,dmgBonus:450, rateBonus:0.3,  rangeBonus:60,  splashBonus:150, armorPierce:true },
    ],
  },
  {
    id:'venom', name:'VENOM TOWER', icon:'☠️', rarity:'special',
    cost:280, shopCost:900, unlocked:false,
    desc:'Poisons groups. DPS stacks over time.',
    color:'#16a085',
    range:C.venom.range, fireRate:C.venom.fireRate, damage:C.venom.damage,
    bulletSpeed:270, bulletColor:'#1abc9c', bulletSize:6,
    splash:70, slow:0.15, burn:8, pierce:0, maxUpgrade:4,
    upgrades:[
      { name:'Acid Cloud',     cost:240, dmgBonus:12,  rateBonus:0.45, rangeBonus:20,  burnBonus:6  },
      { name:'Plague',         cost:400, dmgBonus:25,  rateBonus:0.55, rangeBonus:30,  burnBonus:12 },
      { name:'BIOHAZARD',      cost:700, dmgBonus:55,  rateBonus:1.1,  rangeBonus:45,  burnBonus:22, splashBonus:35 },
      { name:'EXTINCTION VIRUS',cost:1300,dmgBonus:120,rateBonus:2.0,  rangeBonus:60,  burnBonus:40, splashBonus:60 },
    ],
  },

  // ── LEGENDARY ───────────────────────────────────────────────────────────
  {
    id:'omega', name:'OMEGA CANNON', icon:'💥', rarity:'legendary',
    cost:800, shopCost:4000, unlocked:false,
    desc:'Devastating orbital strike. Rare.',
    color:'#f1c40f',
    range:C.omega.range, fireRate:C.omega.fireRate, damage:C.omega.damage,
    bulletSpeed:360, bulletColor:'#f9e79f', bulletSize:14,
    splash:100, slow:0, armorPierce:true, pierce:0, maxUpgrade:3,
    upgrades:[
      { name:'Overload',       cost:800,  dmgBonus:250, rateBonus:0.06, rangeBonus:30,  splashBonus:35 },
      { name:'Singularity',    cost:1400, dmgBonus:500, rateBonus:0.07, rangeBonus:35,  splashBonus:60 },
      { name:'EXTINCTION',     cost:2200, dmgBonus:1000,rateBonus:0.12, rangeBonus:60,  splashBonus:100 },
    ],
  },
  {
    id:'phantom', name:'PHANTOM SNIPER', icon:'👻', rarity:'legendary',
    cost:700, shopCost:3500, unlocked:false,
    desc:'Sees invisible enemies. Insta-kills weak foes.',
    color:'#8e44ad',
    range:C.phantom.range, fireRate:C.phantom.fireRate, damage:C.phantom.damage,
    bulletSpeed:850, bulletColor:'#bb8fce', bulletSize:4,
    splash:0, slow:0, pierce:3, armorPierce:true, canSeeInvis:true, maxUpgrade:3,
    upgrades:[
      { name:'Shadow Mark',    cost:700,  dmgBonus:120, rateBonus:0.2,  rangeBonus:40  },
      { name:'Soul Rip',       cost:1200, dmgBonus:250, rateBonus:0.25, rangeBonus:50,  instaKill:true },
      { name:'GOD OF DEATH',   cost:2000, dmgBonus:500, rateBonus:0.45, rangeBonus:70,  instaKill:true, pierce:6 },
    ],
  },
  {
    id:'temporal', name:'TIME DISTORTER', icon:'🌀', rarity:'legendary',
    cost:900, shopCost:5000, unlocked:false,
    desc:'Slows ALL enemies simultaneously.',
    color:'#1abc9c',
    range:C.temporal.range, fireRate:C.temporal.fireRate, damage:C.temporal.damage,
    bulletSpeed:420, bulletColor:'#48c9b0', bulletSize:5,
    splash:0, slow:0.7, slowDuration:3.5, pierce:1, armorPierce:true, maxUpgrade:3,
    upgrades:[
      { name:'Chronostasis',   cost:900,  dmgBonus:25,  rateBonus:0.05, rangeBonus:0,   slowBonus:0.1  },
      { name:'Temporal Rift',  cost:1600, dmgBonus:60,  rateBonus:0.1,  rangeBonus:0,   slowBonus:0.15 },
      { name:'TIME STOP',      cost:2500, dmgBonus:100, rateBonus:0.17, rangeBonus:0,   slowBonus:0.2  },
    ],
  },
  {
    id:'reaper', name:'SOUL REAPER', icon:'💀', rarity:'legendary',
    cost:1000, shopCost:6000, unlocked:false,
    desc:'Executes enemies below 20% HP.',
    color:'#2c3e50',
    range:C.reaper.range, fireRate:C.reaper.fireRate, damage:C.reaper.damage,
    bulletSpeed:520, bulletColor:'#95a5a6', bulletSize:5,
    splash:0, slow:0, pierce:4, armorPierce:true, instaKillThreshold:0.2, maxUpgrade:3,
    upgrades:[
      { name:'Dark Harvest',   cost:950,  dmgBonus:100, rateBonus:0.25, rangeBonus:30  },
      { name:'Soul Devour',    cost:1600, dmgBonus:200, rateBonus:0.35, rangeBonus:25,  instaKillThreshold:0.35 },
      { name:'GRIM REAPER',    cost:2800, dmgBonus:400, rateBonus:0.55, rangeBonus:45,  instaKillThreshold:0.5, pierce:8 },
    ],
  },

  // ── OWNER-ONLY ──────────────────────────────────────────────────────────
  {
    id:'shadow_commander', name:'SHADOW COMMANDER', icon:'🦇', rarity:'legendary',
    cost:0, shopCost:0, unlocked:false, ownerOnly:true,
    desc:'OWNER ONLY. Massive AoE + aura buffs all nearby towers.',
    color:'#9b59b6',
    range:C.shadow_commander.range, fireRate:C.shadow_commander.fireRate, damage:C.shadow_commander.damage,
    bulletSpeed:500, bulletColor:'#9b59b6', bulletSize:10,
    splash:80, slow:0.4, armorPierce:true, aura:true, auraBonus:0.5, pierce:2, canSeeInvis:true,
    maxUpgrade:0, upgrades:[],
  },
  {
    id:'neon_warden', name:'NEON WARDEN', icon:'🌟', rarity:'legendary',
    cost:0, shopCost:0, unlocked:false, ownerOnly:true,
    desc:'OWNER ONLY. Chains lightning to infinite enemies.',
    color:'#00ffaa',
    range:C.neon_warden.range, fireRate:C.neon_warden.fireRate, damage:C.neon_warden.damage,
    bulletSpeed:700, bulletColor:'#00ffaa', bulletSize:6,
    splash:100, slow:0.6, chain:99, armorPierce:true, pierce:3, canSeeInvis:true,
    maxUpgrade:0, upgrades:[],
  },
  {
    id:'void_hunter', name:'VOID HUNTER', icon:'🕳️', rarity:'legendary',
    cost:0, shopCost:0, unlocked:false, ownerOnly:true,
    desc:'OWNER ONLY. Instant-kills everything. Reality shredder.',
    color:'#8e44ad',
    range:C.void_hunter.range, fireRate:C.void_hunter.fireRate, damage:C.void_hunter.damage,
    bulletSpeed:900, bulletColor:'#9b59b6', bulletSize:12,
    splash:50, slow:0.8, pierce:8, armorPierce:true, canSeeInvis:true, instaKill:true,
    maxUpgrade:0, upgrades:[],
  },
]})();

function getTowerDef(id) { return TOWER_DEFS.find(t => t.id === id); }

// ── Tower class ───────────────────────────────────────────
class Tower {
  constructor(def, tileX, tileY, tileSize) {
    this.def      = def;
    this.tileX    = tileX;
    this.tileY    = tileY;
    this.tileSize = tileSize;
    this.x        = tileX * tileSize + tileSize / 2;
    this.y        = tileY * tileSize + tileSize / 2;

    this.level      = 0;
    this.damage     = def.damage;
    this.range      = def.range;
    this.fireRate   = def.fireRate;
    this.slow       = def.slow   || 0;
    this.splash     = def.splash || 0;
    this.burn       = def.burn   || 0;
    this.chain      = def.chain  || 0;
    this.pierce     = def.pierce || 0;
    this.armorPierce = def.armorPierce || false;
    this.instaKill  = def.instaKill || false;
    this.instaKillThreshold = def.instaKillThreshold || 0;
    this.canSeeInvis = def.canSeeInvis || false;

    this.fireCooldown = 0;
    this.target       = null;
    this.bullets      = [];
    this.angle        = 0;
    this.shootFlash   = 0;
    this.auraBuff     = 1.0;
    this.selected     = false;
    this.auraAlpha    = 0;
    this.targetMode   = 'first';
    this.totalCostSpent = def.cost;
  }

  get cost()  { return this.def.cost; }
  get name()  { return this.def.name; }
  get icon()  { return this.def.icon; }

  getSellValue() { return Math.floor(this.totalCostSpent * 0.6); }

  getUpgradeCost() {
    if (this.level >= this.def.maxUpgrade || !this.def.upgrades[this.level]) return 0;
    return this.def.upgrades[this.level].cost;
  }

  upgrade() {
    if (this.level >= this.def.maxUpgrade) return false;
    const u = this.def.upgrades[this.level];
    if (!u) return false;
    this.totalCostSpent += u.cost;
    this.damage   += u.dmgBonus    || 0;
    this.fireRate += u.rateBonus   || 0;
    this.range    += u.rangeBonus  || 0;
    this.slow     += u.slowBonus   || 0;
    this.splash   += u.splashBonus || 0;
    this.burn     += u.burnBonus   || 0;
    this.chain    += u.chainBonus  || 0;
    if (u.armorPierce) this.armorPierce = true;
    if (u.instaKill)   this.instaKill   = true;
    if (u.instaKillThreshold) this.instaKillThreshold = u.instaKillThreshold;
    if (u.pierce)      this.pierce = u.pierce;
    if (u.burn)        this.burn   = u.burn;
    this.level++;
    return true;
  }

  update(dt, enemies) {
    this.shootFlash   = Math.max(0, this.shootFlash - dt * 8);
    this.fireCooldown = Math.max(0, this.fireCooldown - dt);

    this.target = this._pickTarget(enemies);
    if (this.target) {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      this.angle = Math.atan2(dy, dx) - Math.PI / 2;
    }

    if (this.target && this.fireCooldown <= 0) {
      this.fireCooldown = 1 / (this.fireRate * this.auraBuff);
      this.shootFlash   = 1;
      this._fire(this.target, enemies);
    }

    this.bullets = this.bullets.filter(b => !b.dead);
    this.bullets.forEach(b => b.update(dt));
  }

  _pickTarget(enemies) {
    const inRange = enemies.filter(e => {
      const dx = e.x - this.x, dy = e.y - this.y;
      if (e.dead) return false;
      if (e.invisible && !this.canSeeInvis) return false;
      return Math.sqrt(dx * dx + dy * dy) <= this.range;
    });
    if (!inRange.length) return null;
    switch (this.targetMode) {
      case 'first':  return inRange.reduce((a, b) => a.pathProgress > b.pathProgress ? a : b);
      case 'last':   return inRange.reduce((a, b) => a.pathProgress < b.pathProgress ? a : b);
      case 'strong': return inRange.reduce((a, b) => a.hp > b.hp ? a : b);
      case 'close':  return inRange.reduce((a, b) => {
        return Math.hypot(a.x-this.x,a.y-this.y) < Math.hypot(b.x-this.x,b.y-this.y) ? a : b;
      });
    }
    return inRange[0];
  }

  _fire(target, allEnemies) {
    const d = this.def;
    const effDmg = this.damage * this.auraBuff;
    this.bullets.push(new Bullet({
      x: this.x, y: this.y,
      target,
      damage:     effDmg,
      speed:      d.bulletSpeed,
      color:      d.bulletColor,
      size:       d.bulletSize,
      splash:     this.splash,
      slow:       this.slow,
      slowDuration: d.slowDuration || 2,
      burn:       this.burn,
      chain:      this.chain,
      pierce:     this.pierce,
      armorPierce:this.armorPierce,
      instaKill:  this.instaKill || (this.level >= 2 && d.id === 'phantom'),
      instaKillThreshold: this.instaKillThreshold,
      allEnemies,
    }));
  }

  draw(ctx) {
    const s = this.tileSize, pad = 5;
    const tx = this.tileX * s, ty = this.tileY * s;
    const cx = this.x, cy = this.y;
    const flash = this.shootFlash;
    const col = this.def.color;

    // ── Tile background ──────────────────────────────────────────────────
    // Subtle rounded bg panel
    ctx.save();
    if (this.auraBuff > 1.0) {
      // Aura-buffed: gold shimmer bg
      const ag = ctx.createRadialGradient(cx,cy,s*0.1,cx,cy,s*0.55);
      ag.addColorStop(0,'rgba(241,196,15,0.22)');
      ag.addColorStop(1,'rgba(241,196,15,0.04)');
      ctx.fillStyle = ag;
    } else if (this.selected) {
      ctx.fillStyle = 'rgba(241,196,15,0.18)';
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
    }
    ctx.beginPath();
    ctx.roundRect(tx+pad, ty+pad, s-pad*2, s-pad*2, 4);
    ctx.fill();

    // Border ring on tile
    ctx.strokeStyle = this.selected ? col : 'rgba(255,255,255,0.07)';
    ctx.lineWidth = this.selected ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(tx+pad, ty+pad, s-pad*2, s-pad*2, 4);
    ctx.stroke();
    ctx.restore();

    // ── Rotate + draw body ────────────────────────────────────────────────
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.angle + Math.PI/2);

    // Outer glow ring when firing
    if (flash > 0) {
      ctx.shadowBlur = 18;
      ctx.shadowColor = col;
    }

    // Base circle
    const grad = ctx.createRadialGradient(0,-s*0.05,s*0.05, 0,0,s*0.38);
    grad.addColorStop(0, flash>0 ? '#ffffff' : col+'dd');
    grad.addColorStop(1, col+'55');
    ctx.beginPath();
    ctx.arc(0, 0, s*0.34, 0, Math.PI*2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Barrel
    ctx.shadowBlur = 0;
    ctx.fillStyle = flash>0 ? '#fff' : col+'cc';
    ctx.beginPath();
    ctx.roundRect(-s*0.075, -s*0.34, s*0.15, s*0.28, 2);
    ctx.fill();

    // Barrel tip flash
    if (flash > 0) {
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 12; ctx.shadowColor = col;
      ctx.beginPath();
      ctx.arc(0, -s*0.36, s*0.1, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Level stripe(s) on body
    if (this.level > 0) {
      ctx.fillStyle = '#f1c40f';
      for (let i = 0; i < this.level; i++) {
        const rx = (i - (this.level-1)/2) * s*0.14;
        ctx.fillRect(rx - s*0.04, s*0.12, s*0.08, s*0.12);
      }
    }

    ctx.restore();

    // ── Emoji icon (rendered after rotation so it stays upright) ──────────
    ctx.save();
    ctx.font = `${Math.floor(s*0.38)}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.88;
    ctx.fillText(this.def.icon, cx, cy);
    ctx.globalAlpha = 1;
    ctx.restore();

    // ── Range ring (selected) ────────────────────────────────────────────
    if (this.selected) {
      ctx.beginPath();
      ctx.arc(cx, cy, this.range, 0, Math.PI*2);
      ctx.strokeStyle = col + '55';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5,4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // ── Aura pulse ring ──────────────────────────────────────────────────
    if (this.def.aura) {
      const t = Date.now() * 0.003;
      ctx.beginPath();
      ctx.arc(cx, cy, this.range*0.7, 0, Math.PI*2);
      ctx.fillStyle = `rgba(241,196,15,${(Math.sin(t)+1)*0.07})`;
      ctx.fill();
    }

    // ── Owner glow pulse ─────────────────────────────────────────────────
    if (this.def.ownerOnly) {
      const t = Date.now() * 0.003;
      ctx.beginPath();
      ctx.arc(cx, cy, s*0.44, 0, Math.PI*2);
      ctx.strokeStyle = col;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.4 + Math.sin(t)*0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Owner glow pulse
    if (this.def.ownerOnly) {
      const t = Date.now()*0.003;
      ctx.beginPath();
      ctx.arc(this.x, this.y, s*0.44, 0, Math.PI*2);
      ctx.strokeStyle = this.def.color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.4+Math.sin(t)*0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    if (this.selected) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.range, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(241,196,15,0.22)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6,4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(this.x, this.y, s*0.43, 0, Math.PI*2);
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (this.def.aura) {
      this.auraAlpha = (Math.sin(Date.now()*0.003)+1)*0.12;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.range*0.7, 0, Math.PI*2);
      ctx.fillStyle = `rgba(241,196,15,${this.auraAlpha})`;
      ctx.fill();
    }
  }
}

// ── Bullet class ──────────────────────────────────────────
class Bullet {
  constructor(opts) {
    Object.assign(this, opts);
    this.dead = false;
    this.hitEnemies = new Set();
    this.age = 0;
  }

  update(dt) {
    this.age += dt;
    if (!this.target || this.target.dead) {
      if (this.pierce > 0 && this.allEnemies) {
        let nearest = null, bestDist = Infinity;
        for (const e of this.allEnemies) {
          if (e.dead || this.hitEnemies.has(e)) continue;
          const d = Math.hypot(e.x-this.x, e.y-this.y);
          if (d < bestDist) { bestDist = d; nearest = e; }
        }
        if (nearest) this.target = nearest;
        else { this.dead = true; return; }
      } else { this.dead = true; return; }
    }

    const dx = this.target.x - this.x, dy = this.target.y - this.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 8) { this._hit(this.target); return; }
    const spd = this.speed * dt;
    this.x += (dx/dist)*spd;
    this.y += (dy/dist)*spd;
  }

  _hit(enemy) {
    if (this.hitEnemies.has(enemy)) { this.dead = true; return; }
    const threshold = this.instaKillThreshold || 0;
    if (this.instaKill || (threshold > 0 && enemy.hp < enemy.maxHp * threshold)) {
      enemy.takeDamage(enemy.hp+1, this);
    } else {
      const dmg = this.armorPierce ? this.damage : this.damage*(1-(enemy.armor||0));
      enemy.takeDamage(dmg, this);
    }
    this.hitEnemies.add(enemy);

    if (this.splash > 0 && this.allEnemies) {
      this.allEnemies.forEach(e => {
        if (e===enemy || e.dead) return;
        const d = Math.hypot(e.x-enemy.x, e.y-enemy.y);
        if (d <= this.splash) {
          const dmg = this.armorPierce ? this.damage : this.damage*(1-(e.armor||0));
          e.takeDamage(dmg*(1-(d/this.splash)*0.5), this);
        }
      });
    }

    if (this.chain > 0 && this.allEnemies) {
      let chained = 0, prev = enemy;
      for (const e of this.allEnemies) {
        if (chained >= this.chain) break;
        if (e===enemy || e.dead || this.hitEnemies.has(e)) continue;
        if (Math.hypot(e.x-prev.x, e.y-prev.y) < 150) {
          const dmg = this.armorPierce ? this.damage*0.6 : this.damage*0.6*(1-(e.armor||0));
          e.takeDamage(dmg, this);
          this.hitEnemies.add(e);
          prev = e; chained++;
        }
      }
    }

    if (this.pierce <= 0) this.dead = true;
    else this.pierce--;
  }

  draw(ctx) {
    if (this.speed >= 900 && this.target && !this.target.dead) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.target.x, this.target.y);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10; ctx.shadowColor = this.color;
      ctx.globalAlpha = 0.7;
      ctx.stroke();
      ctx.restore();
      this.dead = true;
      return;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8; ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}
