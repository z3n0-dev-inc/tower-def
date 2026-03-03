/* ═══════════════════════════════════════════════
   enemies.js — Enemy types, waves, AI
   ═══════════════════════════════════════════════ */

const ENEMY_TYPES = {
  // ── SLOW / WEAK ──────────────────────────────
  walker: {
    name: 'WALKER',
    icon: '🧟',
    color: '#5d4037',
    hp: 80, speed: 55, reward: 5,
    armor: 0, size: 14, isBoss: false,
    specialMove: null,
  },
  crawler: {
    name: 'CRAWLER',
    icon: '🦎',
    color: '#2e7d32',
    hp: 50, speed: 90, reward: 4,
    armor: 0, size: 10, isBoss: false,
    specialMove: null,
  },
  bloated: {
    name: 'BLOATED',
    icon: '🎃',
    color: '#bf360c',
    hp: 300, speed: 30, reward: 12,
    armor: 0.1, size: 18, isBoss: false,
    specialMove: null,
  },

  // ── MEDIUM ────────────────────────────────────
  runner: {
    name: 'RUNNER',
    icon: '💨',
    color: '#1565c0',
    hp: 120, speed: 140, reward: 8,
    armor: 0, size: 11, isBoss: false,
    specialMove: null,
  },
  armored: {
    name: 'ARMORED',
    icon: '🛡️',
    color: '#546e7a',
    hp: 250, speed: 45, reward: 15,
    armor: 0.4, size: 16, isBoss: false,
    specialMove: null,
  },
  toxic: {
    name: 'TOXIC',
    icon: '☠️',
    color: '#558b2f',
    hp: 160, speed: 65, reward: 10,
    armor: 0, size: 13, isBoss: false,
    poison: true,   // poisons towers briefly
    specialMove: 'poison',
  },
  ghost: {
    name: 'GHOST',
    icon: '👻',
    color: '#9fa8da',
    hp: 100, speed: 85, reward: 12,
    armor: 0.5, invisible: true, size: 12, isBoss: false,
    specialMove: 'invisible',
  },
  healer: {
    name: 'HEALER',
    icon: '💊',
    color: '#e91e63',
    hp: 140, speed: 50, reward: 14,
    armor: 0, size: 13, isBoss: false,
    specialMove: 'heal',   // heals nearby enemies
  },
  berserker: {
    name: 'BERSERKER',
    icon: '😡',
    color: '#b71c1c',
    hp: 180, speed: 80, reward: 16,
    armor: 0, size: 14, isBoss: false,
    rageOnDamage: true,
    specialMove: 'rage',
  },

  // ── FAST / STRONG ─────────────────────────────
  nightmare: {
    name: 'NIGHTMARE',
    icon: '🌑',
    color: '#212121',
    hp: 400, speed: 100, reward: 25,
    armor: 0.3, size: 15, isBoss: false,
    specialMove: null,
  },
  leaper: {
    name: 'LEAPER',
    icon: '🦘',
    color: '#f57f17',
    hp: 200, speed: 60, reward: 18,
    armor: 0, size: 13, isBoss: false,
    specialMove: 'leap', // teleports ahead occasionally
  },
  shielder: {
    name: 'SHIELDER',
    icon: '🔰',
    color: '#37474f',
    hp: 350, speed: 50, reward: 22,
    armor: 0.6, size: 17, isBoss: false,
    specialMove: null,
  },

  // ── BOSSES ────────────────────────────────────
  boss_zombie_king: {
    name: 'ZOMBIE KING',
    icon: '👑',
    color: '#4a148c',
    hp: 2000, speed: 35, reward: 150,
    armor: 0.3, size: 26, isBoss: true,
    specialMove: 'summon',  // spawns walkers
  },
  boss_undead_titan: {
    name: 'UNDEAD TITAN',
    icon: '🗿',
    color: '#1a1a1a',
    hp: 5000, speed: 25, reward: 300,
    armor: 0.5, size: 30, isBoss: true,
    specialMove: 'stomp',
  },
  boss_shadow_lord: {
    name: 'SHADOW LORD',
    icon: '🌑',
    color: '#0d0d0d',
    hp: 12000, speed: 40, reward: 600,
    armor: 0.6, invisible: true, size: 32, isBoss: true,
    specialMove: 'phase',
  },
};

// ── Wave generation ───────────────────────────────────────
function generateWaves(mapId, totalWaves, waveModifier) {
  const waves = [];
  for (let w = 1; w <= totalWaves; w++) {
    const wave = { number: w, enemies: [], delay: 0.8 };
    const budget = Math.floor((20 + w * 12) * waveModifier);
    const waveProgress = w / totalWaves;

    if (w % 5 === 0) {
      // Boss wave
      const bossPool = [
        { type: 'boss_zombie_king', costWeight: 5  },
        { type: 'boss_undead_titan', costWeight: 10 },
        { type: 'boss_shadow_lord', costWeight: 20 },
      ];
      let boss = bossPool[0];
      if (w >= 10) boss = bossPool[1];
      if (w >= 20) boss = bossPool[2];

      wave.enemies.push({ type: boss.type, count: 1, interval: 0 });
      wave.isBossWave = true;

      // Add some fodder
      wave.enemies.push({ type: 'runner', count: Math.floor(w/2), interval: 0.4 });
    } else {
      // Normal wave
      const available = getAvailableEnemyTypes(w);
      let remaining = budget;

      while (remaining > 0) {
        const type = available[Math.floor(Math.random() * available.length)];
        const typeDef = ENEMY_TYPES[type];
        const cost = Math.ceil(typeDef.hp / 30);
        if (remaining < cost && wave.enemies.length > 0) break;

        const maxCount = Math.min(Math.floor(remaining / cost), 12);
        const count = Math.max(1, Math.floor(Math.random() * maxCount) + 1);

        wave.enemies.push({ type, count, interval: 0.3 + Math.random() * 0.4 });
        remaining -= cost * count;
      }
    }

    waves.push(wave);
  }
  return waves;
}

function getAvailableEnemyTypes(wave) {
  const all = [
    { type: 'walker',    minWave: 1  },
    { type: 'crawler',   minWave: 1  },
    { type: 'runner',    minWave: 2  },
    { type: 'bloated',   minWave: 3  },
    { type: 'armored',   minWave: 4  },
    { type: 'toxic',     minWave: 5  },
    { type: 'ghost',     minWave: 6  },
    { type: 'healer',    minWave: 7  },
    { type: 'berserker', minWave: 8  },
    { type: 'nightmare', minWave: 9  },
    { type: 'leaper',    minWave: 10 },
    { type: 'shielder',  minWave: 12 },
  ];
  return all.filter(e => e.minWave <= wave).map(e => e.type);
}

// ── Enemy instance ─────────────────────────────────────────
class Enemy {
  constructor(type, path, tileSize, waveNum, waveModifier) {
    const def = ENEMY_TYPES[type];
    this.type = type;
    this.def = def;
    this.name = def.name;
    this.icon = def.icon;
    this.color = def.color;
    this.size = def.size * (def.isBoss ? 1.0 : 0.9);
    this.isBoss = def.isBoss;
    this.invisible = def.invisible || false;

    const scale = 1 + (waveNum - 1) * 0.06 * waveModifier;
    this.maxHp = Math.floor(def.hp * scale);
    this.hp = this.maxHp;
    this.speed = def.speed * (0.95 + Math.random() * 0.1);
    this.baseSpeed = this.speed;
    this.reward = def.reward;
    this.armor = def.armor || 0;

    this.path = path;
    this.tileSize = tileSize;
    this.pathIndex = 0;
    this.pathProgress = 0;
    this.x = path[0][0] * tileSize + tileSize/2;
    this.y = path[0][1] * tileSize + tileSize/2;
    this.targetX = this.x;
    this.targetY = this.y;

    this.dead = false;
    this.reachedEnd = false;
    this.slowTimer = 0;
    this.burnTimer = 0;
    this.burnDmg = 0;
    this.burnAccum = 0;
    this.poisonTimer = 0;
    this.healTimer = 0;
    this.rageActive = false;

    this.flashTimer = 0;
    this.angle = 0;

    // Boss special
    this.specialCooldown = 0;

    // Entry animation
    this.spawnAlpha = 0;
    this.spawnTime = 0.3;

    this._updateTarget();
  }

  _updateTarget() {
    if (this.pathIndex + 1 < this.path.length) {
      this.targetX = this.path[this.pathIndex+1][0] * this.tileSize + this.tileSize/2;
      this.targetY = this.path[this.pathIndex+1][1] * this.tileSize + this.tileSize/2;
    }
  }

  takeDamage(amount, bullet) {
    if (this.dead) return;
    let dmg = amount;
    // Rage: reduce damage when enraged
    if (this.rageActive) dmg *= 0.5;

    this.hp -= dmg;
    this.flashTimer = 0.12;

    if (bullet && bullet.slow > 0) {
      this.speed = this.baseSpeed * (1 - bullet.slow);
      this.slowTimer = bullet.slowDur || 1.5;
    }
    if (bullet && bullet.burn > 0) {
      this.burnDmg = bullet.burn;
      this.burnTimer = 4.0;
    }

    if (this.def.rageOnDamage && !this.rageActive && this.hp < this.maxHp * 0.4) {
      this.rageActive = true;
      this.speed = this.baseSpeed * 1.8;
    }

    if (this.hp <= 0) {
      this.hp = 0;
      this.dead = true;
    }
    return dmg;
  }

  update(dt, allEnemies) {
    this.spawnAlpha = Math.min(1, this.spawnAlpha + dt / this.spawnTime);
    this.flashTimer = Math.max(0, this.flashTimer - dt);

    // Slow timer
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      if (this.slowTimer <= 0 && !this.rageActive) this.speed = this.baseSpeed;
    }

    // Burn
    if (this.burnTimer > 0) {
      this.burnAccum += dt;
      this.burnTimer -= dt;
      if (this.burnAccum >= 0.5) {
        this.hp -= this.burnDmg * 0.5;
        this.burnAccum = 0;
        if (this.hp <= 0) { this.hp = 0; this.dead = true; return; }
      }
    }

    // Healer special
    if (this.def.specialMove === 'heal') {
      this.healTimer -= dt;
      if (this.healTimer <= 0) {
        this.healTimer = 3;
        if (allEnemies) {
          allEnemies.forEach(e => {
            if (e === this || e.dead) return;
            const d = Math.hypot(e.x - this.x, e.y - this.y);
            if (d < 80) e.hp = Math.min(e.maxHp, e.hp + e.maxHp * 0.08);
          });
        }
      }
    }

    // Leaper special
    if (this.def.specialMove === 'leap') {
      this.specialCooldown -= dt;
      if (this.specialCooldown <= 0) {
        this.specialCooldown = 5 + Math.random() * 5;
        // Jump ahead 2 path nodes
        const ahead = Math.min(this.pathIndex + 2, this.path.length - 2);
        this.pathIndex = ahead;
        this.x = this.path[ahead][0] * this.tileSize + this.tileSize/2;
        this.y = this.path[ahead][1] * this.tileSize + this.tileSize/2;
        this._updateTarget();
      }
    }

    // Move along path
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    this.angle = Math.atan2(dy, dx);
    this.pathProgress = this.pathIndex + (1 - dist / this.tileSize);

    const move = this.speed * dt;
    if (dist <= move) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.pathIndex++;
      if (this.pathIndex >= this.path.length - 1) {
        this.reachedEnd = true;
        this.dead = true;
        return;
      }
      this._updateTarget();
    } else {
      this.x += (dx / dist) * move;
      this.y += (dy / dist) * move;
    }
  }

  draw(ctx) {
    if (this.dead) return;
    const alpha = this.invisible ? 0.25 : this.spawnAlpha;
    ctx.globalAlpha = alpha;

    const s = this.size;

    // Shadow
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + s*0.7, s*0.6, s*0.2, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fill();

    // Body circle
    ctx.beginPath();
    ctx.arc(this.x, this.y, s, 0, Math.PI*2);
    const bodyColor = this.flashTimer > 0 ? '#ffffff' :
                      this.rageActive ? '#ff0000' :
                      this.burnTimer > 0 ? '#ff6600' :
                      this.color;
    ctx.fillStyle = bodyColor;
    ctx.fill();

    if (this.isBoss) {
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Icon
    ctx.font = `${Math.floor(s * 1.1)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.icon, this.x, this.y);

    // HP bar
    if (this.hp < this.maxHp) {
      const bw = s * 2.2;
      const bh = this.isBoss ? 7 : 4;
      const bx = this.x - bw/2;
      const by = this.y - s - (this.isBoss ? 14 : 9);

      ctx.fillStyle = '#333';
      ctx.fillRect(bx, by, bw, bh);

      const ratio = this.hp / this.maxHp;
      ctx.fillStyle = ratio > 0.6 ? '#2ecc71' : ratio > 0.3 ? '#f39c12' : '#e74c3c';
      ctx.fillRect(bx, by, bw * ratio, bh);

      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, bw, bh);
    }

    // Slow indicator
    if (this.slowTimer > 0) {
      ctx.fillStyle = 'rgba(52,152,219,0.5)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, s + 3, 0, Math.PI*2);
      ctx.fill();
    }

    // Burn indicator
    if (this.burnTimer > 0) {
      const t = Date.now() * 0.006;
      for (let i = 0; i < 3; i++) {
        const fx = this.x + Math.cos(t + i*2.1) * s * 0.8;
        const fy = this.y + Math.sin(t + i*2.1) * s * 0.8;
        ctx.font = '10px serif';
        ctx.fillText('🔥', fx - 5, fy - 5);
      }
    }

    ctx.globalAlpha = 1;
  }
}
