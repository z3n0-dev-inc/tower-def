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

/* ── Canvas Enemy Art (no emojis) ───────────────────────── */
const EnemyArt = {
  walker(ctx, x, y, s) {
    ctx.fillStyle='#8d6e63';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Zombie stitches
    ctx.strokeStyle='#3e2723'; ctx.lineWidth=s*.12;
    ctx.beginPath(); ctx.moveTo(x-s*.3,y-s*.2); ctx.lineTo(x+s*.3,y-s*.2); ctx.stroke();
    // Eyes
    ctx.fillStyle='#c62828';
    ctx.beginPath(); ctx.arc(x-s*.32,y-s*.1,s*.18,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.32,y-s*.1,s*.18,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#000';
    ctx.beginPath(); ctx.arc(x-s*.32,y-s*.1,s*.08,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.32,y-s*.1,s*.08,0,Math.PI*2); ctx.fill();
    // Mouth
    ctx.strokeStyle='#3e2723'; ctx.lineWidth=s*.1; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x-s*.3,y+s*.3); ctx.quadraticCurveTo(x,y+s*.5,x+s*.3,y+s*.3); ctx.stroke();
  },
  crawler(ctx, x, y, s) {
    ctx.fillStyle='#388e3c';
    ctx.beginPath(); ctx.ellipse(x,y,s*1.2,s*.7,0,0,Math.PI*2); ctx.fill();
    // Scales
    ctx.fillStyle='#2e7d32';
    for(let i=-1;i<=1;i++) for(let j=-1;j<=1;j++){
      ctx.beginPath(); ctx.arc(x+i*s*.35,y+j*s*.22,s*.12,0,Math.PI*2); ctx.fill();
    }
    // Eyes
    ctx.fillStyle='#ffee58';
    ctx.beginPath(); ctx.arc(x-s*.4,y-s*.1,s*.16,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.4,y-s*.1,s*.16,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#000';
    ctx.beginPath(); ctx.arc(x-s*.4,y-s*.1,s*.07,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.4,y-s*.1,s*.07,0,Math.PI*2); ctx.fill();
  },
  bloated(ctx, x, y, s) {
    ctx.fillStyle='#e64a19';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Bloat lines
    ctx.strokeStyle='#bf360c'; ctx.lineWidth=s*.08;
    ctx.beginPath(); ctx.arc(x,y,s*.7,Math.PI*.2,Math.PI*.8); ctx.stroke();
    ctx.beginPath(); ctx.arc(x,y,s*.5,-Math.PI*.1,Math.PI*.1+Math.PI); ctx.stroke();
    // Eyes bulging
    ctx.fillStyle='#ffcc02';
    ctx.beginPath(); ctx.arc(x-s*.35,y-s*.25,s*.22,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.35,y-s*.25,s*.22,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#000';
    ctx.beginPath(); ctx.arc(x-s*.35,y-s*.25,s*.1,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.35,y-s*.25,s*.1,0,Math.PI*2); ctx.fill();
  },
  runner(ctx, x, y, s) {
    ctx.fillStyle='#1976d2';
    ctx.beginPath(); ctx.ellipse(x,y,s*.7,s,0,0,Math.PI*2); ctx.fill();
    // Speed lines
    ctx.strokeStyle='#90caf9'; ctx.lineWidth=s*.07; ctx.lineCap='round';
    for(let i=0;i<3;i++){
      const oy=(i-1)*s*.3;
      ctx.beginPath(); ctx.moveTo(x-s*.9,y+oy); ctx.lineTo(x-s*.5,y+oy); ctx.stroke();
    }
    // Eyes
    ctx.fillStyle='#fff';
    ctx.beginPath(); ctx.arc(x-s*.2,y-s*.2,s*.18,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.2,y-s*.2,s*.18,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#0d47a1';
    ctx.beginPath(); ctx.arc(x-s*.18,y-s*.18,s*.1,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.22,y-s*.18,s*.1,0,Math.PI*2); ctx.fill();
  },
  armored(ctx, x, y, s) {
    // Armor plates
    ctx.fillStyle='#607d8b';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#455a64';
    ctx.beginPath(); ctx.roundRect(x-s*.7,y-s*.8,s*1.4,s*.5,s*.1); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x-s*.7,y-s*.25,s*1.4,s*.5,s*.1); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x-s*.7,y+s*.3,s*1.4,s*.5,s*.1); ctx.fill();
    // Visor
    ctx.fillStyle='#b0bec5';
    ctx.beginPath(); ctx.roundRect(x-s*.5,y-s*.75,s,s*.3,s*.08); ctx.fill();
    ctx.fillStyle='rgba(100,180,255,0.3)';
    ctx.beginPath(); ctx.roundRect(x-s*.5,y-s*.75,s,s*.3,s*.08); ctx.fill();
  },
  toxic(ctx, x, y, s) {
    ctx.fillStyle='#689f38';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Toxic bubbles
    ctx.fillStyle='#8bc34a';
    const t=Date.now()*.002;
    for(let i=0;i<5;i++){
      const a=i/5*Math.PI*2+t, r=s*.55;
      ctx.beginPath(); ctx.arc(x+Math.cos(a)*r,y+Math.sin(a)*r,s*.18,0,Math.PI*2); ctx.fill();
    }
    // Skull face
    ctx.fillStyle='#1b5e20';
    ctx.beginPath(); ctx.arc(x,y-s*.1,s*.4,0,Math.PI*2); ctx.fill();
    ctx.fillRect(x-s*.3,y+s*.1,s*.6,s*.35);
    ctx.fillStyle='#8bc34a';
    ctx.beginPath(); ctx.arc(x-s*.16,y-s*.18,s*.12,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.16,y-s*.18,s*.12,0,Math.PI*2); ctx.fill();
    for(let i=0;i<3;i++) ctx.fillRect(x-s*.2+i*s*.2,y+s*.12,s*.12,s*.18);
  },
  ghost(ctx, x, y, s) {
    ctx.fillStyle='rgba(159,168,218,0.6)';
    ctx.beginPath();
    ctx.arc(x,y-s*.1,s*.7,Math.PI,0);
    ctx.lineTo(x+s*.7,y+s*.6);
    ctx.bezierCurveTo(x+s*.5,y+s*.3,x+s*.3,y+s*.7,x+s*.1,y+s*.5);
    ctx.bezierCurveTo(x-s*.1,y+s*.7,x-s*.3,y+s*.3,x-s*.5,y+s*.6);
    ctx.lineTo(x-s*.7,y+s*.6); ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(30,30,60,0.8)';
    ctx.beginPath(); ctx.arc(x-s*.25,y,s*.18,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.25,y,s*.18,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x,y+s*.3,s*.12,0,Math.PI); ctx.fill();
  },
  healer(ctx, x, y, s) {
    ctx.fillStyle='#e91e63';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Cross
    ctx.fillStyle='#fff';
    ctx.fillRect(x-s*.15,y-s*.6,s*.3,s*1.2);
    ctx.fillRect(x-s*.6,y-s*.15,s*1.2,s*.3);
    // Halo
    ctx.strokeStyle='#fff9c4'; ctx.lineWidth=s*.08;
    ctx.beginPath(); ctx.arc(x,y-s*.8,s*.35,0,Math.PI*2); ctx.stroke();
  },
  berserker(ctx, x, y, s) {
    ctx.fillStyle='#c62828';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Horns
    ctx.fillStyle='#4e342e';
    ctx.beginPath(); ctx.moveTo(x-s*.5,y-s*.7); ctx.lineTo(x-s*.7,y-s*1.3); ctx.lineTo(x-s*.2,y-s*.8); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x+s*.5,y-s*.7); ctx.lineTo(x+s*.7,y-s*1.3); ctx.lineTo(x+s*.2,y-s*.8); ctx.fill();
    // Angry eyes
    ctx.fillStyle='#ff6f00';
    ctx.beginPath(); ctx.arc(x-s*.3,y-s*.15,s*.22,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.3,y-s*.15,s*.22,0,Math.PI*2); ctx.fill();
    // Eyebrows angled inward
    ctx.strokeStyle='#000'; ctx.lineWidth=s*.12; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x-s*.52,y-s*.42); ctx.lineTo(x-s*.1,y-s*.32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+s*.52,y-s*.42); ctx.lineTo(x+s*.1,y-s*.32); ctx.stroke();
    // Snarl
    ctx.strokeStyle='#000'; ctx.lineWidth=s*.1;
    ctx.beginPath(); ctx.moveTo(x-s*.4,y+s*.3); ctx.lineTo(x+s*.4,y+s*.3); ctx.stroke();
    for(let i=0;i<4;i++){ctx.beginPath(); ctx.moveTo(x-s*.3+i*s*.2,y+s*.3); ctx.lineTo(x-s*.3+i*s*.2,y+s*.55); ctx.stroke();}
  },
  nightmare(ctx, x, y, s) {
    ctx.fillStyle='#1a1a2e';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Shadow tendrils
    const t=Date.now()*.003;
    ctx.strokeStyle='#212121'; ctx.lineWidth=s*.15; ctx.lineCap='round';
    for(let i=0;i<5;i++){
      const a=i/5*Math.PI*2+t;
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+Math.cos(a)*s*1.1,y+Math.sin(a)*s*1.1); ctx.stroke();
    }
    ctx.fillStyle='#16213e'; ctx.beginPath(); ctx.arc(x,y,s*.8,0,Math.PI*2); ctx.fill();
    // Glowing eyes
    ctx.fillStyle='#e53935';
    ctx.beginPath(); ctx.arc(x-s*.28,y-s*.1,s*.2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.28,y-s*.1,s*.2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#ff8f00';
    ctx.beginPath(); ctx.arc(x-s*.28,y-s*.1,s*.1,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.28,y-s*.1,s*.1,0,Math.PI*2); ctx.fill();
  },
  leaper(ctx, x, y, s) {
    ctx.fillStyle='#f57f17';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Leg coils
    ctx.strokeStyle='#e65100'; ctx.lineWidth=s*.12; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(x-s*.7,y+s*.5); ctx.quadraticCurveTo(x-s*.4,y+s*1.1,x-s*.1,y+s*.6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+s*.7,y+s*.5); ctx.quadraticCurveTo(x+s*.4,y+s*1.1,x+s*.1,y+s*.6); ctx.stroke();
    // Eyes
    ctx.fillStyle='#fff9c4';
    ctx.beginPath(); ctx.arc(x-s*.3,y-s*.2,s*.2,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.3,y-s*.2,s*.2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#000';
    ctx.beginPath(); ctx.arc(x-s*.28,y-s*.18,s*.1,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.32,y-s*.18,s*.1,0,Math.PI*2); ctx.fill();
  },
  shielder(ctx, x, y, s) {
    // Shield
    ctx.fillStyle='#546e7a';
    ctx.beginPath();
    ctx.moveTo(x,y-s*1.1); ctx.lineTo(x+s*.9,y-s*.6);
    ctx.lineTo(x+s*.9,y+s*.4); ctx.quadraticCurveTo(x,y+s*1.2,x-s*.9,y+s*.4);
    ctx.lineTo(x-s*.9,y-s*.6); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#78909c'; ctx.lineWidth=s*.06; ctx.stroke();
    // Shield emblem
    ctx.fillStyle='#b0bec5';
    ctx.beginPath(); ctx.moveTo(x,y-s*.7); ctx.lineTo(x+s*.4,y-s*.45); ctx.lineTo(x+s*.4,y+s*.2); ctx.quadraticCurveTo(x,y+s*.7,x-s*.4,y+s*.2); ctx.lineTo(x-s*.4,y-s*.45); ctx.closePath(); ctx.fill();
    // Eyes peeking over
    ctx.fillStyle='#37474f';
    ctx.beginPath(); ctx.arc(x-s*.22,y-s*.4,s*.16,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.22,y-s*.4,s*.16,0,Math.PI*2); ctx.fill();
  },
  boss_zombie_king(ctx, x, y, s) {
    ctx.fillStyle='#4a148c';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Crown
    ctx.fillStyle='#f1c40f';
    ctx.beginPath(); ctx.moveTo(x-s*.7,y-s*.8); ctx.lineTo(x-s*.7,y-s*1.3); ctx.lineTo(x-s*.3,y-s*.9); ctx.lineTo(x,y-s*1.4); ctx.lineTo(x+s*.3,y-s*.9); ctx.lineTo(x+s*.7,y-s*1.3); ctx.lineTo(x+s*.7,y-s*.8); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#e74c3c'; for(let i=-1;i<=1;i++){ctx.beginPath(); ctx.arc(x+i*s*.35,y-s*.95,s*.12,0,Math.PI*2); ctx.fill();}
    // Eyes
    ctx.fillStyle='#ff6f00';
    ctx.beginPath(); ctx.arc(x-s*.3,y-s*.1,s*.25,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.3,y-s*.1,s*.25,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#000';
    ctx.beginPath(); ctx.arc(x-s*.3,y-s*.1,s*.12,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.3,y-s*.1,s*.12,0,Math.PI*2); ctx.fill();
    // Boss ring
    ctx.strokeStyle='#f1c40f'; ctx.lineWidth=s*.06;
    ctx.beginPath(); ctx.arc(x,y,s*1.08,0,Math.PI*2); ctx.stroke();
  },
  boss_undead_titan(ctx, x, y, s) {
    ctx.fillStyle='#212121';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Stone texture
    ctx.fillStyle='#2c2c2c';
    ctx.beginPath(); ctx.roundRect(x-s*.7,y-s*.9,s*.45,s*.4,s*.05); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x+s*.25,y-s*.9,s*.45,s*.4,s*.05); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x-s*.8,y-s*.3,s*.5,s*.5,s*.05); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x+s*.3,y-s*.3,s*.5,s*.5,s*.05); ctx.fill();
    // Eyes
    ctx.fillStyle='#b71c1c';
    ctx.beginPath(); ctx.arc(x-s*.28,y-s*.18,s*.22,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.28,y-s*.18,s*.22,0,Math.PI*2); ctx.fill();
    // Boss ring
    ctx.strokeStyle='#e74c3c'; ctx.lineWidth=s*.08;
    ctx.beginPath(); ctx.arc(x,y,s*1.1,0,Math.PI*2); ctx.stroke();
  },
  boss_shadow_lord(ctx, x, y, s) {
    const t=Date.now()*.003;
    ctx.fillStyle='rgba(13,13,30,0.9)';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Phase tendrils
    ctx.strokeStyle='#311b92'; ctx.lineWidth=s*.12; ctx.lineCap='round';
    for(let i=0;i<8;i++){
      const a=i/8*Math.PI*2+t, len=s*(0.8+Math.sin(t+i)*0.3);
      ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+Math.cos(a)*len,y+Math.sin(a)*len); ctx.stroke();
    }
    ctx.fillStyle='#1a0050'; ctx.beginPath(); ctx.arc(x,y,s*.75,0,Math.PI*2); ctx.fill();
    // Void eyes
    ctx.fillStyle='#ea80fc';
    ctx.beginPath(); ctx.arc(x-s*.28,y-s*.1,s*.22+Math.sin(t)*.05,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.28,y-s*.1,s*.22+Math.sin(t)*.05,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#fff';
    ctx.beginPath(); ctx.arc(x-s*.28,y-s*.1,s*.08,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.28,y-s*.1,s*.08,0,Math.PI*2); ctx.fill();
    // Boss ring
    ctx.strokeStyle='#7c4dff'; ctx.lineWidth=s*.07;
    ctx.globalAlpha=0.7+Math.sin(t)*.3;
    ctx.beginPath(); ctx.arc(x,y,s*1.12,0,Math.PI*2); ctx.stroke();
    ctx.globalAlpha=1;
  },
  colossus(ctx, x, y, s) {
    // Giant armored hulk — slate blue
    ctx.fillStyle='#546e7a';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Armor plates
    ctx.fillStyle='#37474f';
    ctx.beginPath(); ctx.ellipse(x,y-s*.15,s*.7,s*.45,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#78909c'; ctx.lineWidth=s*.1;
    ctx.beginPath(); ctx.moveTo(x-s*.5,y); ctx.lineTo(x+s*.5,y); ctx.stroke();
    // Glowing eyes — red
    ctx.fillStyle='#ef5350';
    ctx.beginPath(); ctx.arc(x-s*.28,y-s*.15,s*.14,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.28,y-s*.15,s*.14,0,Math.PI*2); ctx.fill();
  },
  wraith(ctx, x, y, s) {
    // Ghostly purple wisp — semi-transparent
    ctx.globalAlpha=0.55;
    ctx.fillStyle='#9c27b0';
    ctx.beginPath(); ctx.ellipse(x,y,s*.85,s,0,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=0.85;
    // Dark void core
    ctx.fillStyle='#1a0030';
    ctx.beginPath(); ctx.arc(x,y,s*.4,0,Math.PI*2); ctx.fill();
    // Eye slits
    ctx.fillStyle='#ea80fc';
    ctx.fillRect(x-s*.35,y-s*.1,s*.22,s*.1);
    ctx.fillRect(x+s*.12,y-s*.1,s*.22,s*.1);
    ctx.globalAlpha=1;
  },
  bloodhound(ctx, x, y, s) {
    // Fast red beast
    ctx.fillStyle='#c62828';
    ctx.beginPath(); ctx.ellipse(x,y,s*.9,s*.75,0,0,Math.PI*2); ctx.fill();
    // Snout
    ctx.fillStyle='#b71c1c';
    ctx.beginPath(); ctx.ellipse(x+s*.3,y,s*.35,s*.25,0,0,Math.PI*2); ctx.fill();
    // Eyes — yellow rage
    ctx.fillStyle='#ffee58';
    ctx.beginPath(); ctx.arc(x-s*.1,y-s*.3,s*.16,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.25,y-s*.25,s*.16,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#000';
    ctx.beginPath(); ctx.arc(x-s*.1,y-s*.3,s*.07,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.25,y-s*.25,s*.07,0,Math.PI*2); ctx.fill();
  },
  plague_carrier(ctx, x, y, s) {
    // Bloated toxic green
    ctx.fillStyle='#388e3c';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Toxic bubbles
    ctx.fillStyle='#a5d6a7';
    for(let i=0;i<5;i++){
      const bx=x+(Math.cos(i*1.26))*s*.55, by=y+(Math.sin(i*1.26))*s*.55;
      ctx.beginPath(); ctx.arc(bx,by,s*.18,0,Math.PI*2); ctx.fill();
    }
    // Eyes
    ctx.fillStyle='#1b5e20';
    ctx.beginPath(); ctx.arc(x-s*.28,y-s*.15,s*.16,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.28,y-s*.15,s*.16,0,Math.PI*2); ctx.fill();
  },
  titan_guardian(ctx, x, y, s) {
    // Massive grey fortress
    ctx.fillStyle='#263238';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Layered armor rings
    ctx.strokeStyle='#455a64'; ctx.lineWidth=s*.15;
    ctx.beginPath(); ctx.arc(x,y,s*.75,0,Math.PI*2); ctx.stroke();
    ctx.strokeStyle='#37474f'; ctx.lineWidth=s*.1;
    ctx.beginPath(); ctx.arc(x,y,s*.5,0,Math.PI*2); ctx.stroke();
    // Face plate
    ctx.fillStyle='#37474f';
    ctx.beginPath(); ctx.ellipse(x,y-s*.1,s*.45,s*.35,0,0,Math.PI*2); ctx.fill();
    // Visor glow
    ctx.fillStyle='#ff1744';
    ctx.fillRect(x-s*.35,y-s*.18,s*.7,s*.12);
  },
  void_rift(ctx, x, y, s) {
    // Swirling void portal
    ctx.globalAlpha=0.7;
    ctx.fillStyle='#200040';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Rift rings
    ctx.globalAlpha=0.9;
    ctx.strokeStyle='#7b1fa2'; ctx.lineWidth=s*.12;
    ctx.beginPath(); ctx.arc(x,y,s*.75,0,Math.PI*2); ctx.stroke();
    ctx.strokeStyle='#ce93d8'; ctx.lineWidth=s*.06;
    ctx.beginPath(); ctx.arc(x,y,s*.45,0,Math.PI*2); ctx.stroke();
    // Core
    ctx.fillStyle='#ea80fc';
    ctx.beginPath(); ctx.arc(x,y,s*.2,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=1;
  },
  boss_colossus_prime(ctx, x, y, s) {
    // Titan boss
    ctx.fillStyle='#455a64';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Huge armor
    ctx.fillStyle='#37474f';
    ctx.beginPath(); ctx.ellipse(x,y-s*.2,s*.8,s*.55,0,0,Math.PI*2); ctx.fill();
    // Gold ring
    ctx.strokeStyle='#ffd700'; ctx.lineWidth=s*.12;
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.stroke();
    ctx.strokeStyle='#78909c'; ctx.lineWidth=s*.06;
    ctx.beginPath(); ctx.moveTo(x-s*.6,y); ctx.lineTo(x+s*.6,y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x,y-s*.6); ctx.lineTo(x,y+s*.6); ctx.stroke();
    // Eyes
    ctx.fillStyle='#ff1744';
    ctx.beginPath(); ctx.arc(x-s*.3,y-s*.2,s*.16,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.3,y-s*.2,s*.16,0,Math.PI*2); ctx.fill();
  },
  boss_void_emperor(ctx, x, y, s) {
    // Void boss — dark with purple corona
    ctx.fillStyle='#1a0030';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Corona rings
    ctx.strokeStyle='#aa00ff'; ctx.lineWidth=s*.14;
    ctx.globalAlpha=0.7;
    ctx.beginPath(); ctx.arc(x,y,s*.95,0,Math.PI*2); ctx.stroke();
    ctx.strokeStyle='#e040fb'; ctx.lineWidth=s*.07;
    ctx.beginPath(); ctx.arc(x,y,s*.65,0,Math.PI*2); ctx.stroke();
    ctx.globalAlpha=1;
    // Gold boss ring
    ctx.strokeStyle='#ffd700'; ctx.lineWidth=s*.1;
    ctx.beginPath(); ctx.arc(x,y,s*1.05,0,Math.PI*2); ctx.stroke();
    // Eyes — three
    ctx.fillStyle='#ea80fc';
    ctx.beginPath(); ctx.arc(x,y-s*.35,s*.17,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x-s*.35,y+s*.1,s*.13,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.35,y+s*.1,s*.13,0,Math.PI*2); ctx.fill();
  },
  boss_omega_destroyer(ctx, x, y, s) {
    // Final boss — crimson juggernaut
    ctx.fillStyle='#7f0000';
    ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
    // Dark red layered armor
    ctx.fillStyle='#b71c1c';
    ctx.beginPath(); ctx.ellipse(x,y-s*.15,s*.85,s*.6,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#c62828';
    ctx.beginPath(); ctx.ellipse(x,y-s*.25,s*.6,s*.4,0,0,Math.PI*2); ctx.fill();
    // Gold boss ring
    ctx.strokeStyle='#ffd700'; ctx.lineWidth=s*.15;
    ctx.beginPath(); ctx.arc(x,y,s*1.08,0,Math.PI*2); ctx.stroke();
    // Second ring
    ctx.strokeStyle='#ff6d00'; ctx.lineWidth=s*.08;
    ctx.beginPath(); ctx.arc(x,y,s*.75,0,Math.PI*2); ctx.stroke();
    // Three glowing eyes
    ctx.fillStyle='#ff6e40';
    ctx.shadowBlur=12; ctx.shadowColor='#ff1744';
    ctx.beginPath(); ctx.arc(x-s*.3,y-s*.2,s*.17,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+s*.3,y-s*.2,s*.17,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x,y+s*.15,s*.14,0,Math.PI*2); ctx.fill();
    ctx.shadowBlur=0;
  },
  _default(ctx, x, y, s) {
    ctx.fillStyle='#555'; ctx.beginPath(); ctx.arc(x,y,s,0,Math.PI*2); ctx.fill();
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

    // Shadow
    ctx.beginPath(); ctx.ellipse(this.x,this.y+s*.7,s*.6,s*.2,0,0,Math.PI*2);
    ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.fill();

    // Flash override
    if (this.flashTimer > 0) {
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(this.x,this.y,s,0,Math.PI*2); ctx.fill();
    } else {
      // Draw canvas art — no emojis
      const fn = EnemyArt[this.type] || EnemyArt._default;
      // Apply rage / burn tint
      if (this.rageActive) { ctx.globalAlpha = alpha * 0.4; ctx.fillStyle='#ff0000'; ctx.beginPath(); ctx.arc(this.x,this.y,s,0,Math.PI*2); ctx.fill(); ctx.globalAlpha = alpha; }
      fn(ctx, this.x, this.y, s);
    }

    // Boss gold ring
    if (this.isBoss) { ctx.strokeStyle='#f1c40f'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(this.x,this.y,s+3,0,Math.PI*2); ctx.stroke(); }

    // HP bar
    if (this.hp < this.maxHp) {
      const bw=s*2.2, bh=this.isBoss?7:4;
      const bx=this.x-bw/2, by=this.y-s-(this.isBoss?14:9);
      ctx.fillStyle='#333'; ctx.fillRect(bx,by,bw,bh);
      const ratio=this.hp/this.maxHp;
      ctx.fillStyle=ratio>.6?'#2ecc71':ratio>.3?'#f39c12':'#e74c3c';
      ctx.fillRect(bx,by,bw*ratio,bh);
      ctx.strokeStyle='#111'; ctx.lineWidth=1; ctx.strokeRect(bx,by,bw,bh);
    }

    // Slow ring
    if (this.slowTimer > 0) { ctx.fillStyle='rgba(52,152,219,0.4)'; ctx.beginPath(); ctx.arc(this.x,this.y,s+3,0,Math.PI*2); ctx.fill(); }

    // Burn sparks (drawn, not emoji)
    if (this.burnTimer > 0) {
      const t=Date.now()*.006;
      for(let i=0;i<4;i++){
        const a=t+i*1.57, r=s*.85;
        const fx=this.x+Math.cos(a)*r, fy=this.y+Math.sin(a)*r;
        ctx.fillStyle=i%2?'#ff6600':'#ffcc00';
        ctx.beginPath(); ctx.arc(fx,fy,s*.12,0,Math.PI*2); ctx.fill();
      }
    }

    // Immune indicator — small colored X for each immunity type
    if (this.immunities.length && !this.isBoss) {
      const TC={bullet:'#95a5a6',fire:'#e74c3c',ice:'#3498db',explosive:'#e67e22',electric:'#f1c40f',laser:'#ff0040',poison:'#16a085'};
      this.immunities.forEach((imm, i) => {
        ctx.fillStyle=TC[imm]||'#fff';
        ctx.beginPath(); ctx.arc(this.x+s+i*s*.35-this.immunities.length*s*.17, this.y-s*1.2, s*.15, 0, Math.PI*2); ctx.fill();
      });
    }

    ctx.globalAlpha = 1;
  }
}
