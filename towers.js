/* ═══════════════════════════════════════════════
   towers.js
   ═══════════════════════════════════════════════

   ── DAMAGE CONFIG ────────────────────────────────
   Edit these numbers to tune any tower instantly.
   Format:  towerId: { damage, fireRate, range }
   ─────────────────────────────────────────────── */

const TOWER_DAMAGE_CONFIG = {
  //  id                  damage   fireRate  range
  gunner:          { damage: 15,   fireRate: 1.2,  range: 120 },
  archer:          { damage: 10,   fireRate: 1.8,  range: 160 },
  sniper:          { damage: 80,   fireRate: 0.4,  range: 260 },
  rocketeer:       { damage: 60,   fireRate: 0.6,  range: 130 },
  freezer:         { damage: 10,   fireRate: 0.8,  range: 110 },
  flamer:          { damage: 8,    fireRate: 8,    range: 90  },
  tesla:           { damage: 40,   fireRate: 1.0,  range: 140 },
  laser:           { damage: 12,   fireRate: 15,   range: 180 },
  mortar:          { damage: 100,  fireRate: 0.3,  range: 200 },
  venom:           { damage: 20,   fireRate: 1.5,  range: 140 },
  omega:           { damage: 400,  fireRate: 0.25, range: 200 },
  phantom:         { damage: 250,  fireRate: 0.8,  range: 300 },
  temporal:        { damage: 30,   fireRate: 0.15, range: 999 },
  reaper:          { damage: 180,  fireRate: 0.9,  range: 200 },
  // ── OWNER TOWERS — deliberately broken OP ─────────────
  shadow_commander:{ damage: 9999, fireRate: 3.0,  range: 999 },
  neon_warden:     { damage: 9999, fireRate: 8.0,  range: 999 },
  void_hunter:     { damage: 99999,fireRate: 4.0,  range: 999 },
};

/* ── DAMAGE TYPES ──────────────────────────────────────────
   Each tower has a damageType.
   Each enemy has an immunities[] array.
   If tower's damageType is in enemy.immunities → 0 damage.
   Owner towers + legendaries with bypasses:true ignore all.

   Types: bullet | fire | ice | explosive | electric | laser | poison | void
   ─────────────────────────────────────────────────────── */

const TOWER_DEFS = (() => {
  const c = TOWER_DAMAGE_CONFIG;
  return [
    // ── BASIC ──────────────────────────────────────────────
    {
      id:'gunner' icon:'[GUN]',, name:'GUNNER', rarity:'basic',
      cost:75, shopCost:0,
      desc:'Standard soldier. Weak vs armored enemies.',
      damageType:'bullet', bypasses:false,
      color:'#3498db', range:c.gunner.range, fireRate:c.gunner.fireRate, damage:c.gunner.damage,
      bulletSpeed:280, bulletColor:'#f1c40f', bulletSize:4,
      splash:0, slow:0, pierce:0, maxUpgrade:3, unlocked:true,
      weakVs:['armored','shielder'], strongVs:['walker','crawler','runner'],
      upgrades:[
        { name:'Rapid Fire',   cost:80,  dmgBonus:5,  rateBonus:0.5, rangeBonus:0  },
        { name:'Heavy Rounds', cost:130, dmgBonus:10, rateBonus:0.3, rangeBonus:15 },
        { name:'Minigun',      cost:220, dmgBonus:20, rateBonus:1.5, rangeBonus:20 },
      ],
    },
    {
      id:'archer' icon:'[BOW]',, name:'ARCHER', rarity:'basic',
      cost:60, shopCost:0,
      desc:'Long range. Pierces. Weak vs armored.',
      damageType:'bullet', bypasses:false,
      color:'#27ae60', range:c.archer.range, fireRate:c.archer.fireRate, damage:c.archer.damage,
      bulletSpeed:320, bulletColor:'#2ecc71', bulletSize:3,
      splash:0, slow:0, pierce:1, maxUpgrade:3, unlocked:true,
      weakVs:['armored','shielder','ghost'], strongVs:['walker','crawler','bloated'],
      upgrades:[
        { name:'Longbow',       cost:70,  dmgBonus:5,  rateBonus:0.6, rangeBonus:30 },
        { name:'Poison Arrows', cost:120, dmgBonus:8,  rateBonus:0.2, rangeBonus:20, burn:3 },
        { name:'Storm Arrows',  cost:200, dmgBonus:12, rateBonus:1.0, rangeBonus:30, pierce:2 },
      ],
    },
    {
      id:'sniper' icon:'[SNP]',, name:'SNIPER', rarity:'basic',
      cost:120, shopCost:250,
      desc:'Long range, high damage. Weak vs fast enemies.',
      damageType:'bullet', bypasses:false,
      color:'#8e44ad', range:c.sniper.range, fireRate:c.sniper.fireRate, damage:c.sniper.damage,
      bulletSpeed:600, bulletColor:'#e8daef', bulletSize:3,
      splash:0, slow:0, pierce:2, maxUpgrade:3, unlocked:false,
      weakVs:['crawler','runner'], strongVs:['bloated','armored','nightmare'],
      upgrades:[
        { name:'Scope+',        cost:110, dmgBonus:30,  rateBonus:0.1, rangeBonus:40 },
        { name:'Armour Pierce', cost:200, dmgBonus:50,  rateBonus:0.1, rangeBonus:20, armorPierce:true },
        { name:'Rail Gun',      cost:350, dmgBonus:120, rateBonus:0.2, rangeBonus:40, pierce:5 },
      ],
    },
    // ── ADVANCED ───────────────────────────────────────────
    {
      id:'rocketeer' icon:'[RKT]',, name:'ROCKETEER', rarity:'advanced',
      cost:200, shopCost:500,
      desc:'Explosive splash. Weak vs fast enemies.',
      damageType:'explosive', bypasses:false,
      color:'#e67e22', range:c.rocketeer.range, fireRate:c.rocketeer.fireRate, damage:c.rocketeer.damage,
      bulletSpeed:200, bulletColor:'#e74c3c', bulletSize:7,
      splash:60, slow:0, pierce:0, maxUpgrade:3, unlocked:false,
      weakVs:['runner','leaper','crawler'], strongVs:['bloated','shielder','walker'],
      upgrades:[
        { name:'Big Rockets',    cost:180, dmgBonus:30,  rateBonus:0.1, rangeBonus:20, splashBonus:20 },
        { name:'Cluster Bomb',   cost:280, dmgBonus:50,  rateBonus:0.2, rangeBonus:10, splashBonus:30 },
        { name:'Nuclear Warhead',cost:480, dmgBonus:120, rateBonus:0.15,rangeBonus:20, splashBonus:60 },
      ],
    },
    {
      id:'freezer' icon:'[ICE]',, name:'FREEZER', rarity:'advanced',
      cost:160, shopCost:450,
      desc:'Slows enemies. Weak vs armored.',
      damageType:'ice', bypasses:false,
      color:'#3498db', range:c.freezer.range, fireRate:c.freezer.fireRate, damage:c.freezer.damage,
      bulletSpeed:240, bulletColor:'#85c1e9', bulletSize:8,
      splash:50, slow:0.45, slowDuration:2.0, pierce:0, maxUpgrade:3, unlocked:false,
      weakVs:['armored','shielder'], strongVs:['runner','berserker','nightmare'],
      upgrades:[
        { name:'Arctic Blast',  cost:150, dmgBonus:5,  rateBonus:0.2, rangeBonus:20, slowBonus:0.1  },
        { name:'Deep Freeze',   cost:240, dmgBonus:10, rateBonus:0.2, rangeBonus:20, slowBonus:0.15 },
        { name:'Absolute Zero', cost:380, dmgBonus:15, rateBonus:0.3, rangeBonus:30, slowBonus:0.2  },
      ],
    },
    {
      id:'flamer' icon:'[FIR]',, name:'FLAMETHROWER', rarity:'advanced',
      cost:180, shopCost:500,
      desc:'Burns over time. Weak vs ghost and armored.',
      damageType:'fire', bypasses:false,
      color:'#e74c3c', range:c.flamer.range, fireRate:c.flamer.fireRate, damage:c.flamer.damage,
      bulletSpeed:180, bulletColor:'#ff6b35', bulletSize:6,
      splash:20, slow:0, burn:3, pierce:0, maxUpgrade:3, unlocked:false,
      weakVs:['ghost','armored'], strongVs:['walker','crawler','bloated','toxic'],
      upgrades:[
        { name:'Napalm',       cost:160, dmgBonus:4,  rateBonus:2, rangeBonus:15, burnBonus:2 },
        { name:'Inferno',      cost:260, dmgBonus:8,  rateBonus:3, rangeBonus:10, burnBonus:4 },
        { name:'Dragon Breath',cost:420, dmgBonus:15, rateBonus:5, rangeBonus:20, burnBonus:8 },
      ],
    },
    // ── SPECIAL ────────────────────────────────────────────
    {
      id:'tesla' icon:'[ELC]',, name:'TESLA COIL', rarity:'special',
      cost:350, shopCost:1200,
      desc:'Chains lightning. Weak vs armored.',
      damageType:'electric', bypasses:false,
      color:'#f39c12', range:c.tesla.range, fireRate:c.tesla.fireRate, damage:c.tesla.damage,
      bulletSpeed:500, bulletColor:'#f9e79f', bulletSize:3,
      splash:0, chain:4, slow:0.2, pierce:0, maxUpgrade:3, unlocked:false,
      weakVs:['armored','shielder'], strongVs:['runner','crawler','ghost','toxic'],
      upgrades:[
        { name:'Overcharge',    cost:300, dmgBonus:20, rateBonus:0.3, rangeBonus:20, chainBonus:2 },
        { name:'Ball Lightning',cost:500, dmgBonus:40, rateBonus:0.3, rangeBonus:30, chainBonus:3 },
        { name:'Storm God',     cost:800, dmgBonus:80, rateBonus:0.5, rangeBonus:40, chainBonus:5 },
      ],
    },
    {
      id:'laser' icon:'[LZR]',, name:'LASER TOWER', rarity:'special',
      cost:400, shopCost:1500,
      desc:'Pierces armor. Deals no damage to ghost.',
      damageType:'laser', bypasses:false,
      color:'#e74c3c', range:c.laser.range, fireRate:c.laser.fireRate, damage:c.laser.damage,
      bulletSpeed:999, bulletColor:'#ff0040', bulletSize:2,
      splash:0, slow:0, armorPierce:true, beam:true, pierce:0, maxUpgrade:3, unlocked:false,
      weakVs:['ghost'], strongVs:['armored','shielder','nightmare','boss_undead_titan'],
      upgrades:[
        { name:'Focused Beam', cost:350, dmgBonus:8,  rateBonus:3, rangeBonus:30 },
        { name:'Plasma Cutter',cost:580, dmgBonus:15, rateBonus:5, rangeBonus:20 },
        { name:'Death Ray',    cost:950, dmgBonus:30, rateBonus:8, rangeBonus:40 },
      ],
    },
    {
      id:'mortar' icon:'[MTR]',, name:'MORTAR', rarity:'special',
      cost:320, shopCost:1100,
      desc:'Massive splash. Too slow for fast enemies.',
      damageType:'explosive', bypasses:false,
      color:'#7f8c8d', range:c.mortar.range, fireRate:c.mortar.fireRate, damage:c.mortar.damage,
      bulletSpeed:150, bulletColor:'#bdc3c7', bulletSize:10,
      splash:90, slow:0, pierce:0, maxUpgrade:3, unlocked:false,
      weakVs:['runner','leaper'], strongVs:['bloated','shielder','walker','armored'],
      upgrades:[
        { name:'Heavy Shell', cost:280, dmgBonus:50,  rateBonus:0.1, rangeBonus:30, splashBonus:20 },
        { name:'Barrage',     cost:460, dmgBonus:80,  rateBonus:0.15,rangeBonus:20, splashBonus:40 },
        { name:'Armageddon',  cost:750, dmgBonus:180, rateBonus:0.2, rangeBonus:40, splashBonus:80 },
      ],
    },
    {
      id:'venom' icon:'[PSN]',, name:'VENOM TOWER', rarity:'special',
      cost:280, shopCost:900,
      desc:'Poisons groups. Weak vs boss types.',
      damageType:'poison', bypasses:false,
      color:'#16a085', range:c.venom.range, fireRate:c.venom.fireRate, damage:c.venom.damage,
      bulletSpeed:260, bulletColor:'#1abc9c', bulletSize:6,
      splash:70, slow:0.15, burn:8, pierce:0, maxUpgrade:3, unlocked:false,
      weakVs:['boss_zombie_king','boss_undead_titan','boss_shadow_lord'],
      strongVs:['walker','crawler','healer','bloated'],
      upgrades:[
        { name:'Acid Cloud', cost:240, dmgBonus:10, rateBonus:0.4, rangeBonus:20, burnBonus:5  },
        { name:'Plague',     cost:400, dmgBonus:20, rateBonus:0.5, rangeBonus:30, burnBonus:10 },
        { name:'BIOHAZARD',  cost:700, dmgBonus:40, rateBonus:1.0, rangeBonus:40, burnBonus:20, splashBonus:30 },
      ],
    },
    // ── LEGENDARY — bypasses all immunities ────────────────
    {
      id:'omega' icon:'[OMG]',, name:'OMEGA CANNON', rarity:'legendary',
      cost:800, shopCost:4000,
      desc:'Kills ANY monster type. Expensive but unstoppable.',
      damageType:'void', bypasses:true,
      color:'#f1c40f', range:c.omega.range, fireRate:c.omega.fireRate, damage:c.omega.damage,
      bulletSpeed:350, bulletColor:'#f9e79f', bulletSize:14,
      splash:100, slow:0, armorPierce:true, pierce:0, maxUpgrade:3, unlocked:false,
      strongVs:['ALL'],
      upgrades:[
        { name:'Overload',   cost:800,  dmgBonus:200, rateBonus:0.05, rangeBonus:30, splashBonus:30 },
        { name:'Singularity',cost:1400, dmgBonus:400, rateBonus:0.05, rangeBonus:30, splashBonus:50 },
        { name:'EXTINCTION', cost:2200, dmgBonus:800, rateBonus:0.1,  rangeBonus:50, splashBonus:80 },
      ],
    },
    {
      id:'phantom' icon:'[PHT]',, name:'PHANTOM SNIPER', rarity:'legendary',
      cost:700, shopCost:3500,
      desc:'Sees invisible. Insta-kills weak foes. Kills ANY type.',
      damageType:'void', bypasses:true,
      color:'#8e44ad', range:c.phantom.range, fireRate:c.phantom.fireRate, damage:c.phantom.damage,
      bulletSpeed:800, bulletColor:'#bb8fce', bulletSize:4,
      splash:0, slow:0, pierce:3, armorPierce:true, canSeeInvis:true, maxUpgrade:3, unlocked:false,
      strongVs:['ALL'],
      upgrades:[
        { name:'Shadow Mark', cost:700,  dmgBonus:100, rateBonus:0.2, rangeBonus:40 },
        { name:'Soul Rip',    cost:1200, dmgBonus:200, rateBonus:0.2, rangeBonus:40, instaKill:true },
        { name:'GOD OF DEATH',cost:2000, dmgBonus:400, rateBonus:0.4, rangeBonus:60, instaKill:true, pierce:6 },
      ],
    },
    {
      id:'temporal' icon:'[TMP]',, name:'TIME DISTORTER', rarity:'legendary',
      cost:900, shopCost:5000,
      desc:'Slows ALL enemies on screen. Kills ANY type.',
      damageType:'void', bypasses:true,
      color:'#1abc9c', range:c.temporal.range, fireRate:c.temporal.fireRate, damage:c.temporal.damage,
      bulletSpeed:400, bulletColor:'#48c9b0', bulletSize:5,
      splash:0, slow:0.7, slowDuration:3.5, pierce:1, armorPierce:true, maxUpgrade:3, unlocked:false,
      strongVs:['ALL'],
      upgrades:[
        { name:'Chronostasis', cost:900,  dmgBonus:20, rateBonus:0.05, rangeBonus:0, slowBonus:0.1  },
        { name:'Temporal Rift',cost:1600, dmgBonus:50, rateBonus:0.1,  rangeBonus:0, slowBonus:0.15 },
        { name:'TIME STOP',    cost:2500, dmgBonus:80, rateBonus:0.15, rangeBonus:0, slowBonus:0.2  },
      ],
    },
    {
      id:'reaper' icon:'[RPR]',, name:'SOUL REAPER', rarity:'legendary',
      cost:1000, shopCost:6000,
      desc:'Executes below 20% HP. Kills ANY type.',
      damageType:'void', bypasses:true,
      color:'#2c3e50', range:c.reaper.range, fireRate:c.reaper.fireRate, damage:c.reaper.damage,
      bulletSpeed:500, bulletColor:'#95a5a6', bulletSize:5,
      splash:0, slow:0, pierce:4, armorPierce:true, instaKillThreshold:0.2, maxUpgrade:3, unlocked:false,
      strongVs:['ALL'],
      upgrades:[
        { name:'Dark Harvest', cost:950,  dmgBonus:90,  rateBonus:0.2, rangeBonus:30 },
        { name:'Soul Devour',  cost:1600, dmgBonus:180, rateBonus:0.3, rangeBonus:20, instaKillThreshold:0.35 },
        { name:'GRIM REAPER',  cost:2800, dmgBonus:350, rateBonus:0.5, rangeBonus:40, instaKillThreshold:0.5, pierce:8 },
      ],
    },
    // ── OWNER ONLY — void damage, bypasses everything ──────
    {
      id:'shadow_commander' icon:'[SCM]',, name:'SHADOW COMMANDER', rarity:'legendary',
      cost:0, shopCost:0, ownerOnly:true,
      desc:'OWNER ONLY. Void damage. Kills every monster type. Buffs nearby towers.',
      damageType:'void', bypasses:true,
      color:'#9b59b6',
      range:c.shadow_commander.range, fireRate:c.shadow_commander.fireRate, damage:c.shadow_commander.damage,
      bulletSpeed:500, bulletColor:'#9b59b6', bulletSize:10,
      splash:80, slow:0.4, armorPierce:true, aura:true, auraBonus:0.5,
      pierce:2, canSeeInvis:true, maxUpgrade:0, upgrades:[], unlocked:false,
      strongVs:['ALL'],
    },
    {
      id:'neon_warden' icon:'[NWD]',, name:'NEON WARDEN', rarity:'legendary',
      cost:0, shopCost:0, ownerOnly:true,
      desc:'OWNER ONLY. Void damage. 99-chain lightning. Nothing survives.',
      damageType:'void', bypasses:true,
      color:'#00ffaa',
      range:c.neon_warden.range, fireRate:c.neon_warden.fireRate, damage:c.neon_warden.damage,
      bulletSpeed:700, bulletColor:'#00ffaa', bulletSize:6,
      splash:100, slow:0.6, chain:99, armorPierce:true,
      pierce:3, canSeeInvis:true, maxUpgrade:0, upgrades:[], unlocked:false,
      strongVs:['ALL'],
    },
    {
      id:'void_hunter' icon:'[VHT]',, name:'VOID HUNTER', rarity:'legendary',
      cost:0, shopCost:0, ownerOnly:true,
      desc:'OWNER ONLY. Void damage. Insta-kills everything. Reality shredder.',
      damageType:'void', bypasses:true,
      color:'#8e44ad',
      range:c.void_hunter.range, fireRate:c.void_hunter.fireRate, damage:c.void_hunter.damage,
      bulletSpeed:900, bulletColor:'#9b59b6', bulletSize:12,
      splash:50, slow:0.8, pierce:8, armorPierce:true,
      canSeeInvis:true, instaKill:true, maxUpgrade:0, upgrades:[], unlocked:false,
      strongVs:['ALL'],
    },
  ];
})();

function getTowerDef(id) { return TOWER_DEFS.find(t => t.id === id); }

/* ── Canvas Tower Art (no emojis) ───────────────────────── */
const TowerArt = {
  gunner(ctx, x, y, s, col) {
    ctx.beginPath(); ctx.arc(x, y, s*.38, 0, Math.PI*2); ctx.fillStyle=col; ctx.fill();
    ctx.fillStyle='#1a252f'; ctx.beginPath(); ctx.ellipse(x,y-s*.06,s*.22,s*.15,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#5dade2'; ctx.beginPath(); ctx.ellipse(x,y-s*.06,s*.13,s*.09,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#888'; ctx.fillRect(x+s*.3,y-s*.05,s*.3,s*.1);
    ctx.fillStyle='#555'; ctx.fillRect(x+s*.56,y-s*.07,s*.06,s*.14);
  },
  archer(ctx, x, y, s, col) {
    ctx.beginPath(); ctx.arc(x, y, s*.38, 0, Math.PI*2); ctx.fillStyle=col; ctx.fill();
    ctx.strokeStyle='#8B6914'; ctx.lineWidth=s*.08; ctx.lineCap='round';
    ctx.beginPath(); ctx.arc(x+s*.18,y,s*.28,-Math.PI*.6,Math.PI*.6); ctx.stroke();
    ctx.strokeStyle='#c8a44a'; ctx.lineWidth=s*.04;
    ctx.beginPath(); ctx.moveTo(x-s*.2,y); ctx.lineTo(x+s*.3,y); ctx.stroke();
    ctx.fillStyle='#c8a44a';
    ctx.beginPath(); ctx.moveTo(x+s*.3,y); ctx.lineTo(x+s*.18,y-s*.1); ctx.lineTo(x+s*.18,y+s*.1); ctx.fill();
  },
  sniper(ctx, x, y, s, col) {
    ctx.beginPath(); ctx.arc(x, y, s*.38, 0, Math.PI*2); ctx.fillStyle=col; ctx.fill();
    ctx.fillStyle='#555'; ctx.fillRect(x+s*.08,y-s*.06,s*.56,s*.12);
    ctx.fillStyle='#222'; ctx.fillRect(x+s*.22,y-s*.2,s*.15,s*.14);
    ctx.fillStyle='#e74c3c'; ctx.beginPath(); ctx.arc(x+s*.3,y-s*.13,s*.05,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x+s*.28,y-s*.15,s*.02,0,Math.PI*2); ctx.fill();
  },
  rocketeer(ctx, x, y, s, col) {
    ctx.beginPath(); ctx.arc(x, y, s*.38, 0, Math.PI*2); ctx.fillStyle=col; ctx.fill();
    ctx.fillStyle='#7f8c8d'; ctx.beginPath(); ctx.roundRect(x+s*.06,y-s*.14,s*.46,s*.28,s*.05); ctx.fill();
    ctx.fillStyle='#e74c3c';
    ctx.beginPath(); ctx.moveTo(x+s*.56,y); ctx.lineTo(x+s*.42,y-s*.14); ctx.lineTo(x+s*.42,y+s*.14); ctx.fill();
    ctx.fillStyle='#f39c12'; ctx.beginPath(); ctx.arc(x+s*.06,y,s*.1,0,Math.PI*2); ctx.fill();
  },
  freezer(ctx, x, y, s, col) {
    ctx.beginPath(); ctx.arc(x, y, s*.38, 0, Math.PI*2); ctx.fillStyle=col; ctx.fill();
    ctx.strokeStyle='#dff'; ctx.lineWidth=s*.07; ctx.lineCap='round';
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+Math.cos(a)*s*.3,y+Math.sin(a)*s*.3); ctx.stroke();}
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2+Math.PI/6; ctx.beginPath(); ctx.moveTo(x+Math.cos(a)*s*.14,y+Math.sin(a)*s*.14); ctx.lineTo(x+Math.cos(a)*s*.26,y+Math.sin(a)*s*.26); ctx.stroke();}
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x,y,s*.07,0,Math.PI*2); ctx.fill();
  },
  flamer(ctx, x, y, s, col) {
    ctx.beginPath(); ctx.arc(x, y, s*.38, 0, Math.PI*2); ctx.fillStyle=col; ctx.fill();
    ctx.fillStyle='#922b21'; ctx.beginPath(); ctx.roundRect(x-s*.22,y-s*.18,s*.28,s*.36,s*.05); ctx.fill();
    ctx.fillStyle='#888'; ctx.fillRect(x+s*.06,y-s*.06,s*.3,s*.12);
    ctx.fillStyle='#f39c12'; ctx.beginPath(); ctx.arc(x+s*.38,y,s*.12,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x+s*.38,y,s*.05,0,Math.PI*2); ctx.fill();
  },
  tesla(ctx, x, y, s, col) {
    ctx.fillStyle='#0d0d1a'; ctx.beginPath(); ctx.arc(x,y,s*.38,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=col; ctx.lineWidth=s*.06; ctx.beginPath(); ctx.arc(x,y,s*.3,0,Math.PI*2); ctx.stroke();
    ctx.lineWidth=s*.04; ctx.beginPath(); ctx.arc(x,y,s*.18,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='#f9e79f';
    ctx.beginPath(); ctx.moveTo(x+s*.06,y-s*.2); ctx.lineTo(x-s*.04,y); ctx.lineTo(x+s*.06,y); ctx.lineTo(x-s*.06,y+s*.2); ctx.lineTo(x+s*.04,y); ctx.lineTo(x-s*.06,y); ctx.closePath(); ctx.fill();
  },
  laser(ctx, x, y, s, col) {
    ctx.fillStyle='#1a0000'; ctx.beginPath(); ctx.arc(x,y,s*.38,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=col; ctx.lineWidth=s*.05; ctx.beginPath(); ctx.arc(x,y,s*.34,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='#ff0040'; ctx.beginPath(); ctx.arc(x,y,s*.14,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#ff9090'; ctx.beginPath(); ctx.arc(x-s*.04,y-s*.04,s*.05,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#888'; ctx.fillRect(x+s*.14,y-s*.04,s*.3,s*.08);
  },
  mortar(ctx, x, y, s, col) {
    ctx.fillStyle='#1c2833'; ctx.beginPath(); ctx.arc(x,y,s*.38,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#7f8c8d'; ctx.fillRect(x-s*.24,y+s*.1,s*.48,s*.12);
    ctx.save(); ctx.translate(x,y); ctx.rotate(-0.5);
    ctx.fillStyle=col; ctx.fillRect(-s*.08,-s*.34,s*.16,s*.34);
    ctx.fillStyle='#555'; ctx.fillRect(-s*.08,-s*.38,s*.16,s*.06);
    ctx.restore();
  },
  venom(ctx, x, y, s, col) {
    ctx.fillStyle='#0a1f17'; ctx.beginPath(); ctx.arc(x,y,s*.38,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x,y-s*.06,s*.2,0,Math.PI*2); ctx.fill();
    ctx.fillRect(x-s*.12,y+s*.06,s*.24,s*.12);
    ctx.fillStyle='#0a1f17';
    ctx.beginPath(); ctx.arc(x-s*.08,y-s*.08,s*.06,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.08,y-s*.08,s*.06,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=col;
    for(let i=0;i<4;i++) ctx.fillRect(x-s*.1+i*s*.07,y+s*.04,s*.05,s*.08);
  },
  omega(ctx, x, y, s, col) {
    ctx.strokeStyle=col; ctx.lineWidth=s*.09; ctx.beginPath(); ctx.arc(x,y,s*.38,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='#050500'; ctx.beginPath(); ctx.arc(x,y,s*.3,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=col; ctx.lineWidth=s*.07; ctx.lineJoin='round';
    ctx.beginPath(); ctx.arc(x,y-s*.04,s*.16,Math.PI*.18,Math.PI*.82); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-s*.2,y+s*.14); ctx.lineTo(x-s*.09,y+s*.14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+s*.09,y+s*.14); ctx.lineTo(x+s*.2,y+s*.14); ctx.stroke();
  },
  phantom(ctx, x, y, s, col) {
    ctx.fillStyle=col+'22'; ctx.beginPath(); ctx.arc(x,y,s*.38,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=col;
    ctx.beginPath();
    ctx.arc(x,y-s*.06,s*.26,Math.PI,0);
    ctx.lineTo(x+s*.26,y+s*.2); ctx.bezierCurveTo(x+s*.14,y+s*.1,x+s*.06,y+s*.24,x,y+s*.16);
    ctx.bezierCurveTo(x-s*.06,y+s*.24,x-s*.14,y+s*.1,x-s*.26,y+s*.2); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#fff';
    ctx.beginPath(); ctx.arc(x-s*.1,y-s*.06,s*.07,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.1,y-s*.06,s*.07,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#1a0033';
    ctx.beginPath(); ctx.arc(x-s*.1,y-s*.06,s*.04,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.1,y-s*.06,s*.04,0,Math.PI*2); ctx.fill();
  },
  temporal(ctx, x, y, s, col) {
    ctx.fillStyle='#020210'; ctx.beginPath(); ctx.arc(x,y,s*.38,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=col; ctx.lineWidth=s*.06; ctx.beginPath(); ctx.arc(x,y,s*.3,0,Math.PI*2); ctx.stroke();
    for(let i=0;i<12;i++){
      const a=i/12*Math.PI*2, r=i%3===0?s*.24:s*.26;
      ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x+Math.cos(a)*r,y+Math.sin(a)*r,i%3===0?s*.03:s*.015,0,Math.PI*2); ctx.fill();
    }
    ctx.strokeStyle='#fff'; ctx.lineWidth=s*.05; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y-s*.2); ctx.stroke();
    ctx.lineWidth=s*.04; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+s*.14,y+s*.08); ctx.stroke();
    ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x,y,s*.05,0,Math.PI*2); ctx.fill();
  },
  reaper(ctx, x, y, s, col) {
    ctx.fillStyle='#050505'; ctx.beginPath(); ctx.arc(x,y,s*.38,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#4a3000'; ctx.lineWidth=s*.06; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x-s*.1,y+s*.3); ctx.quadraticCurveTo(x+s*.1,y,x+s*.15,y-s*.26); ctx.stroke();
    ctx.fillStyle=col;
    ctx.beginPath(); ctx.moveTo(x+s*.15,y-s*.26); ctx.quadraticCurveTo(x+s*.38,y-s*.4,x-s*.06,y-s*.14); ctx.quadraticCurveTo(x+s*.18,y-s*.28,x+s*.15,y-s*.26); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.arc(x,y,s*.38,0,Math.PI*2); ctx.fill();
  },
  // ── Owner towers ────────────────────────────────────────
  shadow_commander(ctx, x, y, s, col) {
    const t=Date.now()*.003;
    ctx.shadowBlur=20; ctx.shadowColor=col;
    ctx.globalAlpha=.22+Math.sin(t)*.1; ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x,y,s*.52,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
    ctx.shadowBlur=0;
    ctx.fillStyle='#0d0019';
    ctx.beginPath(); ctx.arc(x,y-s*.06,s*.28,Math.PI,0); ctx.lineTo(x+s*.28,y+s*.24);
    ctx.bezierCurveTo(x+s*.1,y+s*.1,x+s*.05,y+s*.3,x,y+s*.2);
    ctx.bezierCurveTo(x-s*.05,y+s*.3,x-s*.1,y+s*.1,x-s*.28,y+s*.24); ctx.closePath(); ctx.fill();
    ctx.strokeStyle=col; ctx.lineWidth=s*.06;
    ctx.beginPath(); ctx.moveTo(x-s*.18,y-s*.22); ctx.lineTo(x-s*.18,y-s*.38); ctx.lineTo(x-s*.06,y-s*.26); ctx.lineTo(x,y-s*.4); ctx.lineTo(x+s*.06,y-s*.26); ctx.lineTo(x+s*.18,y-s*.38); ctx.lineTo(x+s*.18,y-s*.22); ctx.stroke();
    ctx.shadowBlur=8; ctx.shadowColor=col;
    ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x-s*.1,y-s*.08,s*.06+Math.sin(t)*.02,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.1,y-s*.08,s*.06+Math.sin(t)*.02,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;
  },
  neon_warden(ctx, x, y, s, col) {
    const t=Date.now()*.004;
    ctx.globalAlpha=.18+Math.sin(t)*.08; ctx.strokeStyle=col; ctx.lineWidth=s*.22;
    ctx.shadowBlur=18; ctx.shadowColor=col;
    ctx.beginPath(); ctx.arc(x,y,s*.44,0,Math.PI*2); ctx.stroke();
    ctx.globalAlpha=1; ctx.shadowBlur=0;
    ctx.fillStyle='#001a0d'; ctx.beginPath(); ctx.arc(x,y,s*.36,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle=col; ctx.lineWidth=s*.05; ctx.beginPath(); ctx.arc(x,y,s*.36,0,Math.PI*2); ctx.stroke();
    ctx.globalAlpha=.7; ctx.strokeStyle=col; ctx.lineWidth=s*.03;
    ctx.beginPath(); ctx.moveTo(x-s*.3,y); ctx.lineTo(x-s*.1,y); ctx.lineTo(x-s*.1,y-s*.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+s*.3,y); ctx.lineTo(x+s*.1,y); ctx.lineTo(x+s*.1,y+s*.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x,y-s*.3); ctx.lineTo(x,y-s*.1); ctx.lineTo(x+s*.15,y-s*.1); ctx.stroke();
    ctx.globalAlpha=1;
    ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x,y,s*.12,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x,y,s*.05,0,Math.PI*2); ctx.fill();
  },
  void_hunter(ctx, x, y, s, col) {
    const t=Date.now()*.003;
    ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(x,y,s*.38,0,Math.PI*2); ctx.fill();
    ctx.save(); ctx.translate(x,y); ctx.rotate(t);
    ctx.strokeStyle=col; ctx.lineWidth=s*.05; ctx.setLineDash([s*.2,s*.12]);
    ctx.beginPath(); ctx.arc(0,0,s*.34,0,Math.PI*2); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();
    ctx.save(); ctx.translate(x,y); ctx.rotate(-t*.6);
    ctx.strokeStyle=col+'88'; ctx.lineWidth=s*.03;
    ctx.beginPath(); ctx.arc(0,0,s*.26,0,Math.PI*2); ctx.stroke();
    ctx.restore();
    ctx.fillStyle='#0d0022'; ctx.beginPath(); ctx.arc(x,y,s*.2,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=10; ctx.shadowColor=col;
    ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x,y,s*(.1+Math.sin(t*2)*.03),0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x-s*.04,y-s*.04,s*.03,0,Math.PI*2); ctx.fill();
  },
  _default(ctx, x, y, s, col) {
    ctx.beginPath(); ctx.arc(x,y,s*.38,0,Math.PI*2); ctx.fillStyle=col; ctx.fill();
    ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.stroke();
  }
};

/* ── Tower class ─────────────────────────────────────────── */
class Tower {
  constructor(def, tileX, tileY, tileSize) {
    this.def=def; this.tileX=tileX; this.tileY=tileY; this.tileSize=tileSize;
    this.x=tileX*tileSize+tileSize/2; this.y=tileY*tileSize+tileSize/2;
    this.level=0; this.damage=def.damage; this.range=def.range; this.fireRate=def.fireRate;
    this.slow=def.slow||0; this.splash=def.splash||0; this.burn=def.burn||0;
    this.chain=def.chain||0; this.pierce=def.pierce||0;
    this.armorPierce=def.armorPierce||false; this.instaKill=def.instaKill||false;
    this.instaKillThreshold=def.instaKillThreshold||0; this.canSeeInvis=def.canSeeInvis||false;
    this.damageType=def.damageType||'bullet'; this.bypasses=def.bypasses||false;
    this.fireCooldown=0; this.target=null; this.bullets=[];
    this.angle=0; this.shootFlash=0; this.auraBuff=1.0;
    this.selected=false; this.auraAlpha=0; this.targetMode='first';
    this.totalCostSpent=def.cost;
  }
  get cost(){return this.def.cost;}
  get name(){return this.def.name;}
  getSellValue(){return Math.floor(this.totalCostSpent*.6);}
  getUpgradeCost(){
    if(this.level>=this.def.maxUpgrade||!this.def.upgrades[this.level])return null;
    return this.def.upgrades[this.level].cost;
  }
  upgrade(){
    if(this.level>=this.def.maxUpgrade)return false;
    const u=this.def.upgrades[this.level]; if(!u)return false;
    this.totalCostSpent+=u.cost; this.damage+=u.dmgBonus||0; this.fireRate+=u.rateBonus||0;
    this.range+=u.rangeBonus||0; this.slow+=u.slowBonus||0; this.splash+=u.splashBonus||0;
    this.burn+=u.burnBonus||0; this.chain+=u.chainBonus||0;
    if(u.armorPierce)this.armorPierce=true; if(u.instaKill)this.instaKill=true;
    if(u.instaKillThreshold)this.instaKillThreshold=u.instaKillThreshold;
    if(u.pierce)this.pierce=u.pierce; if(u.burn)this.burn=u.burn;
    this.level++; return true;
  }
  canDamage(enemy){
    if(this.bypasses)return true;
    if(!enemy.immunities?.length)return true;
    return !enemy.immunities.includes(this.damageType);
  }
  update(dt,enemies){
    this.shootFlash=Math.max(0,this.shootFlash-dt*8);
    this.fireCooldown=Math.max(0,this.fireCooldown-dt);
    this.target=this._pickTarget(enemies);
    if(this.target){const dx=this.target.x-this.x,dy=this.target.y-this.y; this.angle=Math.atan2(dy,dx)-Math.PI/2;}
    if(this.target&&this.fireCooldown<=0){
      this.fireCooldown=1/(this.fireRate*this.auraBuff); this.shootFlash=1; this._fire(this.target,enemies);
    }
    this.bullets=this.bullets.filter(b=>!b.dead); this.bullets.forEach(b=>b.update(dt));
  }
  _pickTarget(enemies){
    const inRange=enemies.filter(e=>{
      if(e.dead)return false; if(e.invisible&&!this.canSeeInvis)return false;
      if(!this.canDamage(e))return false;
      return Math.hypot(e.x-this.x,e.y-this.y)<=this.range;
    });
    if(!inRange.length)return null;
    switch(this.targetMode){
      case'first': return inRange.reduce((a,b)=>a.pathProgress>b.pathProgress?a:b);
      case'last':  return inRange.reduce((a,b)=>a.pathProgress<b.pathProgress?a:b);
      case'strong':return inRange.reduce((a,b)=>a.hp>b.hp?a:b);
      case'close': return inRange.reduce((a,b)=>Math.hypot(a.x-this.x,a.y-this.y)<Math.hypot(b.x-this.x,b.y-this.y)?a:b);
    }
    return inRange[0];
  }
  _fire(target,allEnemies){
    const d=this.def;
    this.bullets.push(new Bullet({
      x:this.x,y:this.y,target,damage:this.damage*this.auraBuff,speed:d.bulletSpeed,
      color:d.bulletColor,size:d.bulletSize,splash:this.splash,slow:this.slow,
      slowDuration:d.slowDuration||2,burn:this.burn,chain:this.chain,pierce:this.pierce,
      armorPierce:this.armorPierce,instaKill:this.instaKill,
      instaKillThreshold:this.instaKillThreshold,bypasses:this.bypasses,
      damageType:this.damageType,allEnemies,
    }));
  }
  draw(ctx){
    const s=this.tileSize,x=this.x,y=this.y;
    if(this.auraBuff>1.0){ctx.fillStyle='rgba(241,196,15,0.12)'; ctx.fillRect(this.tileX*s+2,this.tileY*s+2,s-4,s-4);}
    else{ctx.fillStyle=this.selected?'rgba(241,196,15,0.2)':'rgba(0,0,0,0.35)'; ctx.fillRect(this.tileX*s+4,this.tileY*s+4,s-8,s-8);}
    ctx.save(); ctx.translate(x,y); ctx.rotate(this.angle+Math.PI/2); ctx.translate(-x,-y);
    if(this.shootFlash>0){ctx.shadowBlur=14;ctx.shadowColor=this.def.color;}
    const fn=TowerArt[this.def.id]||TowerArt._default;
    fn(ctx,x,y,s,this.shootFlash>0?'#ffffff':this.def.color);
    ctx.shadowBlur=0; ctx.restore();
    // Upgrade pips
    for(let i=0;i<this.level;i++){
      ctx.fillStyle='#f1c40f'; ctx.beginPath();
      ctx.arc(x-(this.level-1)*4+i*8,y+s*.33,3,0,Math.PI*2); ctx.fill();
    }
    // Owner glow
    if(this.def.ownerOnly){
      const t=Date.now()*.003;
      ctx.beginPath(); ctx.arc(x,y,s*.46,0,Math.PI*2);
      ctx.strokeStyle=this.def.color; ctx.lineWidth=3;
      ctx.globalAlpha=.4+Math.sin(t)*.3; ctx.stroke(); ctx.globalAlpha=1;
    }
    // Selection ring
    if(this.selected){
      ctx.beginPath(); ctx.arc(x,y,this.range,0,Math.PI*2);
      ctx.strokeStyle='rgba(241,196,15,0.22)'; ctx.lineWidth=1.5; ctx.setLineDash([6,4]); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(x,y,s*.43,0,Math.PI*2); ctx.strokeStyle='#f1c40f'; ctx.lineWidth=2; ctx.stroke();
    }
    // Aura ring
    if(this.def.aura){
      this.auraAlpha=(Math.sin(Date.now()*.003)+1)*.12;
      ctx.beginPath(); ctx.arc(x,y,this.range*.7,0,Math.PI*2);
      ctx.fillStyle=`rgba(241,196,15,${this.auraAlpha})`; ctx.fill();
    }
    // Damage type dot (top-right corner of tile)
    const TC={bullet:'#95a5a6',fire:'#e74c3c',ice:'#3498db',explosive:'#e67e22',electric:'#f1c40f',laser:'#ff0040',poison:'#16a085',void:'#8e44ad'};
    ctx.fillStyle=TC[this.damageType]||'#fff';
    ctx.beginPath(); ctx.arc(this.tileX*s+s-7,this.tileY*s+7,4,0,Math.PI*2); ctx.fill();
  }
}

/* ── Bullet class ────────────────────────────────────────── */
class Bullet{
  constructor(opts){Object.assign(this,opts);this.dead=false;this.hitEnemies=new Set();this.age=0;}
  update(dt){
    this.age+=dt;
    if(!this.target||this.target.dead){
      if(this.pierce>0&&this.allEnemies){
        let nearest=null,bestDist=Infinity;
        for(const e of this.allEnemies){
          if(e.dead||this.hitEnemies.has(e))continue;
          if(!this.bypasses&&e.immunities?.includes(this.damageType))continue;
          const d=Math.hypot(e.x-this.x,e.y-this.y);
          if(d<bestDist){bestDist=d;nearest=e;}
        }
        if(nearest)this.target=nearest; else{this.dead=true;return;}
      }else{this.dead=true;return;}
    }
    const dx=this.target.x-this.x,dy=this.target.y-this.y,dist=Math.sqrt(dx*dx+dy*dy);
    if(dist<8){this._hit(this.target);return;}
    const spd=this.speed*dt; this.x+=dx/dist*spd; this.y+=dy/dist*spd;
  }
  _hit(enemy){
    if(this.hitEnemies.has(enemy)){this.dead=true;return;}
    if(!this.bypasses&&enemy.immunities?.includes(this.damageType)){this.dead=true;return;}
    const threshold=this.instaKillThreshold||0;
    if(this.instaKill||(threshold>0&&enemy.hp<enemy.maxHp*threshold)){enemy.takeDamage(enemy.hp+1,this);}
    else{const dmg=this.armorPierce?this.damage:this.damage*(1-(enemy.armor||0));enemy.takeDamage(dmg,this);}
    this.hitEnemies.add(enemy);
    if(this.splash>0&&this.allEnemies){
      this.allEnemies.forEach(e=>{
        if(e===enemy||e.dead)return;
        if(!this.bypasses&&e.immunities?.includes(this.damageType))return;
        const d=Math.hypot(e.x-enemy.x,e.y-enemy.y);
        if(d<=this.splash){const dmg=this.armorPierce?this.damage:this.damage*(1-(e.armor||0));e.takeDamage(dmg*(1-d/this.splash*.5),this);}
      });
    }
    if(this.chain>0&&this.allEnemies){
      let chained=0,prev=enemy;
      for(const e of this.allEnemies){
        if(chained>=this.chain)break;
        if(e===enemy||e.dead||this.hitEnemies.has(e))continue;
        if(!this.bypasses&&e.immunities?.includes(this.damageType))continue;
        if(Math.hypot(e.x-prev.x,e.y-prev.y)<150){
          const dmg=this.armorPierce?this.damage*.6:this.damage*.6*(1-(e.armor||0));
          e.takeDamage(dmg,this);this.hitEnemies.add(e);prev=e;chained++;
        }
      }
    }
    if(this.pierce<=0)this.dead=true; else this.pierce--;
  }
  draw(ctx){
    if(this.speed>=900&&this.target&&!this.target.dead){
      ctx.save(); ctx.beginPath(); ctx.moveTo(this.x,this.y); ctx.lineTo(this.target.x,this.target.y);
      ctx.strokeStyle=this.color; ctx.lineWidth=2; ctx.shadowBlur=10; ctx.shadowColor=this.color;
      ctx.globalAlpha=.7; ctx.stroke(); ctx.restore(); this.dead=true; return;
    }
    ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fillStyle=this.color; ctx.shadowBlur=8; ctx.shadowColor=this.color; ctx.fill(); ctx.shadowBlur=0;
  }
}
