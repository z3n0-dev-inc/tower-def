/* ═══════════════════════════════════════════════
   towers.js — All tower definitions & logic (improved)
   ═══════════════════════════════════════════════ */

const TOWER_DEFS = [
  // ── BASIC ──────────────────────────────────────
  {
    id:'gunner', name:'GUNNER', icon:'🔫', rarity:'basic',
    cost:75, shopCost:0, desc:'Standard soldier. Good all-rounder.',
    color:'#3498db', range:120, fireRate:1.2, damage:15,
    bulletSpeed:280, bulletColor:'#f1c40f', bulletSize:4,
    splash:0, slow:0, pierce:0,
    maxUpgrade:3, unlocked:true,
    upgrades:[
      { name:'Rapid Fire',   cost:80,  dmgBonus:5,  rateBonus:0.5, rangeBonus:0  },
      { name:'Heavy Rounds', cost:130, dmgBonus:10, rateBonus:0.3, rangeBonus:15 },
      { name:'Minigun',      cost:220, dmgBonus:20, rateBonus:1.5, rangeBonus:20 },
    ],
  },
  {
    id:'archer', name:'ARCHER', icon:'🏹', rarity:'basic',
    cost:60, shopCost:0, desc:'Long range, low damage. Great for early waves.',
    color:'#27ae60', range:160, fireRate:1.8, damage:10,
    bulletSpeed:320, bulletColor:'#2ecc71', bulletSize:3,
    splash:0, slow:0, pierce:1,
    maxUpgrade:3, unlocked:true,
    upgrades:[
      { name:'Longbow',       cost:70,  dmgBonus:5,  rateBonus:0.6, rangeBonus:30 },
      { name:'Poison Arrows', cost:120, dmgBonus:8,  rateBonus:0.2, rangeBonus:20, poison:3 },
      { name:'Storm Arrows',  cost:200, dmgBonus:12, rateBonus:1.0, rangeBonus:30, pierce:2 },
    ],
  },
  {
    id:'sniper', name:'SNIPER', icon:'🎯', rarity:'basic',
    cost:120, shopCost:250, desc:'Very long range, high damage, slow fire.',
    color:'#8e44ad', range:260, fireRate:0.4, damage:80,
    bulletSpeed:600, bulletColor:'#e8daef', bulletSize:3,
    splash:0, slow:0, pierce:2,
    maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Scope+',        cost:110, dmgBonus:30,  rateBonus:0.1, rangeBonus:40 },
      { name:'Armour Pierce', cost:200, dmgBonus:50,  rateBonus:0.1, rangeBonus:20, armorPierce:true },
      { name:'Rail Gun',      cost:350, dmgBonus:120, rateBonus:0.2, rangeBonus:40, pierce:5 },
    ],
  },

  // ── ADVANCED ───────────────────────────────────
  {
    id:'rocketeer', name:'ROCKETEER', icon:'🚀', rarity:'advanced',
    cost:200, shopCost:500, desc:'Explosive splash damage. Destroys groups.',
    color:'#e67e22', range:130, fireRate:0.6, damage:60,
    bulletSpeed:200, bulletColor:'#e74c3c', bulletSize:7,
    splash:60, slow:0, pierce:0,
    maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Big Rockets',    cost:180, dmgBonus:30,  rateBonus:0.1, rangeBonus:20, splashBonus:20 },
      { name:'Cluster Bomb',   cost:280, dmgBonus:50,  rateBonus:0.2, rangeBonus:10, splashBonus:30 },
      { name:'Nuclear Warhead',cost:480, dmgBonus:120, rateBonus:0.15,rangeBonus:20, splashBonus:60 },
    ],
  },
  {
    id:'freezer', name:'FREEZER', icon:'❄️', rarity:'advanced',
    cost:160, shopCost:450, desc:'Slows enemies. Low damage but vital support.',
    color:'#3498db', range:110, fireRate:0.8, damage:10,
    bulletSpeed:240, bulletColor:'#85c1e9', bulletSize:8,
    splash:50, slow:0.45, slowDuration:2.0, pierce:0,
    maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Arctic Blast',  cost:150, dmgBonus:5,  rateBonus:0.2, rangeBonus:20, slowBonus:0.1  },
      { name:'Deep Freeze',   cost:240, dmgBonus:10, rateBonus:0.2, rangeBonus:20, slowBonus:0.15 },
      { name:'Absolute Zero', cost:380, dmgBonus:15, rateBonus:0.3, rangeBonus:30, slowBonus:0.2, freeze:true },
    ],
  },
  {
    id:'flamer', name:'FLAMETHROWER', icon:'🔥', rarity:'advanced',
    cost:180, shopCost:500, desc:'Continuous flame. Burns enemies over time.',
    color:'#e74c3c', range:90, fireRate:8, damage:8,
    bulletSpeed:180, bulletColor:'#ff6b35', bulletSize:6,
    splash:20, slow:0, burn:3, pierce:0,
    maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Napalm',       cost:160, dmgBonus:4,  rateBonus:2, rangeBonus:15, burnBonus:2 },
      { name:'Inferno',      cost:260, dmgBonus:8,  rateBonus:3, rangeBonus:10, burnBonus:4 },
      { name:'Dragon Breath',cost:420, dmgBonus:15, rateBonus:5, rangeBonus:20, burnBonus:8 },
    ],
  },

  // ── SPECIAL ────────────────────────────────────
  {
    id:'tesla', name:'TESLA COIL', icon:'⚡', rarity:'special',
    cost:350, shopCost:1200, desc:'Chains lightning to multiple enemies.',
    color:'#f39c12', range:140, fireRate:1.0, damage:40,
    bulletSpeed:500, bulletColor:'#f9e79f', bulletSize:3,
    splash:0, chain:4, slow:0.2, pierce:0,
    maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Overcharge',    cost:300, dmgBonus:20, rateBonus:0.3, rangeBonus:20, chainBonus:2 },
      { name:'Ball Lightning',cost:500, dmgBonus:40, rateBonus:0.3, rangeBonus:30, chainBonus:3 },
      { name:'Storm God',     cost:800, dmgBonus:80, rateBonus:0.5, rangeBonus:40, chainBonus:5 },
    ],
  },
  {
    id:'laser', name:'LASER TOWER', icon:'🔴', rarity:'special',
    cost:400, shopCost:1500, desc:'Continuous beam, ignores armor.',
    color:'#e74c3c', range:180, fireRate:15, damage:12,
    bulletSpeed:999, bulletColor:'#ff0040', bulletSize:2,
    splash:0, slow:0, armorPierce:true, beam:true, pierce:0,
    maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Focused Beam', cost:350, dmgBonus:8,  rateBonus:3, rangeBonus:30 },
      { name:'Plasma Cutter',cost:580, dmgBonus:15, rateBonus:5, rangeBonus:20 },
      { name:'Death Ray',    cost:950, dmgBonus:30, rateBonus:8, rangeBonus:40 },
    ],
  },

  // ── LEGENDARY ──────────────────────────────────
  {
    id:'omega', name:'OMEGA CANNON', icon:'💥', rarity:'legendary',
    cost:800, shopCost:4000, desc:'Devastating orbital strike. Extremely rare.',
    color:'#f1c40f', range:200, fireRate:0.25, damage:400,
    bulletSpeed:350, bulletColor:'#f9e79f', bulletSize:14,
    splash:100, slow:0, armorPierce:true, pierce:0,
    maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Overload',   cost:800,  dmgBonus:200, rateBonus:0.05, rangeBonus:30, splashBonus:30 },
      { name:'Singularity',cost:1400, dmgBonus:400, rateBonus:0.05, rangeBonus:30, splashBonus:50 },
      { name:'EXTINCTION', cost:2200, dmgBonus:800, rateBonus:0.1,  rangeBonus:50, splashBonus:80 },
    ],
  },
  {
    id:'phantom', name:'PHANTOM SNIPER', icon:'👻', rarity:'legendary',
    cost:700, shopCost:3500, desc:'Invisible. Can target invisible enemies. Insta-kills weak foes.',
    color:'#8e44ad', range:300, fireRate:0.8, damage:250,
    bulletSpeed:800, bulletColor:'#bb8fce', bulletSize:4,
    splash:0, slow:0, pierce:3, armorPierce:true, canSeeInvis:true,
    maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Shadow Mark', cost:700,  dmgBonus:100, rateBonus:0.2, rangeBonus:40 },
      { name:'Soul Rip',    cost:1200, dmgBonus:200, rateBonus:0.2, rangeBonus:40, instaKill:true },
      { name:'GOD OF DEATH',cost:2000, dmgBonus:400, rateBonus:0.4, rangeBonus:60, instaKill:true, pierce:6 },
    ],
  },

  // ── OWNER-ONLY ─────────────────────────────────
  {
    id:'shadow_commander', name:'SHADOW COMMANDER', icon:'🦇', rarity:'legendary',
    cost:0, shopCost:0, desc:'Owner exclusive. Buffs all nearby towers by 50%.',
    color:'#1a1a2e', range:220, fireRate:2.0, damage:300,
    bulletSpeed:500, bulletColor:'#1a1a2e', bulletSize:8,
    splash:30, slow:0.3, armorPierce:true, aura:true, auraBonus:0.5, pierce:0,
    maxUpgrade:0, upgrades:[], ownerOnly:true, unlocked:false,
  },
  {
    id:'neon_warden', name:'NEON WARDEN', icon:'🌟', rarity:'legendary',
    cost:0, shopCost:0, desc:'Owner exclusive. Electrifying area denial.',
    color:'#00ffaa', range:180, fireRate:5.0, damage:150,
    bulletSpeed:600, bulletColor:'#00ffaa', bulletSize:5,
    splash:80, slow:0.5, chain:6, armorPierce:true, pierce:0,
    maxUpgrade:0, upgrades:[], ownerOnly:true, unlocked:false,
  },
  {
    id:'void_hunter', name:'VOID HUNTER', icon:'🕳️', rarity:'legendary',
    cost:0, shopCost:0, desc:'Owner exclusive. Pulls enemies back on kill.',
    color:'#160041', range:250, fireRate:1.5, damage:500,
    bulletSpeed:700, bulletColor:'#9b59b6', bulletSize:10,
    splash:40, slow:0.6, pierce:5, armorPierce:true, pullOnKill:true,
    maxUpgrade:0, upgrades:[], ownerOnly:true, unlocked:false,
  },
];

function getTowerDef(id) { return TOWER_DEFS.find(t => t.id === id); }

// ── Tower class ───────────────────────────────────────────
class Tower {
  constructor(def, tileX, tileY, tileSize) {
    this.def       = def;
    this.id        = def.id;
    this.tileX     = tileX;
    this.tileY     = tileY;
    this.tileSize  = tileSize;
    this.x         = (tileX + 0.5) * tileSize;
    this.y         = (tileY + 0.5) * tileSize;

    this.level     = 0;
    this.damage    = def.damage;
    this.range     = def.range;
    this.fireRate  = def.fireRate;
    this.splash    = def.splash;
    this.slow      = def.slow;
    this.chain     = def.chain || 0;
    this.burn      = def.burn  || 0;
    this.pierce    = def.pierce || 0;

    // Aura buff multiplier (applied externally by game loop)
    this.auraBuff  = 1.0;

    this.cooldown  = 0;
    this.target    = null;
    this.angle     = Math.PI / 2;
    this.selected  = false;
    this.bullets   = [];
    this.targetMode = 'first';
    this.shots     = 0;
    this.totalDmg  = 0;

    // Visual
    this.auraAlpha    = 0;
    this.shootFlash   = 0;
    this.bounceY      = 0;
    this.bounceDir    = 1;
    this.totalInvested = def.cost;
  }

  getSellValue() {
    return Math.floor(this.totalInvested * 0.6);
  }

  getUpgradeCost() {
    if (this.level >= this.def.maxUpgrade) return null;
    return this.def.upgrades[this.level].cost;
  }

  upgrade() {
    if (this.level >= this.def.maxUpgrade) return false;
    const u = this.def.upgrades[this.level];
    this.damage    += u.dmgBonus   || 0;
    this.fireRate  += u.rateBonus  || 0;
    this.range     += u.rangeBonus || 0;
    this.splash    += u.splashBonus || 0;
    if (u.slowBonus)  this.slow  = Math.min(this.slow + u.slowBonus, 0.85);
    if (u.chainBonus) this.chain += u.chainBonus;
    if (u.burnBonus)  this.burn  += u.burnBonus;
    if (u.pierce)     this.pierce = (this.pierce || 0) + u.pierce;
    this.totalInvested += u.cost;
    this.level++;
    return true;
  }

  update(dt, enemies) {
    // Animate shoot flash
    this.shootFlash = Math.max(0, this.shootFlash - dt * 8);

    // Effective fire rate / damage factoring in aura buff
    const effRate = this.fireRate * this.auraBuff;
    this.cooldown  = Math.max(0, this.cooldown - dt);
    if (this.cooldown > 0 || !enemies.length) return;

    this.target = this._pickTarget(enemies);
    if (!this.target) return;

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    this.angle = Math.atan2(dy, dx);

    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > this.range) { this.target = null; return; }

    this.cooldown = 1 / effRate;
    this.shots++;
    this.shootFlash = 1;
    this._fire(this.target, enemies);
  }

  _pickTarget(enemies) {
    const inRange = enemies.filter(e => {
      const dx = e.x - this.x, dy = e.y - this.y;
      if (e.dead) return false;
      if (e.invisible && !this.def.canSeeInvis) return false;
      return Math.sqrt(dx * dx + dy * dy) <= this.range;
    });
    if (!inRange.length) return null;

    switch (this.targetMode) {
      case 'first':  return inRange.reduce((a, b) => a.pathProgress > b.pathProgress ? a : b);
      case 'last':   return inRange.reduce((a, b) => a.pathProgress < b.pathProgress ? a : b);
      case 'strong': return inRange.reduce((a, b) => a.hp > b.hp ? a : b);
      case 'close':  return inRange.reduce((a, b) => {
        const d1 = Math.hypot(a.x - this.x, a.y - this.y);
        const d2 = Math.hypot(b.x - this.x, b.y - this.y);
        return d1 < d2 ? a : b;
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
      slowDur:    d.slowDuration || 1.5,
      burn:       this.burn,
      chain:      this.chain,
      pierce:     this.pierce,
      armorPierce: d.armorPierce || false,
      instaKill:  d.instaKill   || (this.level >= 2 && d.id === 'phantom'),
      allEnemies,
    }));
  }

  draw(ctx) {
    const s   = this.tileSize;
    const pad = 4;
    const x   = this.tileX * s, y = this.tileY * s;

    // Tile base — subtle highlight when aura buffed
    if (this.auraBuff > 1.0) {
      ctx.fillStyle = `rgba(241,196,15,0.12)`;
      ctx.fillRect(x + pad - 2, y + pad - 2, s - pad * 2 + 4, s - pad * 2 + 4);
    } else {
      ctx.fillStyle = this.selected ? 'rgba(241,196,15,0.2)' : 'rgba(0,0,0,0.35)';
      ctx.fillRect(x + pad, y + pad, s - pad * 2, s - pad * 2);
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);

    // Platform circle — brighter when firing
    const flash = this.shootFlash;
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.36, 0, Math.PI * 2);
    ctx.fillStyle = flash > 0
      ? `rgba(255,255,255,${flash * 0.25})` + this.def.color
      : this.def.color + 'aa';
    ctx.fillStyle = this.def.color + (flash > 0 ? 'ee' : 'aa');
    ctx.fill();
    ctx.strokeStyle = this.def.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Barrel
    ctx.fillStyle = flash > 0 ? '#fff' : '#ddd';
    ctx.fillRect(-3, -s * 0.1, 6, -s * 0.32);

    ctx.restore();

    // Icon
    ctx.font = `${Math.floor(s * 0.4)}px serif`;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.def.icon, this.x, this.y - 1);

    // Level pips
    if (this.level > 0) {
      for (let i = 0; i < this.level; i++) {
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(this.x - (this.level - 1) * 4 + i * 8, this.y + s * 0.33, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Aura buff indicator
    if (this.auraBuff > 1.0) {
      const t = Date.now() * 0.002;
      ctx.font = '10px serif';
      ctx.fillText('⬆', this.x + s * 0.35, this.y - s * 0.35);
    }

    // Selection ring + range circle
    if (this.selected) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(241,196,15,0.22)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(this.x, this.y, s * 0.43, 0, Math.PI * 2);
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Aura towers: animated field
    if (this.def.aura) {
      this.auraAlpha = (Math.sin(Date.now() * 0.003) + 1) * 0.12;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.range * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(241,196,15,${this.auraAlpha})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(241,196,15,0.3)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}

// ── Bullet class ──────────────────────────────────────────
class Bullet {
  constructor(opts) {
    Object.assign(this, opts);
    this.dead       = false;
    this.hitEnemies = new Set();
    this.age        = 0;
  }

  update(dt) {
    this.age += dt;

    // If target dead/gone, piercing bullets seek a new one
    if (!this.target || this.target.dead) {
      if (this.pierce > 0 && this.allEnemies) {
        let nearest = null, bestDist = Infinity;
        for (const e of this.allEnemies) {
          if (e.dead || this.hitEnemies.has(e)) continue;
          const d = Math.hypot(e.x - this.x, e.y - this.y);
          if (d < bestDist) { bestDist = d; nearest = e; }
        }
        if (nearest) this.target = nearest;
        else { this.dead = true; return; }
      } else { this.dead = true; return; }
    }

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 8) { this._hit(this.target); return; }

    const spd = this.speed * dt;
    this.x += (dx / dist) * spd;
    this.y += (dy / dist) * spd;
  }

  _hit(enemy) {
    if (this.hitEnemies.has(enemy)) { this.dead = true; return; }

    if (this.instaKill && enemy.hp < enemy.maxHp * 0.15) {
      enemy.takeDamage(enemy.hp + 1, this);
    } else {
      const dmg = this.armorPierce ? this.damage : this.damage * (1 - (enemy.armor || 0));
      enemy.takeDamage(dmg, this);
    }
    this.hitEnemies.add(enemy);

    // Splash
    if (this.splash > 0 && this.allEnemies) {
      this.allEnemies.forEach(e => {
        if (e === enemy || e.dead) return;
        const d = Math.hypot(e.x - enemy.x, e.y - enemy.y);
        if (d <= this.splash) {
          const falloff = 1 - (d / this.splash) * 0.5;
          const dmg = this.armorPierce ? this.damage : this.damage * (1 - (e.armor || 0));
          e.takeDamage(dmg * falloff, this);
        }
      });
    }

    // Chain lightning
    if (this.chain > 0 && this.allEnemies) {
      let chained = 0, prev = enemy;
      for (const e of this.allEnemies) {
        if (chained >= this.chain) break;
        if (e === enemy || e.dead || this.hitEnemies.has(e)) continue;
        if (Math.hypot(e.x - prev.x, e.y - prev.y) < 130) {
          const dmg = this.armorPierce ? this.damage * 0.6 : this.damage * 0.6 * (1 - (e.armor || 0));
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
    // Beam bullets (laser): don't draw as circle
    if (this.speed >= 900 && this.target && !this.target.dead) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.target.x, this.target.y);
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.shadowBlur  = 10;
      ctx.shadowColor = this.color;
      ctx.globalAlpha = 0.7;
      ctx.stroke();
      ctx.restore();
      this.dead = true; // laser "bullet" is instant visual
      return;
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle   = this.color;
    ctx.shadowBlur  = 8;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}
