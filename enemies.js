/* ═══════════════════════════════════════════════════════════════════
   enemies.js v11 — SPRITE-CACHED balloon rendering
   Key perf win: each balloon type rendered ONCE to offscreen canvas,
   then drawn with a single drawImage() call per enemy per frame.
   Gradients, beziers, ropes etc. only computed once at init.
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
  red:     { name:'RED',     color:'#e74c3c', hp:1,      speed:75,   reward:1,    armor:0,    size:13, tier:1,  immunities:[], spawnsOnDeath:null },
  blue:    { name:'BLUE',    color:'#3498db', hp:1,      speed:100,  reward:1,    armor:0,    size:13, tier:2,  immunities:[], spawnsOnDeath:{type:'red',count:1} },
  green:   { name:'GREEN',   color:'#27ae60', hp:1,      speed:130,  reward:1,    armor:0,    size:13, tier:3,  immunities:[], spawnsOnDeath:{type:'blue',count:1} },
  yellow:  { name:'YELLOW',  color:'#f1c40f', hp:1,      speed:180,  reward:2,    armor:0,    size:13, tier:4,  immunities:[], spawnsOnDeath:{type:'green',count:1} },
  pink:    { name:'PINK',    color:'#e91e8c', hp:1,      speed:230,  reward:3,    armor:0,    size:13, tier:5,  immunities:[], spawnsOnDeath:{type:'yellow',count:1} },
  black:   { name:'BLACK',   color:'#222222', hp:1,      speed:70,   reward:7,   armor:0,    size:15, tier:6,  immunities:['explosive'], spawnsOnDeath:{type:'pink',count:2} },
  white:   { name:'WHITE',   color:'#dde8f0', hp:1,      speed:70,   reward:7,   armor:0,    size:15, tier:7,  immunities:['ice'],       spawnsOnDeath:{type:'pink',count:2} },
  purple:  { name:'PURPLE',  color:'#8e44ad', hp:1,      speed:72,   reward:7,   armor:0,    size:15, tier:8,  immunities:['bullet'],    spawnsOnDeath:{type:'black',count:1,extraType:'white',extraCount:1} },
  lead:    { name:'LEAD',    color:'#7f8c8d', hp:1,      speed:38,   reward:14,   armor:0.55, size:17, tier:9,  immunities:['bullet','ice','electric'], spawnsOnDeath:{type:'black',count:2} },
  zebra:   { name:'ZEBRA',   color:'#bdc3c7', hp:1,      speed:68,   reward:14,   armor:0,    size:17, tier:10, immunities:['explosive','ice'], spawnsOnDeath:{type:'black',count:1,extraType:'white',extraCount:1} },
  rainbow: { name:'RAINBOW', color:'#e74c3c', hp:1,      speed:85,   reward:26,   armor:0,    size:18, tier:11, immunities:['bullet','ice','explosive'], spawnsOnDeath:{type:'zebra',count:2} },
  ceramic: { name:'CERAMIC', color:'#c9a227', hp:80,     speed:52,   reward:35,   armor:0.35, size:20, tier:12, immunities:[], spawnsOnDeath:{type:'rainbow',count:2} },
  moab:    { name:'M.O.A.B', color:'#2980b9', hp:300,    speed:22,   reward:247,  armor:0.35, size:34, tier:13, immunities:[], isBlimp:true, spawnsOnDeath:{type:'ceramic',count:4} },
  bfb:     { name:'B.F.B',   color:'#e74c3c', hp:1100,   speed:13,   reward:982, armor:0.45, size:46, tier:14, immunities:[], isBlimp:true, isBoss:true, spawnsOnDeath:{type:'moab',count:4} },
  zomg:    { name:'Z.O.M.G', color:'#7d3c98', hp:6000,   speed:6,    reward:3900, armor:0.55, size:60, tier:15, immunities:[], isBlimp:true, isBoss:true, spawnsOnDeath:{type:'bfb',count:4} },
  bad:     { name:'B.A.D',   color:'#922b21', hp:40000,  speed:4,    reward:16250,armor:0.65, size:74, tier:16, immunities:[], isBlimp:true, isBoss:true, spawnsOnDeath:{type:'zomg',count:2,extraType:'bfb',extraCount:3} },
  phantom: { name:'PHANTOM', color:'#1a0030', hp:80000,  speed:5.5,  reward:39000,armor:0.7,  size:80, tier:17, immunities:['bullet'], isBlimp:true, isBoss:true, spawnsOnDeath:{type:'bad',count:2,extraType:'zomg',extraCount:2} },
};

// ── SHARED ANIMATION TIME ────────────────────────────────────────────────────
let _animTime = 0;
function updateAnimTime(dt) { _animTime += dt; }

// ── SPRITE CACHE ─────────────────────────────────────────────────────────────
// Key: "type:size" → offscreen canvas
const _spriteCache = new Map();

function _getSprite(type, S) {
  const key = type + ':' + S;
  if (_spriteCache.has(key)) return _spriteCache.get(key);
  const sprite = _renderSprite(type, S);
  _spriteCache.set(key, sprite);
  return sprite;
}

// Renders a balloon/blimp to an offscreen canvas (called once per type/size)
function _renderSprite(type, S) {
  // Canvas is oversized to fit bob + effects
  const PAD = Math.ceil(S * 1.5);
  const W = Math.ceil(S * 3);
  const H = Math.ceil(S * 3.5);
  const oc = document.createElement('canvas');
  oc.width = W; oc.height = H;
  const g = oc.getContext('2d');
  // Center of balloon in the sprite
  const cx = W / 2, cy = H / 2;

  const def = ENEMY_TYPES[type];
  if (!def) return oc;

  if (def.isBlimp) {
    _drawBlimpSprite(g, cx, cy, S, type);
  } else {
    _drawBalloonSprite(g, cx, cy, S, type);
  }

  return oc;
}

// Balloon configs per type
const _BALLOON_CFG = {
  red:     { mainCol:'#e74c3c', hi:'#ff9980', sh:'#8b0000' },
  blue:    { mainCol:'#2980b9', hi:'#7ec8f8', sh:'#1a4f70' },
  green:   { mainCol:'#27ae60', hi:'#60e890', sh:'#145a30' },
  yellow:  { mainCol:'#f1c40f', hi:'#fff060', sh:'#9a7d0a' },
  pink:    { mainCol:'#e91e8c', hi:'#ff80cc', sh:'#880050',
             stripes:[{col:'rgba(255,160,210,0.5)',x1:-0.75,x2:-0.45},{col:'rgba(255,160,210,0.5)',x1:-0.05,x2:0.25},{col:'rgba(255,160,210,0.5)',x1:0.5,x2:0.8}] },
  black:   { mainCol:'#222',    hi:'#555',    sh:'#000',
             stripes:[{col:'rgba(120,0,0,0.45)',x1:-0.8,x2:-0.38},{col:'rgba(120,0,0,0.45)',x1:0.06,x2:0.48}] },
  white:   { mainCol:'#dde8f5', hi:'#ffffff', sh:'#9ab0cc',
             stripes:[{col:'rgba(140,180,255,0.3)',x1:-0.75,x2:-0.45},{col:'rgba(140,180,255,0.3)',x1:0.05,x2:0.35}] },
  purple:  { mainCol:'#7d3c98', hi:'#c080e8', sh:'#3d1260',
             stripes:[{col:'rgba(200,100,255,0.4)',x1:-0.65,x2:-0.3},{col:'rgba(200,100,255,0.4)',x1:0.2,x2:0.55}] },
  lead:    { mainCol:'#707070', hi:'#aaaaaa', sh:'#303030', pattern:'ceramic' },
  zebra:   { mainCol:'#b0b0b0', hi:'#eee',    sh:'#555',   pattern:'zebra' },
  rainbow: { mainCol:'#e74c3c', hi:'#ff9980', sh:'#880000', pattern:'rainbow' },
  ceramic: { mainCol:'#c9a227', hi:'#ffd060', sh:'#7a5800', pattern:'ceramic' },
};

const _BLIMP_CFG = {
  moab:    { mainCol:'#2471a3', accent:'#1a5276', label:'M.O.A.B', glowCol:'#3498db' },
  bfb:     { mainCol:'#c0392b', accent:'#7b241c', label:'B.F.B',   glowCol:'#e74c3c' },
  zomg:    { mainCol:'#6c3483', accent:'#4a235a', label:'Z.O.M.G', glowCol:'#9b59b6' },
  bad:     { mainCol:'#7b241c', accent:'#1c1c1c', label:'B.A.D',   glowCol:'#e74c3c' },
  phantom: { mainCol:'#1a0030', accent:'#0d001a', label:'PHANTOM', glowCol:'#aa00ff' },
};

function _balloonPath(g, x, y, S) {
  g.beginPath();
  g.moveTo(x, y - S*0.80);
  g.bezierCurveTo(x+S*0.72, y-S*0.80, x+S*0.78, y+S*0.02, x+S*0.62, y+S*0.42);
  g.bezierCurveTo(x+S*0.44, y+S*0.72, x-S*0.44, y+S*0.72, x-S*0.62, y+S*0.42);
  g.bezierCurveTo(x-S*0.78, y+S*0.02, x-S*0.72, y-S*0.80, x, y-S*0.80);
  g.closePath();
}

function _drawBalloonSprite(g, x, y, S, type) {
  const cfg = _BALLOON_CFG[type] || { mainCol:'#888', hi:'#bbb', sh:'#333' };
  const { mainCol, hi, sh, stripes, pattern } = cfg;

  // Shadow
  g.globalAlpha = 0.18;
  g.fillStyle = '#000';
  g.beginPath();
  g.ellipse(x + S*0.08, y + S*0.92, S*0.5, S*0.11, 0, 0, Math.PI*2);
  g.fill();
  g.globalAlpha = 1;

  // Ropes (2 instead of 4 — saves 2 quadratic curves per balloon)
  g.strokeStyle = 'rgba(90,55,20,0.6)';
  g.lineWidth = Math.max(0.5, S * 0.022);
  g.lineCap = 'round';
  [[-0.18, 0.60],[0.18, 0.60]].forEach(([rx,ry]) => {
    g.beginPath();
    g.moveTo(x + rx*S, y + ry*S);
    g.lineTo(x + rx*S*0.3, y + S*0.86);
    g.stroke();
  });

  // Body
  g.save();
  _balloonPath(g, x, y, S);
  const bg = g.createRadialGradient(x-S*0.2, y-S*0.25, S*0.02, x+S*0.08, y+S*0.08, S*0.92);
  bg.addColorStop(0, hi);
  bg.addColorStop(0.42, mainCol);
  bg.addColorStop(1, sh);
  g.fillStyle = bg;
  g.fill();
  g.clip();

  // Stripes
  if (stripes) {
    g.globalAlpha = 0.38;
    stripes.forEach(({col,x1,x2}) => {
      g.fillStyle = col;
      g.fillRect(x + x1*S, y - S*0.92, (x2-x1)*S, S*1.75);
    });
    g.globalAlpha = 1;
  }
  if (pattern === 'zebra') {
    g.globalAlpha = 0.42;
    for (let i=-4;i<=4;i++) {
      g.fillStyle = i%2===0 ? '#111' : '#eee';
      g.fillRect(x+i*S*0.24-S*0.12, y-S*0.92, S*0.24, S*1.75);
    }
    g.globalAlpha = 1;
  }
  if (pattern === 'rainbow') {
    ['#e74c3c','#e67e22','#f1c40f','#27ae60','#3498db','#8e44ad'].forEach((rc,i) => {
      g.fillStyle = rc; g.globalAlpha = 0.42;
      g.fillRect(x-S*0.9+i*S*0.32, y-S*0.92, S*0.32, S*1.75);
    });
    g.globalAlpha = 1;
  }
  if (pattern === 'ceramic') {
    g.strokeStyle='rgba(50,25,0,0.55)'; g.lineWidth=S*0.028; g.globalAlpha=1;
    g.beginPath();
    g.moveTo(x-S*0.1,y-S*0.55); g.lineTo(x+S*0.06,y-S*0.2); g.lineTo(x-S*0.04,y+S*0.12);
    g.stroke();
    g.beginPath();
    g.moveTo(x+S*0.22,y-S*0.3); g.lineTo(x+S*0.1,y+S*0.08);
    g.stroke();
  }
  g.restore();

  // Outline
  g.strokeStyle = _darken(mainCol, 55);
  g.lineWidth = S * 0.042;
  _balloonPath(g, x, y, S);
  g.stroke();

  // Specular highlight
  const spec = g.createRadialGradient(x-S*0.22,y-S*0.38,0, x-S*0.1,y-S*0.15,S*0.44);
  spec.addColorStop(0,'rgba(255,255,255,0.52)');
  spec.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=spec;
  g.beginPath();
  g.ellipse(x-S*0.16,y-S*0.28,S*0.36,S*0.32,-0.35,0,Math.PI*2);
  g.fill();

  // Burner glow
  const burnG = g.createRadialGradient(x,y-S*0.72,0, x,y-S*0.62,S*0.24);
  burnG.addColorStop(0,'rgba(255,190,30,0.85)');
  burnG.addColorStop(1,'rgba(255,50,0,0)');
  g.fillStyle=burnG;
  g.beginPath();
  g.ellipse(x,y-S*0.65,S*0.16,S*0.22,0,0,Math.PI*2);
  g.fill();

  // Gondola (simplified — 1 fill + 1 stroke instead of 8 calls)
  const gW=S*0.34, gH=S*0.21, gX=x-gW/2, gY=y+S*0.83;
  const bGrad=g.createLinearGradient(gX,gY,gX+gW,gY+gH);
  bGrad.addColorStop(0,'#c4975a'); bGrad.addColorStop(1,'#7a5530');
  g.fillStyle=bGrad;
  g.beginPath(); g.roundRect(gX,gY,gW,gH,S*0.04); g.fill();
  g.strokeStyle='#6a4422'; g.lineWidth=S*0.035;
  g.beginPath(); g.roundRect(gX,gY,gW,gH,S*0.04); g.stroke();
}

function _drawBlimpSprite(g, x, y, S, type) {
  const cfg = _BLIMP_CFG[type] || _BLIMP_CFG.moab;
  const { mainCol, accent, label, glowCol } = cfg;

  // Glow aura (static — animation done at draw time via globalAlpha)
  if (glowCol) {
    const gG = g.createRadialGradient(x,y,0,x,y,S*1.1);
    gG.addColorStop(0,glowCol+'55'); gG.addColorStop(1,glowCol+'00');
    g.fillStyle=gG;
    g.beginPath(); g.arc(x,y,S*1.1,0,Math.PI*2); g.fill();
  }

  // Shadow
  g.globalAlpha=0.3;
  g.fillStyle='#000';
  g.beginPath(); g.ellipse(x+S*0.08,y+S*0.68,S*0.82,S*0.14,0,0,Math.PI*2); g.fill();
  g.globalAlpha=1;

  // Main body
  g.save();
  g.beginPath(); g.ellipse(x,y,S*0.96,S*0.5,0,0,Math.PI*2); g.closePath();
  const blG=g.createLinearGradient(x-S,y-S*0.5,x+S,y+S*0.5);
  blG.addColorStop(0,_lighten(mainCol,40));
  blG.addColorStop(0.35,mainCol);
  blG.addColorStop(1,_darken(mainCol,55));
  g.fillStyle=blG; g.fill(); g.clip();
  // Panel lines
  g.strokeStyle='rgba(0,0,0,0.18)'; g.lineWidth=S*0.032;
  for(let pi=-2;pi<=2;pi++){
    g.beginPath();
    g.moveTo(x+pi*S*0.38,y-S*0.52);
    g.lineTo(x+pi*S*0.38,y+S*0.52); g.stroke();
  }
  if(accent){
    g.fillStyle=accent; g.globalAlpha=0.45;
    g.fillRect(x-S,y-S*0.14,S*2,S*0.28);
    g.globalAlpha=1;
  }
  g.restore();

  // Outline
  g.strokeStyle=_darken(mainCol,65); g.lineWidth=S*0.055;
  g.beginPath(); g.ellipse(x,y,S*0.96,S*0.5,0,0,Math.PI*2); g.stroke();

  // Specular
  const sp=g.createRadialGradient(x-S*0.28,y-S*0.18,0,x-S*0.05,y,S*0.55);
  sp.addColorStop(0,'rgba(255,255,255,0.45)'); sp.addColorStop(1,'rgba(255,255,255,0)');
  g.fillStyle=sp;
  g.beginPath(); g.ellipse(x-S*0.1,y-S*0.05,S*0.52,S*0.26,0,0,Math.PI*2); g.fill();

  // Tail fins
  const finCol=_darken(mainCol,30);
  g.fillStyle=finCol;
  [[x-S*0.72,y,x-S*0.9,y-S*0.38,x-S*0.62,-0.04],
   [x-S*0.72,y,x-S*0.9,y+S*0.38,x-S*0.62,0.04],
   [x+S*0.72,y,x+S*0.9,y-S*0.28,x+S*0.7,-0.04],
   [x+S*0.72,y,x+S*0.9,y+S*0.28,x+S*0.7,0.04]].forEach(([ax,ay,bx,by,cx2,cy2])=>{
    g.beginPath(); g.moveTo(ax,ay); g.lineTo(bx,by); g.lineTo(ax+cx2*S,ay+cy2*S); g.closePath(); g.fill();
  });

  // Engine pods (simplified)
  [-S*0.42,S*0.42].forEach(ex => {
    const eY=y+S*0.56;
    g.fillStyle='#1a1a2e';
    g.beginPath(); g.roundRect(x+ex-S*0.14,eY,S*0.28,S*0.22,S*0.04); g.fill();
  });

  // Label
  g.font=`bold ${Math.max(8,Math.floor(S*0.28))}px Arial Black,sans-serif`;
  g.textAlign='center'; g.textBaseline='middle';
  g.strokeStyle='rgba(0,0,0,0.9)'; g.lineWidth=S*0.09;
  g.strokeText(label,x,y-S*0.02);
  g.fillStyle='#fff'; g.fillText(label,x,y-S*0.02);
}

// Pre-warm the sprite cache for all known types at a standard size
// Called after DOM is ready
function _prewarmSpriteCache() {
  const sizes = {};
  for (const [type, def] of Object.entries(ENEMY_TYPES)) {
    sizes[type] = Math.round(def.size * 0.9);
  }
  for (const [type, S] of Object.entries(sizes)) {
    _getSprite(type, S);
  }
}

// ── WAVE GENERATOR ────────────────────────────────────────────────────────────
function generateWaves(mapId, totalWaves, waveModifier, isInfinite) {
  const waves = [];
  const maxW = isInfinite ? 9999 : totalWaves;

  for (let w=1; w<=maxW; w++) {
    const wave = { number:w, enemies:[], delay:0.5 };
    const isMoab    = w%5===0;
    const isBfb     = w%10===0;
    const isZomg    = w%20===0;
    const isBad     = w%40===0;
    const isPhantom = w%80===0;

    if (isPhantom) {
      wave.isBossWave=true;
      wave.enemies.push({type:'phantom', count:1,                       interval:0});
      wave.enemies.push({type:'bad',     count:2+Math.floor(w/80),      interval:1.2});
      wave.enemies.push({type:'zomg',    count:3+Math.floor(w/40),      interval:0.8});
      wave.enemies.push({type:'ceramic', count:15+Math.floor(w/5),      interval:0.15});
    } else if (isBad) {
      wave.isBossWave=true;
      wave.enemies.push({type:'bad',     count:1+Math.floor(w/50),      interval:0});
      wave.enemies.push({type:'zomg',    count:2+Math.floor(w/40),      interval:1.0});
      wave.enemies.push({type:'bfb',     count:Math.floor(w/20),        interval:0.7});
      wave.enemies.push({type:'ceramic', count:10+Math.floor(w/6),      interval:0.18});
    } else if (isZomg) {
      wave.isBossWave=true;
      wave.enemies.push({type:'zomg',    count:1+Math.floor(w/25),      interval:0});
      wave.enemies.push({type:'bfb',     count:1+Math.floor(w/15),      interval:0.9});
      wave.enemies.push({type:'moab',    count:Math.floor(w/10),        interval:0.5});
      wave.enemies.push({type:'ceramic', count:6+Math.floor(w/6),       interval:0.18});
    } else if (isBfb) {
      wave.isBossWave=true;
      wave.enemies.push({type:'bfb',     count:1+Math.floor(w/15),      interval:0.6});
      wave.enemies.push({type:'moab',    count:2+Math.floor(w/8),       interval:0.4});
      wave.enemies.push({type:'rainbow', count:6+Math.floor(w/4),       interval:0.15});
      wave.enemies.push({type:'ceramic', count:3+Math.floor(w/5),       interval:0.2});
    } else if (isMoab) {
      wave.isBossWave=true;
      wave.enemies.push({type:'moab',    count:1+Math.floor(w/10),      interval:0.5});
      wave.enemies.push({type:'ceramic', count:3+Math.floor(w/4),       interval:0.18});
      wave.enemies.push({type:'rainbow', count:4+Math.floor(w/3),       interval:0.16});
    } else {
      const avail = _availableTypes(w);
      const totalCount = Math.floor((20 + w*5.2) * (waveModifier||1));
      const groups = Math.min(6, 2+Math.floor(w/3));
      for (let g2=0;g2<groups;g2++) {
        const type = avail[Math.floor(Math.random()*avail.length)];
        const interval = Math.max(0.1, 0.35 - w*0.004 - Math.random()*0.1);
        wave.enemies.push({type, count:Math.ceil(totalCount/groups), interval});
      }
    }

    waves.push(wave);
    if (!isInfinite && w >= totalWaves) break;
  }
  return waves;
}

function _availableTypes(wave) {
  // Aggressive early escalation — hard types much sooner
  return [
    {type:'red',     min:1},
    {type:'blue',    min:2},
    {type:'green',   min:3},
    {type:'yellow',  min:4},   // was 5
    {type:'pink',    min:5},   // was 7
    {type:'black',   min:6},   // was 8
    {type:'white',   min:6},   // was 8
    {type:'purple',  min:8},   // was 10
    {type:'lead',    min:9},   // was 12
    {type:'zebra',   min:11},  // was 14
    {type:'rainbow', min:12},  // was 15
    {type:'ceramic', min:14},  // was 17
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

    const ws = Math.pow(1.28, Math.max(0, waveNum-1)) * (waveModifier||1);
    this.maxHp = def.hp===1 ? 1 : Math.floor(def.hp * ws);
    this.hp = this.maxHp;

    const speedScale = 1 + waveNum * 0.022 + Math.pow(waveNum * 0.008, 1.4);
    this.speed = (def.speed||65) * (0.9 + Math.random()*0.2) * speedScale;
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
    this.spawnAlpha=0; this.spawnTime=0.15;
    this.pathProgress=0;
    this.waveNum=waveNum; this.waveModifier=waveModifier;

    // Pre-fetch sprite into cache on construction (warm it for this size)
    _getSprite(type, Math.round(this.size));
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

    const S = Math.round(this.size);
    // Bob offset for animation — computed cheaply once per draw
    const bob = this.def.isBlimp
      ? Math.sin(_animTime * 1.1 + this.x * 0.01) * S * 0.06 * 0.6
      : Math.sin(_animTime * 1.3 + this.x * 0.01) * S * 0.06;
    const drawY = this.y + bob;

    // Get cached sprite
    const sprite = _getSprite(this.type, S);
    const sw = sprite.width, sh = sprite.height;
    const sx = this.x - sw/2, sy = drawY - sh/2;

    ctx.globalAlpha = this.spawnAlpha;

    // Draw sprite (single drawImage — the big perf win)
    ctx.drawImage(sprite, sx, sy);

    // Flash on hit — cheap white overlay circle
    if (this.flashTimer > 0) {
      ctx.globalAlpha = this.spawnAlpha * Math.min(1, this.flashTimer * 14);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(this.x, drawY, S * 0.75, 0, Math.PI*2);
      ctx.fill();
    }

    ctx.globalAlpha = this.spawnAlpha;

    // Blimp pulsing glow (cheap sin, no gradient per frame)
    if (this.isBoss) {
      const glowAlpha = 0.25 + Math.sin(_animTime * 2.5) * 0.12;
      ctx.globalAlpha = this.spawnAlpha * glowAlpha;
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = S * 0.07;
      ctx.beginPath();
      ctx.arc(this.x, drawY, S * 1.05, 0, Math.PI*2);
      ctx.stroke();
    }

    ctx.globalAlpha = this.spawnAlpha;

    // HP bar (only when damaged)
    if (this.maxHp > 1 && this.hp < this.maxHp) {
      const bw = S*(this.isBoss?2.8:2.4), bh = this.isBoss?7:4;
      const bx = this.x-bw/2, by = drawY - S*1.35;
      const ratio = Math.max(0, this.hp/this.maxHp);
      ctx.fillStyle='rgba(0,0,0,0.7)';
      ctx.fillRect(bx-1, by-1, bw+2, bh+2);
      // Color by health
      ctx.fillStyle = ratio>0.6 ? '#22c55e' : ratio>0.3 ? '#f59e0b' : '#ef4444';
      ctx.fillRect(bx, by, bw*ratio, bh);
    }

    // Slow frost ring
    if (this.slowTimer > 0) {
      ctx.globalAlpha = this.spawnAlpha * Math.min(1, this.slowTimer) * 0.5;
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = S * 0.1;
      ctx.beginPath();
      ctx.arc(this.x, drawY, S+S*0.18, 0, Math.PI*2);
      ctx.stroke();
    }

    // Burn sparks (4 tiny circles, cheap)
    if (this.burnTimer > 0) {
      const t3 = _animTime * 7;
      ctx.globalAlpha = this.spawnAlpha;
      for (let i=0;i<4;i++){
        const a = t3+i*1.57, r = S*(0.8+Math.sin(t3*2+i)*0.16);
        ctx.fillStyle = i%2 ? '#ff6600' : '#ffcc00';
        ctx.beginPath();
        ctx.arc(this.x+Math.cos(a)*r, drawY+Math.sin(a)*r, S*0.09, 0, Math.PI*2);
        ctx.fill();
      }
    }

    // Immunity icons (text, rare — only drawn when enemy has them)
    if (this.immunities.length > 0) {
      const IC = {bullet:'🛡',explosive:'💥',ice:'❄️',electric:'⚡'};
      ctx.globalAlpha = this.spawnAlpha;
      ctx.font = `${Math.floor(S*0.28)}px serif`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      this.immunities.slice(0,2).forEach((im,i) => {
        ctx.fillText(IC[im]||'?', this.x+(i-0.5)*S*0.55, drawY-S*1.1);
      });
    }

    ctx.globalAlpha = 1;
  }
}
