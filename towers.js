/* ═══════════════════════════════════════════════
   towers.js — All tower definitions & Tower/Bullet classes
   ═══════════════════════════════════════════════ */

const TOWER_DEFS = [
  // ── BASIC ──────────────────────────────────────
  {
    id:'gunner', name:'GUNNER', icon:'🔫', rarity:'basic',
    cost:75, shopCost:0, desc:'Standard soldier. Good all-rounder.',
    color:'#3498db', range:120, fireRate:1.2, damage:15,
    bulletSpeed:280, bulletColor:'#f1c40f', bulletSize:4,
    splash:0, slow:0, pierce:0, maxUpgrade:3, unlocked:true,
    upgrades:[
      { name:'Rapid Fire',   cost:80,  dmgBonus:5,  rateBonus:0.5, rangeBonus:0  },
      { name:'Heavy Rounds', cost:130, dmgBonus:10, rateBonus:0.3, rangeBonus:15 },
      { name:'Minigun',      cost:220, dmgBonus:20, rateBonus:1.5, rangeBonus:20 },
    ],
  },
  {
    id:'archer', name:'ARCHER', icon:'🏹', rarity:'basic',
    cost:60, shopCost:0, desc:'Long range. Great for early waves.',
    color:'#27ae60', range:160, fireRate:1.8, damage:10,
    bulletSpeed:320, bulletColor:'#2ecc71', bulletSize:3,
    splash:0, slow:0, pierce:1, maxUpgrade:3, unlocked:true,
    upgrades:[
      { name:'Longbow',       cost:70,  dmgBonus:5,  rateBonus:0.6, rangeBonus:30 },
      { name:'Poison Arrows', cost:120, dmgBonus:8,  rateBonus:0.2, rangeBonus:20, burn:3 },
      { name:'Storm Arrows',  cost:200, dmgBonus:12, rateBonus:1.0, rangeBonus:30, pierce:2 },
    ],
  },
  {
    id:'sniper', name:'SNIPER', icon:'🎯', rarity:'basic',
    cost:120, shopCost:250, desc:'Very long range, high damage, slow fire.',
    color:'#8e44ad', range:260, fireRate:0.4, damage:80,
    bulletSpeed:600, bulletColor:'#e8daef', bulletSize:3,
    splash:0, slow:0, pierce:2, maxUpgrade:3, unlocked:false,
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
    splash:60, slow:0, pierce:0, maxUpgrade:3, unlocked:false,
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
    splash:50, slow:0.45, slowDuration:2.0, pierce:0, maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Arctic Blast',  cost:150, dmgBonus:5,  rateBonus:0.2, rangeBonus:20, slowBonus:0.1  },
      { name:'Deep Freeze',   cost:240, dmgBonus:10, rateBonus:0.2, rangeBonus:20, slowBonus:0.15 },
      { name:'Absolute Zero', cost:380, dmgBonus:15, rateBonus:0.3, rangeBonus:30, slowBonus:0.2  },
    ],
  },
  {
    id:'flamer', name:'FLAMETHROWER', icon:'🔥', rarity:'advanced',
    cost:180, shopCost:500, desc:'Continuous flame. Burns enemies over time.',
    color:'#e74c3c', range:90, fireRate:8, damage:8,
    bulletSpeed:180, bulletColor:'#ff6b35', bulletSize:6,
    splash:20, slow:0, burn:3, pierce:0, maxUpgrade:3, unlocked:false,
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
    splash:0, chain:4, slow:0.2, pierce:0, maxUpgrade:3, unlocked:false,
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
    splash:0, slow:0, armorPierce:true, beam:true, pierce:0, maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Focused Beam', cost:350, dmgBonus:8,  rateBonus:3, rangeBonus:30 },
      { name:'Plasma Cutter',cost:580, dmgBonus:15, rateBonus:5, rangeBonus:20 },
      { name:'Death Ray',    cost:950, dmgBonus:30, rateBonus:8, rangeBonus:40 },
    ],
  },
  {
    id:'mortar', name:'MORTAR', icon:'💣', rarity:'special',
    cost:320, shopCost:1100, desc:'Lobs shells with massive splash. Slow but devastating.',
    color:'#7f8c8d', range:200, fireRate:0.3, damage:100,
    bulletSpeed:150, bulletColor:'#bdc3c7', bulletSize:10,
    splash:90, slow:0, pierce:0, maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Heavy Shell', cost:280, dmgBonus:50,  rateBonus:0.1, rangeBonus:30, splashBonus:20 },
      { name:'Barrage',     cost:460, dmgBonus:80,  rateBonus:0.15,rangeBonus:20, splashBonus:40 },
      { name:'Armageddon',  cost:750, dmgBonus:180, rateBonus:0.2, rangeBonus:40, splashBonus:80 },
    ],
  },
  {
    id:'venom', name:'VENOM TOWER', icon:'☠️', rarity:'special',
    cost:280, shopCost:900, desc:'Poisons groups. DPS builds over time.',
    color:'#16a085', range:140, fireRate:1.5, damage:20,
    bulletSpeed:260, bulletColor:'#1abc9c', bulletSize:6,
    splash:70, slow:0.15, burn:8, pierce:0, maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Acid Cloud', cost:240, dmgBonus:10, rateBonus:0.4, rangeBonus:20, burnBonus:5  },
      { name:'Plague',     cost:400, dmgBonus:20, rateBonus:0.5, rangeBonus:30, burnBonus:10 },
      { name:'BIOHAZARD',  cost:700, dmgBonus:40, rateBonus:1.0, rangeBonus:40, burnBonus:20, splashBonus:30 },
    ],
  },

  // ── LEGENDARY ──────────────────────────────────
  {
    id:'omega', name:'OMEGA CANNON', icon:'💥', rarity:'legendary',
    cost:800, shopCost:4000, desc:'Devastating orbital strike. Extremely rare.',
    color:'#f1c40f', range:200, fireRate:0.25, damage:400,
    bulletSpeed:350, bulletColor:'#f9e79f', bulletSize:14,
    splash:100, slow:0, armorPierce:true, pierce:0, maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Overload',   cost:800,  dmgBonus:200, rateBonus:0.05, rangeBonus:30, splashBonus:30 },
      { name:'Singularity',cost:1400, dmgBonus:400, rateBonus:0.05, rangeBonus:30, splashBonus:50 },
      { name:'EXTINCTION', cost:2200, dmgBonus:800, rateBonus:0.1,  rangeBonus:50, splashBonus:80 },
    ],
  },
  {
    id:'phantom', name:'PHANTOM SNIPER', icon:'👻', rarity:'legendary',
    cost:700, shopCost:3500, desc:'Sees invisible enemies. Insta-kills weak foes.',
    color:'#8e44ad', range:300, fireRate:0.8, damage:250,
    bulletSpeed:800, bulletColor:'#bb8fce', bulletSize:4,
    splash:0, slow:0, pierce:3, armorPierce:true, canSeeInvis:true, maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Shadow Mark', cost:700,  dmgBonus:100, rateBonus:0.2, rangeBonus:40 },
      { name:'Soul Rip',    cost:1200, dmgBonus:200, rateBonus:0.2, rangeBonus:40, instaKill:true },
      { name:'GOD OF DEATH',cost:2000, dmgBonus:400, rateBonus:0.4, rangeBonus:60, instaKill:true, pierce:6 },
    ],
  },
  {
    id:'temporal', name:'TIME DISTORTER', icon:'🌀', rarity:'legendary',
    cost:900, shopCost:5000, desc:'Slows ALL enemies on screen simultaneously.',
    color:'#1abc9c', range:999, fireRate:0.15, damage:30,
    bulletSpeed:400, bulletColor:'#48c9b0', bulletSize:5,
    splash:0, slow:0.7, slowDuration:3.5, pierce:1, armorPierce:true, maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Chronostasis', cost:900,  dmgBonus:20, rateBonus:0.05, rangeBonus:0, slowBonus:0.1  },
      { name:'Temporal Rift',cost:1600, dmgBonus:50, rateBonus:0.1,  rangeBonus:0, slowBonus:0.15 },
      { name:'TIME STOP',    cost:2500, dmgBonus:80, rateBonus:0.15, rangeBonus:0, slowBonus:0.2  },
    ],
  },
  {
    id:'reaper', name:'SOUL REAPER', icon:'💀', rarity:'legendary',
    cost:1000, shopCost:6000, desc:'Executes enemies below 20% HP. Terrifying.',
    color:'#2c3e50', range:200, fireRate:0.9, damage:180,
    bulletSpeed:500, bulletColor:'#95a5a6', bulletSize:5,
    splash:0, slow:0, pierce:4, armorPierce:true, instaKillThreshold:0.2, maxUpgrade:3, unlocked:false,
    upgrades:[
      { name:'Dark Harvest', cost:950,  dmgBonus:90,  rateBonus:0.2, rangeBonus:30 },
      { name:'Soul Devour',  cost:1600, dmgBonus:180, rateBonus:0.3, rangeBonus:20, instaKillThreshold:0.35 },
      { name:'GRIM REAPER',  cost:2800, dmgBonus:350, rateBonus:0.5, rangeBonus:40, instaKillThreshold:0.5, pierce:8 },
    ],
  },

  // ── OWNER-ONLY ─────────────────────────────────
  {
    id:'shadow_commander', name:'SHADOW COMMANDER', icon:'🦇', rarity:'legendary',
    cost:0, shopCost:0, desc:'OWNER ONLY. Massive AoE + aura buff to all nearby towers.',
    color:'#9b59b6', range:220, fireRate:2.0, damage:350,
    bulletSpeed:500, bulletColor:'#9b59b6', bulletSize:10,
    splash:80, slow:0.4, armorPierce:true, aura:true, auraBonus:0.5, pierce:2, canSeeInvis:true,
    maxUpgrade:0, upgrades:[], ownerOnly:true, unlocked:false,
  },
  {
    id:'neon_warden', name:'NEON WARDEN', icon:'🌟', rarity:'legendary',
    cost:0, shopCost:0, desc:'OWNER ONLY. Electric storm — chains to infinite enemies.',
    color:'#00ffaa', range:200, fireRate:5.0, damage:200,
    bulletSpeed:700, bulletColor:'#00ffaa', bulletSize:6,
    splash:100, slow:0.6, chain:10, armorPierce:true, pierce:3, canSeeInvis:true,
    maxUpgrade:0, upgrades:[], ownerOnly:true, unlocked:false,
  },
  {
    id:'void_hunter', name:'VOID HUNTER', icon:'🕳️', rarity:'legendary',
    cost:0, shopCost:0, desc:'OWNER ONLY. Instant-kills any enemy. Reality shredder.',
    color:'#8e44ad', range:280, fireRate:2.0, damage:9999,
    bulletSpeed:900, bulletColor:'#9b59b6', bulletSize:12,
    splash:50, slow:0.8, pierce:8, armorPierce:true, canSeeInvis:true, instaKill:true,
    maxUpgrade:0, upgrades:[], ownerOnly:true, unlocked:false,
  },
];

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
    const s = this.tileSize, pad = 4;
    const x = this.tileX * s, y = this.tileY * s;

    if (this.auraBuff > 1.0) {
      ctx.fillStyle = `rgba(241,196,15,0.12)`;
      ctx.fillRect(x+pad-2, y+pad-2, s-pad*2+4, s-pad*2+4);
    } else {
      ctx.fillStyle = this.selected ? 'rgba(241,196,15,0.2)' : 'rgba(0,0,0,0.35)';
      ctx.fillRect(x+pad, y+pad, s-pad*2, s-pad*2);
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);
    const flash = this.shootFlash;
    ctx.beginPath();
    ctx.arc(0, 0, s*0.36, 0, Math.PI*2);
    ctx.fillStyle = this.def.color + (flash>0?'ee':'aa');
    ctx.fill();
    ctx.strokeStyle = this.def.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = flash > 0 ? '#fff' : '#ddd';
    ctx.fillRect(-3, -s*0.1, 6, -s*0.32);
    ctx.restore();

    ctx.font = `${Math.floor(s*0.4)}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(this.def.icon, this.x, this.y-1);

    if (this.level > 0) {
      for (let i = 0; i < this.level; i++) {
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath();
        ctx.arc(this.x-(this.level-1)*4+i*8, this.y+s*0.33, 3, 0, Math.PI*2);
        ctx.fill();
      }
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
