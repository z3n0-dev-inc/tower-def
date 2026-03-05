/* ═══════════════════════════════════════════════
   towers.js — Tower definitions & classes
   
   ── HOW TO TUNE DAMAGE ───────────────────────────
   Edit TOWER_DAMAGE_CONFIG below.
   Changes apply instantly to every tower in the game.
   Format: id: { damage, fireRate, range }
   ─────────────────────────────────────────────── */

const TOWER_DAMAGE_CONFIG = {
  //              damage  fireRate  range
  gunner:       { damage:  15,  fireRate: 1.2,  range: 120 },
  archer:       { damage:  10,  fireRate: 1.8,  range: 160 },
  sniper:       { damage:  80,  fireRate: 0.38, range: 265 },
  rocketeer:    { damage:  60,  fireRate: 0.55, range: 130 },
  freezer:      { damage:  10,  fireRate: 0.8,  range: 110 },
  flamer:       { damage:   8,  fireRate: 8.0,  range:  90 },
  tesla:        { damage:  40,  fireRate: 0.9,  range: 140 },
  laser:        { damage:  12,  fireRate: 14,   range: 180 },
  mortar:       { damage:  95,  fireRate: 0.28, range: 200 },
  venom:        { damage:  20,  fireRate: 1.4,  range: 140 },
  omega:        { damage: 400,  fireRate: 0.24, range: 200 },
  phantom:      { damage: 250,  fireRate: 0.72, range: 305 },
  temporal:     { damage:  28,  fireRate: 0.15, range: 999 },
  reaper:       { damage: 160,  fireRate: 0.85, range: 200 },
  shadow_commander: { damage: 9999,  fireRate: 3.0, range: 999 },
  neon_warden:      { damage: 9999,  fireRate: 8.0, range: 999 },
  void_hunter:      { damage: 99999, fireRate: 4.0, range: 999 },
  drone_bay:     { damage:  14,  fireRate: 2.0,  range: 150 },
  apache:        { damage:  75,  fireRate: 0.48, range: 170 },
  stormwing:     { damage:  28,  fireRate: 1.6,  range: 190 },
  stratobomber:  { damage: 150,  fireRate: 0.24, range: 215 },
  spectre:       { damage: 240,  fireRate: 0.78, range: 335 },
  sky_fortress:  { damage: 650,  fireRate: 0.19, range: 255 },
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


  // ── AIR TOWERS ──────────────────────────────────────────────────────────
  // Air towers hover above the ground, rotate independently, and can be
  // placed on PATH tiles as well as ground tiles.
  {
    id:'drone_bay', name:'DRONE BAY', icon:'🚁', rarity:'advanced',
    cost:220, shopCost:600, unlocked:false, isAir:true,
    desc:'Launches swarm drones. Can fire in all directions simultaneously.',
    color:'#00bcd4',
    range:155, fireRate:2.2, damage:18,
    bulletSpeed:280, bulletColor:'#00e5ff', bulletSize:4,
    splash:0, slow:0, pierce:0, maxUpgrade:4,
    upgrades:[
      { name:'Extra Drones',     cost:150, dmgBonus:8,   rateBonus:0.5,  rangeBonus:20 },
      { name:'Homing Missiles',  cost:260, dmgBonus:18,  rateBonus:0.6,  rangeBonus:25, splashBonus:20 },
      { name:'Drone Swarm',      cost:420, dmgBonus:30,  rateBonus:1.0,  rangeBonus:30, pierce:2 },
      { name:'NANODRONE CLOUD',  cost:800, dmgBonus:70,  rateBonus:2.5,  rangeBonus:45, pierce:4, armorPierce:true },
    ],
  },
  {
    id:'apache', name:'APACHE GUNSHIP', icon:'🚁', rarity:'advanced',
    cost:380, shopCost:1200, unlocked:false, isAir:true,
    desc:'Heavy gunship. Minigun + rocket pods. Circles the field.',
    color:'#ff6f00',
    range:175, fireRate:0.55, damage:90,
    bulletSpeed:320, bulletColor:'#ff9800', bulletSize:8,
    splash:50, slow:0, burn:4, pierce:0, maxUpgrade:4,
    upgrades:[
      { name:'Hellfire Pods',    cost:300, dmgBonus:45,  rateBonus:0.1,  rangeBonus:20, splashBonus:25 },
      { name:'Chain Gun',        cost:500, dmgBonus:80,  rateBonus:0.4,  rangeBonus:20, burnBonus:4 },
      { name:'Heavy Loadout',    cost:850, dmgBonus:160, rateBonus:0.3,  rangeBonus:35, splashBonus:45 },
      { name:'DEATH FROM ABOVE', cost:1600,dmgBonus:350, rateBonus:0.5,  rangeBonus:50, splashBonus:80, armorPierce:true },
    ],
  },
  {
    id:'stormwing', name:'STORMWING JET', icon:'✈️', rarity:'special',
    cost:520, shopCost:2000, unlocked:false, isAir:true,
    desc:'Supersonic fighter. Strafes the path at high speed.',
    color:'#7986cb',
    range:195, fireRate:1.8, damage:35,
    bulletSpeed:600, bulletColor:'#9fa8da', bulletSize:5,
    splash:30, slow:0.2, pierce:2, maxUpgrade:4,
    upgrades:[
      { name:'Afterburner',      cost:400, dmgBonus:18,  rateBonus:0.5,  rangeBonus:30 },
      { name:'Plasma Guns',      cost:700, dmgBonus:40,  rateBonus:0.7,  rangeBonus:30, armorPierce:true },
      { name:'Mach Strike',      cost:1100,dmgBonus:85,  rateBonus:1.2,  rangeBonus:45, pierce:4 },
      { name:'SONIC ANNIHILATOR',cost:2200,dmgBonus:200, rateBonus:2.0,  rangeBonus:60, pierce:6, splashBonus:50, armorPierce:true },
    ],
  },
  {
    id:'stratobomber', name:'STRATO BOMBER', icon:'💣', rarity:'special',
    cost:650, shopCost:2800, unlocked:false, isAir:true,
    desc:'High altitude carpet bombing. Devastating AoE runs.',
    color:'#78909c',
    range:220, fireRate:0.28, damage:180,
    bulletSpeed:220, bulletColor:'#cfd8dc', bulletSize:12,
    splash:110, slow:0, pierce:0, maxUpgrade:4,
    upgrades:[
      { name:'Payload+',         cost:550, dmgBonus:90,  rateBonus:0.06, rangeBonus:25, splashBonus:35 },
      { name:'Carpet Bomb',      cost:950, dmgBonus:180, rateBonus:0.1,  rangeBonus:30, splashBonus:60 },
      { name:'Thermobaric',      cost:1600,dmgBonus:350, rateBonus:0.12, rangeBonus:40, splashBonus:100, burnBonus:10 },
      { name:'TACTICAL NUKE',    cost:3000,dmgBonus:800, rateBonus:0.18, rangeBonus:60, splashBonus:180, armorPierce:true },
    ],
  },
  {
    id:'spectre', name:'SPECTRE AC-130', icon:'🛩️', rarity:'legendary',
    cost:900, shopCost:5000, unlocked:false, isAir:true,
    desc:'Gunship that orbits and fires three weapons simultaneously.',
    color:'#546e7a',
    range:340, fireRate:0.9, damage:280,
    bulletSpeed:400, bulletColor:'#b0bec5', bulletSize:9,
    splash:70, slow:0.3, pierce:3, armorPierce:true, canSeeInvis:true, maxUpgrade:3,
    upgrades:[
      { name:'Triple Armament',  cost:1000, dmgBonus:140, rateBonus:0.2,  rangeBonus:35, splashBonus:30 },
      { name:'Full Broadside',   cost:1800, dmgBonus:280, rateBonus:0.3,  rangeBonus:40, splashBonus:55, chain:3 },
      { name:'ORBITAL PLATFORM', cost:3200, dmgBonus:600, rateBonus:0.55, rangeBonus:60, splashBonus:90, chain:6, armorPierce:true },
    ],
  },
  {
    id:'sky_fortress', name:'SKY FORTRESS', icon:'🏰', rarity:'legendary',
    cost:1200, shopCost:7000, unlocked:false, isAir:true,
    desc:'Flying fortress. Buffs ALL towers below. Absolute dominance.',
    color:'#f9a825',
    range:260, fireRate:0.22, damage:800,
    bulletSpeed:500, bulletColor:'#ffd54f', bulletSize:16,
    splash:130, slow:0.5, armorPierce:true, pierce:2, aura:true, auraBonus:0.4, canSeeInvis:true, maxUpgrade:3,
    upgrades:[
      { name:'Reinforced Guns',  cost:1200, dmgBonus:400, rateBonus:0.06, rangeBonus:30, splashBonus:40 },
      { name:'Orbital Cannons',  cost:2000, dmgBonus:800, rateBonus:0.08, rangeBonus:40, splashBonus:80, chain:4 },
      { name:'GOD MACHINE',      cost:3500, dmgBonus:1800,rateBonus:0.14, rangeBonus:60, splashBonus:150, chain:8, armorPierce:true },
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
/* ── Tower Art — hand-drawn per-tower sprites ────────────── */
const TowerArt = {

  // GUNNER — squat military turret, thick barrel, ammo belt
  gunner(ctx, x, y, s, angle, flash) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI/2);
    const S = s;
    // Base plate — octagonal
    ctx.fillStyle = '#2a3545';
    ctx.beginPath();
    for(let i=0;i<8;i++){
      const a = (i/8)*Math.PI*2 - Math.PI/8;
      const r = S*.36;
      i===0 ? ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r) : ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
    }
    ctx.closePath(); ctx.fill();
    // Turret dome
    ctx.fillStyle = '#3a4a5e';
    ctx.beginPath(); ctx.arc(0, 0, S*.28, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#4a5e72';
    ctx.beginPath(); ctx.arc(-S*.06, -S*.06, S*.18, 0, Math.PI*2); ctx.fill(); // highlight
    // Thick barrel — double
    ctx.fillStyle = flash>0 ? '#ffe080' : '#2a3545';
    ctx.beginPath(); ctx.roundRect(-S*.1, -S*.38, S*.07, S*.32, S*.02); ctx.fill();
    ctx.beginPath(); ctx.roundRect(S*.03, -S*.38, S*.07, S*.32, S*.02); ctx.fill();
    // Barrel cooling rings
    ctx.strokeStyle = '#1a2535'; ctx.lineWidth = S*.025;
    for(let i=0;i<3;i++) ctx.strokeRect(-S*.1, -S*.35+i*S*.09, S*.2, S*.025);
    // Muzzle flash
    if(flash>0){
      ctx.fillStyle = '#fff8c0';
      ctx.shadowBlur = 12; ctx.shadowColor = '#ffaa00';
      ctx.beginPath();
      ctx.moveTo(-S*.14, -S*.38); ctx.lineTo(0, -S*.58); ctx.lineTo(S*.14, -S*.38);
      ctx.fill(); ctx.shadowBlur = 0;
    }
    // Ammo belt — side detail
    ctx.fillStyle = '#f5c842';
    for(let i=0;i<4;i++) ctx.fillRect(S*.2+i*S*.07, -S*.12+i*S*.04, S*.05, S*.08);
    ctx.restore();
  },

  // ARCHER — tall narrow tower with arrow slits, bow mechanism on top
  archer(ctx, x, y, s, angle, flash) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI/2);
    const S = s;
    // Stone tower base — rectangular
    ctx.fillStyle = '#3d5228';
    ctx.beginPath(); ctx.roundRect(-S*.22, -S*.3, S*.44, S*.42, S*.03); ctx.fill();
    ctx.fillStyle = '#2d4018';
    ctx.fillRect(-S*.22, -S*.3, S*.44, S*.08); // top darker
    // Arrow slits
    ctx.fillStyle = '#1a2810';
    ctx.beginPath(); ctx.roundRect(-S*.04, -S*.26, S*.08, S*.16, S*.01); ctx.fill();
    // Bow frame
    ctx.strokeStyle = '#5a7030'; ctx.lineWidth = S*.06; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, -S*.34, S*.2, Math.PI*.7, Math.PI*1.3); ctx.stroke();
    // Bowstring
    ctx.strokeStyle = flash>0 ? '#fff' : '#c8d890'; ctx.lineWidth = S*.02;
    ctx.beginPath(); ctx.moveTo(Math.cos(Math.PI*.7)*S*.2, Math.sin(Math.PI*.7)*S*.2-S*.34); ctx.lineTo(0, flash>0 ? -S*.28 : -S*.24); ctx.lineTo(Math.cos(Math.PI*1.3)*S*.2, Math.sin(Math.PI*1.3)*S*.2-S*.34); ctx.stroke();
    // Arrow on string
    ctx.strokeStyle = '#8a6030'; ctx.lineWidth = S*.03;
    ctx.beginPath(); ctx.moveTo(0, -S*.44); ctx.lineTo(0, flash>0 ? -S*.14 : -S*.18); ctx.stroke();
    // Arrow tip
    ctx.fillStyle = flash>0 ? '#fff8c0' : '#c0c8a0';
    if(flash>0){ctx.shadowBlur=8; ctx.shadowColor='#aaff44';}
    ctx.beginPath(); ctx.moveTo(-S*.04, -S*.46); ctx.lineTo(0, -S*.56); ctx.lineTo(S*.04, -S*.46); ctx.fill();
    ctx.shadowBlur = 0;
    // Leafy decoration
    ctx.fillStyle = '#4a6820';
    ctx.beginPath(); ctx.ellipse(-S*.22, S*.04, S*.1, S*.06, -0.5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(S*.22, S*.04, S*.1, S*.06, 0.5, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  },

  // SNIPER — sleek long-barrel rifle on elevated platform, crosshair reticle
  sniper(ctx, x, y, s, angle, flash) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI/2);
    const S = s;
    // Raised platform
    ctx.fillStyle = '#4a3a6e';
    ctx.beginPath(); ctx.ellipse(0, S*.12, S*.3, S*.14, 0, 0, Math.PI*2); ctx.fill();
    // Tripod legs
    ctx.strokeStyle = '#3a2a5e'; ctx.lineWidth = S*.05; ctx.lineCap = 'round';
    [[-0.35,0.32],[0,0.36],[0.35,0.32]].forEach(([lx,ly])=>{
      ctx.beginPath(); ctx.moveTo(0, S*.12); ctx.lineTo(lx*S, ly*S); ctx.stroke();
    });
    // Barrel — very long, thin
    ctx.fillStyle = flash>0 ? '#ffe0a0' : '#2e2048';
    ctx.beginPath(); ctx.roundRect(-S*.04, -S*.55, S*.08, S*.55, S*.02); ctx.fill();
    // Silencer
    ctx.fillStyle = '#3a2e58';
    ctx.beginPath(); ctx.roundRect(-S*.055, -S*.6, S*.11, S*.12, S*.03); ctx.fill();
    // Scope
    ctx.fillStyle = '#2a1a40';
    ctx.beginPath(); ctx.roundRect(-S*.06, -S*.36, S*.12, S*.1, S*.02); ctx.fill();
    ctx.fillStyle = '#1a0a30';
    ctx.beginPath(); ctx.roundRect(-S*.04, -S*.35, S*.08, S*.08, S*.02); ctx.fill();
    ctx.fillStyle = 'rgba(80,140,255,0.4)';
    ctx.beginPath(); ctx.roundRect(-S*.04, -S*.35, S*.08, S*.08, S*.02); ctx.fill();
    // Scope crosshair detail
    ctx.strokeStyle = 'rgba(200,220,255,0.6)'; ctx.lineWidth = S*.01;
    ctx.beginPath(); ctx.moveTo(-S*.04, -S*.31); ctx.lineTo(S*.04, -S*.31); ctx.stroke();
    // Muzzle flash
    if(flash>0){
      ctx.fillStyle = '#fff0a0';
      ctx.shadowBlur = 16; ctx.shadowColor = '#aa88ff';
      ctx.beginPath(); ctx.moveTo(-S*.06, -S*.6); ctx.lineTo(0, -S*.78); ctx.lineTo(S*.06, -S*.6); ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  },

  // ROCKETEER — chunky launcher, four-tube salvo pod, fins
  rocketeer(ctx, x, y, s, angle, flash) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI/2);
    const S = s;
    // Body
    ctx.fillStyle = '#6a3810';
    ctx.beginPath(); ctx.arc(0, 0, S*.3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#8a4818';
    ctx.beginPath(); ctx.arc(-S*.06, -S*.06, S*.2, 0, Math.PI*2); ctx.fill();
    // 2x2 rocket pod
    const tubePositions = [[-S*.1,-S*.1],[S*.1,-S*.1],[-S*.1,S*.1],[S*.1,S*.1]];
    ctx.fillStyle = '#4a2808';
    tubePositions.forEach(([tx,ty])=>{
      ctx.beginPath(); ctx.roundRect(tx-S*.06, ty-S*.38, S*.12, S*.42, S*.03); ctx.fill();
    });
    ctx.fillStyle = '#2e1800';
    tubePositions.forEach(([tx,ty])=>{
      ctx.beginPath(); ctx.arc(tx, ty-S*.38, S*.05, 0, Math.PI*2); ctx.fill();
    });
    // Active rocket(s) if flashing
    if(flash>0){
      ctx.fillStyle = '#ff6600';
      ctx.shadowBlur = 10; ctx.shadowColor = '#ff4400';
      ctx.beginPath(); ctx.moveTo(-S*.06,-S*.38); ctx.lineTo(0,-S*.58); ctx.lineTo(S*.06,-S*.38); ctx.fill();
      ctx.beginPath(); ctx.moveTo(S*.04,-S*.38); ctx.lineTo(S*.1,-S*.56); ctx.lineTo(S*.16,-S*.38); ctx.fill();
      ctx.shadowBlur = 0;
    }
    // Fins
    ctx.fillStyle = '#5a3008';
    [[-S*.3,S*.1],[S*.3,S*.1]].forEach(([fx,fy])=>{
      ctx.beginPath(); ctx.moveTo(fx, fy-S*.12); ctx.lineTo(fx+(fx>0?S*.12:-S*.12), fy+S*.14); ctx.lineTo(fx, fy+S*.08); ctx.fill();
    });
    ctx.restore();
  },

  // FREEZER — cryo-cannon, ice crystal housing, frost vents on sides
  freezer(ctx, x, y, s, angle, flash) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI/2);
    const S = s;
    // Ice crystal housing — hexagonal
    ctx.fillStyle = '#1a3a5a';
    ctx.beginPath();
    for(let i=0;i<6;i++){
      const a = (i/6)*Math.PI*2;
      i===0?ctx.moveTo(Math.cos(a)*S*.32, Math.sin(a)*S*.32):ctx.lineTo(Math.cos(a)*S*.32, Math.sin(a)*S*.32);
    }
    ctx.closePath(); ctx.fill();
    // Ice facets
    ctx.fillStyle = '#2a5a8a';
    ctx.beginPath();
    for(let i=0;i<6;i++){
      const a = (i/6)*Math.PI*2;
      i===0?ctx.moveTo(Math.cos(a)*S*.2, Math.sin(a)*S*.2):ctx.lineTo(Math.cos(a)*S*.2, Math.sin(a)*S*.2);
    }
    ctx.closePath(); ctx.fill();
    // Frost sheen
    ctx.fillStyle = 'rgba(180,230,255,0.2)';
    ctx.beginPath(); ctx.ellipse(-S*.08, -S*.1, S*.15, S*.1, -0.5, 0, Math.PI*2); ctx.fill();
    // Cryo barrel — frosted tube
    ctx.fillStyle = flash>0 ? '#a0e8ff' : '#1a4060';
    ctx.beginPath(); ctx.roundRect(-S*.07, -S*.44, S*.14, S*.34, S*.04); ctx.fill();
    // Frost rings on barrel
    ctx.strokeStyle = 'rgba(140,200,255,0.5)'; ctx.lineWidth = S*.025;
    for(let i=0;i<3;i++) {
      ctx.beginPath(); ctx.arc(0, -S*.32+i*S*.1, S*.08, 0, Math.PI*2); ctx.stroke();
    }
    // Ice spray from tip
    if(flash>0){
      ctx.fillStyle = 'rgba(140,220,255,0.7)';
      ctx.shadowBlur = 12; ctx.shadowColor = '#60cfff';
      for(let i=0;i<5;i++){
        const a = -Math.PI/2 + (i-2)*0.2;
        ctx.beginPath(); ctx.moveTo(0,-S*.44); ctx.lineTo(Math.cos(a)*S*.32, Math.sin(a)*S*.32-S*.44); ctx.lineWidth=S*.03; ctx.strokeStyle='rgba(140,220,255,0.7)'; ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }
    // Side vent crystals
    ctx.fillStyle = '#5ab0e0';
    [[-S*.32,0],[S*.32,0]].forEach(([vx,vy])=>{
      ctx.beginPath(); ctx.moveTo(vx, vy-S*.08); ctx.lineTo(vx+(vx>0?S*.14:-S*.14), vy); ctx.lineTo(vx, vy+S*.08); ctx.fill();
    });
    ctx.restore();
  },

  // FLAMER — wide nozzle, fuel tank on back, heat fins
  flamer(ctx, x, y, s, angle, flash) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI/2);
    const S = s;
    // Fuel tank
    ctx.fillStyle = '#c43a00';
    ctx.beginPath(); ctx.ellipse(0, S*.14, S*.2, S*.26, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#e05000';
    ctx.fillRect(-S*.18, S*.04, S*.36, S*.08); // band
    // Warning stripes on tank
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(-S*.18, S*.08, S*.06, S*.04);
    ctx.fillRect(-S*.04, S*.08, S*.06, S*.04);
    ctx.fillRect(S*.1, S*.08, S*.06, S*.04);
    // Main body
    ctx.fillStyle = '#8a2800';
    ctx.beginPath(); ctx.ellipse(0, -S*.04, S*.28, S*.22, 0, 0, Math.PI*2); ctx.fill();
    // Heat fins
    ctx.fillStyle = '#6a2000';
    [[-S*.26,-S*.1],[-S*.22,-S*.2],[S*.26,-S*.1],[S*.22,-S*.2]].forEach(([fx,fy])=>{
      ctx.beginPath(); ctx.roundRect(fx<0?fx-S*.08:fx, fy, S*.08, S*.18, S*.02); ctx.fill();
    });
    // Nozzle — wide, conical
    ctx.fillStyle = '#5a1800';
    ctx.beginPath(); ctx.moveTo(-S*.12, -S*.26); ctx.lineTo(-S*.18, -S*.48); ctx.lineTo(S*.18, -S*.48); ctx.lineTo(S*.12, -S*.26); ctx.closePath(); ctx.fill();
    // Flame — animated
    if(flash>0){
      const t = Date.now()*0.01;
      ctx.shadowBlur = 14; ctx.shadowColor = '#ff6600';
      const flames = [[0,-0.62,0.14],[0.12,-0.58,0.1],[-0.12,-0.58,0.1],[0,-0.72,0.08]];
      flames.forEach(([fx,fy,fr],i)=>{
        ctx.fillStyle = i%2===0?'#ff4400':'#ffaa00';
        ctx.beginPath(); ctx.arc(fx*S, fy*S+Math.sin(t+i)*S*.04, fr*S, 0, Math.PI*2); ctx.fill();
      });
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  },

  // TESLA — coil tower, electric arcs, Jacob's ladder design
  tesla(ctx, x, y, s, angle, flash) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI/2);
    const S = s;
    // Base insulator — ceramic look
    ctx.fillStyle = '#2a3048';
    ctx.beginPath(); ctx.arc(0, 0, S*.3, 0, Math.PI*2); ctx.fill();
    // Coil rings
    ctx.strokeStyle = '#3a4068'; ctx.lineWidth = S*.06;
    ctx.beginPath(); ctx.arc(0, 0, S*.22, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = '#4a5080'; ctx.lineWidth = S*.04;
    ctx.beginPath(); ctx.arc(0, 0, S*.15, 0, Math.PI*2); ctx.stroke();
    // Tower spine
    ctx.fillStyle = '#1e2840';
    ctx.beginPath(); ctx.roundRect(-S*.05, -S*.5, S*.1, S*.46, S*.02); ctx.fill();
    // Top electrode — ball
    ctx.fillStyle = '#6080c8';
    ctx.beginPath(); ctx.arc(0, -S*.5, S*.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(180,200,255,0.4)';
    ctx.beginPath(); ctx.arc(-S*.03, -S*.54, S*.05, 0, Math.PI*2); ctx.fill();
    // Electric arcs when firing
    if(flash>0){
      ctx.strokeStyle = '#88ccff';
      ctx.shadowBlur = 12; ctx.shadowColor = '#4488ff';
      ctx.lineWidth = S*.025; ctx.lineCap = 'round';
      // Zigzag arcs
      for(let arc=0;arc<3;arc++){
        const a = arc/3*Math.PI*2 + Date.now()*.02;
        ctx.beginPath(); ctx.moveTo(0,-S*.5);
        let cx2=0, cy=-S*.5;
        for(let i=0;i<4;i++){
          cx2 += Math.cos(a+i)*S*.2;
          cy -= S*.08;
          ctx.lineTo(cx2, cy);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }
    // Side spark gap contacts
    ctx.fillStyle = '#5070b0';
    ctx.beginPath(); ctx.roundRect(-S*.3, -S*.06, S*.14, S*.12, S*.03); ctx.fill();
    ctx.beginPath(); ctx.roundRect(S*.16, -S*.06, S*.14, S*.12, S*.03); ctx.fill();
    ctx.restore();
  },

  // LASER — sleek cylinder, lens array, targeting beam
  laser(ctx, x, y, s, angle, flash) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI/2);
    const S = s;
    // Smooth casing
    ctx.fillStyle = '#1e1e3a';
    ctx.beginPath(); ctx.ellipse(0, 0, S*.26, S*.3, 0, 0, Math.PI*2); ctx.fill();
    // Metallic sheen
    ctx.fillStyle = 'rgba(100,100,200,0.2)';
    ctx.beginPath(); ctx.ellipse(-S*.08, -S*.1, S*.14, S*.18, -0.5, 0, Math.PI*2); ctx.fill();
    // Lens array — three rings
    ctx.fillStyle = '#0a0a20';
    ctx.beginPath(); ctx.roundRect(-S*.08, -S*.46, S*.16, S*.2, S*.06); ctx.fill();
    [S*.04, S*.07, S*.1].forEach((r,i)=>{
      ctx.strokeStyle = `rgba(80,120,255,${0.8-i*.2})`; ctx.lineWidth = S*.02;
      ctx.beginPath(); ctx.arc(0, -S*.36, r, 0, Math.PI*2); ctx.stroke();
    });
    // Beam
    if(flash>0){
      ctx.strokeStyle = '#ff0055';
      ctx.shadowBlur = 16; ctx.shadowColor = '#ff0040';
      ctx.lineWidth = S*.04;
      ctx.beginPath(); ctx.moveTo(0, -S*.46); ctx.lineTo(0, -S*.9); ctx.stroke();
      ctx.lineWidth = S*.02; ctx.strokeStyle = '#ffaacc';
      ctx.beginPath(); ctx.moveTo(0, -S*.46); ctx.lineTo(0, -S*.9); ctx.stroke();
      ctx.shadowBlur = 0;
    }
    // Cooling vents on sides
    ctx.strokeStyle = '#2a2a50'; ctx.lineWidth = S*.03;
    for(let i=0;i<3;i++){
      ctx.beginPath(); ctx.moveTo(-S*.28, -S*.08+i*S*.14); ctx.lineTo(-S*.22, -S*.08+i*S*.14); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(S*.22, -S*.08+i*S*.14); ctx.lineTo(S*.28, -S*.08+i*S*.14); ctx.stroke();
    }
    ctx.restore();
  },

  // MORTAR — stubby wide barrel, recoil system, blast shield
  mortar(ctx, x, y, s, angle, flash) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI/2);
    const S = s;
    // Baseplate
    ctx.fillStyle = '#3a3020';
    ctx.beginPath(); ctx.ellipse(0, S*.2, S*.38, S*.16, 0, 0, Math.PI*2); ctx.fill();
    // Bipod legs
    ctx.strokeStyle = '#2a2210'; ctx.lineWidth = S*.06; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, S*.04); ctx.lineTo(-S*.3, S*.22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, S*.04); ctx.lineTo(S*.3, S*.22); ctx.stroke();
    // Barrel — short and very wide
    ctx.fillStyle = '#4a4030';
    ctx.beginPath(); ctx.roundRect(-S*.18, -S*.38, S*.36, S*.46, S*.06); ctx.fill();
    // Barrel bore
    ctx.fillStyle = '#1a1408';
    ctx.beginPath(); ctx.arc(0, -S*.38, S*.13, 0, Math.PI*2); ctx.fill();
    // Recoil spring
    ctx.strokeStyle = '#6a5a30'; ctx.lineWidth = S*.04;
    for(let i=0;i<5;i++) {
      ctx.beginPath(); ctx.moveTo(-S*.18, -S*.12+i*S*.08); ctx.lineTo(S*.18, -S*.12+i*S*.08); ctx.stroke();
    }
    // Blast shield
    ctx.fillStyle = '#5a4828';
    ctx.beginPath(); ctx.roundRect(-S*.24, -S*.52, S*.12, S*.22, S*.04); ctx.fill();
    ctx.beginPath(); ctx.roundRect(S*.12, -S*.52, S*.12, S*.22, S*.04); ctx.fill();
    if(flash>0){
      ctx.fillStyle = '#ffaa40';
      ctx.shadowBlur = 14; ctx.shadowColor = '#ff8800';
      ctx.beginPath(); ctx.arc(0, -S*.38, S*.18, -Math.PI, 0); ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  },

  // VENOM — organic living plant-tower, thorns, toxic pods
  venom(ctx, x, y, s, angle, flash) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI/2);
    const S = s;
    const t = Date.now()*0.002;
    // Root base
    ctx.strokeStyle = '#2a5a10'; ctx.lineWidth = S*.08; ctx.lineCap = 'round';
    [[-0.28,0.24],[0,0.3],[0.28,0.24]].forEach(([rx,ry])=>{
      ctx.beginPath(); ctx.moveTo(0, S*.14); ctx.quadraticCurveTo(rx*S*.6, ry*S*.8, rx*S, ry*S); ctx.stroke();
    });
    // Bulb body — organic
    ctx.fillStyle = '#2a6a10';
    ctx.beginPath();
    for(let i=0;i<=12;i++){
      const a=(i/12)*Math.PI*2;
      const r=S*(0.28+0.06*Math.sin(a*3+t));
      i===0?ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r):ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
    }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3a8a20';
    ctx.beginPath(); ctx.ellipse(-S*.08, -S*.06, S*.18, S*.15, -0.4, 0, Math.PI*2); ctx.fill();
    // Thorns on sides
    ctx.fillStyle = '#1a4008';
    [[-S*.3,-S*.05,0.6],[S*.3,-S*.05,-0.6],[-S*.24,S*.1,0.3],[S*.24,S*.1,-0.3]].forEach(([tx,ty,rot])=>{
      ctx.save(); ctx.translate(tx,ty); ctx.rotate(rot);
      ctx.beginPath(); ctx.moveTo(0,-S*.1); ctx.lineTo(S*.05,S*.08); ctx.lineTo(-S*.05,S*.08); ctx.fill();
      ctx.restore();
    });
    // Poison pod — tip
    ctx.fillStyle = '#60a820';
    ctx.beginPath(); ctx.ellipse(0, -S*.32, S*.1, S*.16, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#88cc30';
    ctx.beginPath(); ctx.ellipse(-S*.04, -S*.37, S*.06, S*.08, -0.2, 0, Math.PI*2); ctx.fill();
    // Squirt
    if(flash>0){
      ctx.strokeStyle = '#aaee40';
      ctx.shadowBlur = 8; ctx.shadowColor = '#88dd00';
      ctx.lineWidth = S*.04; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0,-S*.46); ctx.lineTo(S*.06,-S*.62); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,-S*.46); ctx.lineTo(-S*.04,-S*.6); ctx.stroke();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  },

  // OMEGA — massive alien obelisk, four pulsing gems, hovering
  omega(ctx, x, y, s, angle, flash) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI/2);
    const S = s;
    const t = Date.now()*0.002;
    // Gravity shadow
    ctx.fillStyle = 'rgba(80,0,180,0.18)';
    ctx.beginPath(); ctx.ellipse(0, S*.28, S*.3, S*.1, 0, 0, Math.PI*2); ctx.fill();
    // Hover offset
    const hov = Math.sin(t)*S*.04;
    ctx.translate(0, hov);
    // Main obelisk — dark, four-sided taper
    ctx.fillStyle = '#0a0018';
    ctx.beginPath(); ctx.moveTo(-S*.14, -S*.5); ctx.lineTo(S*.14, -S*.5); ctx.lineTo(S*.22, S*.3); ctx.lineTo(-S*.22, S*.3); ctx.closePath(); ctx.fill();
    // Purple sheen
    const og = ctx.createLinearGradient(-S*.2, -S*.5, S*.2, S*.3);
    og.addColorStop(0,'rgba(100,0,200,0.4)'); og.addColorStop(0.5,'rgba(200,0,255,0.15)'); og.addColorStop(1,'rgba(40,0,80,0.4)');
    ctx.fillStyle = og; ctx.beginPath(); ctx.moveTo(-S*.14,-S*.5); ctx.lineTo(S*.14,-S*.5); ctx.lineTo(S*.22,S*.3); ctx.lineTo(-S*.22,S*.3); ctx.closePath(); ctx.fill();
    // Glowing runes — four gems embedded
    [[0,-S*.38,'#ff00aa'],[0,-S*.18,'#aa00ff'],[0,S*.02,'#6600ff'],[0,S*.2,'#3300cc']].forEach(([gx,gy,gc])=>{
      ctx.fillStyle = gc;
      ctx.shadowBlur = 10+Math.sin(t)*4; ctx.shadowColor = gc;
      ctx.beginPath(); ctx.moveTo(gx, gy-S*.07); ctx.lineTo(gx+S*.07, gy); ctx.lineTo(gx, gy+S*.07); ctx.lineTo(gx-S*.07, gy); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
    });
    // Apex
    ctx.fillStyle = '#cc00ff';
    ctx.shadowBlur = 16; ctx.shadowColor = '#ff00ff';
    ctx.beginPath(); ctx.moveTo(-S*.04,-S*.5); ctx.lineTo(0,-S*.65); ctx.lineTo(S*.04,-S*.5); ctx.fill();
    ctx.shadowBlur = 0;
    if(flash>0){
      ctx.strokeStyle = '#ff00ff'; ctx.lineWidth = S*.03;
      ctx.shadowBlur = 18; ctx.shadowColor = '#cc00ff';
      ctx.beginPath(); ctx.moveTo(0,-S*.65); ctx.lineTo(0,-S*.95); ctx.stroke();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  },

  // PHANTOM — ghostly spectral cannon, transparent form, purple aura
  phantom(ctx, x, y, s, angle, flash) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI/2);
    const S = s;
    const t = Date.now()*0.002;
    // Spectral shimmer rings
    for(let i=2;i>=0;i--){
      ctx.globalAlpha = 0.15-i*.04;
      ctx.fillStyle = '#8833ff';
      ctx.beginPath(); ctx.arc(0, 0, S*(0.28+i*.12)+Math.sin(t+i)*S*.04, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // Translucent body
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = '#4422aa';
    ctx.beginPath(); ctx.arc(0, 0, S*.28, 0, Math.PI*2); ctx.fill();
    // Inner glow
    const pg = ctx.createRadialGradient(0,0,0,0,0,S*.26);
    pg.addColorStop(0,'rgba(180,100,255,0.5)'); pg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(0, 0, S*.26, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1;
    // Phase barrel — wispy
    ctx.strokeStyle = flash>0 ? '#ff88ff' : 'rgba(180,100,255,0.7)';
    ctx.shadowBlur = flash>0 ? 14 : 6; ctx.shadowColor = '#aa44ff';
    ctx.lineWidth = S*.08; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -S*.5); ctx.stroke();
    ctx.shadowBlur = 0;
    // Skull motif — two eye sockets
    ctx.fillStyle = 'rgba(220,180,255,0.5)';
    ctx.beginPath(); ctx.arc(-S*.1, -S*.06, S*.07, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(S*.1, -S*.06, S*.07, 0, Math.PI*2); ctx.fill();
    if(flash>0){
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 20; ctx.shadowColor = '#cc44ff';
      ctx.beginPath(); ctx.arc(0, -S*.52, S*.1, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  },

  // TEMPORAL — clockwork time-distortion device, spinning gears, hourglass
  temporal(ctx, x, y, s, angle, flash) {
    ctx.save(); ctx.translate(x, y);
    const S = s;
    const t = Date.now()*0.001;
    // Outer gear ring
    ctx.save();
    ctx.rotate(t*0.5);
    ctx.strokeStyle = '#8a7040'; ctx.lineWidth = S*.05;
    ctx.setLineDash([S*.14, S*.08]);
    ctx.beginPath(); ctx.arc(0, 0, S*.36, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    // Gear teeth
    ctx.save(); ctx.rotate(-t*0.8);
    ctx.strokeStyle = '#6a5030'; ctx.lineWidth = S*.04;
    ctx.setLineDash([S*.1, S*.1]);
    ctx.beginPath(); ctx.arc(0, 0, S*.28, 0, Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    // Center clock face
    ctx.fillStyle = '#2a1a08';
    ctx.beginPath(); ctx.arc(0, 0, S*.2, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#8a7040'; ctx.lineWidth = S*.02;
    ctx.beginPath(); ctx.arc(0, 0, S*.2, 0, Math.PI*2); ctx.stroke();
    // Hour/minute hands
    ctx.strokeStyle = '#e0c060'; ctx.lineWidth = S*.03; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(-Math.PI/2+t)*S*.14, Math.sin(-Math.PI/2+t)*S*.14); ctx.stroke();
    ctx.strokeStyle = '#fff0a0'; ctx.lineWidth = S*.02;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(-Math.PI/2+t*3)*S*.18, Math.sin(-Math.PI/2+t*3)*S*.18); ctx.stroke();
    // Center dot
    ctx.fillStyle = '#ffd700';
    ctx.shadowBlur = 6; ctx.shadowColor = '#ffd700';
    ctx.beginPath(); ctx.arc(0, 0, S*.04, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    // Hourglass symbol
    if(flash>0){
      ctx.strokeStyle = '#ffd700'; ctx.lineWidth = S*.04;
      ctx.shadowBlur = 10; ctx.shadowColor = '#ffaa00';
      ctx.beginPath(); ctx.arc(0, 0, S*.38, 0, Math.PI*2); ctx.stroke();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  },

  // REAPER — scythe-mounted turret, bone-white housing, death aura
  reaper(ctx, x, y, s, angle, flash) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI/2);
    const S = s;
    // Base — dark skull platform
    ctx.fillStyle = '#1a1a2a';
    ctx.beginPath(); ctx.arc(0, 0, S*.3, 0, Math.PI*2); ctx.fill();
    // Skull face on base
    ctx.fillStyle = '#d4cfc0';
    ctx.beginPath(); ctx.ellipse(0, S*.02, S*.2, S*.18, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1a1a2a';
    // Eye sockets
    ctx.beginPath(); ctx.ellipse(-S*.08, -S*.02, S*.06, S*.07, -0.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(S*.08, -S*.02, S*.06, S*.07, 0.1, 0, Math.PI*2); ctx.fill();
    // Nose hole
    ctx.beginPath(); ctx.arc(0, S*.06, S*.03, 0, Math.PI*2); ctx.fill();
    // Scythe blade — crescent
    ctx.fillStyle = flash>0 ? '#ccffcc' : '#8aafa8';
    ctx.beginPath();
    ctx.arc(S*.05, -S*.42, S*.28, -Math.PI*.8, -Math.PI*.05);
    ctx.arc(S*.05, -S*.42, S*.18, -Math.PI*.05, -Math.PI*.8, true);
    ctx.closePath(); ctx.fill();
    // Blade edge highlight
    ctx.strokeStyle = flash>0 ? '#ffffff' : '#c0d8d0'; ctx.lineWidth = S*.02;
    ctx.shadowBlur = flash>0?12:0; ctx.shadowColor='#aaffaa';
    ctx.beginPath(); ctx.arc(S*.05, -S*.42, S*.27, -Math.PI*.8, -Math.PI*.05); ctx.stroke();
    ctx.shadowBlur = 0;
    // Handle
    ctx.strokeStyle = '#3a3030'; ctx.lineWidth = S*.07; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, -S*.16); ctx.lineTo(S*.12, -S*.62); ctx.stroke();
    // Soul wisps if active
    if(flash>0){
      ctx.fillStyle = '#88ffaa'; ctx.globalAlpha=0.6;
      ctx.shadowBlur = 10; ctx.shadowColor = '#44ff66';
      ctx.beginPath(); ctx.arc(-S*.14, -S*.32, S*.08, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    }
    ctx.restore();
  },


  // ── AIR TOWER ART ─────────────────────────────────────────────────────

  // DRONE BAY — floating hexagonal launch pad, spinning rotors, drones orbit
  drone_bay(ctx, x, y, s, angle, flash) {
    const S = s, t = Date.now()*0.003;
    // Drop shadow (air = hovering)
    ctx.fillStyle = 'rgba(0,180,212,0.12)';
    ctx.beginPath(); ctx.ellipse(x, y+S*.55, S*.42, S*.14, 0, 0, Math.PI*2); ctx.fill();
    // Hover offset
    ctx.save(); ctx.translate(x, y + Math.sin(t)*S*.04);
    // Platform — hexagon
    ctx.fillStyle = '#0d3a42';
    ctx.beginPath();
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2;i===0?ctx.moveTo(Math.cos(a)*S*.3,Math.sin(a)*S*.3):ctx.lineTo(Math.cos(a)*S*.3,Math.sin(a)*S*.3);}
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#00bcd4'; ctx.lineWidth = S*.04;
    ctx.beginPath();
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2;i===0?ctx.moveTo(Math.cos(a)*S*.3,Math.sin(a)*S*.3):ctx.lineTo(Math.cos(a)*S*.3,Math.sin(a)*S*.3);}
    ctx.closePath(); ctx.stroke();
    // Rotor arms — 4
    ctx.save(); ctx.rotate(t*2);
    ctx.strokeStyle = '#006064'; ctx.lineWidth = S*.05; ctx.lineCap = 'round';
    for(let i=0;i<4;i++){const a=i/4*Math.PI*2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(a)*S*.38,Math.sin(a)*S*.38);ctx.stroke();}
    // Rotor discs
    ctx.fillStyle = 'rgba(0,200,220,0.35)';
    for(let i=0;i<4;i++){const a=i/4*Math.PI*2;ctx.beginPath();ctx.arc(Math.cos(a)*S*.38,Math.sin(a)*S*.38,S*.1,0,Math.PI*2);ctx.fill();}
    ctx.restore();
    // Center launch tube
    ctx.fillStyle = '#00bcd4';
    ctx.shadowBlur = 8; ctx.shadowColor = '#00e5ff';
    ctx.beginPath(); ctx.arc(0,0,S*.1,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    // Mini drone orbiting if firing
    if(flash>0){
      const da = t*8;
      ctx.fillStyle = '#fff'; ctx.shadowBlur=10; ctx.shadowColor='#00e5ff';
      ctx.beginPath(); ctx.arc(Math.cos(da)*S*.5, Math.sin(da)*S*.5, S*.07, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  },

  // APACHE GUNSHIP — rotary wing warbird, stub wings with rocket pods, nose cannon
  apache(ctx, x, y, s, angle, flash) {
    const S = s, t = Date.now()*0.003;
    ctx.fillStyle = 'rgba(100,60,0,0.12)';
    ctx.beginPath(); ctx.ellipse(x, y+S*.6, S*.55, S*.15, 0, 0, Math.PI*2); ctx.fill();
    ctx.save(); ctx.translate(x, y + Math.sin(t*0.8)*S*.05); ctx.rotate(angle + Math.PI/2);
    // Fuselage
    ctx.fillStyle = '#2d3b1a';
    ctx.beginPath(); ctx.ellipse(0, 0, S*.2, S*.42, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#3d5025';
    ctx.beginPath(); ctx.ellipse(-S*.04, -S*.12, S*.14, S*.26, 0, 0, Math.PI*2); ctx.fill();
    // Cockpit bubble
    ctx.fillStyle = '#1a2810';
    ctx.beginPath(); ctx.ellipse(0, -S*.32, S*.14, S*.18, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(100,200,255,0.35)';
    ctx.beginPath(); ctx.ellipse(-S*.04, -S*.36, S*.08, S*.1, -0.2, 0, Math.PI*2); ctx.fill();
    // Stub wings
    ctx.fillStyle = '#2d3b1a';
    ctx.beginPath(); ctx.moveTo(-S*.16,S*.05); ctx.lineTo(-S*.52,-S*.02); ctx.lineTo(-S*.5,S*.12); ctx.lineTo(-S*.16,S*.18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(S*.16,S*.05); ctx.lineTo(S*.52,-S*.02); ctx.lineTo(S*.5,S*.12); ctx.lineTo(S*.16,S*.18); ctx.fill();
    // Rocket pods on wings
    ctx.fillStyle = '#1a2410';
    ctx.beginPath(); ctx.roundRect(-S*.52,-S*.04,S*.18,S*.22,S*.04); ctx.fill();
    ctx.beginPath(); ctx.roundRect(S*.34,-S*.04,S*.18,S*.22,S*.04); ctx.fill();
    if(flash>0){
      ctx.fillStyle='#ff9800'; ctx.shadowBlur=10; ctx.shadowColor='#ff6600';
      ctx.beginPath(); ctx.moveTo(-S*.42,-S*.04); ctx.lineTo(-S*.34,-S*.24); ctx.lineTo(-S*.26,-S*.04); ctx.fill();
      ctx.beginPath(); ctx.moveTo(S*.36,-S*.04); ctx.lineTo(S*.43,-S*.24); ctx.lineTo(S*.5,-S*.04); ctx.fill();
      ctx.shadowBlur=0;
    }
    // Tail boom + rotor
    ctx.fillStyle = '#1e2810';
    ctx.beginPath(); ctx.roundRect(-S*.04,S*.38,S*.08,S*.3,S*.02); ctx.fill();
    // Main rotor — spinning
    ctx.save(); ctx.rotate(t*5);
    ctx.strokeStyle='rgba(60,90,30,0.8)'; ctx.lineWidth=S*.04; ctx.lineCap='round';
    for(let i=0;i<2;i++){ctx.beginPath();ctx.moveTo(i===0?-S*.55:S*.55,0);ctx.lineTo(i===0?S*.55:-S*.55,0);ctx.stroke();}
    ctx.restore();
    // Nose cannon
    ctx.fillStyle = flash>0?'#ffcc00':'#1a2410';
    ctx.beginPath(); ctx.roundRect(-S*.03,-S*.6,S*.06,S*.24,S*.02); ctx.fill();
    ctx.restore();
  },

  // STORMWING — swept delta fighter jet, sharp angles, afterburner glow
  stormwing(ctx, x, y, s, angle, flash) {
    const S = s, t = Date.now()*0.003;
    ctx.fillStyle = 'rgba(80,100,200,0.1)';
    ctx.beginPath(); ctx.ellipse(x, y+S*.58, S*.5, S*.13, 0, 0, Math.PI*2); ctx.fill();
    ctx.save(); ctx.translate(x, y + Math.sin(t*1.2)*S*.04); ctx.rotate(angle + Math.PI/2);
    // Delta wing body
    ctx.fillStyle = '#2a3060';
    ctx.beginPath();
    ctx.moveTo(0,-S*.55);
    ctx.lineTo(-S*.48,S*.3);
    ctx.lineTo(-S*.18,S*.22);
    ctx.lineTo(0,S*.1);
    ctx.lineTo(S*.18,S*.22);
    ctx.lineTo(S*.48,S*.3);
    ctx.closePath(); ctx.fill();
    // Wing underside lighter
    ctx.fillStyle = '#363c78';
    ctx.beginPath(); ctx.moveTo(0,-S*.45); ctx.lineTo(-S*.38,S*.22); ctx.lineTo(0,S*.04); ctx.lineTo(S*.38,S*.22); ctx.closePath(); ctx.fill();
    // Cockpit — narrow teardrop
    ctx.fillStyle = '#1a1e40';
    ctx.beginPath(); ctx.ellipse(0,-S*.28,S*.08,S*.2,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(120,160,255,0.4)';
    ctx.beginPath(); ctx.ellipse(-S*.02,-S*.3,S*.04,S*.12,-0.15,0,Math.PI*2); ctx.fill();
    // Twin engine nozzles
    ctx.fillStyle='#1a1e40';
    ctx.beginPath(); ctx.roundRect(-S*.14,S*.24,S*.1,S*.2,S*.04); ctx.fill();
    ctx.beginPath(); ctx.roundRect(S*.04,S*.24,S*.1,S*.2,S*.04); ctx.fill();
    // Afterburner glow
    ctx.fillStyle=flash>0?'#fff':'rgba(255,120,0,0.7)';
    ctx.shadowBlur=flash>0?16:8; ctx.shadowColor='#ff6600';
    ctx.beginPath(); ctx.arc(-S*.09,S*.46,S*.08,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(S*.09,S*.46,S*.08,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;
    // Missiles under wings
    ctx.fillStyle='#1a1e40';
    ctx.beginPath(); ctx.roundRect(-S*.42,S*.04,S*.06,S*.18,S*.02); ctx.fill();
    ctx.beginPath(); ctx.roundRect(S*.36,S*.04,S*.06,S*.18,S*.02); ctx.fill();
    ctx.restore();
  },

  // STRATO BOMBER — huge wide-body, four engines, bomb bay doors open
  stratobomber(ctx, x, y, s, angle, flash) {
    const S = s, t = Date.now()*0.003;
    ctx.fillStyle = 'rgba(100,110,120,0.12)';
    ctx.beginPath(); ctx.ellipse(x, y+S*.65, S*.7, S*.18, 0, 0, Math.PI*2); ctx.fill();
    ctx.save(); ctx.translate(x, y + Math.sin(t*0.6)*S*.05); ctx.rotate(angle + Math.PI/2);
    // Wide fuselage
    ctx.fillStyle = '#3a4248';
    ctx.beginPath(); ctx.ellipse(0, 0, S*.18, S*.52, 0, 0, Math.PI*2); ctx.fill();
    // High-mount swept wings
    ctx.fillStyle = '#2e3840';
    ctx.beginPath(); ctx.moveTo(-S*.1,-S*.08); ctx.lineTo(-S*.75,S*.2); ctx.lineTo(-S*.72,S*.36); ctx.lineTo(-S*.1,S*.18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(S*.1,-S*.08); ctx.lineTo(S*.75,S*.2); ctx.lineTo(S*.72,S*.36); ctx.lineTo(S*.1,S*.18); ctx.fill();
    // Four engines under wings
    ctx.fillStyle = '#1e2830';
    [[-S*.55,S*.24],[-S*.36,S*.2],[S*.36,S*.2],[S*.55,S*.24]].forEach(([ex,ey])=>{
      ctx.beginPath(); ctx.roundRect(ex-S*.07,ey,S*.14,S*.2,S*.04); ctx.fill();
      ctx.fillStyle='rgba(255,120,0,'+(flash>0?'0.9':'0.5')+')';
      ctx.beginPath(); ctx.arc(ex,ey+S*.2,S*.06,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#1e2830';
    });
    // Cockpit
    ctx.fillStyle='#1e2830';
    ctx.beginPath(); ctx.ellipse(0,-S*.42,S*.1,S*.16,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(150,200,255,0.3)';
    ctx.beginPath(); ctx.ellipse(-S*.02,-S*.44,S*.05,S*.09,-0.1,0,Math.PI*2); ctx.fill();
    // Bomb bay — open if firing
    if(flash>0){
      ctx.fillStyle='#0a1218';
      ctx.beginPath(); ctx.roundRect(-S*.12,S*.08,S*.24,S*.18,S*.02); ctx.fill();
      ctx.fillStyle='#555'; ctx.shadowBlur=14; ctx.shadowColor='#888';
      ctx.beginPath(); ctx.ellipse(0,S*.2,S*.08,S*.12,0,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;
    }
    // Tail
    ctx.fillStyle='#2e3840';
    ctx.beginPath(); ctx.moveTo(-S*.06,S*.5); ctx.lineTo(-S*.26,S*.42); ctx.lineTo(-S*.24,S*.56); ctx.fill();
    ctx.beginPath(); ctx.moveTo(S*.06,S*.5); ctx.lineTo(S*.26,S*.42); ctx.lineTo(S*.24,S*.56); ctx.fill();
    ctx.fillStyle='#3a4248';
    ctx.beginPath(); ctx.moveTo(0,S*.52); ctx.lineTo(0,S*.72); ctx.lineTo(S*.04,S*.72); ctx.lineTo(S*.04,S*.52); ctx.fill();
    ctx.restore();
  },

  // SPECTRE AC-130 — lumbering gunship, side-firing cannons, three weapon ports
  spectre(ctx, x, y, s, angle, flash) {
    const S = s, t = Date.now()*0.003;
    ctx.fillStyle = 'rgba(60,80,90,0.14)';
    ctx.beginPath(); ctx.ellipse(x, y+S*.62, S*.65, S*.17, 0, 0, Math.PI*2); ctx.fill();
    ctx.save(); ctx.translate(x, y + Math.sin(t*0.7)*S*.04); ctx.rotate(angle + Math.PI/2);
    // Big fuselage — C-130 style
    ctx.fillStyle = '#2e3a40';
    ctx.beginPath(); ctx.ellipse(0, S*.06, S*.22, S*.55, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#3a4850';
    ctx.beginPath(); ctx.ellipse(-S*.05, S*.0, S*.14, S*.35, -0.08, 0, Math.PI*2); ctx.fill();
    // High-mounted wings
    ctx.fillStyle = '#252e35';
    ctx.beginPath(); ctx.moveTo(-S*.12,-S*.12); ctx.lineTo(-S*.72,S*.1); ctx.lineTo(-S*.7,S*.28); ctx.lineTo(-S*.12,S*.1); ctx.fill();
    ctx.beginPath(); ctx.moveTo(S*.12,-S*.12); ctx.lineTo(S*.72,S*.1); ctx.lineTo(S*.7,S*.28); ctx.lineTo(S*.12,S*.1); ctx.fill();
    // Four turboprop engines
    ctx.fillStyle='#1a2428';
    [[-S*.62,S*.12],[-S*.44,S*.08],[S*.44,S*.08],[S*.62,S*.12]].forEach(([ex,ey])=>{
      ctx.beginPath(); ctx.ellipse(ex,ey,S*.08,S*.12,0,0,Math.PI*2); ctx.fill();
      // Prop disk
      ctx.fillStyle='rgba(200,220,255,'+(flash>0?'0.6':'0.25')+')';
      ctx.beginPath(); ctx.arc(ex,ey-S*.06,S*.1,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#1a2428';
    });
    // Three side gun ports — the spectre signature
    ctx.fillStyle='#0e1820';
    ctx.beginPath(); ctx.roundRect(S*.2,-S*.35,S*.1,S*.08,S*.02); ctx.fill();
    ctx.beginPath(); ctx.roundRect(S*.2,-S*.1,S*.1,S*.08,S*.02); ctx.fill();
    ctx.beginPath(); ctx.roundRect(S*.2,S*.15,S*.1,S*.1,S*.02); ctx.fill();
    if(flash>0){
      ctx.fillStyle='#fff8c0'; ctx.shadowBlur=10; ctx.shadowColor='#ffaa00';
      [S*.3,-S*.3,S*.3,-S*.06,S*.3,S*.19].forEach((v,i)=>{
        if(i%2===0) return;
        ctx.beginPath(); ctx.arc(S*.3,v,S*.07,0,Math.PI*2); ctx.fill();
      });
      ctx.shadowBlur=0;
    }
    // Cockpit
    ctx.fillStyle='#1e2830';
    ctx.beginPath(); ctx.ellipse(0,-S*.45,S*.12,S*.15,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(130,180,255,0.3)';
    ctx.beginPath(); ctx.ellipse(-S*.02,-S*.47,S*.06,S*.08,-.1,0,Math.PI*2); ctx.fill();
    ctx.restore();
  },

  // SKY FORTRESS — massive airborne castle, turrets all around, glowing core
  sky_fortress(ctx, x, y, s, angle, flash) {
    const S = s, t = Date.now()*0.002;
    ctx.fillStyle = 'rgba(200,160,0,0.14)';
    ctx.beginPath(); ctx.ellipse(x, y+S*.7, S*.75, S*.2, 0, 0, Math.PI*2); ctx.fill();
    const hov = Math.sin(t)*S*.06;
    ctx.save(); ctx.translate(x, y + hov);
    // Engine glow rings underneath
    for(let i=0;i<4;i++){
      const a = (i/4)*Math.PI*2 + t*0.4;
      ctx.fillStyle='rgba(255,180,0,0.2)';
      ctx.beginPath(); ctx.arc(Math.cos(a)*S*.28, S*.35+Math.sin(a)*S*.08, S*.1, 0, Math.PI*2); ctx.fill();
    }
    // Main hull — wide hexagonal fortress
    ctx.fillStyle = '#2a2218';
    ctx.beginPath();
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2-Math.PI/6;i===0?ctx.moveTo(Math.cos(a)*S*.55,Math.sin(a)*S*.38):ctx.lineTo(Math.cos(a)*S*.55,Math.sin(a)*S*.38);}
    ctx.closePath(); ctx.fill();
    // Wall battlements
    ctx.fillStyle = '#3a3020';
    for(let i=0;i<6;i++){
      const a = i/6*Math.PI*2-Math.PI/6;
      const mx = Math.cos(a)*S*.5, my = Math.sin(a)*S*.35;
      ctx.beginPath(); ctx.roundRect(mx-S*.06, my-S*.1, S*.12, S*.16, S*.02); ctx.fill();
    }
    // Corner turrets — 6
    ctx.fillStyle='#4a4030';
    for(let i=0;i<6;i++){
      const a=i/6*Math.PI*2;
      const tx=Math.cos(a)*S*.44, ty=Math.sin(a)*S*.3;
      ctx.beginPath(); ctx.arc(tx, ty, S*.1, 0, Math.PI*2); ctx.fill();
      // Turret barrel pointing outward
      ctx.strokeStyle=flash>0?'#ffd700':'#6a6040'; ctx.lineWidth=S*.04; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(tx+Math.cos(a)*S*.2,ty+Math.sin(a)*S*.14); ctx.stroke();
    }
    // Inner courtyard
    ctx.fillStyle='#1e1a10';
    ctx.beginPath(); ctx.arc(0, 0, S*.28, 0, Math.PI*2); ctx.fill();
    // Central power crystal — animated
    const pulse = S*(0.12 + 0.04*Math.sin(t*3));
    const cg = ctx.createRadialGradient(0,0,0,0,0,pulse*2.5);
    cg.addColorStop(0,'rgba(255,215,0,1)'); cg.addColorStop(0.4,'rgba(255,140,0,0.6)'); cg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(0,0,pulse*2.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#fff8d0'; ctx.shadowBlur=20+Math.sin(t*3)*8; ctx.shadowColor='#ffd700';
    ctx.beginPath(); ctx.arc(0,0,pulse,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;
    // Spinning aura ring
    ctx.save(); ctx.rotate(t);
    ctx.strokeStyle='rgba(255,180,0,0.5)'; ctx.lineWidth=S*.04;
    ctx.setLineDash([S*.18,S*.12]);
    ctx.beginPath(); ctx.arc(0,0,S*.38,0,Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    ctx.restore();
  },

  // Fallback for owner-only or missing towers
  _default(ctx, x, y, s, angle, flash) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle + Math.PI/2);
    const S = s;
    ctx.fillStyle = '#444';
    ctx.beginPath(); ctx.arc(0, 0, S*.3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#666';
    ctx.beginPath(); ctx.roundRect(-S*.06, -S*.38, S*.12, S*.34, S*.02); ctx.fill();
    ctx.restore();
  }
};


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

    // Air tower orbit state
    if (def.isAir) {
      this.orbitAngle  = Math.random() * Math.PI * 2;
      this.orbitRadius = tileSize * 1.5;
      this.orbitSpeed  = 0.7 + Math.random() * 0.5;
      this.orbitBaseX  = tileX * tileSize + tileSize / 2;
      this.orbitBaseY  = tileY * tileSize + tileSize / 2;
    }
  }

  get cost()  { return this.def.cost; }
  get name()  { return this.def.name; }
  get icon()  { return this.def.icon; }

  getSellValue() { return Math.floor(this.totalCostSpent * 0.65); }

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

    const isAir = !!this.def.isAir;

    if (isAir) {
      // ── AIR TOWER: Orbiting aircraft BTD6-style ──────────────────
      if (!this.orbitAngle) this.orbitAngle = Math.random() * Math.PI * 2;
      if (!this.orbitRadius) this.orbitRadius = this.tileSize * 1.5;
      if (!this.orbitSpeed) this.orbitSpeed = 0.8 + Math.random() * 0.5; // rad/s
      if (!this.orbitBaseX) this.orbitBaseX = this.tileX * this.tileSize + this.tileSize / 2;
      if (!this.orbitBaseY) this.orbitBaseY = this.tileY * this.tileSize + this.tileSize / 2;

      // Pick target first
      this.target = this._pickTarget(enemies);

      if (this.target) {
        // Fly toward target, orbiting around them
        const tx = this.target.x, ty = this.target.y;
        const dx = tx - this.x, dy = ty - this.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        // Angle of flight
        this.angle = Math.atan2(dy, dx);
        // Move toward target
        const speed = this.tileSize * 3.5;
        if (dist > this.tileSize * 0.8) {
          this.x += (dx/dist) * speed * dt;
          this.y += (dy/dist) * speed * dt;
        }
        // Fire
        if (this.fireCooldown <= 0) {
          this.fireCooldown = 1 / (this.fireRate * this.auraBuff);
          this.shootFlash = 1;
          this._fire(this.target, enemies);
        }
      } else {
        // No target — orbit base tile
        this.orbitAngle += this.orbitSpeed * dt;
        const targetX = this.orbitBaseX + Math.cos(this.orbitAngle) * this.orbitRadius;
        const targetY = this.orbitBaseY + Math.sin(this.orbitAngle) * this.orbitRadius;
        const dx = targetX - this.x, dy = targetY - this.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        const speed = this.tileSize * 3.0;
        if (dist > 4) {
          this.x += (dx/dist) * Math.min(speed*dt, dist);
          this.y += (dy/dist) * Math.min(speed*dt, dist);
          this.angle = Math.atan2(dy, dx);
        }
      }
    } else {
      // Ground tower — stationary
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
    }

    this.bullets = this.bullets.filter(b => !b.dead);
    this.bullets.forEach(b => b.update(dt));
  }

  _pickTarget(enemies) {
    const myX = this.def.isAir ? this.x : (this.tileX * this.tileSize + this.tileSize/2);
    const myY = this.def.isAir ? this.y : (this.tileY * this.tileSize + this.tileSize/2);
    const checkRange = this.def.isAir ? this.range * 2.5 : this.range; // air towers have wider effective range
    const inRange = enemies.filter(e => {
      const dx = e.x - myX, dy = e.y - myY;
      if (e.dead) return false;
      if (e.invisible && !this.canSeeInvis) return false;
      return Math.sqrt(dx * dx + dy * dy) <= checkRange;
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
    // Air towers use live position; ground towers use tile center
    const isAir = !!this.def.isAir;
    const cx = isAir ? this.x : (this.tileX * s + s/2);
    const cy = isAir ? this.y : (this.tileY * s + s/2);
    const flash = this.shootFlash;
    const col = this.def.color;

    // ── Tile background ──────────────────────────────────────────────────
    const rarityColors = { basic:'#3b82f6', advanced:'#06b6d4', special:'#a78bfa', legendary:'#f59e0b' };
    const rarityCol = rarityColors[this.def.rarity] || col;

    ctx.save();
    if (isAir) {
      // Air towers: show landing pad at home tile
      ctx.strokeStyle = 'rgba(0,188,212,0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3,3]);
      ctx.beginPath(); ctx.roundRect(tx+pad, ty+pad, s-pad*2, s-pad*2, 4); ctx.stroke();
      ctx.setLineDash([]);
      // Pad H marker
      ctx.fillStyle = 'rgba(0,188,212,0.25)'; ctx.beginPath(); ctx.roundRect(tx+pad,ty+pad,s-pad*2,s-pad*2,4); ctx.fill();
      ctx.font = `bold ${Math.floor(s*0.3)}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle='rgba(0,188,212,0.5)'; ctx.fillText('H', tx+s/2, ty+s/2);
      // Flight path circle
      ctx.strokeStyle = 'rgba(0,188,212,0.12)'; ctx.lineWidth=1; ctx.setLineDash([2,4]);
      ctx.beginPath(); ctx.arc(tx+s/2, ty+s/2, s*1.5, 0, Math.PI*2); ctx.stroke();
      ctx.setLineDash([]);
      // Drop shadow under aircraft
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.beginPath(); ctx.ellipse(cx + s*0.08, this.tileY*s+s*0.85, s*0.32, s*0.08, 0, 0, Math.PI*2); ctx.fill();
    } else if (this.auraBuff > 1.0) {
      const ag = ctx.createRadialGradient(cx,cy,s*0.1,cx,cy,s*0.55);
      ag.addColorStop(0,'rgba(241,196,15,0.25)');
      ag.addColorStop(1,'rgba(241,196,15,0.04)');
      ctx.fillStyle = ag;
      ctx.beginPath(); ctx.roundRect(tx+pad, ty+pad, s-pad*2, s-pad*2, 4); ctx.fill();
    } else if (this.selected) {
      ctx.fillStyle = 'rgba(241,196,15,0.16)';
      ctx.beginPath(); ctx.roundRect(tx+pad, ty+pad, s-pad*2, s-pad*2, 4); ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath(); ctx.roundRect(tx+pad, ty+pad, s-pad*2, s-pad*2, 4); ctx.fill();
    }

    if (!isAir) {
      // Rarity-colored border
      const borderCol = this.selected ? '#f1c40f' : rarityCol + (this.def.rarity==='legendary'?'55':'33');
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = this.selected ? 2 : (this.def.rarity === 'legendary' ? 1.5 : 1);
      ctx.beginPath(); ctx.roundRect(tx+pad, ty+pad, s-pad*2, s-pad*2, 4); ctx.stroke();
    }
    ctx.restore();

    // ── Draw tower sprite ────────────────────────────────────────────────
    const artFn = TowerArt[this.def.id] || TowerArt._default;
    artFn(ctx, cx, cy, s, this.angle, flash);

    // Level upgrade pips (glowing dots — drawn above sprite)
    if (this.level > 0) {
      ctx.save();
      ctx.shadowBlur = 5; ctx.shadowColor = '#f1c40f';
      for (let i = 0; i < this.level; i++) {
        const rx = cx + (i - (this.level-1)/2) * s*0.16;
        const ry = cy + s*0.38;
        ctx.beginPath();
        ctx.arc(rx, ry, s*0.055, 0, Math.PI*2);
        ctx.fillStyle = i < 3 ? '#f1c40f' : '#fff';
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.restore();
    }

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
      this.auraAlpha = (Math.sin(t)+1)*0.10;
      ctx.beginPath();
      ctx.arc(cx, cy, this.range*0.7, 0, Math.PI*2);
      ctx.fillStyle = `rgba(241,196,15,${this.auraAlpha})`;
      ctx.fill();
    }

    // ── Owner glow pulse (single, clean) ─────────────────────────────────
    if (this.def.ownerOnly) {
      const t = Date.now() * 0.002;
      ctx.save();
      ctx.shadowBlur = 20 + Math.sin(t)*10;
      ctx.shadowColor = col;
      ctx.beginPath();
      ctx.arc(cx, cy, s*0.44, 0, Math.PI*2);
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.35 + Math.sin(t)*0.25;
      ctx.stroke();
      ctx.restore();
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
    // Instant beams (laser / phantom)
    if (this.speed >= 900 && this.target && !this.target.dead) {
      ctx.save();
      const grd = ctx.createLinearGradient(this.x, this.y, this.target.x, this.target.y);
      grd.addColorStop(0, this.color);
      grd.addColorStop(1, this.color + '00');
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.target.x, this.target.y);
      ctx.strokeStyle = grd;
      ctx.lineWidth = this.size || 2;
      ctx.shadowBlur = 14; ctx.shadowColor = this.color;
      ctx.globalAlpha = 0.85;
      ctx.stroke();
      // Core line
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = (this.size||2) * 0.4;
      ctx.strokeStyle = '#fff';
      ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(this.target.x, this.target.y);
      ctx.stroke();
      ctx.restore();
      this.dead = true;
      return;
    }

    ctx.save();
    ctx.shadowBlur = this.size * 2.5;
    ctx.shadowColor = this.color;

    // Trail effect: draw fading tail toward previous position
    if (this.target && !this.target.dead) {
      const dx = this.target.x - this.x, dy = this.target.y - this.y;
      const dist = Math.sqrt(dx*dx+dy*dy)||1;
      const tailLen = this.size * 4;
      const tx = this.x - (dx/dist)*tailLen, ty = this.y - (dy/dist)*tailLen;
      const tg = ctx.createLinearGradient(this.x, this.y, tx, ty);
      tg.addColorStop(0, this.color + 'cc');
      tg.addColorStop(1, this.color + '00');
      ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(tx, ty);
      ctx.strokeStyle = tg;
      ctx.lineWidth = this.size * 0.65;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.7;
      ctx.stroke();
    }

    // Main bullet body
    ctx.globalAlpha = 1;
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    g.addColorStop(0, '#fff');
    g.addColorStop(0.3, this.color);
    g.addColorStop(1, this.color + '88');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fillStyle = g;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.restore();
  }
}
