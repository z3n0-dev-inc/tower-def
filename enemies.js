/* ═══════════════════════════════════════════════════════════════════
   enemies.js — BTD6-style Hot Air Balloon Enemies
   Pop a big balloon → spawns smaller inner ones (BTD6 mechanic)
   Realistic balloon art: gradient body, gondola, ropes, highlights
   ═══════════════════════════════════════════════════════════════════ */

// ── COLOR HELPERS ────────────────────────────────────────────────────────────
function _lighten(hex, amt) {
  const n=parseInt(hex.replace('#',''),16);
  return '#'+[n>>16,(n>>8)&0xff,n&0xff].map(c=>Math.min(255,c+amt).toString(16).padStart(2,'0')).join('');
}
function _darken(hex, amt) {
  const n=parseInt(hex.replace('#',''),16);
  return '#'+[n>>16,(n>>8)&0xff,n&0xff].map(c=>Math.max(0,c-amt).toString(16).padStart(2,'0')).join('');
}

// ── BALLOON TYPES ─────────────────────────────────────────────────────────────
const ENEMY_TYPES = {
  red:     { name:'RED BALLOON',     color:'#e74c3c', hp:1,     speed:60,   reward:1,   armor:0,    size:13, tier:1,  immunities:[], spawnsOnDeath:null },
  blue:    { name:'BLUE BALLOON',    color:'#3498db', hp:1,     speed:78,   reward:2,   armor:0,    size:13, tier:2,  immunities:[], spawnsOnDeath:{type:'red',count:1} },
  green:   { name:'GREEN BALLOON',   color:'#27ae60', hp:1,     speed:98,   reward:3,   armor:0,    size:13, tier:3,  immunities:[], spawnsOnDeath:{type:'blue',count:1} },
  yellow:  { name:'YELLOW BALLOON',  color:'#f1c40f', hp:1,     speed:135,  reward:4,   armor:0,    size:13, tier:4,  immunities:[], spawnsOnDeath:{type:'green',count:1} },
  pink:    { name:'PINK BALLOON',    color:'#e91e8c', hp:1,     speed:170,  reward:5,   armor:0,    size:13, tier:5,  immunities:[], spawnsOnDeath:{type:'yellow',count:1} },
  black:   { name:'BLACK BALLOON',   color:'#222222', hp:1,     speed:55,   reward:11,  armor:0,    size:15, tier:6,  immunities:['explosive'], spawnsOnDeath:{type:'pink',count:2} },
  white:   { name:'WHITE BALLOON',   color:'#dde8f0', hp:1,     speed:55,   reward:11,  armor:0,    size:15, tier:7,  immunities:['ice'],       spawnsOnDeath:{type:'pink',count:2} },
  purple:  { name:'PURPLE BALLOON',  color:'#8e44ad', hp:1,     speed:55,   reward:11,  armor:0,    size:15, tier:8,  immunities:['bullet'],    spawnsOnDeath:{type:'black',count:1} },
  lead:    { name:'LEAD BALLOON',    color:'#7f8c8d', hp:1,     speed:26,   reward:23,  armor:0.5,  size:17, tier:9,  immunities:['bullet','ice','electric'], spawnsOnDeath:{type:'black',count:2} },
  zebra:   { name:'ZEBRA BALLOON',   color:'#bdc3c7', hp:1,     speed:52,   reward:23,  armor:0,    size:17, tier:10, immunities:['explosive','ice'], spawnsOnDeath:{type:'black',count:1,extraType:'white',extraCount:1} },
  rainbow: { name:'RAINBOW BALLOON', color:'#e74c3c', hp:1,     speed:65,   reward:40,  armor:0,    size:18, tier:11, immunities:['bullet','ice','explosive'], spawnsOnDeath:{type:'zebra',count:2} },
  ceramic: { name:'CERAMIC BALLOON', color:'#c9a227', hp:60,    speed:38,   reward:54,  armor:0.3,  size:20, tier:12, immunities:[], spawnsOnDeath:{type:'rainbow',count:2} },
  moab:    { name:'M.O.A.B',         color:'#2980b9', hp:200,   speed:16,   reward:381, armor:0.3,  size:34, tier:13, immunities:[], isBlimp:true, spawnsOnDeath:{type:'ceramic',count:4} },
  bfb:     { name:'B.F.B',           color:'#e74c3c', hp:700,   speed:9,    reward:1512,armor:0.4,  size:46, tier:14, immunities:[], isBlimp:true, isBoss:true, spawnsOnDeath:{type:'moab',count:4} },
  zomg:    { name:'Z.O.M.G',         color:'#7d3c98', hp:4000,  speed:4,    reward:6000,armor:0.5,  size:60, tier:15, immunities:[], isBlimp:true, isBoss:true, spawnsOnDeath:{type:'bfb',count:4} },
  bad:     { name:'B.A.D',           color:'#922b21', hp:28000, speed:2.8,  reward:25000,armor:0.6, size:74, tier:16, immunities:[], isBlimp:true, isBoss:true, spawnsOnDeath:{type:'zomg',count:2,extraType:'bfb',extraCount:3} },
};

// ── BALLOON ART ENGINE ────────────────────────────────────────────────────────
const EnemyArt = {

  _bob(t_ms) { return Math.sin(t_ms * 0.001 * 1.3) * 0.04; },

  // Core hot-air balloon renderer
  _balloon(ctx, x, y, S, opts) {
    const { mainCol, hi, sh, stripes, pattern, label } = opts;
    const bob = this._bob(Date.now()) * S;
    const cy = y + bob;

    // Shadow on ground
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(x + S*0.08, y + S*0.88, S*0.5, S*0.11, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // ROPES – 4 lines from balloon bottom to gondola
    ctx.save();
    ctx.strokeStyle = 'rgba(90,55,20,0.75)';
    ctx.lineWidth = Math.max(0.5, S * 0.022);
    ctx.lineCap = 'round';
    [[-0.26,0.60],[-0.10,0.60],[0.10,0.60],[0.26,0.60]].forEach(([rx,ry])=>{
      ctx.beginPath();
      ctx.moveTo(x + rx*S, cy + ry*S);
      ctx.quadraticCurveTo(x + rx*S*0.55, cy + S*0.78, x + rx*S*0.35, cy + S*0.86);
      ctx.stroke();
    });
    ctx.restore();

    // BALLOON BODY – teardrop bezier
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, cy - S*0.80);
    ctx.bezierCurveTo(x+S*0.72, cy-S*0.80, x+S*0.78, cy+S*0.02, x+S*0.62, cy+S*0.42);
    ctx.bezierCurveTo(x+S*0.44, cy+S*0.72, x-S*0.44, cy+S*0.72, x-S*0.62, cy+S*0.42);
    ctx.bezierCurveTo(x-S*0.78, cy+S*0.02, x-S*0.72, cy-S*0.80, x, cy-S*0.80);
    ctx.closePath();

    // Main gradient fill
    const bg = ctx.createRadialGradient(x-S*0.2, cy-S*0.25, S*0.02, x+S*0.08, cy+S*0.08, S*0.92);
    bg.addColorStop(0, hi);
    bg.addColorStop(0.42, mainCol);
    bg.addColorStop(1, sh);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.clip();

    // Stripe patterns inside body
    if (stripes) {
      ctx.globalAlpha = 0.38;
      stripes.forEach(({col,x1,x2})=>{
        ctx.fillStyle = col;
        ctx.fillRect(x + x1*S, cy - S*0.92, (x2-x1)*S, S*1.75);
      });
      ctx.globalAlpha = 1;
    }
    if (pattern === 'zebra') {
      ctx.globalAlpha = 0.42;
      for (let i=-4;i<=4;i++){
        ctx.fillStyle = i%2===0?'#111':'#eee';
        ctx.fillRect(x+i*S*0.24-S*0.12, cy-S*0.92, S*0.24, S*1.75);
      }
      ctx.globalAlpha = 1;
    }
    if (pattern === 'rainbow') {
      ['#e74c3c','#e67e22','#f1c40f','#27ae60','#3498db','#8e44ad'].forEach((rc,i)=>{
        ctx.fillStyle = rc; ctx.globalAlpha = 0.42;
        ctx.fillRect(x-S*0.9+i*S*0.32, cy-S*0.92, S*0.32, S*1.75);
      });
      ctx.globalAlpha = 1;
    }
    if (pattern === 'ceramic') {
      // crack lines
      ctx.strokeStyle='rgba(50,25,0,0.55)'; ctx.lineWidth=S*0.028; ctx.globalAlpha=1;
      ctx.beginPath();
      ctx.moveTo(x-S*0.1,cy-S*0.55); ctx.lineTo(x+S*0.06,cy-S*0.2); ctx.lineTo(x-S*0.04,cy+S*0.12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x+S*0.22,cy-S*0.3); ctx.lineTo(x+S*0.1,cy+S*0.08);
      ctx.stroke();
    }
    ctx.restore();

    // PANEL SEAM LINES
    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,0.13)';
    ctx.lineWidth = S*0.022;
    [-S*0.3, 0, S*0.3].forEach(ox=>{
      ctx.beginPath();
      ctx.moveTo(x+ox, cy-S*0.8);
      ctx.lineTo(x+ox*0.75, cy+S*0.62);
      ctx.stroke();
    });
    ctx.restore();

    // OUTLINE
    ctx.save();
    ctx.strokeStyle = _darken(mainCol, 55);
    ctx.lineWidth = S * 0.042;
    ctx.beginPath();
    ctx.moveTo(x, cy-S*0.80);
    ctx.bezierCurveTo(x+S*0.72,cy-S*0.80,x+S*0.78,cy+S*0.02,x+S*0.62,cy+S*0.42);
    ctx.bezierCurveTo(x+S*0.44,cy+S*0.72,x-S*0.44,cy+S*0.72,x-S*0.62,cy+S*0.42);
    ctx.bezierCurveTo(x-S*0.78,cy+S*0.02,x-S*0.72,cy-S*0.80,x,cy-S*0.80);
    ctx.closePath(); ctx.stroke();
    ctx.restore();

    // SPECULAR HIGHLIGHT
    ctx.save();
    const spec = ctx.createRadialGradient(x-S*0.22,cy-S*0.38,0, x-S*0.1,cy-S*0.15,S*0.44);
    spec.addColorStop(0,'rgba(255,255,255,0.52)');
    spec.addColorStop(0.5,'rgba(255,255,255,0.14)');
    spec.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=spec;
    ctx.beginPath();
    ctx.ellipse(x-S*0.16,cy-S*0.28,S*0.36,S*0.32,-0.35,0,Math.PI*2);
    ctx.fill();
    ctx.restore();

    // BURNER GLOW at top opening
    ctx.save();
    const burnG = ctx.createRadialGradient(x,cy-S*0.72,0, x,cy-S*0.62,S*0.24);
    burnG.addColorStop(0,'rgba(255,190,30,0.85)');
    burnG.addColorStop(0.45,'rgba(255,70,0,0.35)');
    burnG.addColorStop(1,'rgba(255,50,0,0)');
    ctx.fillStyle=burnG;
    ctx.beginPath();
    ctx.ellipse(x,cy-S*0.65,S*0.16,S*0.22,0,0,Math.PI*2);
    ctx.fill();
    ctx.restore();

    // GONDOLA (basket)
    const gW=S*0.34, gH=S*0.21, gX=x-gW/2, gY=cy+S*0.83;
    ctx.save();
    // basket shadow
    ctx.fillStyle='rgba(0,0,0,0.28)';
    ctx.beginPath(); ctx.ellipse(x+S*0.03,gY+gH+S*0.05,gW*0.52,S*0.06,0,0,Math.PI*2); ctx.fill();
    // basket body
    const bGrad=ctx.createLinearGradient(gX,gY,gX+gW,gY+gH);
    bGrad.addColorStop(0,'#c4975a'); bGrad.addColorStop(0.5,'#a07842'); bGrad.addColorStop(1,'#7a5530');
    ctx.fillStyle=bGrad;
    ctx.beginPath(); ctx.roundRect(gX,gY,gW,gH,S*0.04); ctx.fill();
    // weave grid
    ctx.strokeStyle='rgba(0,0,0,0.22)'; ctx.lineWidth=S*0.02;
    for(let gi=1;gi<3;gi++){
      ctx.beginPath(); ctx.moveTo(gX,gY+gi*gH/3); ctx.lineTo(gX+gW,gY+gi*gH/3); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gX+gi*gW/3,gY); ctx.lineTo(gX+gi*gW/3,gY+gH); ctx.stroke();
    }
    // rim
    ctx.strokeStyle='#7a5530'; ctx.lineWidth=S*0.038;
    ctx.beginPath(); ctx.roundRect(gX,gY,gW,gH,S*0.04); ctx.stroke();
    // rim highlight
    ctx.strokeStyle='#d4a56a'; ctx.lineWidth=S*0.022;
    ctx.beginPath(); ctx.moveTo(gX+S*0.04,gY); ctx.lineTo(gX+gW-S*0.04,gY); ctx.stroke();
    ctx.restore();

    // LABEL for named balloons
    if (label) {
      ctx.save();
      ctx.font=`bold ${Math.max(7,Math.floor(S*0.26))}px Arial Black,sans-serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.strokeStyle='rgba(0,0,0,0.75)'; ctx.lineWidth=S*0.07;
      ctx.strokeText(label,x,cy-S*0.05);
      ctx.fillStyle='#fff';
      ctx.fillText(label,x,cy-S*0.05);
      ctx.restore();
    }
  },

  // Blimp/airship renderer for MOAB, BFB, ZOMG, BAD
  _blimp(ctx, x, y, S, opts) {
    const { mainCol, accent, label, glowCol } = opts;
    const bob = this._bob(Date.now()) * S * 0.6;
    const cy = y + bob;

    // Shadow
    ctx.save();
    ctx.globalAlpha=0.35;
    ctx.fillStyle='#000';
    ctx.beginPath(); ctx.ellipse(x+S*0.08,cy+S*0.68,S*0.82,S*0.14,0,0,Math.PI*2); ctx.fill();
    ctx.restore();

    // Glow aura
    if (glowCol) {
      ctx.save();
      const t=Date.now()*0.003;
      ctx.globalAlpha=0.18+Math.sin(t)*0.1;
      const gG=ctx.createRadialGradient(x,cy,0,x,cy,S*1.1);
      gG.addColorStop(0,glowCol+'88'); gG.addColorStop(1,glowCol+'00');
      ctx.fillStyle=gG; ctx.beginPath(); ctx.arc(x,cy,S*1.1,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }

    // Main blimp body
    ctx.save();
    ctx.beginPath(); ctx.ellipse(x,cy,S*0.96,S*0.5,0,0,Math.PI*2); ctx.closePath();
    const blG=ctx.createLinearGradient(x-S,cy-S*0.5,x+S,cy+S*0.5);
    blG.addColorStop(0,_lighten(mainCol,40));
    blG.addColorStop(0.35,mainCol);
    blG.addColorStop(1,_darken(mainCol,55));
    ctx.fillStyle=blG; ctx.fill(); ctx.clip();
    // Panel lines
    ctx.strokeStyle='rgba(0,0,0,0.18)'; ctx.lineWidth=S*0.032;
    for(let pi=-2;pi<=2;pi++){
      ctx.beginPath();
      ctx.moveTo(x+pi*S*0.38,cy-S*0.52);
      ctx.lineTo(x+pi*S*0.38,cy+S*0.52); ctx.stroke();
    }
    // Accent stripe
    if(accent){
      ctx.fillStyle=accent; ctx.globalAlpha=0.48;
      ctx.fillRect(x-S,cy-S*0.14,S*2,S*0.28);
      ctx.globalAlpha=1;
    }
    // Rivets
    ctx.fillStyle=_lighten(mainCol,25); ctx.globalAlpha=0.6;
    [[-0.7,-0.2],[0.7,-0.2],[-0.7,0.2],[0.7,0.2],[0,0.48],[0,-0.48]].forEach(([rx,ry])=>{
      ctx.beginPath(); ctx.arc(x+rx*S,cy+ry*S,S*0.035,0,Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha=1;
    ctx.restore();

    // Outline
    ctx.strokeStyle=_darken(mainCol,65); ctx.lineWidth=S*0.055;
    ctx.beginPath(); ctx.ellipse(x,cy,S*0.96,S*0.5,0,0,Math.PI*2); ctx.stroke();

    // Specular highlight
    ctx.save();
    const sp=ctx.createRadialGradient(x-S*0.28,cy-S*0.18,0,x-S*0.05,cy,S*0.55);
    sp.addColorStop(0,'rgba(255,255,255,0.5)'); sp.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=sp;
    ctx.beginPath(); ctx.ellipse(x-S*0.1,cy-S*0.05,S*0.52,S*0.26,0,0,Math.PI*2); ctx.fill();
    ctx.restore();

    // Tail fins
    const finCol=_darken(mainCol,30);
    ctx.fillStyle=finCol;
    [[x-S*0.72,cy,x-S*0.9,cy-S*0.38,x-S*0.62,-0.04],
     [x-S*0.72,cy,x-S*0.9,cy+S*0.38,x-S*0.62,0.04],
     [x+S*0.72,cy,x+S*0.9,cy-S*0.28,x+S*0.7,-0.04],
     [x+S*0.72,cy,x+S*0.9,cy+S*0.28,x+S*0.7,0.04]].forEach(([ax,ay,bx,by,cx2,cy2])=>{
      ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.lineTo(ax+cx2*S,ay+cy2*S); ctx.closePath(); ctx.fill();
    });

    // Engine pods
    ctx.fillStyle='#1a1a2e';
    [-S*0.42,S*0.42].forEach(ex=>{
      const eY=cy+S*0.56;
      ctx.beginPath(); ctx.roundRect(x+ex-S*0.14,eY,S*0.28,S*0.22,S*0.04); ctx.fill();
      // propeller glow
      const eg=ctx.createRadialGradient(x+ex,eY+S*0.11,0,x+ex,eY+S*0.11,S*0.16);
      eg.addColorStop(0,'rgba(0,200,255,0.55)'); eg.addColorStop(1,'rgba(0,100,255,0)');
      ctx.fillStyle=eg; ctx.beginPath(); ctx.arc(x+ex,eY+S*0.11,S*0.16,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#1a1a2e';
    });

    // Label
    ctx.save();
    ctx.font=`bold ${Math.max(8,Math.floor(S*0.28))}px Arial Black,sans-serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.strokeStyle='rgba(0,0,0,0.85)'; ctx.lineWidth=S*0.09;
    ctx.strokeText(label,x,cy-S*0.02);
    ctx.fillStyle='#fff'; ctx.fillText(label,x,cy-S*0.02);
    ctx.restore();
  },

  // ─── INDIVIDUAL RENDERERS ───────────────────────────────────────────────────
  red(ctx,x,y,S)     { EnemyArt._balloon(ctx,x,y,S,{mainCol:'#e74c3c',hi:'#ff9980',sh:'#8b0000'}); },
  blue(ctx,x,y,S)    { EnemyArt._balloon(ctx,x,y,S,{mainCol:'#2980b9',hi:'#7ec8f8',sh:'#1a4f70'}); },
  green(ctx,x,y,S)   { EnemyArt._balloon(ctx,x,y,S,{mainCol:'#27ae60',hi:'#60e890',sh:'#145a30'}); },
  yellow(ctx,x,y,S)  { EnemyArt._balloon(ctx,x,y,S,{mainCol:'#f1c40f',hi:'#fff060',sh:'#9a7d0a'}); },
  pink(ctx,x,y,S)    { EnemyArt._balloon(ctx,x,y,S,{mainCol:'#e91e8c',hi:'#ff80cc',sh:'#880050',stripes:[{col:'rgba(255,160,210,0.5)',x1:-0.75,x2:-0.45},{col:'rgba(255,160,210,0.5)',x1:-0.05,x2:0.25},{col:'rgba(255,160,210,0.5)',x1:0.5,x2:0.8}]}); },
  black(ctx,x,y,S)   { EnemyArt._balloon(ctx,x,y,S,{mainCol:'#222',hi:'#555',sh:'#000',stripes:[{col:'rgba(120,0,0,0.45)',x1:-0.8,x2:-0.38},{col:'rgba(120,0,0,0.45)',x1:0.06,x2:0.48}]}); },
  white(ctx,x,y,S)   { EnemyArt._balloon(ctx,x,y,S,{mainCol:'#dde8f5',hi:'#ffffff',sh:'#9ab0cc',stripes:[{col:'rgba(140,180,255,0.3)',x1:-0.75,x2:-0.45},{col:'rgba(140,180,255,0.3)',x1:0.05,x2:0.35}]}); },
  purple(ctx,x,y,S)  { EnemyArt._balloon(ctx,x,y,S,{mainCol:'#7d3c98',hi:'#c080e8',sh:'#3d1260',stripes:[{col:'rgba(200,100,255,0.4)',x1:-0.65,x2:-0.3},{col:'rgba(200,100,255,0.4)',x1:0.2,x2:0.55}]}); },
  lead(ctx,x,y,S)    { EnemyArt._balloon(ctx,x,y,S,{mainCol:'#707070',hi:'#aaaaaa',sh:'#303030',pattern:'ceramic'}); },
  zebra(ctx,x,y,S)   { EnemyArt._balloon(ctx,x,y,S,{mainCol:'#b0b0b0',hi:'#eee',sh:'#555',pattern:'zebra'}); },
  rainbow(ctx,x,y,S) { EnemyArt._balloon(ctx,x,y,S,{mainCol:'#e74c3c',hi:'#ff9980',sh:'#880000',pattern:'rainbow'}); },
  ceramic(ctx,x,y,S) { EnemyArt._balloon(ctx,x,y,S,{mainCol:'#c9a227',hi:'#ffd060',sh:'#7a5800',pattern:'ceramic'}); },
  moab(ctx,x,y,S)    { EnemyArt._blimp(ctx,x,y,S,{mainCol:'#2471a3',accent:'#1a5276',label:'M.O.A.B',glowCol:'#3498db'}); },
  bfb(ctx,x,y,S)     { EnemyArt._blimp(ctx,x,y,S,{mainCol:'#c0392b',accent:'#7b241c',label:'B.F.B',glowCol:'#e74c3c'}); },
  zomg(ctx,x,y,S)    { EnemyArt._blimp(ctx,x,y,S,{mainCol:'#6c3483',accent:'#4a235a',label:'Z.O.M.G',glowCol:'#9b59b6'}); },
  bad(ctx,x,y,S)     { EnemyArt._blimp(ctx,x,y,S,{mainCol:'#7b241c',accent:'#1c1c1c',label:'B.A.D',glowCol:'#e74c3c'}); },
  _default(ctx,x,y,S){ EnemyArt._balloon(ctx,x,y,S,{mainCol:'#888',hi:'#bbb',sh:'#333'}); },
};

// ── WAVE GENERATOR ────────────────────────────────────────────────────────────
function generateWaves(mapId, totalWaves, waveModifier, isInfinite) {
  const waves = [];
  const maxW = isInfinite ? 9999 : totalWaves;

  for (let w=1; w<=maxW; w++) {
    const wave = { number:w, enemies:[], delay:0.6 };
    const isMoab  = w%5===0;
    const isBfb   = w%10===0;
    const isZomg  = w%20===0;
    const isBad   = w%40===0;

    if (isBad) {
      wave.isBossWave=true;
      wave.enemies.push({type:'bad',  count:1,               interval:0});
      wave.enemies.push({type:'zomg', count:1+Math.floor(w/80), interval:1.5});
      wave.enemies.push({type:'ceramic',count:8+Math.floor(w/8),interval:0.25});
    } else if (isZomg) {
      wave.isBossWave=true;
      wave.enemies.push({type:'zomg', count:1+Math.floor(w/40), interval:0});
      wave.enemies.push({type:'bfb',  count:Math.floor(w/20),   interval:1.2});
      wave.enemies.push({type:'ceramic',count:5+Math.floor(w/8),interval:0.22});
    } else if (isBfb) {
      wave.isBossWave=true;
      wave.enemies.push({type:'bfb',  count:1+Math.floor(w/20), interval:0.8});
      wave.enemies.push({type:'moab', count:Math.max(1,Math.floor(w/10)),interval:0.5});
      wave.enemies.push({type:'rainbow',count:4+Math.floor(w/5),interval:0.18});
    } else if (isMoab) {
      wave.isBossWave=true;
      wave.enemies.push({type:'moab', count:1+Math.floor(w/15),interval:0.6});
      wave.enemies.push({type:'ceramic',count:2+Math.floor(w/5),interval:0.22});
    } else {
      const avail = _availableTypes(w);
      const totalCount = Math.floor((16 + w*3.8) * (waveModifier||1));
      const groups = Math.min(5, 2+Math.floor(w/4));
      for (let g=0;g<groups;g++) {
        const type = avail[Math.floor(Math.random()*avail.length)];
        wave.enemies.push({type, count:Math.ceil(totalCount/groups), interval:0.2+Math.random()*0.3});
      }
    }

    waves.push(wave);
    if (!isInfinite && w >= totalWaves) break;
  }
  return waves;
}

function _availableTypes(wave) {
  return [
    {type:'red',    min:1},  {type:'blue',   min:2},  {type:'green',  min:4},
    {type:'yellow', min:6},  {type:'pink',   min:8},  {type:'black',  min:10},
    {type:'white',  min:10}, {type:'purple', min:12}, {type:'lead',   min:14},
    {type:'zebra',  min:16}, {type:'rainbow',min:18}, {type:'ceramic',min:20},
  ].filter(e=>e.min<=wave).map(e=>e.type);
}

// ── ENEMY CLASS ───────────────────────────────────────────────────────────────
class Enemy {
  constructor(type, path, tileSize, waveNum, waveModifier) {
    const def = ENEMY_TYPES[type] || ENEMY_TYPES.red;
    this.type=type; this.def=def; this.name=def.name; this.color=def.color;
    this.size = def.size * 0.9;
    this.isBoss = !!(def.isBoss || def.isBlimp);
    this.immunities = def.immunities || [];

    // HP scales with wave number — much harder now
    const ws = Math.pow(1.18, Math.max(0, waveNum-1)) * (waveModifier||1);
    this.maxHp = def.hp===1 ? 1 : Math.floor(def.hp * ws);
    this.hp = this.maxHp;

    this.speed = (def.speed||65) * (0.88 + Math.random()*0.24) * (1 + waveNum*0.013);
    this.baseSpeed = this.speed;
    this.reward = Math.floor((def.reward||1) * Math.sqrt(ws));
    this.armor  = def.armor || 0;

    this.path=path; this.tileSize=tileSize;
    this.pathIndex=0;
    this.x=path[0][0]*tileSize+tileSize/2;
    this.y=path[0][1]*tileSize+tileSize/2;
    this.targetX=this.x; this.targetY=this.y;

    this.dead=false; this.reachedEnd=false;
    this.slowTimer=0; this.burnTimer=0; this.burnDmg=0; this.burnAccum=0;
    this.flashTimer=0; this.angle=0;
    this.spawnAlpha=0; this.spawnTime=0.18;
    this.pathProgress=0;
    this.waveNum = waveNum; this.waveModifier = waveModifier;
    this._updateTarget();
  }

  _updateTarget() {
    if (this.pathIndex+1 < this.path.length) {
      this.targetX=this.path[this.pathIndex+1][0]*this.tileSize+this.tileSize/2;
      this.targetY=this.path[this.pathIndex+1][1]*this.tileSize+this.tileSize/2;
    }
  }

  takeDamage(amount, bullet) {
    if (this.dead) return 0;
    let dmg = amount;
    if (this.armor>0 && !bullet?.armorPierce) dmg *= (1-this.armor);
    this.hp -= dmg;
    this.flashTimer = 0.1;
    if (bullet?.slow>0) { this.speed=this.baseSpeed*(1-bullet.slow); this.slowTimer=bullet.slowDuration||2; }
    if (bullet?.burn>0) { this.burnDmg=bullet.burn; this.burnTimer=4.0; }
    if (this.hp<=0) { this.hp=0; this.dead=true; }
    return dmg;
  }

  getSpawnChildren() {
    const def=this.def;
    if (!def.spawnsOnDeath || this.reachedEnd) return [];
    const children=[];
    const s=def.spawnsOnDeath;
    for (let i=0;i<(s.count||1);i++) {
      const c=new Enemy(s.type,this.path,this.tileSize,this.waveNum,this.waveModifier);
      c.pathIndex=this.pathIndex; c.pathProgress=this.pathProgress;
      c.x=this.x; c.y=this.y; c.targetX=this.targetX; c.targetY=this.targetY;
      c.spawnAlpha=0.6;
      children.push(c);
    }
    if (s.extraType) {
      for (let i=0;i<(s.extraCount||1);i++) {
        const c=new Enemy(s.extraType,this.path,this.tileSize,this.waveNum,this.waveModifier);
        c.pathIndex=this.pathIndex; c.pathProgress=this.pathProgress;
        c.x=this.x+((Math.random()-0.5)*this.tileSize*0.5);
        c.y=this.y+((Math.random()-0.5)*this.tileSize*0.5);
        c.targetX=this.targetX; c.targetY=this.targetY; c.spawnAlpha=0.6;
        children.push(c);
      }
    }
    return children;
  }

  update(dt) {
    this.spawnAlpha=Math.min(1,this.spawnAlpha+dt/this.spawnTime);
    this.flashTimer=Math.max(0,this.flashTimer-dt);
    if (this.slowTimer>0){this.slowTimer-=dt;if(this.slowTimer<=0)this.speed=this.baseSpeed;}
    if (this.burnTimer>0){
      this.burnAccum+=dt; this.burnTimer-=dt;
      if(this.burnAccum>=0.5){this.hp-=this.burnDmg*0.5;this.burnAccum=0;if(this.hp<=0){this.hp=0;this.dead=true;return;}}
    }
    const dx=this.targetX-this.x, dy=this.targetY-this.y;
    const dist=Math.sqrt(dx*dx+dy*dy);
    this.angle=Math.atan2(dy,dx);
    this.pathProgress=this.pathIndex+(this.tileSize>0?1-dist/this.tileSize:0);
    const move=this.speed*dt;
    if (dist<=move) {
      this.x=this.targetX; this.y=this.targetY;
      this.pathIndex++;
      if(this.pathIndex>=this.path.length-1){this.reachedEnd=true;this.dead=true;return;}
      this._updateTarget();
    } else {
      this.x+=dx/dist*move; this.y+=dy/dist*move;
    }
  }

  draw(ctx) {
    if (this.dead) return;
    ctx.globalAlpha = this.spawnAlpha;

    // Flash on hit
    if (this.flashTimer>0) {
      ctx.save();
      const fn=EnemyArt[this.type]||EnemyArt._default;
      fn(ctx,this.x,this.y,this.size);
      ctx.globalAlpha=this.spawnAlpha*Math.min(1,this.flashTimer*12);
      ctx.fillStyle='#fff'; ctx.shadowBlur=22; ctx.shadowColor='#fff';
      ctx.beginPath(); ctx.arc(this.x,this.y,this.size*0.82,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;
      ctx.restore();
    } else {
      const fn=EnemyArt[this.type]||EnemyArt._default;
      fn(ctx,this.x,this.y,this.size);
    }

    // Boss/blimp gold ring
    if (this.isBoss) {
      const t2=Date.now()*0.002;
      ctx.strokeStyle='#ffd700'; ctx.lineWidth=this.size*0.07;
      ctx.shadowBlur=10; ctx.shadowColor='#ffd700';
      ctx.beginPath(); ctx.arc(this.x,this.y,this.size*1.05,0,Math.PI*2); ctx.stroke();
      ctx.shadowBlur=0;
    }

    // HP bar (ceramics and blimps)
    if (this.maxHp>1 && this.hp<this.maxHp) {
      const bw=this.size*(this.isBoss?2.8:2.4), bh=this.isBoss?8:5;
      const bx=this.x-bw/2, by=this.y-this.size*1.3;
      const ratio=Math.max(0,this.hp/this.maxHp);
      ctx.fillStyle='rgba(0,0,0,0.65)';
      ctx.beginPath(); ctx.roundRect(bx-1,by-1,bw+2,bh+2,3); ctx.fill();
      const hg=ctx.createLinearGradient(bx,by,bx+bw,by);
      if(ratio>0.6){hg.addColorStop(0,'#16a34a');hg.addColorStop(1,'#22c55e');}
      else if(ratio>0.3){hg.addColorStop(0,'#d97706');hg.addColorStop(1,'#f59e0b');}
      else{hg.addColorStop(0,'#b91c1c');hg.addColorStop(1,'#ef4444');}
      ctx.fillStyle=hg;
      ctx.beginPath(); ctx.roundRect(bx,by,bw*ratio,bh,3); ctx.fill();
    }

    // Slow frost ring
    if (this.slowTimer>0) {
      ctx.globalAlpha=this.spawnAlpha*Math.min(1,this.slowTimer)*0.55;
      ctx.strokeStyle='#93c5fd'; ctx.lineWidth=this.size*0.1;
      ctx.shadowBlur=8; ctx.shadowColor='#3b82f6';
      ctx.beginPath(); ctx.arc(this.x,this.y,this.size+this.size*0.18,0,Math.PI*2); ctx.stroke();
      ctx.shadowBlur=0;
    }

    // Burn sparks
    if (this.burnTimer>0) {
      const t3=Date.now()*0.007;
      for(let i=0;i<4;i++){
        const a=t3+i*1.57, r=this.size*(0.82+Math.sin(t3*2+i)*0.18);
        ctx.fillStyle=i%2?'#ff6600':'#ffcc00';
        ctx.shadowBlur=4; ctx.shadowColor='#ff4400';
        ctx.beginPath(); ctx.arc(this.x+Math.cos(a)*r,this.y+Math.sin(a)*r,this.size*0.1,0,Math.PI*2); ctx.fill();
      }
      ctx.shadowBlur=0;
    }

    // Immunity badges
    if (this.immunities.length>0) {
      const IC={bullet:'🛡',explosive:'💥',ice:'❄️',fire:'🔥',electric:'⚡',laser:'🔴',poison:'☠️'};
      ctx.font=`${Math.floor(this.size*0.28)}px serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      this.immunities.slice(0,2).forEach((im,i)=>{
        ctx.fillText(IC[im]||'?',this.x+(i-0.5)*this.size*0.55,this.y-this.size*1.12);
      });
    }

    ctx.globalAlpha=1;
  }
}
