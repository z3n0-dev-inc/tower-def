/* ═══════════════════════════════════════════════
   enemies.js — Enemy types, waves, AI
   ═══════════════════════════════════════════════
   immunities[] — damage types this enemy ignores.
   Only owner towers (damageType:'void', bypasses:true)
   and legendaries with bypasses:true can always hit.

   Types: bullet | fire | ice | explosive | electric | laser | poison | void
   ─────────────────────────────────────────────── */

const ENEMY_TYPES = {
  // ── SLOW / WEAK ──────────────────────────────
  walker: {
    name:'WALKER', color:'#5d4037',
    hp:80, speed:55, reward:5, armor:0, size:14, isBoss:false,
    immunities: [],  // no immunities — dies to everything
    specialMove:null,
  },
  crawler: {
    name:'CRAWLER', color:'#2e7d32',
    hp:50, speed:90, reward:4, armor:0, size:10, isBoss:false,
    immunities: [],
    specialMove:null,
  },
  bloated: {
    name:'BLOATED', color:'#bf360c',
    hp:300, speed:30, reward:12, armor:0.1, size:18, isBoss:false,
    immunities: ['bullet'],  // too fat for bullets — use explosives/fire
    specialMove:null,
  },
  // ── MEDIUM ────────────────────────────────────
  runner: {
    name:'RUNNER', color:'#1565c0',
    hp:120, speed:140, reward:8, armor:0, size:11, isBoss:false,
    immunities: ['explosive'],  // too fast — explosives miss
    specialMove:null,
  },
  armored: {
    name:'ARMORED', color:'#546e7a',
    hp:250, speed:45, reward:15, armor:0.4, size:16, isBoss:false,
    immunities: ['bullet','ice','electric'],  // use laser/explosive
    specialMove:null,
  },
  toxic: {
    name:'TOXIC', color:'#558b2f',
    hp:160, speed:65, reward:10, armor:0, size:13, isBoss:false,
    immunities: ['poison'],  // already toxic — use fire/electric
    poison:true, specialMove:'poison',
  },
  ghost: {
    name:'GHOST', color:'#9fa8da',
    hp:100, speed:85, reward:12, armor:0.5, size:12, isBoss:false,
    invisible:true,
    immunities: ['fire','laser','explosive'],  // use electric/bullet (phantom/tesla)
    specialMove:'invisible',
  },
  healer: {
    name:'HEALER', color:'#e91e63',
    hp:140, speed:50, reward:14, armor:0, size:13, isBoss:false,
    immunities: [],
    specialMove:'heal',
  },
  berserker: {
    name:'BERSERKER', color:'#b71c1c',
    hp:180, speed:80, reward:16, armor:0, size:14, isBoss:false,
    rageOnDamage:true,
    immunities: ['ice'],  // too hot-blooded — ice doesn't slow it
    specialMove:'rage',
  },
  // ── FAST / STRONG ─────────────────────────────
  nightmare: {
    name:'NIGHTMARE', color:'#212121',
    hp:400, speed:100, reward:25, armor:0.3, size:15, isBoss:false,
    immunities: ['bullet','fire'],  // use laser/electric
    specialMove:null,
  },
  leaper: {
    name:'LEAPER', color:'#f57f17',
    hp:200, speed:60, reward:18, armor:0, size:13, isBoss:false,
    immunities: ['explosive'],  // leaps over explosions
    specialMove:'leap',
  },
  shielder: {
    name:'SHIELDER', color:'#37474f',
    hp:350, speed:50, reward:22, armor:0.6, size:17, isBoss:false,
    immunities: ['bullet','electric'],  // shield blocks bullets/electricity
    specialMove:null,
  },
  // ── BOSSES ────────────────────────────────────
  boss_zombie_king: {
    name:'ZOMBIE KING', color:'#4a148c',
    hp:2000, speed:35, reward:150, armor:0.3, size:26, isBoss:true,
    immunities: ['poison'],  // undead — poison irrelevant
    specialMove:'summon',
  },
  boss_undead_titan: {
    name:'UNDEAD TITAN', color:'#1a1a1a',
    hp:5000, speed:25, reward:300, armor:0.5, size:30, isBoss:true,
    immunities: ['poison','ice','bullet'],  // use laser/explosive only
    specialMove:'stomp',
  },
  // ── NEW LATE-GAME ENEMIES (wave 15+) ──────────────────────
  colossus: {
    name:'COLOSSUS', color:'#607d8b',
    hp:4500, speed:22, reward:55, armor:0.7, size:20, isBoss:false,
    immunities: ['bullet','ice','poison'],  // explosive, laser, electric only
    specialMove:'stomp',
  },
  wraith: {
    name:'WRAITH', color:'#aa00ff',
    hp:800, speed:110, reward:45, armor:0.2, size:9, isBoss:false,
    invisible:true,
    immunities: ['bullet','poison','explosive'],
    specialMove:null,
  },
  bloodhound: {
    name:'BLOODHOUND', color:'#b71c1c',
    hp:1200, speed:90, reward:50, armor:0.3, size:11, isBoss:false,
    immunities: ['ice'],
    rageOnDamage:true,
    specialMove:null,
  },
  plague_carrier: {
    name:'PLAGUE CARRIER', color:'#1b5e20',
    hp:2200, speed:35, reward:60, armor:0.4, size:16, isBoss:false,
    immunities: ['poison','fire'],
    specialMove:'explode',
  },
  titan_guardian: {
    name:'TITAN GUARDIAN', color:'#37474f',
    hp:8000, speed:18, reward:90, armor:0.8, size:22, isBoss:false,
    immunities: ['bullet','ice','poison','fire'],
    specialMove:'stomp',
  },
  void_rift: {
    name:'VOID RIFT', color:'#4a148c',
    hp:3500, speed:50, reward:80, armor:0.5, size:18, isBoss:false,
    invisible:true,
    immunities: ['bullet','fire','ice'],
    specialMove:'phase',
  },
  // ── NEW BOSSES (wave 25, 30, 35+) ──────────────────────────
  boss_colossus_prime: {
    name:'COLOSSUS PRIME', color:'#455a64',
    hp:30000, speed:20, reward:1000, armor:0.75, size:40, isBoss:true,
    immunities: ['bullet','poison','ice'],
    specialMove:'stomp',
  },
  boss_void_emperor: {
    name:'VOID EMPEROR', color:'#1a0030',
    hp:55000, speed:35, reward:2000, armor:0.7, size:44, isBoss:true,
    invisible:true,
    immunities: ['bullet','fire','poison','ice','explosive'],
    specialMove:'phase',
  },
  boss_omega_destroyer: {
    name:'OMEGA DESTROYER', color:'#b71c1c',
    hp:120000, speed:28, reward:5000, armor:0.85, size:48, isBoss:true,
    immunities: ['bullet','ice','poison','fire'],
    specialMove:'stomp',
  },

  boss_shadow_lord: {
    name:'SHADOW LORD', color:'#0d0d0d',
    hp:12000, speed:40, reward:600, armor:0.6, size:32, isBoss:true,
    invisible:true,
    immunities: ['bullet','fire','poison','explosive'],  // only electric/laser/void hurts it
    specialMove:'phase',
  },
};

/* ── Canvas Enemy Art — hand-drawn sprites ───────────────── */
const EnemyArt = {

  // WALKER — classic zombie: torn green jacket, exposed ribs, hungry reach
  walker(ctx, x, y, s) {
    const S = s;
    // Drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(x+S*0.05, y+S*0.7, S*0.45, S*0.14, 0, 0, Math.PI*2); ctx.fill();

    // Legs — stumpy, dragging
    ctx.strokeStyle = '#3d2a1a'; ctx.lineWidth = S*0.22; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x-S*0.18, y+S*0.5); ctx.lineTo(x-S*0.28, y+S*0.85); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S*0.12, y+S*0.5); ctx.lineTo(x+S*0.22, y+S*0.82); ctx.stroke();
    // Feet
    ctx.fillStyle = '#2a1a0a';
    ctx.beginPath(); ctx.ellipse(x-S*0.3, y+S*0.88, S*0.14, S*0.07, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+S*0.24, y+S*0.85, S*0.13, S*0.07, -0.2, 0, Math.PI*2); ctx.fill();

    // Body — torn jacket, hunched
    ctx.fillStyle = '#3d5c30';
    ctx.beginPath();
    ctx.moveTo(x-S*0.42, y+S*0.5);
    ctx.quadraticCurveTo(x-S*0.48, y-S*0.05, x-S*0.3, y-S*0.15);
    ctx.lineTo(x, y-S*0.22);
    ctx.lineTo(x+S*0.35, y-S*0.1);
    ctx.quadraticCurveTo(x+S*0.45, y+S*0.08, x+S*0.38, y+S*0.5);
    ctx.closePath(); ctx.fill();
    // Jacket detail — collar + dark front
    ctx.fillStyle = '#2d4820';
    ctx.fillRect(x-S*0.15, y-S*0.22, S*0.32, S*0.44);
    // Exposed ribs / torn shirt
    ctx.strokeStyle = '#c89060'; ctx.lineWidth = S*0.04;
    for (let r = 0; r < 3; r++) {
      ctx.beginPath(); ctx.moveTo(x-S*0.12, y-S*0.05+r*S*0.12); ctx.lineTo(x+S*0.12, y-S*0.05+r*S*0.12); ctx.stroke();
    }
    // Reaching arm
    ctx.strokeStyle = '#3d5c30'; ctx.lineWidth = S*0.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x+S*0.35, y-S*0.05); ctx.lineTo(x+S*0.78, y-S*0.22); ctx.stroke();
    // Arm hand — clawed
    ctx.fillStyle = '#5c7040';
    ctx.beginPath(); ctx.arc(x+S*0.8, y-S*0.24, S*0.1, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#2a3a18'; ctx.lineWidth = S*0.04;
    for (let f = 0; f < 3; f++) {
      const fa = -0.4 + f*0.4;
      ctx.beginPath(); ctx.moveTo(x+S*0.8, y-S*0.24); ctx.lineTo(x+S*0.8+Math.cos(fa)*S*0.14, y-S*0.24+Math.sin(fa)*S*0.14); ctx.stroke();
    }
    // Dangling arm
    ctx.strokeStyle = '#3d5c30'; ctx.lineWidth = S*0.18;
    ctx.beginPath(); ctx.moveTo(x-S*0.35, y-S*0.05); ctx.lineTo(x-S*0.5, y+S*0.35); ctx.stroke();

    // Neck
    ctx.fillStyle = '#7a5c40';
    ctx.fillRect(x-S*0.1, y-S*0.42, S*0.2, S*0.24);

    // Head — lumpy skull
    ctx.fillStyle = '#8a6e50';
    ctx.beginPath(); ctx.ellipse(x+S*0.04, y-S*0.62, S*0.3, S*0.28, 0.08, 0, Math.PI*2); ctx.fill();
    // Darker side shading
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(x+S*0.1, y-S*0.6, S*0.18, S*0.22, 0.15, 0, Math.PI*2); ctx.fill();

    // Drooping jaw
    ctx.fillStyle = '#7a5a3a';
    ctx.beginPath(); ctx.ellipse(x+S*0.08, y-S*0.42, S*0.2, S*0.12, 0.2, 0, Math.PI*1.0); ctx.fill();
    // Teeth — 3 jagged
    ctx.fillStyle = '#ddd8c0';
    for (let t = 0; t < 3; t++) {
      ctx.beginPath(); ctx.moveTo(x-S*0.06+t*S*0.1, y-S*0.5); ctx.lineTo(x-S*0.02+t*S*0.1, y-S*0.38); ctx.lineTo(x+S*0.02+t*S*0.1, y-S*0.5); ctx.fill();
    }

    // Eyes — one milky white, one rotten yellow
    ctx.fillStyle = '#e8e0d0';
    ctx.beginPath(); ctx.ellipse(x-S*0.1, y-S*0.66, S*0.1, S*0.09, -0.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#d4b840';
    ctx.beginPath(); ctx.ellipse(x+S*0.18, y-S*0.64, S*0.1, S*0.09, 0.1, 0, Math.PI*2); ctx.fill();
    // Pupils
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.beginPath(); ctx.arc(x-S*0.08, y-S*0.66, S*0.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*0.2, y-S*0.64, S*0.04, 0, Math.PI*2); ctx.fill();
    // Bloodshot vein on milky eye
    ctx.strokeStyle = '#cc4444'; ctx.lineWidth = S*0.02;
    ctx.beginPath(); ctx.moveTo(x-S*0.14, y-S*0.68); ctx.lineTo(x-S*0.08, y-S*0.66); ctx.stroke();

    // Wound gash
    ctx.strokeStyle = '#aa2222'; ctx.lineWidth = S*0.05;
    ctx.beginPath(); ctx.moveTo(x-S*0.05, y-S*0.58); ctx.lineTo(x+S*0.1, y-S*0.52); ctx.stroke();

    // Hair — scraggly wisps
    ctx.strokeStyle = '#2a1a0a'; ctx.lineWidth = S*0.04; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x-S*0.18, y-S*0.82); ctx.quadraticCurveTo(x-S*0.3, y-S*0.95, x-S*0.22, y-S*0.88); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S*0.05, y-S*0.88); ctx.quadraticCurveTo(x+S*0.2, y-S*1.0, x+S*0.15, y-S*0.9); ctx.stroke();
  },

  // CRAWLER — low beast, reptilian, four limbs visible, spine ridges
  crawler(ctx, x, y, s) {
    const S = s;
    // Low flat body
    ctx.fillStyle = '#2d5a27';
    ctx.beginPath();
    ctx.ellipse(x, y+S*.1, S*.7, S*.38, 0, 0, Math.PI*2);
    ctx.fill();
    // Spine ridges
    ctx.fillStyle = '#1e3d1a';
    for(let i=0;i<5;i++){
      const rx = x-S*.5+i*S*.25;
      ctx.beginPath();
      ctx.moveTo(rx, y+S*.05);
      ctx.lineTo(rx+S*.08, y-S*.2);
      ctx.lineTo(rx+S*.16, y+S*.05);
      ctx.fill();
    }
    // Head — wedge shaped
    ctx.fillStyle = '#2d5a27';
    ctx.beginPath();
    ctx.moveTo(x+S*.55, y);
    ctx.lineTo(x+S*.85, y-S*.08);
    ctx.lineTo(x+S*.9, y+S*.1);
    ctx.lineTo(x+S*.55, y+S*.18);
    ctx.closePath(); ctx.fill();
    // Snout
    ctx.fillStyle = '#1e3d1a';
    ctx.beginPath();
    ctx.ellipse(x+S*.85, y+S*.02, S*.12, S*.07, 0, 0, Math.PI*2);
    ctx.fill();
    // Slit eyes — yellow
    ctx.fillStyle = '#d4c400';
    ctx.beginPath(); ctx.ellipse(x+S*.68, y-S*.05, S*.1, S*.06, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1a0a00';
    ctx.beginPath(); ctx.ellipse(x+S*.68, y-S*.05, S*.03, S*.06, 0, 0, Math.PI*2); ctx.fill();
    // Four stubby legs
    ctx.strokeStyle = '#1e3d1a'; ctx.lineWidth = S*.14; ctx.lineCap = 'round';
    [[-S*.45,S*.28],[- S*.18,S*.32],[S*.12,S*.32],[S*.38,S*.28]].forEach(([lx,ly])=>{
      ctx.beginPath(); ctx.moveTo(x+lx, y+S*.2); ctx.lineTo(x+lx*1.2, y+ly); ctx.stroke();
    });
    // Tail
    ctx.strokeStyle = '#2d5a27'; ctx.lineWidth = S*.12;
    ctx.beginPath(); ctx.moveTo(x-S*.65, y+S*.12); ctx.quadraticCurveTo(x-S*.9, y+S*.28, x-S*.8, y+S*.45); ctx.stroke();
  },

  // BLOATED — swollen pustule-covered horror
  bloated(ctx, x, y, s) {
    const S = s;
    // Main body — fat irregular mass
    ctx.fillStyle = '#c04f0e';
    ctx.beginPath();
    ctx.ellipse(x, y, S*.85, S*.9, 0, 0, Math.PI*2);
    ctx.fill();
    // Mottled skin texture — dark patches
    ctx.fillStyle = '#9a3a08';
    ctx.beginPath(); ctx.ellipse(x-S*.3, y-S*.2, S*.28, S*.2, -0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+S*.25, y+S*.3, S*.24, S*.18, 0.3, 0, Math.PI*2); ctx.fill();
    // Pustules
    ctx.fillStyle = '#f5c842';
    [[x-S*.2,y+S*.35,S*.12],[x+S*.45,y+S*.1,S*.1],[x-S*.5,y+S*.1,S*.09],[x+S*.1,y-S*.55,S*.11],[x+S*.38,y-S*.3,S*.08]].forEach(([px,py,pr])=>{
      ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#c8a020';
      ctx.beginPath(); ctx.arc(px, py, pr*.45, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#f5c842';
    });
    // Tiny buried eyes — barely visible
    ctx.fillStyle = '#1a0000';
    ctx.beginPath(); ctx.ellipse(x-S*.22, y-S*.25, S*.14, S*.1, -0.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+S*.22, y-S*.25, S*.14, S*.1, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ff4400';
    ctx.beginPath(); ctx.arc(x-S*.22, y-S*.25, S*.06, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.22, y-S*.25, S*.06, 0, Math.PI*2); ctx.fill();
    // Gaping mouth — teeth
    ctx.fillStyle = '#6a1a00';
    ctx.beginPath(); ctx.ellipse(x, y+S*.25, S*.3, S*.18, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ddd8b8';
    for(let i=-2;i<=2;i++) {
      ctx.beginPath(); ctx.moveTo(x+i*S*.11, y+S*.1); ctx.lineTo(x+i*S*.11+S*.05, y+S*.28); ctx.lineTo(x+i*S*.11-S*.04, y+S*.28); ctx.closePath(); ctx.fill();
    }
  },

  // RUNNER — fast undead sprinter, athletic build, glowing blue eyes, motion blur
  runner(ctx, x, y, s) {
    const S = s;
    // Motion trail
    ctx.globalAlpha *= 0.25;
    for (let i = 1; i <= 3; i++) {
      ctx.fillStyle = '#1e4a8a';
      ctx.beginPath(); ctx.ellipse(x + i*S*0.18, y, S*0.2, S*0.38, -0.25, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha /= 0.25;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(x+S*0.05, y+S*0.72, S*0.32, S*0.1, 0, 0, Math.PI*2); ctx.fill();

    // Pumping back leg
    ctx.strokeStyle = '#1a3870'; ctx.lineWidth = S*0.18; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x+S*0.08, y+S*0.42); ctx.lineTo(x-S*0.1, y+S*0.72); ctx.lineTo(x-S*0.28, y+S*0.62); ctx.stroke();
    // Forward leg
    ctx.beginPath(); ctx.moveTo(x-S*0.08, y+S*0.44); ctx.lineTo(x+S*0.18, y+S*0.75); ctx.lineTo(x+S*0.32, y+S*0.65); ctx.stroke();

    // Lean body — angled forward aggressively
    ctx.fillStyle = '#1a4090';
    ctx.beginPath();
    ctx.ellipse(x-S*0.04, y-S*0.02, S*0.26, S*0.5, -0.28, 0, Math.PI*2);
    ctx.fill();
    // Speed stripe — white diagonal
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = S*0.07; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x-S*0.22, y-S*0.42); ctx.lineTo(x+S*0.2, y+S*0.38); ctx.stroke();
    // Number decal
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = `bold ${S*0.22}px monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('RUN', x-S*0.02, y-S*0.05);

    // Back arm pumping behind
    ctx.strokeStyle = '#143070'; ctx.lineWidth = S*0.15;
    ctx.beginPath(); ctx.moveTo(x-S*0.2, y-S*0.02); ctx.lineTo(x-S*0.5, y+S*0.22); ctx.stroke();
    // Forward arm
    ctx.beginPath(); ctx.moveTo(x+S*0.2, y-S*0.12); ctx.lineTo(x+S*0.48, y-S*0.38); ctx.stroke();

    // Neck
    ctx.fillStyle = '#8a7060';
    ctx.fillRect(x-S*0.1, y-S*0.56, S*0.18, S*0.18);

    // Head — streamlined, lean forward
    ctx.fillStyle = '#9a7a62';
    ctx.beginPath(); ctx.ellipse(x-S*0.1, y-S*0.7, S*0.22, S*0.24, -0.22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(x-S*0.04, y-S*0.68, S*0.14, S*0.18, -0.2, 0, Math.PI*2); ctx.fill();

    // Glowing blue eyes
    ctx.fillStyle = '#80d0ff';
    ctx.shadowBlur = 8; ctx.shadowColor = '#0080ff';
    ctx.beginPath(); ctx.arc(x-S*0.2, y-S*0.72, S*0.09, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x-S*0.04, y-S*0.7, S*0.09, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#003366';
    ctx.beginPath(); ctx.arc(x-S*0.2, y-S*0.72, S*0.045, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x-S*0.04, y-S*0.7, S*0.045, 0, Math.PI*2); ctx.fill();

    // Speed lines
    ctx.strokeStyle = 'rgba(100,180,255,0.3)'; ctx.lineWidth = S*0.03;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.moveTo(x+S*0.35+i*S*0.1, y-S*0.1+i*S*0.12); ctx.lineTo(x+S*0.6+i*S*0.1, y-S*0.1+i*S*0.12); ctx.stroke();
    }
  },

  // ARMORED — full plate zombie knight, dented armor, glowing visor
  armored(ctx, x, y, s) {
    const S = s;
    // Drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(x+S*0.05, y+S*0.75, S*0.5, S*0.13, 0, 0, Math.PI*2); ctx.fill();

    // Feet / sabatons
    ctx.fillStyle = '#3a4858';
    ctx.beginPath(); ctx.ellipse(x-S*0.22, y+S*0.75, S*0.16, S*0.08, -0.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+S*0.22, y+S*0.75, S*0.16, S*0.08, 0.2, 0, Math.PI*2); ctx.fill();
    // Greaves
    ctx.strokeStyle = '#4a5868'; ctx.lineWidth = S*0.18; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x-S*0.2, y+S*0.52); ctx.lineTo(x-S*0.22, y+S*0.72); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S*0.2, y+S*0.52); ctx.lineTo(x+S*0.22, y+S*0.72); ctx.stroke();

    // Plate torso — wide, solid
    ctx.fillStyle = '#4a5870';
    ctx.beginPath(); ctx.roundRect(x-S*0.5, y-S*0.28, S*1.0, S*0.82, S*0.06); ctx.fill();
    // Plate section lines
    ctx.strokeStyle = '#32404e'; ctx.lineWidth = S*0.04;
    ctx.beginPath(); ctx.moveTo(x-S*0.5, y-S*0.02); ctx.lineTo(x+S*0.5, y-S*0.02); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-S*0.48, y+S*0.2); ctx.lineTo(x+S*0.48, y+S*0.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y-S*0.28); ctx.lineTo(x, y+S*0.54); ctx.stroke();
    // Pauldrons (shoulder guards) — rounded
    ctx.fillStyle = '#5a6a82';
    ctx.beginPath(); ctx.ellipse(x-S*0.58, y-S*0.18, S*0.2, S*0.28, -0.15, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+S*0.58, y-S*0.18, S*0.2, S*0.28, 0.15, 0, Math.PI*2); ctx.fill();
    // Pauldron edge highlights
    ctx.strokeStyle = '#728498'; ctx.lineWidth = S*0.03;
    ctx.beginPath(); ctx.ellipse(x-S*0.58, y-S*0.18, S*0.2, S*0.28, -0.15, -Math.PI*0.8, 0); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x+S*0.58, y-S*0.18, S*0.2, S*0.28, 0.15, -Math.PI*0.2, Math.PI*0.8); ctx.stroke();

    // Chest emblem — cross/shield
    ctx.fillStyle = '#cc1111';
    ctx.fillRect(x-S*0.06, y-S*0.22, S*0.12, S*0.38);
    ctx.fillRect(x-S*0.2, y-S*0.08, S*0.4, S*0.12);
    // Armor dents and scratches
    ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = S*0.04;
    ctx.beginPath(); ctx.moveTo(x-S*0.32, y+S*0.08); ctx.lineTo(x-S*0.18, y+S*0.28); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S*0.22, y-S*0.18); ctx.lineTo(x+S*0.35, y); ctx.stroke();
    // Specular highlights on armor
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = S*0.03;
    ctx.beginPath(); ctx.moveTo(x-S*0.48, y-S*0.22); ctx.lineTo(x-S*0.48, y+S*0.5); ctx.stroke();

    // Shield arm (left, holding shield)
    ctx.fillStyle = '#4a5870';
    ctx.beginPath(); ctx.roundRect(x-S*0.75, y-S*0.3, S*0.32, S*0.55, S*0.04); ctx.fill();
    // Shield boss
    ctx.fillStyle = '#6a7a90';
    ctx.beginPath(); ctx.arc(x-S*0.59, y-S*0.04, S*0.12, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#d4a820';
    ctx.beginPath(); ctx.arc(x-S*0.59, y-S*0.04, S*0.06, 0, Math.PI*2); ctx.fill();

    // Helmet — great helm style
    ctx.fillStyle = '#4a5870';
    ctx.beginPath(); ctx.roundRect(x-S*0.3, y-S*0.85, S*0.6, S*0.62, S*0.04); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x-S*0.28, y-S*0.85, S*0.56, S*0.3, S*0.04); ctx.fill(); // top dome
    // Helm detail lines
    ctx.strokeStyle = '#32404e'; ctx.lineWidth = S*0.03;
    ctx.beginPath(); ctx.moveTo(x-S*0.3, y-S*0.54); ctx.lineTo(x+S*0.3, y-S*0.54); ctx.stroke();
    // Visor slot — glowing red
    ctx.fillStyle = '#1a0808';
    ctx.beginPath(); ctx.roundRect(x-S*0.22, y-S*0.72, S*0.44, S*0.13, S*0.04); ctx.fill();
    ctx.fillStyle = '#ff1111';
    ctx.shadowBlur = 10; ctx.shadowColor = '#ff0000';
    ctx.beginPath(); ctx.roundRect(x-S*0.2, y-S*0.7, S*0.4, S*0.09, S*0.03); ctx.fill();
    ctx.shadowBlur = 0;
    // Plume on helmet top
    ctx.strokeStyle = '#cc2222'; ctx.lineWidth = S*0.06; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x-S*0.1, y-S*0.85); ctx.quadraticCurveTo(x-S*0.2, y-S*1.1, x, y-S*1.05); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y-S*0.85); ctx.quadraticCurveTo(x+S*0.05, y-S*1.12, x+S*0.12, y-S*1.06); ctx.stroke();
  },

  // TOXIC — dripping mutant, melting flesh, acid puddle below
  toxic(ctx, x, y, s) {
    const S = s;
    const t = Date.now() * 0.0015;
    // Acid drip puddle
    ctx.fillStyle = 'rgba(110,175,0,0.35)';
    ctx.beginPath(); ctx.ellipse(x, y+S*.75, S*.55, S*.18, 0, 0, Math.PI*2); ctx.fill();
    // Oozing body
    ctx.fillStyle = '#4a7a18';
    ctx.beginPath();
    for(let i=0;i<=16;i++){
      const a = (i/16)*Math.PI*2;
      const r = S*(0.72 + 0.16*Math.sin(a*3+t));
      const px = x + Math.cos(a)*r;
      const py = y + Math.sin(a)*r*0.9;
      i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
    }
    ctx.closePath(); ctx.fill();
    // Inner glow — brighter green
    const g = ctx.createRadialGradient(x, y-S*.15, S*.08, x, y, S*.6);
    g.addColorStop(0,'rgba(140,230,0,0.4)'); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, S*.72, 0, Math.PI*2); ctx.fill();
    // Skull face embedded in slime
    ctx.fillStyle = '#1a3a00';
    ctx.beginPath(); ctx.ellipse(x, y-S*.15, S*.3, S*.28, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(80,180,0,0.6)';
    ctx.beginPath(); ctx.arc(x-S*.14, y-S*.2, S*.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.14, y-S*.2, S*.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#00ff00';
    ctx.shadowBlur = 6; ctx.shadowColor = '#00ff00';
    ctx.beginPath(); ctx.arc(x-S*.14, y-S*.2, S*.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.14, y-S*.2, S*.05, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    // Teeth
    ctx.fillStyle = '#c8d4a0';
    for(let i=-2;i<=2;i++) ctx.fillRect(x+i*S*.1-S*.03, y, S*.06, S*.12);
    // Drip tentacles
    ctx.strokeStyle = '#5a9020'; ctx.lineWidth = S*.09; ctx.lineCap = 'round';
    for(let i=0;i<4;i++){
      const ax = x + (i-1.5)*S*.32;
      ctx.beginPath();
      ctx.moveTo(ax, y+S*.55);
      ctx.quadraticCurveTo(ax+(Math.sin(t+i))*S*.2, y+S*.75, ax+(Math.sin(t+i))*S*.15, y+S*.92);
      ctx.stroke();
    }
  },

  // GHOST — translucent specter, trailing wisps, hollow mask face
  ghost(ctx, x, y, s) {
    const S = s;
    const t = Date.now() * 0.002;
    const bob = Math.sin(t) * S * 0.06;
    // Trailing wisps below
    ctx.globalAlpha *= 0.4;
    ctx.fillStyle = '#9fa8da';
    for(let i=0;i<3;i++){
      const wx = x + (i-1)*S*.32;
      ctx.beginPath();
      ctx.moveTo(wx-S*.12, y+S*.4+bob);
      ctx.quadraticCurveTo(wx+S*.04*Math.sin(t+i), y+S*.75+bob, wx, y+S*.95+bob);
      ctx.lineTo(wx+S*.1, y+S*.95+bob);
      ctx.quadraticCurveTo(wx+S*.15, y+S*.65+bob, wx+S*.12, y+S*.4+bob);
      ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha /= 0.4;
    // Main form — hooded shroud shape
    ctx.globalAlpha *= 0.72;
    ctx.fillStyle = '#b0b8e8';
    ctx.beginPath();
    ctx.arc(x, y-S*.28+bob, S*.45, Math.PI, 0);
    ctx.quadraticCurveTo(x+S*.55, y+S*.4+bob, x+S*.38, y+S*.68+bob);
    ctx.quadraticCurveTo(x+S*.22, y+S*.52+bob, x+S*.06, y+S*.72+bob);
    ctx.quadraticCurveTo(x-S*.06, y+S*.52+bob, x-S*.28, y+S*.68+bob);
    ctx.quadraticCurveTo(x-S*.48, y+S*.42+bob, x-S*.55, y+S*.1+bob);
    ctx.closePath(); ctx.fill();
    // Inner shadow
    ctx.fillStyle = 'rgba(60,70,140,0.4)';
    ctx.beginPath(); ctx.ellipse(x, y+S*.15+bob, S*.3, S*.4, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha /= 0.72;
    // Hollow eye sockets — dark voids
    ctx.fillStyle = 'rgba(10,10,30,0.95)';
    ctx.beginPath(); ctx.ellipse(x-S*.2, y-S*.32+bob, S*.14, S*.18, -0.15, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+S*.2, y-S*.32+bob, S*.14, S*.18, 0.15, 0, Math.PI*2); ctx.fill();
    // Faint glow in sockets
    ctx.fillStyle = 'rgba(150,160,255,0.5)';
    ctx.beginPath(); ctx.arc(x-S*.2, y-S*.32+bob, S*.06, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.2, y-S*.32+bob, S*.06, 0, Math.PI*2); ctx.fill();
    // Screaming mouth — jagged
    ctx.fillStyle = 'rgba(10,10,30,0.9)';
    ctx.beginPath(); ctx.ellipse(x, y+bob, S*.16, S*.22, 0, 0, Math.PI*2); ctx.fill();
  },

  // HEALER — corrupted medic, syringe backpack, cross markings, tending to others
  healer(ctx, x, y, s) {
    const S = s;
    // Robes — white with red stains
    ctx.fillStyle = '#e8e4d8';
    ctx.beginPath(); ctx.ellipse(x, y+S*.2, S*.42, S*.6, 0, 0, Math.PI*2); ctx.fill();
    // Red cross on robe
    ctx.fillStyle = '#cc1111';
    ctx.fillRect(x-S*.08, y-S*.1, S*.16, S*.45);
    ctx.fillRect(x-S*.22, y+S*.08, S*.44, S*.15);
    // Blood stains
    ctx.fillStyle = 'rgba(140,0,0,0.45)';
    ctx.beginPath(); ctx.ellipse(x-S*.25, y+S*.4, S*.15, S*.1, -0.4, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+S*.18, y+S*.2, S*.12, S*.08, 0.3, 0, Math.PI*2); ctx.fill();
    // Head — pale, sunken
    ctx.fillStyle = '#c4b090';
    ctx.beginPath(); ctx.ellipse(x, y-S*.52, S*.28, S*.3, 0, 0, Math.PI*2); ctx.fill();
    // White hood/headband
    ctx.fillStyle = '#f0ece0';
    ctx.beginPath(); ctx.arc(x, y-S*.52, S*.28, -Math.PI, 0); ctx.fill();
    ctx.fillRect(x-S*.28, y-S*.58, S*.56, S*.12);
    // Red cross on headband
    ctx.fillStyle = '#cc1111';
    ctx.fillRect(x-S*.04, y-S*.62, S*.08, S*.18);
    ctx.fillRect(x-S*.1, y-S*.56, S*.2, S*.07);
    // Sunken yellow eyes
    ctx.fillStyle = '#f5d020';
    ctx.beginPath(); ctx.arc(x-S*.12, y-S*.54, S*.08, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.12, y-S*.54, S*.08, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1a0a00';
    ctx.beginPath(); ctx.arc(x-S*.12, y-S*.54, S*.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.12, y-S*.54, S*.04, 0, Math.PI*2); ctx.fill();
    // Syringe in hand
    ctx.fillStyle = '#888';
    ctx.beginPath(); ctx.roundRect(x+S*.42, y-S*.2, S*.08, S*.32, S*.02); ctx.fill();
    ctx.fillStyle = '#ff4444';
    ctx.beginPath(); ctx.roundRect(x+S*.44, y-S*.18, S*.04, S*.2, S*.02); ctx.fill();
    ctx.fillStyle = '#ccc';
    ctx.beginPath(); ctx.moveTo(x+S*.46, y+S*.12); ctx.lineTo(x+S*.46, y+S*.28); ctx.lineWidth=S*.03; ctx.strokeStyle='#aaa'; ctx.stroke();
    // Healing aura pulse
    ctx.strokeStyle = 'rgba(255,255,200,0.3)'; ctx.lineWidth = S*.06;
    ctx.beginPath(); ctx.arc(x, y, S*1.1, 0, Math.PI*2); ctx.stroke();
  },

  // BERSERKER — raging muscled brute, exposed chest, battle scars, axe
  berserker(ctx, x, y, s) {
    const S = s;
    // Massive body
    ctx.fillStyle = '#8b2500';
    ctx.beginPath(); ctx.ellipse(x, y+S*.05, S*.58, S*.62, 0, 0, Math.PI*2); ctx.fill();
    // Chest muscles — pec definition
    ctx.fillStyle = '#7a1f00';
    ctx.beginPath(); ctx.ellipse(x-S*.2, y-S*.1, S*.22, S*.2, -0.15, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+S*.2, y-S*.1, S*.22, S*.2, 0.15, 0, Math.PI*2); ctx.fill();
    // Scars on chest
    ctx.strokeStyle = '#5a1000'; ctx.lineWidth = S*.05; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x-S*.12, y-S*.2); ctx.lineTo(x+S*.05, y+S*.02); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S*.22, y-S*.05); ctx.lineTo(x+S*.32, y+S*.14); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-S*.3, y+S*.12); ctx.lineTo(x-S*.1, y+S*.28); ctx.stroke();
    // Tribal band on arm
    ctx.strokeStyle = '#3a0800'; ctx.lineWidth = S*.08;
    ctx.beginPath(); ctx.arc(x+S*.55, y-S*.08, S*.1, 0, Math.PI*2); ctx.stroke();
    // Head — thick brow, war paint
    ctx.fillStyle = '#8b2500';
    ctx.beginPath(); ctx.ellipse(x, y-S*.62, S*.3, S*.32, 0, 0, Math.PI*2); ctx.fill();
    // War paint — black slashes
    ctx.fillStyle = '#1a0000';
    ctx.beginPath(); ctx.moveTo(x-S*.28, y-S*.62); ctx.lineTo(x-S*.08, y-S*.52); ctx.lineWidth=S*.08; ctx.strokeStyle='#000'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S*.28, y-S*.62); ctx.lineTo(x+S*.08, y-S*.52); ctx.stroke();
    // EYES — burning orange-white rage
    ctx.fillStyle = '#fff3c0';
    ctx.beginPath(); ctx.ellipse(x-S*.14, y-S*.65, S*.12, S*.09, -0.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+S*.14, y-S*.65, S*.12, S*.09, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ff5500';
    ctx.beginPath(); ctx.arc(x-S*.14, y-S*.65, S*.06, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.14, y-S*.65, S*.06, 0, Math.PI*2); ctx.fill();
    // Axe
    ctx.fillStyle = '#5a5060';
    ctx.beginPath(); ctx.roundRect(x+S*.6, y-S*.8, S*.1, S*.8, S*.02); ctx.fill();
    ctx.fillStyle = '#7a7888';
    ctx.beginPath();
    ctx.moveTo(x+S*.55, y-S*.8);
    ctx.lineTo(x+S*.88, y-S*.72);
    ctx.lineTo(x+S*.82, y-S*.52);
    ctx.lineTo(x+S*.55, y-S*.48);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#9a9aaa'; ctx.lineWidth = S*.03;
    ctx.beginPath(); ctx.moveTo(x+S*.58, y-S*.78); ctx.lineTo(x+S*.84, y-S*.72); ctx.stroke();
  },

  // NIGHTMARE — shadow entity, tendrils of darkness, multiple glowing eyes
  nightmare(ctx, x, y, s) {
    const S = s;
    const t = Date.now() * 0.003;
    // Outer shadow mass — pulsing, irregular
    ctx.fillStyle = 'rgba(8,6,22,0.85)';
    ctx.beginPath();
    for(let i=0;i<=20;i++){
      const a = (i/20)*Math.PI*2;
      const r = S*(0.88 + 0.2*Math.sin(a*4+t) + 0.12*Math.sin(a*7-t*1.5));
      const px = x + Math.cos(a)*r;
      const py = y + Math.sin(a)*r;
      i===0 ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
    }
    ctx.closePath(); ctx.fill();
    // Tendrils
    ctx.strokeStyle = 'rgba(20,10,50,0.9)'; ctx.lineWidth = S*.12; ctx.lineCap = 'round';
    for(let i=0;i<7;i++){
      const a = (i/7)*Math.PI*2 + t*0.5;
      const len = S*(1.0 + 0.35*Math.sin(t*2+i));
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(a)*S*.4, y + Math.sin(a)*S*.4);
      ctx.quadraticCurveTo(
        x + Math.cos(a+0.4)*S*.85, y + Math.sin(a+0.4)*S*.85,
        x + Math.cos(a)*len, y + Math.sin(a)*len
      );
      ctx.stroke();
    }
    // Dark core
    ctx.fillStyle = '#0c0820';
    ctx.beginPath(); ctx.arc(x, y, S*.52, 0, Math.PI*2); ctx.fill();
    // Void center
    const vg = ctx.createRadialGradient(x,y,0, x,y,S*.5);
    vg.addColorStop(0,'rgba(40,0,80,0.9)'); vg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = vg; ctx.beginPath(); ctx.arc(x, y, S*.5, 0, Math.PI*2); ctx.fill();
    // Three main eyes
    [[x-S*.24, y-S*.14], [x+S*.24, y-S*.14], [x, y+S*.18]].forEach(([ex,ey],i)=>{
      ctx.fillStyle = '#cc0060';
      ctx.shadowBlur = 10; ctx.shadowColor = '#ff0080';
      ctx.beginPath(); ctx.ellipse(ex, ey, S*.14, S*.1, i*.3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ff88cc';
      ctx.beginPath(); ctx.arc(ex, ey, S*.06, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
    });
    // Smaller scattered eyes
    [[x-S*.5,y+S*.1],[x+S*.5,y],[x,y-S*.55],[x-S*.35,y+S*.42]].forEach(([ex,ey])=>{
      ctx.fillStyle = '#ff0060';
      ctx.beginPath(); ctx.arc(ex, ey, S*.06, 0, Math.PI*2); ctx.fill();
    });
  },

  // LEAPER — coiled spring-legs, bulbous head, tongue
  leaper(ctx, x, y, s) {
    const S = s;
    // Coiled spring legs
    ctx.strokeStyle = '#c45a00'; ctx.lineWidth = S*.1; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x-S*.3, y+S*.35); ctx.quadraticCurveTo(x-S*.55, y+S*.65, x-S*.45, y+S*.85); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S*.3, y+S*.35); ctx.quadraticCurveTo(x+S*.55, y+S*.65, x+S*.45, y+S*.85); ctx.stroke();
    // Toe pads
    ctx.fillStyle = '#c45a00';
    ctx.beginPath(); ctx.ellipse(x-S*.45, y+S*.88, S*.12, S*.06, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+S*.45, y+S*.88, S*.12, S*.06, -0.3, 0, Math.PI*2); ctx.fill();
    // Body — squat and muscular
    ctx.fillStyle = '#e07820';
    ctx.beginPath(); ctx.ellipse(x, y+S*.15, S*.42, S*.52, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#c45a00';
    ctx.beginPath(); ctx.ellipse(x, y+S*.28, S*.3, S*.28, 0, 0, Math.PI*2); ctx.fill();
    // Spot pattern
    ctx.fillStyle = '#a04000';
    [[x-S*.18,y+S*.05,S*.09],[x+S*.2,y+S*.22,S*.08],[x-S*.08,y+S*.38,S*.1]].forEach(([px,py,pr])=>{
      ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI*2); ctx.fill();
    });
    // Huge head
    ctx.fillStyle = '#e07820';
    ctx.beginPath(); ctx.ellipse(x, y-S*.42, S*.38, S*.36, 0, 0, Math.PI*2); ctx.fill();
    // Bulging compound eyes
    ctx.fillStyle = '#d4e800';
    ctx.beginPath(); ctx.arc(x-S*.22, y-S*.52, S*.18, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.22, y-S*.52, S*.18, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#5a6000';
    ctx.beginPath(); ctx.arc(x-S*.22, y-S*.52, S*.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.22, y-S*.52, S*.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(x-S*.22, y-S*.52, S*.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.22, y-S*.52, S*.05, 0, Math.PI*2); ctx.fill();
    // Tongue flick
    ctx.strokeStyle = '#ff2222'; ctx.lineWidth = S*.07; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y-S*.22); ctx.quadraticCurveTo(x+S*.2, y-S*.1, x+S*.38, y-S*.18); ctx.stroke();
    // Tongue fork
    ctx.beginPath(); ctx.moveTo(x+S*.38, y-S*.18); ctx.lineTo(x+S*.48, y-S*.12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S*.38, y-S*.18); ctx.lineTo(x+S*.46, y-S*.25); ctx.stroke();
  },

  // SHIELDER — tortoise-like, huge shell, peeking eyes, clawed feet
  shielder(ctx, x, y, s) {
    const S = s;
    // Shell — domed hexagonal carapace
    ctx.fillStyle = '#5a7a30';
    ctx.beginPath(); ctx.ellipse(x, y-S*.1, S*.7, S*.55, 0, 0, Math.PI*2); ctx.fill();
    // Shell plates — hexagonal pattern
    ctx.strokeStyle = '#3a5218'; ctx.lineWidth = S*.04;
    // Center hex
    ctx.beginPath(); ctx.arc(x, y-S*.15, S*.22, 0, Math.PI*2); ctx.stroke();
    // Surrounding pattern
    for(let i=0;i<6;i++){
      const a = i/6*Math.PI*2;
      ctx.beginPath(); ctx.moveTo(x+Math.cos(a)*S*.22, y-S*.15+Math.sin(a)*S*.22);
      ctx.lineTo(x+Math.cos(a)*S*.55, y-S*.15+Math.sin(a)*S*.5); ctx.stroke();
    }
    // Shell highlight
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(x-S*.15, y-S*.32, S*.3, S*.2, -0.4, 0, Math.PI*2); ctx.fill();
    // Shell rim — darker edge
    ctx.strokeStyle = '#3a5218'; ctx.lineWidth = S*.08;
    ctx.beginPath(); ctx.ellipse(x, y-S*.1, S*.7, S*.55, 0, 0, Math.PI*2); ctx.stroke();
    // Head peeking from front
    ctx.fillStyle = '#7a9a48';
    ctx.beginPath(); ctx.ellipse(x, y+S*.32, S*.22, S*.18, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x, y+S*.22, S*.18, S*.2, 0, 0, Math.PI*2); ctx.fill();
    // Beady suspicious eyes
    ctx.fillStyle = '#ffd020';
    ctx.beginPath(); ctx.arc(x-S*.1, y+S*.26, S*.08, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.1, y+S*.26, S*.08, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1a0800';
    ctx.beginPath(); ctx.arc(x-S*.1, y+S*.26, S*.04, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.1, y+S*.26, S*.04, 0, Math.PI*2); ctx.fill();
    // Scaly legs
    ctx.fillStyle = '#6a8a38';
    ctx.beginPath(); ctx.ellipse(x-S*.55, y+S*.28, S*.14, S*.22, 0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+S*.55, y+S*.28, S*.14, S*.22, -0.3, 0, Math.PI*2); ctx.fill();
  },

  // COLOSSUS — stone-plated giant, cracked exterior, glowing core
  colossus(ctx, x, y, s) {
    const S = s;
    // Body — massive stone form
    ctx.fillStyle = '#4a5a64';
    ctx.beginPath(); ctx.ellipse(x, y, S*.78, S*.88, 0, 0, Math.PI*2); ctx.fill();
    // Stone plate textures
    ctx.fillStyle = '#38484e';
    ctx.beginPath(); ctx.roundRect(x-S*.65, y-S*.55, S*.38, S*.3, S*.04); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x+S*.28, y-S*.55, S*.38, S*.3, S*.04); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x-S*.6, y-S*.18, S*.32, S*.28, S*.04); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x+S*.28, y-S*.18, S*.32, S*.28, S*.04); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x-S*.32, y-S*.62, S*.64, S*.28, S*.04); ctx.fill();
    // Cracks — glowing magma inside
    ctx.strokeStyle = '#ff4400'; ctx.lineWidth = S*.04;
    ctx.shadowBlur = 6; ctx.shadowColor = '#ff6600';
    ctx.beginPath(); ctx.moveTo(x-S*.1, y-S*.4); ctx.lineTo(x+S*.18, y-S*.1); ctx.lineTo(x+S*.05, y+S*.25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-S*.4, y+S*.1); ctx.lineTo(x-S*.2, y+S*.35); ctx.stroke();
    ctx.shadowBlur = 0;
    // Glowing chest core
    const cg = ctx.createRadialGradient(x, y+S*.1, 0, x, y+S*.1, S*.28);
    cg.addColorStop(0,'rgba(255,120,0,0.8)'); cg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(x, y+S*.1, S*.28, 0, Math.PI*2); ctx.fill();
    // Face plate
    ctx.fillStyle = '#2e3a40';
    ctx.beginPath(); ctx.ellipse(x, y-S*.55, S*.35, S*.28, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1a2228';
    ctx.beginPath(); ctx.roundRect(x-S*.28, y-S*.65, S*.56, S*.14, S*.04); ctx.fill();
    // Eye scanners — red
    ctx.fillStyle = '#ff1111';
    ctx.shadowBlur = 10; ctx.shadowColor = '#ff0000';
    ctx.beginPath(); ctx.arc(x-S*.18, y-S*.56, S*.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.18, y-S*.56, S*.1, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
  },

  // WRAITH — ink-dark shade, smoky edges, single vertical eye
  wraith(ctx, x, y, s) {
    const S = s;
    const t = Date.now() * 0.002;
    const bob = Math.sin(t*1.3) * S * 0.05;
    // Smoke wisps
    for(let i=0;i<5;i++){
      const a = (i/5)*Math.PI*2 + t;
      const r = S*(0.7 + 0.2*Math.sin(t+i));
      ctx.globalAlpha *= 0.25;
      ctx.fillStyle = '#4a0070';
      ctx.beginPath(); ctx.arc(x+Math.cos(a)*r, y+bob+Math.sin(a)*r*.7, S*.22, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha /= 0.25;
    }
    // Body — elongated shadow
    ctx.fillStyle = '#1a0030';
    ctx.beginPath(); ctx.ellipse(x, y+bob, S*.38, S*.72, 0, 0, Math.PI*2); ctx.fill();
    // Purple sheen
    const wg = ctx.createRadialGradient(x, y-S*.2+bob, 0, x, y+bob, S*.65);
    wg.addColorStop(0,'rgba(120,0,180,0.5)'); wg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = wg; ctx.beginPath(); ctx.arc(x, y+bob, S*.65, 0, Math.PI*2); ctx.fill();
    // Flowing hood-like top
    ctx.fillStyle = '#220040';
    ctx.beginPath();
    ctx.arc(x, y-S*.28+bob, S*.35, -Math.PI, 0);
    ctx.lineTo(x+S*.5, y+bob);
    ctx.bezierCurveTo(x+S*.6, y+S*.35+bob, x+S*.35, y+S*.7+bob, x, y+S*.82+bob);
    ctx.bezierCurveTo(x-S*.35, y+S*.7+bob, x-S*.6, y+S*.35+bob, x-S*.5, y+bob);
    ctx.closePath(); ctx.fill();
    // Single vertical slit eye — glowing
    ctx.fillStyle = '#cc00ff';
    ctx.shadowBlur = 12; ctx.shadowColor = '#aa00ff';
    ctx.beginPath(); ctx.ellipse(x, y-S*.2+bob, S*.08, S*.22, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ee88ff';
    ctx.beginPath(); ctx.ellipse(x, y-S*.2+bob, S*.04, S*.14, 0, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    // Clawed hands emerging
    ctx.strokeStyle = '#3a0058'; ctx.lineWidth = S*.08; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x-S*.4, y+S*.08+bob); ctx.lineTo(x-S*.62, y+bob); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-S*.42, y+S*.08+bob); ctx.lineTo(x-S*.66, y+S*.12+bob); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S*.4, y+S*.08+bob); ctx.lineTo(x+S*.62, y+bob); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S*.42, y+S*.08+bob); ctx.lineTo(x+S*.66, y+S*.12+bob); ctx.stroke();
  },

  // BLOODHOUND — hunched feral beast, visible spine, glowing red eyes, bared teeth
  bloodhound(ctx, x, y, s) {
    const S = s;
    // Low slung body
    ctx.fillStyle = '#8a1818';
    ctx.beginPath(); ctx.ellipse(x, y+S*.1, S*.72, S*.42, 0, 0, Math.PI*2); ctx.fill();
    // Spine ridges
    ctx.fillStyle = '#5c0a0a';
    for(let i=0;i<5;i++){
      ctx.beginPath();
      ctx.moveTo(x-S*.5+i*S*.25, y-S*.1);
      ctx.lineTo(x-S*.44+i*S*.25, y-S*.3);
      ctx.lineTo(x-S*.38+i*S*.25, y-S*.1);
      ctx.fill();
    }
    // Legs — four stumpy ones
    ctx.strokeStyle = '#6a1010'; ctx.lineWidth = S*.16; ctx.lineCap = 'round';
    [[-S*.52,S*.35],[-S*.24,S*.4],[S*.18,S*.4],[S*.48,S*.35]].forEach(([lx,ly])=>{
      ctx.beginPath(); ctx.moveTo(x+lx, y+S*.22); ctx.lineTo(x+lx*1.1, y+ly); ctx.stroke();
    });
    // Wedge head
    ctx.fillStyle = '#7a1010';
    ctx.beginPath();
    ctx.moveTo(x+S*.48, y-S*.02);
    ctx.lineTo(x+S*.88, y-S*.12);
    ctx.lineTo(x+S*.95, y+S*.08);
    ctx.lineTo(x+S*.82, y+S*.22);
    ctx.lineTo(x+S*.48, y+S*.2);
    ctx.closePath(); ctx.fill();
    // Muzzle
    ctx.fillStyle = '#5c0a0a';
    ctx.beginPath(); ctx.ellipse(x+S*.88, y+S*.05, S*.1, S*.07, 0, 0, Math.PI*2); ctx.fill();
    // Snout teeth
    ctx.fillStyle = '#e8e0c0';
    for(let i=0;i<3;i++) {
      ctx.beginPath();
      ctx.moveTo(x+S*.78+i*S*.06, y+S*.06);
      ctx.lineTo(x+S*.82+i*S*.06, y+S*.18);
      ctx.lineTo(x+S*.76+i*S*.06, y+S*.18);
      ctx.closePath(); ctx.fill();
    }
    // Burning eyes — yellow with red rim
    ctx.fillStyle = '#ff6600';
    ctx.shadowBlur = 8; ctx.shadowColor = '#ff2200';
    ctx.beginPath(); ctx.arc(x+S*.6, y-S*.08, S*.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath(); ctx.arc(x+S*.6, y-S*.08, S*.05, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    // Tail raised
    ctx.strokeStyle = '#7a1010'; ctx.lineWidth = S*.1;
    ctx.beginPath(); ctx.moveTo(x-S*.65, y+S*.05); ctx.quadraticCurveTo(x-S*.95, y-S*.2, x-S*.88, y-S*.45); ctx.stroke();
  },

  // PLAGUE CARRIER — swollen tumor body, buboes, leaking dark fluid
  plague_carrier(ctx, x, y, s) {
    const S = s;
    // Dark fluid pool
    ctx.fillStyle = 'rgba(0,40,0,0.4)';
    ctx.beginPath(); ctx.ellipse(x, y+S*.8, S*.6, S*.18, 0, 0, Math.PI*2); ctx.fill();
    // Main body — grotesquely swollen
    ctx.fillStyle = '#2a5a18';
    ctx.beginPath(); ctx.ellipse(x, y, S*.82, S*.88, 0, 0, Math.PI*2); ctx.fill();
    // Tumors / buboes — dark lumps
    ctx.fillStyle = '#1a3a0a';
    [[x-S*.55,y-S*.3,S*.22],[x+S*.5,y-S*.1,S*.2],[x-S*.4,y+S*.45,S*.18],[x+S*.45,y+S*.38,S*.22],[x,y-S*.65,S*.19]].forEach(([bx,by,br])=>{
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI*2); ctx.fill();
    });
    // Pustule tops
    ctx.fillStyle = '#8aba30';
    [[x-S*.55,y-S*.38,S*.08],[x+S*.5,y-S*.18,S*.07],[x,y-S*.72,S*.07]].forEach(([bx,by,br])=>{
      ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI*2); ctx.fill();
    });
    // Sunken skull face
    ctx.fillStyle = '#1a3a0a';
    ctx.beginPath(); ctx.ellipse(x, y-S*.1, S*.28, S*.26, 0, 0, Math.PI*2); ctx.fill();
    // Hollow eye sockets
    ctx.fillStyle = '#aad030';
    ctx.shadowBlur = 8; ctx.shadowColor = '#88cc00';
    ctx.beginPath(); ctx.arc(x-S*.14, y-S*.16, S*.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.14, y-S*.16, S*.1, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#223800';
    ctx.beginPath(); ctx.arc(x-S*.14, y-S*.16, S*.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.14, y-S*.16, S*.05, 0, Math.PI*2); ctx.fill();
    // Mouth — dripping
    ctx.fillStyle = '#0a1e00';
    ctx.beginPath(); ctx.ellipse(x, y+S*.08, S*.2, S*.12, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#4a8a10'; ctx.lineWidth = S*.05; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x-S*.08, y+S*.2); ctx.lineTo(x-S*.06, y+S*.42); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S*.08, y+S*.2); ctx.lineTo(x+S*.1, y+S*.38); ctx.stroke();
  },

  // TITAN GUARDIAN — massive suit of mechanical armor, gatling cannon shoulder mount
  titan_guardian(ctx, x, y, s) {
    const S = s;
    // Base body — thick hexagonal torso
    ctx.fillStyle = '#1e2a30';
    ctx.beginPath(); ctx.arc(x, y, S*.88, 0, Math.PI*2); ctx.fill();
    // Chest armor layers
    ctx.fillStyle = '#263840';
    ctx.beginPath(); ctx.ellipse(x, y-S*.1, S*.65, S*.55, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#1a2830';
    ctx.fillRect(x-S*.55, y-S*.18, S*1.1, S*.1);
    ctx.fillRect(x-S*.5, y+S*.05, S*1.0, S*.08);
    // Shoulder cannon — right side
    ctx.fillStyle = '#2e3e48';
    ctx.beginPath(); ctx.roundRect(x+S*.55, y-S*.6, S*.38, S*.28, S*.05); ctx.fill();
    ctx.fillStyle = '#1a2830';
    for(let i=0;i<3;i++) {
      ctx.beginPath(); ctx.roundRect(x+S*.58+i*S*.1, y-S*.52, S*.07, S*.3, S*.03); ctx.fill();
    }
    // Rocket pod — left shoulder
    ctx.fillStyle = '#2e3e48';
    ctx.beginPath(); ctx.roundRect(x-S*.92, y-S*.55, S*.3, S*.42, S*.05); ctx.fill();
    for(let i=0;i<3;i++) {
      ctx.fillStyle = '#1a2830';
      ctx.beginPath(); ctx.ellipse(x-S*.77, y-S*.5+i*S*.14, S*.08, S*.06, 0, 0, Math.PI*2); ctx.fill();
    }
    // Head unit — angular
    ctx.fillStyle = '#263840';
    ctx.beginPath(); ctx.roundRect(x-S*.3, y-S*.88, S*.6, S*.4, S*.06); ctx.fill();
    ctx.fillStyle = '#1a2830';
    ctx.beginPath(); ctx.roundRect(x-S*.28, y-S*.85, S*.56, S*.35, S*.05); ctx.fill();
    // Visor — single wide scanner slit
    ctx.fillStyle = '#ff1133';
    ctx.shadowBlur = 14; ctx.shadowColor = '#ff0020';
    ctx.beginPath(); ctx.roundRect(x-S*.22, y-S*.72, S*.44, S*.1, S*.04); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,20,50,0.25)';
    ctx.beginPath(); ctx.roundRect(x-S*.22, y-S*.72, S*.44, S*.1, S*.04); ctx.fill();
  },

  // VOID RIFT — swirling portal entity, rings of distortion, reaching hands
  void_rift(ctx, x, y, s) {
    const S = s;
    const t = Date.now() * 0.002;
    // Distortion rings — rotating
    for(let ring=3;ring>=0;ring--){
      const rot = t * (ring%2===0?1:-1) * (1+ring*.3);
      ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
      ctx.strokeStyle = `rgba(${80+ring*40},0,${180+ring*20},${0.5-ring*.08})`;
      ctx.lineWidth = S*(0.06+ring*.02);
      ctx.setLineDash([S*(0.2+ring*.05), S*(0.15+ring*.03)]);
      ctx.beginPath(); ctx.arc(0, 0, S*(0.28+ring*.2), 0, Math.PI*2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
    // Dark center
    const vg = ctx.createRadialGradient(x,y,0,x,y,S*.55);
    vg.addColorStop(0,'rgba(10,0,30,1)'); vg.addColorStop(0.4,'rgba(50,0,100,0.8)'); vg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = vg; ctx.beginPath(); ctx.arc(x, y, S*.55, 0, Math.PI*2); ctx.fill();
    // Event horizon glow
    ctx.strokeStyle = '#8800ff';
    ctx.shadowBlur = 16; ctx.shadowColor = '#aa00ff';
    ctx.lineWidth = S*.08;
    ctx.beginPath(); ctx.arc(x, y, S*.28, 0, Math.PI*2); ctx.stroke();
    ctx.shadowBlur = 0;
    // Core — white singularity
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 20; ctx.shadowColor = '#cc88ff';
    ctx.beginPath(); ctx.arc(x, y, S*.1, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    // Warped hand reaching out
    ctx.strokeStyle = 'rgba(100,0,200,0.7)'; ctx.lineWidth = S*.09; ctx.lineCap = 'round';
    const ha = Math.sin(t)*0.4;
    ctx.beginPath(); ctx.moveTo(x+S*.28, y+S*.08); ctx.lineTo(x+S*.65, y+S*.05+Math.sin(t)*S*.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S*.62, y+S*.02+Math.sin(t)*S*.1); ctx.lineTo(x+S*.76, y-S*.08); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S*.62, y+S*.02+Math.sin(t)*S*.1); ctx.lineTo(x+S*.78, y+S*.08); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+S*.62, y+S*.02+Math.sin(t)*S*.1); ctx.lineTo(x+S*.74, y+S*.18); ctx.stroke();
  },

  // BOSS ZOMBIE KING — massive crowned undead monarch, dark robe with gold trim
  boss_zombie_king(ctx, x, y, s) {
    const S = s;
    const t = Date.now() * 0.002;

    // Aura — purple mist rising
    for (let i = 0; i < 4; i++) {
      const a = i / 4 * Math.PI * 2 + t;
      const rx = x + Math.cos(a) * S * 0.7, ry = y + Math.sin(a) * S * 0.5;
      ctx.globalAlpha *= 0.2;
      ctx.fillStyle = '#6a00aa';
      ctx.beginPath(); ctx.arc(rx, ry, S*0.35, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha /= 0.2;
    }

    // Robe base — dark sweeping shape with scalloped hem
    ctx.fillStyle = '#2a0058';
    ctx.beginPath();
    ctx.moveTo(x-S*0.65, y+S*0.3);
    ctx.bezierCurveTo(x-S*0.8, y+S*0.75, x-S*0.55, y+S*1.1, x, y+S*1.05);
    ctx.bezierCurveTo(x+S*0.55, y+S*1.1, x+S*0.8, y+S*0.75, x+S*0.65, y+S*0.3);
    ctx.lineTo(x+S*0.58, y-S*0.25);
    ctx.lineTo(x-S*0.58, y-S*0.25);
    ctx.closePath(); ctx.fill();
    // Robe scalloped hem detail
    ctx.fillStyle = '#3a007a';
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath(); ctx.arc(x+i*S*0.28, y+S*1.05, S*0.2, 0, Math.PI*2); ctx.fill();
    }
    // Gold trim along robe edges
    ctx.strokeStyle = '#d4a820'; ctx.lineWidth = S*0.06;
    ctx.beginPath();
    ctx.moveTo(x-S*0.65, y+S*0.3);
    ctx.bezierCurveTo(x-S*0.8, y+S*0.75, x-S*0.55, y+S*1.1, x, y+S*1.05);
    ctx.bezierCurveTo(x+S*0.55, y+S*1.1, x+S*0.8, y+S*0.75, x+S*0.65, y+S*0.3);
    ctx.stroke();
    // Robe center split
    ctx.strokeStyle = '#d4a820'; ctx.lineWidth = S*0.04;
    ctx.beginPath(); ctx.moveTo(x, y-S*0.25); ctx.lineTo(x, y+S*1.05); ctx.stroke();
    // Gold rune circles on robe
    ctx.strokeStyle = 'rgba(212,168,32,0.4)'; ctx.lineWidth = S*0.03;
    [[-S*0.3, S*0.2],[S*0.3, S*0.25],[-S*0.15, S*0.6],[S*0.15, S*0.65]].forEach(([rx2,ry2]) => {
      ctx.beginPath(); ctx.arc(x+rx2, y+ry2, S*0.12, 0, Math.PI*2); ctx.stroke();
    });

    // Ribcage visible through robe
    ctx.strokeStyle = 'rgba(180,150,100,0.3)'; ctx.lineWidth = S*0.04;
    for (let r = 0; r < 4; r++) {
      ctx.beginPath(); ctx.arc(x, y-S*0.05+r*S*0.18, S*0.22, -Math.PI*0.7, -Math.PI*0.3); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y-S*0.05+r*S*0.18, S*0.22, -Math.PI*0.7, -Math.PI*0.3, true); ctx.stroke();
    }

    // Scepter — long dark staff with glowing gem
    ctx.strokeStyle = '#8a6810'; ctx.lineWidth = S*0.08; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x+S*0.78, y-S*0.9); ctx.lineTo(x+S*0.72, y+S*0.75); ctx.stroke();
    // Scepter orb
    const orbGlow = ctx.createRadialGradient(x+S*0.78, y-S*0.98, 0, x+S*0.78, y-S*0.98, S*0.22);
    orbGlow.addColorStop(0, '#ff4444'); orbGlow.addColorStop(0.5, '#cc0000'); orbGlow.addColorStop(1, 'rgba(100,0,0,0)');
    ctx.fillStyle = orbGlow; ctx.beginPath(); ctx.arc(x+S*0.78, y-S*0.98, S*0.22, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ee2222';
    ctx.shadowBlur = 15; ctx.shadowColor = '#ff0000';
    ctx.beginPath(); ctx.arc(x+S*0.78, y-S*0.98, S*0.14, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffaaaa';
    ctx.beginPath(); ctx.arc(x+S*0.72, y-S*1.04, S*0.05, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    // Neck
    ctx.fillStyle = '#7a6248';
    ctx.fillRect(x-S*0.12, y-S*0.5, S*0.24, S*0.28);

    // Head — wide skull, weathered
    ctx.fillStyle = '#8c7054';
    ctx.beginPath(); ctx.ellipse(x, y-S*0.72, S*0.42, S*0.4, 0, 0, Math.PI*2); ctx.fill();
    // Head shading
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(x+S*0.12, y-S*0.7, S*0.25, S*0.35, 0.1, 0, Math.PI*2); ctx.fill();

    // CROWN — multi-spike with jewels
    ctx.fillStyle = '#d4a820';
    ctx.beginPath();
    ctx.moveTo(x-S*0.42, y-S*1.0);
    const spikes = [[-0.42,1.0],[-0.3,1.42],[-0.18,0.98],[0,1.5],[0.18,0.98],[0.3,1.42],[0.42,1.0],[0.42,0.85],[-0.42,0.85]];
    spikes.forEach(([sx2,sy2]) => ctx.lineTo(x+S*sx2, y-S*sy2));
    ctx.closePath(); ctx.fill();
    // Crown inner band
    ctx.fillStyle = '#b88c10';
    ctx.fillRect(x-S*0.42, y-S*1.04, S*0.84, S*0.18);
    // Crown jewels
    ctx.fillStyle = '#cc2222'; ctx.shadowBlur = 8; ctx.shadowColor = '#ff0000';
    ctx.beginPath(); ctx.arc(x-S*0.3, y-S*1.42, S*0.09, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#2288ee'; ctx.shadowColor = '#0066ff';
    ctx.beginPath(); ctx.arc(x, y-S*1.5, S*0.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#22aa44'; ctx.shadowColor = '#00ff44';
    ctx.beginPath(); ctx.arc(x+S*0.3, y-S*1.42, S*0.09, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    // Jaw — dropped, showing teeth
    ctx.fillStyle = '#7a6040';
    ctx.beginPath(); ctx.ellipse(x, y-S*0.5, S*0.3, S*0.16, 0, 0, Math.PI*1.05); ctx.fill();
    // Teeth — 4 large
    ctx.fillStyle = '#e0d8b0';
    for (let t2 = 0; t2 < 4; t2++) {
      const tx = x - S*0.22 + t2*S*0.15;
      ctx.beginPath(); ctx.moveTo(tx, y-S*0.58); ctx.lineTo(tx+S*0.055, y-S*0.42); ctx.lineTo(tx+S*0.11, y-S*0.58); ctx.fill();
    }

    // THREE EYES — glowing orange
    ctx.fillStyle = '#ff8800';
    ctx.shadowBlur = 12; ctx.shadowColor = '#ff5500';
    [[x-S*0.2, y-S*0.78],[x+S*0.2, y-S*0.78],[x, y-S*0.64]].forEach(([ex, ey]) => {
      ctx.fillStyle = '#ff8800';
      ctx.beginPath(); ctx.arc(ex, ey, S*0.1, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#ffd040';
      ctx.beginPath(); ctx.arc(ex, ey, S*0.055, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#1a0000';
      ctx.beginPath(); ctx.arc(ex, ey, S*0.025, 0, Math.PI*2); ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Bony hands gripping robe/scepter
    ctx.fillStyle = '#8c7054';
    ctx.beginPath(); ctx.ellipse(x+S*0.62, y+S*0.05, S*0.1, S*0.16, -0.2, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#5a4030'; ctx.lineWidth = S*0.04;
    for (let f = 0; f < 3; f++) {
      ctx.beginPath(); ctx.moveTo(x+S*0.62, y+S*0.12); ctx.lineTo(x+S*0.58+f*S*0.06, y+S*0.28); ctx.stroke();
    }
  },

  // BOSS UNDEAD TITAN — colossal stone giant, crumbling, lava veins
  boss_undead_titan(ctx, x, y, s) {
    const S = s;
    // Massive rough body
    ctx.fillStyle = '#2e2e2e';
    ctx.beginPath(); ctx.arc(x, y, S*.92, 0, Math.PI*2); ctx.fill();
    // Stone slab texture — big cracked sections
    ctx.fillStyle = '#222222';
    ctx.beginPath(); ctx.roundRect(x-S*.8, y-S*.7, S*.45, S*.55, S*.05); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x+S*.35, y-S*.7, S*.46, S*.55, S*.05); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x-S*.78, y-S*.08, S*.4, S*.52, S*.05); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x+S*.38, y-S*.08, S*.4, S*.52, S*.05); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x-S*.38, y+S*.5, S*.76, S*.38, S*.05); ctx.fill();
    // Lava crack network
    ctx.strokeStyle = '#ff4400'; ctx.lineWidth = S*.05;
    ctx.shadowBlur = 8; ctx.shadowColor = '#ff6600';
    const cracks = [[x-S*.4,y-S*.5,x+S*.1,y-S*.2],[x+S*.1,y-S*.2,x+S*.35,y+S*.3],[x-S*.4,y+S*.1,x-S*.1,y+S*.55],[x+S*.35,y+S*.3,x+S*.1,y+S*.65],[x-S*.6,y-S*.1,x-S*.4,y+S*.1]];
    cracks.forEach(([x1,y1,x2,y2])=>{ ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); });
    ctx.shadowBlur = 0;
    // Glowing lava at core
    const lg = ctx.createRadialGradient(x,y+S*.2,0,x,y+S*.2,S*.45);
    lg.addColorStop(0,'rgba(255,100,0,0.55)'); lg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(x, y+S*.2, S*.45, 0, Math.PI*2); ctx.fill();
    // Face — carved square hollows
    ctx.fillStyle = '#111111';
    ctx.beginPath(); ctx.roundRect(x-S*.3, y-S*.7, S*.22, S*.3, S*.03); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x+S*.08, y-S*.7, S*.22, S*.3, S*.03); ctx.fill();
    // Eye fire
    ctx.fillStyle = '#ff3300';
    ctx.shadowBlur = 16; ctx.shadowColor = '#ff6600';
    ctx.beginPath(); ctx.arc(x-S*.19, y-S*.56, S*.1, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.19, y-S*.56, S*.1, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath(); ctx.arc(x-S*.19, y-S*.56, S*.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.19, y-S*.56, S*.05, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    // Fissure mouth
    ctx.fillStyle = '#1a0000';
    ctx.beginPath(); ctx.moveTo(x-S*.38, y-S*.18); ctx.lineTo(x+S*.38, y-S*.18); ctx.lineTo(x+S*.32, y-S*.04); ctx.lineTo(x-S*.32, y-S*.04); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#ff5500'; ctx.lineWidth = S*.04;
    ctx.shadowBlur = 6; ctx.shadowColor = '#ff4400';
    ctx.beginPath(); ctx.moveTo(x-S*.38, y-S*.18); ctx.lineTo(x+S*.38, y-S*.18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-S*.32, y-S*.04); ctx.lineTo(x+S*.32, y-S*.04); ctx.stroke();
    ctx.shadowBlur = 0;
  },

  // BOSS SHADOW LORD — void-cloaked figure, pulsing dark energy, crown of eyes
  boss_shadow_lord(ctx, x, y, s) {
    const S = s;
    const t = Date.now() * 0.0025;
    // Outer void corona
    const vc = ctx.createRadialGradient(x,y,S*.3,x,y,S*1.1);
    vc.addColorStop(0,'rgba(30,0,60,0.7)'); vc.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = vc; ctx.beginPath(); ctx.arc(x, y, S*1.1, 0, Math.PI*2); ctx.fill();
    // Tentacle arms — six
    ctx.strokeStyle = '#1a0035'; ctx.lineWidth = S*.14; ctx.lineCap = 'round';
    for(let i=0;i<6;i++){
      const a = (i/6)*Math.PI*2 + t;
      const ax = x + Math.cos(a)*S*(0.72+Math.sin(t*2+i)*.15);
      const ay = y + Math.sin(a)*S*(0.72+Math.sin(t*2+i)*.15);
      const mx = x + Math.cos(a+0.5)*S*.4;
      const my = y + Math.sin(a+0.5)*S*.4;
      ctx.beginPath(); ctx.moveTo(x+Math.cos(a)*S*.25, y+Math.sin(a)*S*.25);
      ctx.quadraticCurveTo(mx, my, ax, ay); ctx.stroke();
    }
    // Body — billowing dark robes
    ctx.fillStyle = '#0a0010';
    ctx.beginPath(); ctx.ellipse(x, y+S*.12, S*.55, S*.78, 0, 0, Math.PI*2); ctx.fill();
    // Robe detail — purple sheen
    const rg = ctx.createRadialGradient(x-S*.15, y-S*.1, 0, x, y+S*.1, S*.65);
    rg.addColorStop(0,'rgba(80,0,140,0.4)'); rg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = rg; ctx.beginPath(); ctx.ellipse(x, y+S*.12, S*.55, S*.78, 0, 0, Math.PI*2); ctx.fill();
    // Head — faceless void
    ctx.fillStyle = '#0a0010';
    ctx.beginPath(); ctx.ellipse(x, y-S*.55, S*.33, S*.36, 0, 0, Math.PI*2); ctx.fill();
    // Crown of eyes — semicircle above head
    ctx.fillStyle = '#cc00ff';
    ctx.shadowBlur = 12; ctx.shadowColor = '#aa00ff';
    for(let i=0;i<5;i++){
      const a = -Math.PI + (i+1)/6*Math.PI;
      const er = S*.42;
      const ex = x + Math.cos(a)*er;
      const ey = (y-S*.55) + Math.sin(a)*er;
      const pulse = S*(.07 + .03*Math.sin(t*2+i));
      ctx.beginPath(); ctx.arc(ex, ey, pulse, 0, Math.PI*2); ctx.fill();
    }
    ctx.shadowBlur = 0;
    // Main two eyes on face — large
    ctx.fillStyle = '#dd00ff';
    ctx.shadowBlur = 18; ctx.shadowColor = '#cc00ff';
    ctx.beginPath(); ctx.ellipse(x-S*.16, y-S*.58, S*.12+Math.sin(t)*.03, S*.16+Math.sin(t)*.02, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+S*.16, y-S*.58, S*.12+Math.sin(t+1)*.03, S*.16+Math.sin(t+1)*.02, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(x-S*.16, y-S*.58, S*.05, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+S*.16, y-S*.58, S*.05, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
  },

  // BOSS COLOSSUS PRIME — titanium-plated megabot
  boss_colossus_prime(ctx, x, y, s) {
    const S = s;
    // Core hull
    ctx.fillStyle = '#263844';
    ctx.beginPath(); ctx.arc(x, y, S*.9, 0, Math.PI*2); ctx.fill();
    // Armor plates — thick overlapping
    ctx.fillStyle = '#1e2e38';
    ctx.beginPath(); ctx.roundRect(x-S*.8, y-S*.6, S*.5, S*.5, S*.05); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x+S*.3, y-S*.6, S*.5, S*.5, S*.05); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x-S*.82, y+S*.05, S*.5, S*.5, S*.05); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x+S*.32, y+S*.05, S*.5, S*.5, S*.05); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x-S*.45, y-S*.8, S*.9, S*.28, S*.06); ctx.fill();
    // Gold highlight trim
    ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = S*.04;
    ctx.beginPath(); ctx.roundRect(x-S*.45, y-S*.8, S*.9, S*.28, S*.06); ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, S*.9, 0, Math.PI*2); ctx.stroke();
    // Visor — wide scanline
    ctx.fillStyle = '#0a1820';
    ctx.beginPath(); ctx.roundRect(x-S*.38, y-S*.72, S*.76, S*.22, S*.05); ctx.fill();
    ctx.fillStyle = '#ff1133';
    ctx.shadowBlur = 16; ctx.shadowColor = '#ff0030';
    ctx.beginPath(); ctx.roundRect(x-S*.34, y-S*.68, S*.68, S*.14, S*.04); ctx.fill();
    ctx.shadowBlur = 0;
    // Cross-hairs in visor
    ctx.strokeStyle = 'rgba(255,0,0,0.4)'; ctx.lineWidth = S*.02;
    ctx.beginPath(); ctx.moveTo(x, y-S*.72); ctx.lineTo(x, y-S*.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x-S*.38, y-S*.61); ctx.lineTo(x+S*.38, y-S*.61); ctx.stroke();
    // Chest power core
    const pcg = ctx.createRadialGradient(x, y+S*.15, 0, x, y+S*.15, S*.32);
    pcg.addColorStop(0,'rgba(255,200,0,0.9)'); pcg.addColorStop(0.4,'rgba(255,80,0,0.5)'); pcg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = pcg; ctx.beginPath(); ctx.arc(x, y+S*.15, S*.32, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff8c0';
    ctx.shadowBlur = 20; ctx.shadowColor = '#ffd700';
    ctx.beginPath(); ctx.arc(x, y+S*.15, S*.1, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    // Shoulder cannons
    ctx.fillStyle = '#1a2830';
    ctx.beginPath(); ctx.roundRect(x-S*.98, y-S*.62, S*.22, S*.48, S*.04); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x+S*.76, y-S*.62, S*.22, S*.48, S*.04); ctx.fill();
    ctx.fillStyle = '#0e1820';
    for(let i=0;i<3;i++){
      ctx.beginPath(); ctx.roundRect(x-S*.95, y-S*.58+i*S*.14, S*.16, S*.1, S*.02); ctx.fill();
      ctx.beginPath(); ctx.roundRect(x+S*.79, y-S*.58+i*S*.14, S*.16, S*.1, S*.02); ctx.fill();
    }
  },

  // BOSS VOID EMPEROR — cosmic horror, multiple arms, event horizon crown
  boss_void_emperor(ctx, x, y, s) {
    const S = s;
    const t = Date.now() * 0.002;
    // Cosmic nebula background glow
    const ng = ctx.createRadialGradient(x, y, 0, x, y, S*1.2);
    ng.addColorStop(0,'rgba(50,0,100,0.6)'); ng.addColorStop(0.6,'rgba(20,0,50,0.3)'); ng.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(x, y, S*1.2, 0, Math.PI*2); ctx.fill();
    // Six arms spiraling
    for(let i=0;i<6;i++){
      const a = (i/6)*Math.PI*2 + t*0.6;
      const len = S*(1.0 + 0.2*Math.sin(t+i));
      ctx.strokeStyle = `rgba(${100+i*20},0,${180+i*10},0.7)`;
      ctx.lineWidth = S*(0.12-i*.015);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x+Math.cos(a)*S*.28, y+Math.sin(a)*S*.28);
      ctx.bezierCurveTo(
        x+Math.cos(a+0.6)*S*.6, y+Math.sin(a+0.6)*S*.6,
        x+Math.cos(a+1.1)*S*.9, y+Math.sin(a+1.1)*S*.9,
        x+Math.cos(a)*len, y+Math.sin(a)*len
      );
      ctx.stroke();
    }
    // Main body — dark with cosmic shimmer
    ctx.fillStyle = '#100020';
    ctx.beginPath(); ctx.arc(x, y, S*.7, 0, Math.PI*2); ctx.fill();
    const csg = ctx.createRadialGradient(x-S*.2, y-S*.2, 0, x, y, S*.7);
    csg.addColorStop(0,'rgba(140,0,255,0.3)'); csg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = csg; ctx.beginPath(); ctx.arc(x, y, S*.7, 0, Math.PI*2); ctx.fill();
    // Crown of orbit rings
    ctx.save(); ctx.translate(x, y-S*.7); ctx.rotate(t);
    ctx.strokeStyle = 'rgba(200,100,255,0.7)'; ctx.lineWidth = S*.05;
    ctx.beginPath(); ctx.ellipse(0, 0, S*.4, S*.15, 0, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
    ctx.save(); ctx.translate(x, y-S*.7); ctx.rotate(-t*1.5);
    ctx.strokeStyle = 'rgba(255,50,200,0.5)'; ctx.lineWidth = S*.03;
    ctx.beginPath(); ctx.ellipse(0, 0, S*.32, S*.12, Math.PI*.3, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
    // Face — three eyes arranged vertically
    ctx.fillStyle = '#cc00ff';
    ctx.shadowBlur = 14; ctx.shadowColor = '#aa00ff';
    [[x, y-S*.35], [x-S*.2, y-S*.08], [x+S*.2, y-S*.08]].forEach(([ex,ey])=>{
      ctx.beginPath(); ctx.arc(ex, ey, S*.12+Math.sin(t)*.03, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex, ey, S*.06, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#cc00ff';
    });
    ctx.shadowBlur = 0;
    // Gold boss halo ring
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = S*.08;
    ctx.shadowBlur = 10; ctx.shadowColor = '#ffd700';
    ctx.beginPath(); ctx.arc(x, y, S*.92, 0, Math.PI*2); ctx.stroke();
    ctx.shadowBlur = 0;
  },

  // BOSS OMEGA DESTROYER — final form, pure crimson annihilation machine
  boss_omega_destroyer(ctx, x, y, s) {
    const S = s;
    const t = Date.now() * 0.002;
    // Pulsing energy field
    const ef = ctx.createRadialGradient(x, y, S*.4, x, y, S*1.25);
    ef.addColorStop(0,'rgba(200,0,30,0.0)'); ef.addColorStop(0.7,'rgba(150,0,20,0.2)'); ef.addColorStop(1,'rgba(80,0,0,0.5)');
    ctx.fillStyle = ef; ctx.beginPath(); ctx.arc(x, y, S*1.25, 0, Math.PI*2); ctx.fill();
    // Four massive bladed arms
    for(let i=0;i<4;i++){
      const a = (i/4)*Math.PI*2 + t*.5;
      ctx.save(); ctx.translate(x,y); ctx.rotate(a);
      ctx.fillStyle = '#7a0000';
      ctx.beginPath();
      ctx.moveTo(0, -S*.35);
      ctx.lineTo(-S*.12, -S*.5);
      ctx.lineTo(-S*.08, -S*.95);
      ctx.lineTo(S*.08, -S*.95);
      ctx.lineTo(S*.12, -S*.5);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#aa0010';
      ctx.beginPath(); ctx.moveTo(0,-S*.35); ctx.lineTo(0,-S*.9); ctx.lineTo(S*.05,-S*.5); ctx.closePath(); ctx.fill();
      // Blade edge glow
      ctx.strokeStyle = '#ff3020'; ctx.lineWidth = S*.02;
      ctx.shadowBlur = 6; ctx.shadowColor = '#ff0020';
      ctx.beginPath(); ctx.moveTo(-S*.08,-S*.95); ctx.lineTo(0,-S*.95); ctx.lineTo(S*.08,-S*.95); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
    }
    // Core body — thick armored sphere
    ctx.fillStyle = '#500000';
    ctx.beginPath(); ctx.arc(x, y, S*.72, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#700010';
    ctx.beginPath(); ctx.ellipse(x, y-S*.12, S*.55, S*.45, 0, 0, Math.PI*2); ctx.fill();
    // Energy core — beating
    const pulse = S*(0.22 + 0.06*Math.sin(t*4));
    const ecg = ctx.createRadialGradient(x, y, 0, x, y, pulse*2.5);
    ecg.addColorStop(0,'rgba(255,255,200,1)'); ecg.addColorStop(0.3,'rgba(255,80,0,0.8)'); ecg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = ecg; ctx.beginPath(); ctx.arc(x, y, pulse*2.5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff8e0';
    ctx.shadowBlur = 25; ctx.shadowColor = '#ff4400';
    ctx.beginPath(); ctx.arc(x, y, pulse, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;
    // Face — three-eye scan array
    ctx.fillStyle = '#ff1a00';
    ctx.shadowBlur = 12; ctx.shadowColor = '#ff0000';
    [x-S*.28, x, x+S*.28].forEach(ex=>{
      ctx.beginPath(); ctx.arc(ex, y-S*.38, S*.11, 0, Math.PI*2); ctx.fill();
    });
    ctx.fillStyle = '#ffaa00';
    [x-S*.28, x, x+S*.28].forEach(ex=>{
      ctx.beginPath(); ctx.arc(ex, y-S*.38, S*.05, 0, Math.PI*2); ctx.fill();
    });
    ctx.shadowBlur = 0;
    // Armor ridge lines
    ctx.strokeStyle = '#aa0010'; ctx.lineWidth = S*.05;
    for(let i=0;i<3;i++) {
      const ry = y-S*.25+i*S*.25;
      ctx.beginPath(); ctx.arc(x, ry, S*(0.5-i*.08), Math.PI*.05, Math.PI*.95); ctx.stroke();
    }
    // Gold boss ring — double
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = S*.1;
    ctx.shadowBlur = 12; ctx.shadowColor = '#ffd700';
    ctx.beginPath(); ctx.arc(x, y, S*.95, 0, Math.PI*2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,215,0,0.4)'; ctx.lineWidth = S*.05;
    ctx.beginPath(); ctx.arc(x, y, S*1.05, 0, Math.PI*2); ctx.stroke();
    ctx.shadowBlur = 0;
  },

  _default(ctx, x, y, s) {
    ctx.fillStyle = '#555';
    ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI*2); ctx.fill();
  }
};


// ── Wave generation ───────────────────────────────────────
function generateWaves(mapId, totalWaves, waveModifier) {
  const waves = [];
  for (let w = 1; w <= totalWaves; w++) {
    const wave = { number: w, enemies: [], delay: 0.8 };
    const budget = Math.floor((20 + w * 14) * waveModifier);

    // Every 5 waves = boss wave
    if (w % 5 === 0) {
      let boss = 'boss_zombie_king';
      if (w >= 10) boss = 'boss_undead_titan';
      if (w >= 20) boss = 'boss_shadow_lord';
      if (w >= 25) boss = 'boss_colossus_prime';
      if (w >= 30) boss = 'boss_void_emperor';
      if (w >= 35) boss = 'boss_omega_destroyer';
      wave.enemies.push({ type: boss, count: 1, interval: 0 });
      wave.isBossWave = true;
      // Escort pack scales with wave
      const escort = w >= 30 ? 'void_rift' : w >= 20 ? 'wraith' : 'runner';
      wave.enemies.push({ type: escort, count: Math.floor(w/3), interval: 0.3 });
    } else {
      const available = getAvailableEnemyTypes(w);
      let remaining = budget;
      let safetyLimit = 40;
      while (remaining > 0 && safetyLimit-- > 0) {
        const type = available[Math.floor(Math.random() * available.length)];
        const typeDef = ENEMY_TYPES[type];
        const cost = Math.ceil(typeDef.hp / 30);
        if (remaining < cost && wave.enemies.length > 0) break;
        const maxCount = Math.min(Math.floor(remaining / Math.max(1,cost)), 15);
        const count = Math.max(1, Math.floor(Math.random() * maxCount) + 1);
        wave.enemies.push({ type, count, interval: 0.25 + Math.random() * 0.35 });
        remaining -= cost * count;
      }
    }
    waves.push(wave);
  }
  return waves;
}

function getAvailableEnemyTypes(wave) {
  return [
    { type:'walker',         minWave:1  },
    { type:'crawler',        minWave:1  },
    { type:'runner',         minWave:2  },
    { type:'bloated',        minWave:3  },
    { type:'armored',        minWave:4  },
    { type:'toxic',          minWave:5  },
    { type:'ghost',          minWave:6  },
    { type:'healer',         minWave:7  },
    { type:'berserker',      minWave:8  },
    { type:'nightmare',      minWave:9  },
    { type:'leaper',         minWave:10 },
    { type:'shielder',       minWave:12 },
    // ── NEW LATE-GAME ENEMIES ──────────
    { type:'bloodhound',     minWave:15 },
    { type:'wraith',         minWave:17 },
    { type:'colossus',       minWave:18 },
    { type:'plague_carrier', minWave:20 },
    { type:'void_rift',      minWave:24 },
    { type:'titan_guardian', minWave:28 },
  ].filter(e => e.minWave <= wave).map(e => e.type);
}

// ── Enemy instance ─────────────────────────────────────────
class Enemy {
  constructor(type, path, tileSize, waveNum, waveModifier) {
    const def = ENEMY_TYPES[type] || ENEMY_TYPES.walker;
    this.type = type; this.def = def; this.name = def.name;
    this.color = def.color; this.size = def.size * (def.isBoss ? 1.0 : 0.9);
    this.isBoss = def.isBoss; this.invisible = def.invisible || false;
    this.immunities = def.immunities || [];

    const scale = 1 + (waveNum - 1) * 0.06 * (waveModifier || 1);
    this.maxHp = Math.floor((def.hp||80) * scale);
    this.hp = this.maxHp;
    this.speed = (def.speed||55) * (0.95 + Math.random() * 0.1);
    this.baseSpeed = this.speed;
    this.reward = def.reward || 5;
    this.armor = def.armor || 0;

    this.path = path; this.tileSize = tileSize;
    this.pathIndex = 0; this.pathProgress = 0;
    this.x = path[0][0] * tileSize + tileSize/2;
    this.y = path[0][1] * tileSize + tileSize/2;
    this.targetX = this.x; this.targetY = this.y;

    this.dead = false; this.reachedEnd = false;
    this.slowTimer = 0; this.burnTimer = 0; this.burnDmg = 0; this.burnAccum = 0;
    this.poisonTimer = 0; this.healTimer = 0; this.rageActive = false;
    this.flashTimer = 0; this.angle = 0; this.specialCooldown = 0;
    this.spawnAlpha = 0; this.spawnTime = 0.3;
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
    if (this.rageActive) dmg *= 0.5;
    this.hp -= dmg; this.flashTimer = 0.12;
    if (bullet?.slow > 0) { this.speed = this.baseSpeed * (1 - bullet.slow); this.slowTimer = bullet.slowDur || 1.5; }
    if (bullet?.burn > 0) { this.burnDmg = bullet.burn; this.burnTimer = 4.0; }
    if (this.def.rageOnDamage && !this.rageActive && this.hp < this.maxHp * 0.4) {
      this.rageActive = true; this.speed = this.baseSpeed * 1.8;
    }
    if (this.hp <= 0) { this.hp = 0; this.dead = true; }
    return dmg;
  }

  update(dt, allEnemies) {
    this.spawnAlpha = Math.min(1, this.spawnAlpha + dt / this.spawnTime);
    this.flashTimer = Math.max(0, this.flashTimer - dt);
    if (this.slowTimer > 0) { this.slowTimer -= dt; if (this.slowTimer <= 0 && !this.rageActive) this.speed = this.baseSpeed; }
    if (this.burnTimer > 0) {
      this.burnAccum += dt; this.burnTimer -= dt;
      if (this.burnAccum >= 0.5) { this.hp -= this.burnDmg * 0.5; this.burnAccum = 0; if (this.hp <= 0) { this.hp = 0; this.dead = true; return; } }
    }
    if (this.def.specialMove === 'heal') {
      this.healTimer -= dt;
      if (this.healTimer <= 0) { this.healTimer = 3; if (allEnemies) allEnemies.forEach(e => { if (e===this||e.dead)return; if (Math.hypot(e.x-this.x,e.y-this.y)<80) e.hp = Math.min(e.maxHp, e.hp + e.maxHp*.08); }); }
    }
    if (this.def.specialMove === 'leap') {
      this.specialCooldown -= dt;
      if (this.specialCooldown <= 0) {
        this.specialCooldown = 5 + Math.random() * 5;
        const ahead = Math.min(this.pathIndex + 2, this.path.length - 2);
        this.pathIndex = ahead;
        this.x = this.path[ahead][0]*this.tileSize+this.tileSize/2;
        this.y = this.path[ahead][1]*this.tileSize+this.tileSize/2;
        this._updateTarget();
      }
    }
    const dx=this.targetX-this.x, dy=this.targetY-this.y, dist=Math.sqrt(dx*dx+dy*dy);
    this.angle = Math.atan2(dy, dx);
    this.pathProgress = this.pathIndex + (1 - dist / this.tileSize);
    const move = this.speed * dt;
    if (dist <= move) {
      this.x=this.targetX; this.y=this.targetY; this.pathIndex++;
      if (this.pathIndex >= this.path.length - 1) { this.reachedEnd=true; this.dead=true; return; }
      this._updateTarget();
    } else { this.x+=dx/dist*move; this.y+=dy/dist*move; }
  }

  draw(ctx) {
    if (this.dead) return;
    const alpha = this.invisible ? 0.22 : this.spawnAlpha;
    ctx.globalAlpha = alpha;
    const s = this.size;

    // Shadow (softer, elliptical)
    const sg = ctx.createRadialGradient(this.x, this.y+s*.75, 0, this.x, this.y+s*.75, s*.7);
    sg.addColorStop(0,'rgba(0,0,0,0.45)'); sg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.ellipse(this.x, this.y+s*.75, s*.65, s*.22, 0, 0, Math.PI*2); ctx.fill();

    // Flash override (hit flash)
    if (this.flashTimer > 0) {
      ctx.fillStyle='#fff';
      ctx.shadowBlur = 15; ctx.shadowColor = '#fff';
      ctx.beginPath(); ctx.arc(this.x, this.y, s, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      const fn = EnemyArt[this.type] || EnemyArt._default;
      if (this.rageActive) {
        // Rage: red aura pulse
        ctx.globalAlpha = alpha * 0.5;
        ctx.fillStyle = '#ff0000';
        ctx.shadowBlur = 12; ctx.shadowColor = '#ff0000';
        ctx.beginPath(); ctx.arc(this.x, this.y, s*1.25, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = alpha;
      }
      fn(ctx, this.x, this.y, s);
    }

    // Boss: animated gold ring + spinning dashes
    if (this.isBoss) {
      const t = Date.now() * 0.002;
      ctx.strokeStyle = '#f1c40f';
      ctx.lineWidth = s * 0.1;
      ctx.shadowBlur = 10; ctx.shadowColor = '#f59e0b';
      ctx.beginPath(); ctx.arc(this.x, this.y, s + s*0.2, 0, Math.PI*2); ctx.stroke();
      ctx.shadowBlur = 0;
      // Spinning dashes
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(t);
      ctx.strokeStyle = 'rgba(251,191,36,0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([s*0.25, s*0.25]);
      ctx.beginPath(); ctx.arc(0, 0, s + s*0.45, 0, Math.PI*2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    // HP bar — improved gradient, rounded
    if (this.hp < this.maxHp) {
      const bw = s * (this.isBoss ? 2.6 : 2.2);
      const bh = this.isBoss ? 8 : 4;
      const bx = this.x - bw/2;
      const by = this.y - s - (this.isBoss ? 17 : 10);
      const ratio = Math.max(0, this.hp / this.maxHp);

      // Background
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.beginPath(); ctx.roundRect(bx-1, by-1, bw+2, bh+2, bh/2+1); ctx.fill();

      // Fill gradient
      const hpGrad = ctx.createLinearGradient(bx, by, bx + bw, by);
      if (ratio > 0.6) {
        hpGrad.addColorStop(0,'#16a34a'); hpGrad.addColorStop(1,'#22c55e');
      } else if (ratio > 0.3) {
        hpGrad.addColorStop(0,'#d97706'); hpGrad.addColorStop(1,'#f59e0b');
      } else {
        hpGrad.addColorStop(0,'#b91c1c'); hpGrad.addColorStop(1,'#ef4444');
      }
      ctx.fillStyle = hpGrad;
      ctx.beginPath(); ctx.roundRect(bx, by, bw * ratio, bh, bh/2); ctx.fill();

      // Sheen
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.beginPath(); ctx.roundRect(bx, by, bw * ratio, bh * 0.45, bh/2); ctx.fill();
    }

    // Slow ring (icy blue)
    if (this.slowTimer > 0) {
      const sr = Math.min(1, this.slowTimer / 2);
      ctx.globalAlpha = alpha * sr * 0.55;
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = s * 0.12;
      ctx.shadowBlur = 8; ctx.shadowColor = '#3b82f6';
      ctx.beginPath(); ctx.arc(this.x, this.y, s + s*0.22, 0, Math.PI*2); ctx.stroke();
      ctx.shadowBlur = 0; ctx.globalAlpha = alpha;
    }

    // Burn sparks (orbiting)
    if (this.burnTimer > 0) {
      const t = Date.now() * 0.007;
      for (let i = 0; i < 5; i++) {
        const a = t + i * 1.257;
        const r = s * (0.8 + Math.sin(t * 2 + i) * 0.2);
        const fx = this.x + Math.cos(a) * r;
        const fy = this.y + Math.sin(a) * r;
        ctx.fillStyle = i % 2 ? '#ff6600' : '#ffcc00';
        ctx.shadowBlur = 6; ctx.shadowColor = '#ff4400';
        ctx.beginPath(); ctx.arc(fx, fy, s * 0.13, 0, Math.PI*2); ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    // Immunity dots (small, only for regular enemies)
    if (this.immunities.length && !this.isBoss) {
      const TC = { bullet:'#94a3b8', fire:'#ef4444', ice:'#3b82f6', explosive:'#f97316', electric:'#facc15', laser:'#ff0040', poison:'#10b981' };
      this.immunities.forEach((imm, i) => {
        const ix = this.x - (this.immunities.length-1)*s*0.18 + i*s*0.36;
        const iy = this.y - s - 2;
        ctx.fillStyle = TC[imm] || '#fff';
        ctx.beginPath(); ctx.arc(ix, iy, s*0.14, 0, Math.PI*2); ctx.fill();
      });
    }

    ctx.globalAlpha = 1;
  }
}
