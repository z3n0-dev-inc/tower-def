/* ═══════════════════════════════════════════════
   maps.js — 8 progressively harder maps
   Harder maps = MUCH longer paths + more waves + brutal modifiers
   ═══════════════════════════════════════════════ */

const MAPS = [
  {
    id: 'graveyard',
    name: 'GRAVEYARD',
    theme: 'graveyard',
    difficulty: 1,
    waves: 15,
    description: 'A foggy cemetery. Good place to start, rookie.',
    bgColor: '#1a2a15', pathColor: '#4a3820',
    grassColor: '#1e3018', accentColor: '#2d4a28',
    decorations: ['🪦','🌲','🌫️'],
    unlocked: true,
    cols: 20, rows: 14,
    path: [
      // Short winding S-shape — easy intro
      [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[5,4],[5,5],[5,6],[5,7],
      [6,7],[7,7],[8,7],[9,7],[10,7],[10,6],[10,5],[10,4],[10,3],[11,3],
      [12,3],[13,3],[14,3],[14,4],[14,5],[14,6],[14,7],[14,8],[14,9],[14,10],
      [13,10],[12,10],[11,10],[10,10],[9,10],[8,10],[7,10],[6,10],[5,10],[4,10],
      [4,9],[4,8],[4,7],[3,7],[2,7],[1,7],[0,7]
    ],
    startGold: 150, livesStart: 25, waveModifier: 1.0,
  },
  {
    id: 'city_ruins',
    name: 'CITY RUINS',
    theme: 'urban',
    difficulty: 2,
    waves: 18,
    description: 'Overrun streets. Longer routes, less room to breathe.',
    bgColor: '#1a1a1a', pathColor: '#555',
    grassColor: '#222', accentColor: '#333',
    decorations: ['🏚️','🚗','💡'],
    unlocked: false,
    cols: 22, rows: 14,
    path: [
      // Longer — figure-8 cross through city grid
      [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],
      [9,3],[9,4],[9,5],[9,6],[9,7],[8,7],[7,7],[6,7],[5,7],[5,8],
      [5,9],[5,10],[5,11],[6,11],[7,11],[8,11],[9,11],[10,11],[11,11],
      [12,11],[13,11],[14,11],[14,10],[14,9],[14,8],[14,7],[15,7],[16,7],
      [17,7],[17,6],[17,5],[17,4],[17,3],[17,2],[18,2],[19,2],[20,2],[21,2]
    ],
    startGold: 175, livesStart: 20, waveModifier: 1.3,
  },
  {
    id: 'volcano',
    name: 'VOLCANO',
    theme: 'volcanic',
    difficulty: 3,
    waves: 22,
    description: 'Molten rock and lava channels. Path is long and winding.',
    bgColor: '#1a0a00', pathColor: '#3a1500',
    grassColor: '#1f0d00', accentColor: '#5a1a00',
    decorations: ['🌋','🔥','💎'],
    unlocked: false,
    cols: 22, rows: 15,
    path: [
      // Much longer serpentine — 3 back-and-forth passes
      [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[13,2],[14,2],[15,2],
      [15,3],[15,4],[15,5],[15,6],[15,7],
      [14,7],[13,7],[12,7],[11,7],[10,7],[9,7],[8,7],[7,7],[6,7],[5,7],[4,7],[3,7],[2,7],
      [2,8],[2,9],[2,10],[2,11],[2,12],
      [3,12],[4,12],[5,12],[6,12],[7,12],[8,12],[9,12],[10,12],[11,12],[12,12],[13,12],[14,12],[15,12],[16,12],[17,12],[18,12],[19,12],[20,12],[21,12]
    ],
    startGold: 200, livesStart: 18, waveModifier: 1.7,
  },
  {
    id: 'arctic',
    name: 'ARCTIC BASE',
    theme: 'arctic',
    difficulty: 4,
    waves: 25,
    description: 'Frozen tundra. Enemies fast. Path is very long through ice fields.',
    bgColor: '#0a1525', pathColor: '#a8c8e8',
    grassColor: '#0d1e33', accentColor: '#1a3050',
    decorations: ['🏔️','❄️','🐧'],
    unlocked: false,
    cols: 26, rows: 15,
    path: [
      // 4 long passes — very long map
      [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],[20,1],[21,1],[22,1],[23,1],[24,1],[25,1],
      [25,2],[25,3],[25,4],[25,5],[25,6],
      [24,6],[23,6],[22,6],[21,6],[20,6],[19,6],[18,6],[17,6],[16,6],[15,6],[14,6],[13,6],[12,6],[11,6],[10,6],[9,6],[8,6],[7,6],[6,6],[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],
      [0,7],[0,8],[0,9],[0,10],[0,11],
      [1,11],[2,11],[3,11],[4,11],[5,11],[6,11],[7,11],[8,11],[9,11],[10,11],[11,11],[12,11],[13,11],[14,11],[15,11],[16,11],[17,11],[18,11],[19,11],[20,11],[21,11],[22,11],[23,11],[24,11],[25,11]
    ],
    startGold: 225, livesStart: 15, waveModifier: 2.0,
  },
  {
    id: 'inferno',
    name: 'INFERNO',
    theme: 'hell',
    difficulty: 5,
    waves: 28,
    description: 'Hellfire everywhere. Very long path. Strong enemies from wave 1.',
    bgColor: '#0f0000', pathColor: '#5a0000',
    grassColor: '#1a0000', accentColor: '#3a0000',
    decorations: ['👹','💀','🔥'],
    unlocked: false,
    cols: 24, rows: 15,
    path: [
      // Long spiral-ish with 5 segments
      [0,7],[1,7],[2,7],[2,6],[2,5],[2,4],[2,3],[2,2],[2,1],
      [3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],
      [19,2],[19,3],[19,4],[19,5],[19,6],[19,7],[19,8],[19,9],[19,10],[19,11],[19,12],[19,13],
      [18,13],[17,13],[16,13],[15,13],[14,13],[13,13],[12,13],[11,13],[10,13],[9,13],[8,13],[7,13],[6,13],[5,13],[4,13],[3,13],[2,13],
      [2,12],[2,11],[2,10],[2,9],[2,8],
      [3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],[15,8],[16,8],
      [16,7],[16,6],[16,5],[16,4],[16,3],
      [17,3],[18,3],[19,3],[20,3],[21,3],[22,3],[23,3]
    ],
    startGold: 250, livesStart: 12, waveModifier: 2.5,
  },
  {
    id: 'nuclear_wasteland',
    name: 'NUCLEAR WASTELAND',
    theme: 'nuclear',
    difficulty: 6,
    waves: 32,
    description: 'Mutant enemies, massive maze-like path. Brutal from wave 1.',
    bgColor: '#0d1a00', pathColor: '#4a6600',
    grassColor: '#0f1f00', accentColor: '#2a3d00',
    decorations: ['☢️','💚','🌿'],
    unlocked: false,
    cols: 26, rows: 16,
    path: [
      // Massive maze — longest so far
      [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],[20,1],[21,1],[22,1],[23,1],[24,1],[25,1],
      [25,2],[25,3],[25,4],[25,5],[25,6],[25,7],[25,8],
      [24,8],[23,8],[22,8],[21,8],[20,8],[19,8],[18,8],[17,8],[16,8],[15,8],[14,8],[13,8],[12,8],[11,8],[10,8],[9,8],[8,8],[7,8],[6,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8],
      [0,9],[0,10],[0,11],[0,12],[0,13],[0,14],[0,15],
      [1,15],[2,15],[3,15],[4,15],[5,15],[6,15],[7,15],[8,15],[9,15],[10,15],[11,15],[12,15],[13,15],[14,15],[15,15],[16,15],[17,15],[18,15],[19,15],[20,15],[21,15],[22,15],[23,15],[24,15],[25,15]
    ],
    startGold: 275, livesStart: 10, waveModifier: 3.2,
  },
  {
    id: 'shadow_realm',
    name: 'SHADOW REALM',
    theme: 'shadow',
    difficulty: 7,
    waves: 36,
    description: 'Invisible enemies. Impossible-length path. Elites from wave 5.',
    bgColor: '#05050f', pathColor: '#2a0060',
    grassColor: '#08080f', accentColor: '#150030',
    decorations: ['🌑','👁️','🕯️'],
    unlocked: false,
    cols: 28, rows: 16,
    path: [
      // Extreme zigzag — massive path
      [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],[20,1],[21,1],[22,1],[23,1],[24,1],[25,1],[26,1],[27,1],
      [27,2],[27,3],[27,4],[27,5],
      [26,5],[25,5],[24,5],[23,5],[22,5],[21,5],[20,5],[19,5],[18,5],[17,5],[16,5],[15,5],[14,5],[13,5],[12,5],[11,5],[10,5],[9,5],[8,5],[7,5],[6,5],[5,5],[4,5],[3,5],[2,5],[1,5],[0,5],
      [0,6],[0,7],[0,8],[0,9],
      [1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],[8,9],[9,9],[10,9],[11,9],[12,9],[13,9],[14,9],[15,9],[16,9],[17,9],[18,9],[19,9],[20,9],[21,9],[22,9],[23,9],[24,9],[25,9],[26,9],[27,9],
      [27,10],[27,11],[27,12],[27,13],[27,14],[27,15],
      [26,15],[25,15],[24,15],[23,15],[22,15],[21,15],[20,15],[19,15],[18,15],[17,15],[16,15],[15,15],[14,15],[13,15],[12,15],[11,15],[10,15],[9,15],[8,15],[7,15],[6,15],[5,15],[4,15],[3,15],[2,15],[1,15],[0,15]
    ],
    startGold: 300, livesStart: 8, waveModifier: 3.8,
  },
  {
    id: 'omega_facility',
    name: 'OMEGA FACILITY',
    theme: 'omega',
    difficulty: 8,
    waves: 42,
    description: 'ENDGAME. The longest path. The hardest enemies. Legends only.',
    bgColor: '#000005', pathColor: '#ff0030',
    grassColor: '#020208', accentColor: '#0a000f',
    decorations: ['💀','⚠️','🔴'],
    unlocked: false,
    cols: 30, rows: 16,
    path: [
      // The grand serpent — ~150 tiles long
      [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],[20,1],[21,1],[22,1],[23,1],[24,1],[25,1],[26,1],[27,1],[28,1],[29,1],
      [29,2],[29,3],[29,4],[29,5],
      [28,5],[27,5],[26,5],[25,5],[24,5],[23,5],[22,5],[21,5],[20,5],[19,5],[18,5],[17,5],[16,5],[15,5],[14,5],[13,5],[12,5],[11,5],[10,5],[9,5],[8,5],[7,5],[6,5],[5,5],[4,5],[3,5],[2,5],[1,5],[0,5],
      [0,6],[0,7],[0,8],[0,9],
      [1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],[8,9],[9,9],[10,9],[11,9],[12,9],[13,9],[14,9],[15,9],[16,9],[17,9],[18,9],[19,9],[20,9],[21,9],[22,9],[23,9],[24,9],[25,9],[26,9],[27,9],[28,9],[29,9],
      [29,10],[29,11],[29,12],[29,13],[29,14],[29,15],
      [28,15],[27,15],[26,15],[25,15],[24,15],[23,15],[22,15],[21,15],[20,15],[19,15],[18,15],[17,15],[16,15],[15,15],[14,15],[13,15],[12,15],[11,15],[10,15],[9,15],[8,15],[7,15],[6,15],[5,15],[4,15],[3,15],[2,15],[1,15],[0,15]
    ],
    startGold: 400, livesStart: 5, waveModifier: 5.0,
  },
];

function getMap(id) {
  const map = MAPS.find(m => m.id === id);
  if (!map) return null;
  map.pathSet = new Set(map.path.map(([c,r]) => `${c},${r}`));
  return map;
}

// ── Map Preview Renderer ──────────────────────────────────
function drawMapPreview(canvas, map) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const tW = W / map.cols, tH = H / map.rows;

  ctx.fillStyle = map.bgColor || '#1a2a15';
  ctx.fillRect(0, 0, W, H);

  // Texture dots
  ctx.fillStyle = map.accentColor || '#2d4a28';
  const rng = mulberry32Preview(7);
  for (let i = 0; i < 80; i++) {
    ctx.globalAlpha = 0.5;
    ctx.fillRect(rng()*W, rng()*H, rng()<0.3?2:1, rng()<0.3?2:1);
  }
  ctx.globalAlpha = 1;

  // Theme colors
  const themeColors = {
    graveyard:{ path1:'#4f3e22', path2:'#6b5530', edge:'rgba(0,0,0,0.4)' },
    urban:    { path1:'#505050', path2:'#707070', edge:'rgba(0,0,0,0.5)' },
    volcanic: { path1:'#3d1500', path2:'#552000', edge:'rgba(180,60,0,0.5)' },
    arctic:   { path1:'#8ab4d4', path2:'#c0d8f0', edge:'rgba(200,235,255,0.3)' },
    hell:     { path1:'#600000', path2:'#880000', edge:'rgba(200,0,0,0.5)' },
    nuclear:  { path1:'#506800', path2:'#708000', edge:'rgba(160,200,0,0.3)' },
    shadow:   { path1:'#2a0060', path2:'#400090', edge:'rgba(120,0,255,0.4)' },
    omega:    { path1:'#400000', path2:'#660000', edge:'rgba(220,0,30,0.5)' },
  };
  const tc = themeColors[map.theme] || themeColors.graveyard;

  ctx.save();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // Shadow
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = Math.max(tW,tH)*.9+4;
  ctx.beginPath();
  map.path.forEach(([c,r],i)=>{const px=c*tW+tW/2,py=r*tH+tH/2; i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);});
  ctx.stroke();
  // Edge
  ctx.strokeStyle = tc.edge;
  ctx.lineWidth = Math.max(tW,tH)*.88+2;
  ctx.globalAlpha=0.7;
  ctx.beginPath();
  map.path.forEach(([c,r],i)=>{const px=c*tW+tW/2,py=r*tH+tH/2; i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);});
  ctx.stroke(); ctx.globalAlpha=1;
  // Main fill
  ctx.strokeStyle = tc.path1;
  ctx.lineWidth = Math.max(tW,tH)*.84;
  ctx.beginPath();
  map.path.forEach(([c,r],i)=>{const px=c*tW+tW/2,py=r*tH+tH/2; i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);});
  ctx.stroke();
  // Center highlight
  ctx.strokeStyle = tc.path2;
  ctx.lineWidth = Math.max(tW,tH)*.3;
  ctx.globalAlpha=0.5;
  ctx.beginPath();
  map.path.forEach(([c,r],i)=>{const px=c*tW+tW/2,py=r*tH+tH/2; i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);});
  ctx.stroke(); ctx.globalAlpha=1;
  ctx.restore();

  // Start portal
  const [sc,sr] = map.path[0];
  const scx=sc*tW+tW/2, scy=sr*tH+tH/2, sr2=Math.min(tW,tH)*.42;
  const sg=ctx.createRadialGradient(scx,scy,sr2*.2,scx,scy,sr2*1.3);
  sg.addColorStop(0,'rgba(46,204,113,0.5)'); sg.addColorStop(1,'rgba(39,174,96,0)');
  ctx.fillStyle=sg; ctx.fillRect(sc*tW-tW,sr*tH-tH,tW*3,tH*3);
  ctx.strokeStyle='#2ecc71'; ctx.lineWidth=Math.min(tW,tH)*.08;
  ctx.beginPath(); ctx.arc(scx,scy,sr2,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='rgba(46,204,113,0.4)'; ctx.beginPath(); ctx.arc(scx,scy,sr2*.7,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#fff'; ctx.font=`bold ${Math.floor(Math.min(tH,tW)*.45)}px monospace`;
  ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('S',scx,scy);

  // End portal
  const [ec,er] = map.path[map.path.length-1];
  const ecx=ec*tW+tW/2, ecy=er*tH+tH/2;
  const eg2=ctx.createRadialGradient(ecx,ecy,sr2*.2,ecx,ecy,sr2*1.3);
  eg2.addColorStop(0,'rgba(231,76,60,0.5)'); eg2.addColorStop(1,'rgba(192,57,43,0)');
  ctx.fillStyle=eg2; ctx.fillRect(ec*tW-tW,er*tH-tH,tW*3,tH*3);
  ctx.strokeStyle='#e74c3c'; ctx.lineWidth=Math.min(tW,tH)*.08;
  ctx.beginPath(); ctx.arc(ecx,ecy,sr2,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='rgba(192,57,43,0.4)'; ctx.beginPath(); ctx.arc(ecx,ecy,sr2*.7,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#fff'; ctx.fillText('E',ecx,ecy);
}


// ── Map decoration canvas drawing — theme based, no emojis ──
function _drawMapDeco(c, theme, x, y, s, rng) {
  const pick = rng();
  c.save();
  c.translate(x, y);
  c.scale(s/14, s/14);

  switch(theme) {
    case 'graveyard': {
      if (pick < 0.4) {
        // Gravestone
        c.fillStyle = '#7f8c8d';
        c.beginPath(); c.roundRect(-5, -10, 10, 14, 2); c.fill();
        c.fillStyle = '#95a5a6';
        c.beginPath(); c.arc(0, -10, 5, Math.PI, 0); c.fill();
        c.fillStyle = '#555';
        c.fillRect(-3, -8, 6, 1.5);
        c.fillRect(-1.5, -9.5, 3, 4);
      } else if (pick < 0.75) {
        // Dead tree
        c.strokeStyle = '#4a3728'; c.lineWidth = 2.5; c.lineCap = 'round';
        c.beginPath(); c.moveTo(0, 12); c.lineTo(0, -4); c.stroke();
        c.beginPath(); c.moveTo(0, 2); c.lineTo(-7, -5); c.stroke();
        c.beginPath(); c.moveTo(0, -1); c.lineTo(7, -7); c.stroke();
        c.beginPath(); c.moveTo(0, -4); c.lineTo(-4, -10); c.stroke();
        c.beginPath(); c.moveTo(0, -4); c.lineTo(5, -11); c.stroke();
      } else {
        // Fog wisps
        c.fillStyle = 'rgba(200,220,200,0.5)';
        c.beginPath(); c.ellipse(0, 0, 10, 4, 0, 0, Math.PI*2); c.fill();
        c.beginPath(); c.ellipse(-5, 3, 7, 3, 0, 0, Math.PI*2); c.fill();
      }
      break;
    }
    case 'urban': {
      if (pick < 0.35) {
        // Ruined wall stub
        c.fillStyle = '#555';
        c.fillRect(-8, -4, 6, 14);
        c.fillStyle = '#444';
        c.fillRect(-8, -4, 6, 3);
        c.fillRect(-8, 2, 6, 3);
        c.fillStyle = '#666';
        c.fillRect(2, 2, 7, 8);
        c.fillStyle = '#4a4a4a';
        c.fillRect(2, 2, 7, 2.5);
      } else if (pick < 0.65) {
        // Wrecked car chassis
        c.fillStyle = '#7f8c8d';
        c.beginPath(); c.roundRect(-10, -4, 20, 8, 2); c.fill();
        c.fillStyle = '#555';
        c.beginPath(); c.roundRect(-8, -7, 16, 6, 2); c.fill();
        c.fillStyle = '#222';
        c.beginPath(); c.arc(-6, 5, 4, 0, Math.PI*2); c.fill();
        c.beginPath(); c.arc(6, 5, 4, 0, Math.PI*2); c.fill();
      } else {
        // Lamppost
        c.strokeStyle = '#888'; c.lineWidth = 2; c.lineCap = 'round';
        c.beginPath(); c.moveTo(0, 12); c.lineTo(0, -8); c.stroke();
        c.beginPath(); c.moveTo(0, -8); c.quadraticCurveTo(0, -13, 6, -13); c.stroke();
        c.fillStyle = '#ffe082';
        c.beginPath(); c.arc(6, -13, 2.5, 0, Math.PI*2); c.fill();
      }
      break;
    }
    case 'volcanic': {
      if (pick < 0.4) {
        // Rock formation
        c.fillStyle = '#4a2c0a';
        c.beginPath(); c.moveTo(-10,12); c.lineTo(-12,-4); c.lineTo(-4,-12); c.lineTo(4,-10); c.lineTo(12,-2); c.lineTo(10,12); c.fill();
        c.fillStyle = '#5a3812';
        c.beginPath(); c.moveTo(-4,-12); c.lineTo(4,-10); c.lineTo(2,-6); c.lineTo(-2,-8); c.fill();
      } else if (pick < 0.7) {
        // Lava crack
        c.strokeStyle = '#e64a19'; c.lineWidth = 2.5;
        c.beginPath(); c.moveTo(-10,-3); c.lineTo(-4,2); c.lineTo(0,-1); c.lineTo(6,4); c.lineTo(10,1); c.stroke();
        c.strokeStyle = '#ff6d00'; c.lineWidth = 1;
        c.beginPath(); c.moveTo(-10,-3); c.lineTo(-4,2); c.lineTo(0,-1); c.lineTo(6,4); c.lineTo(10,1); c.stroke();
      } else {
        // Crystal shard
        c.fillStyle = '#880e4f';
        c.beginPath(); c.moveTo(0,-13); c.lineTo(5,-2); c.lineTo(3,12); c.lineTo(-3,12); c.lineTo(-5,-2); c.closePath(); c.fill();
        c.fillStyle = '#ad1457';
        c.beginPath(); c.moveTo(0,-13); c.lineTo(5,-2); c.lineTo(0,0); c.lineTo(-5,-2); c.fill();
      }
      break;
    }
    case 'arctic': {
      if (pick < 0.4) {
        // Ice spike cluster
        c.fillStyle = '#b3e5fc';
        for(let i=-1;i<=1;i++){
          c.save(); c.translate(i*5,0); c.rotate(i*.2);
          c.beginPath(); c.moveTo(-2.5,10); c.lineTo(0,-12+Math.abs(i)*3); c.lineTo(2.5,10); c.fill();
          c.restore();
        }
      } else if (pick < 0.7) {
        // Snow mound
        c.fillStyle = '#e1f5fe';
        c.beginPath(); c.ellipse(0, 4, 11, 6, 0, 0, Math.PI*2); c.fill();
        c.fillStyle = '#fff';
        c.beginPath(); c.ellipse(0, 0, 8, 5, 0, 0, Math.PI*2); c.fill();
      } else {
        // Penguin silhouette
        c.fillStyle = '#212121';
        c.beginPath(); c.ellipse(0, 2, 5, 8, 0, 0, Math.PI*2); c.fill();
        c.beginPath(); c.arc(0, -8, 5, 0, Math.PI*2); c.fill();
        c.fillStyle = '#fff';
        c.beginPath(); c.ellipse(0, 3, 3, 5, 0, 0, Math.PI*2); c.fill();
        c.fillStyle = '#f57f17';
        c.beginPath(); c.moveTo(-2,-6); c.lineTo(2,-6); c.lineTo(0,-4); c.fill();
      }
      break;
    }
    case 'hell': {
      if (pick < 0.35) {
        // Bone pile
        c.fillStyle = '#bcaaa4';
        c.beginPath(); c.ellipse(0, 8, 9, 4, 0, 0, Math.PI*2); c.fill();
        c.strokeStyle = '#d7ccc8'; c.lineWidth = 2.5; c.lineCap = 'round';
        c.beginPath(); c.moveTo(-8, 4); c.lineTo(8, 4); c.stroke();
        c.beginPath(); c.moveTo(-6, 0); c.lineTo(6, 8); c.stroke();
        c.fillStyle = '#bcaaa4';
        c.beginPath(); c.arc(0, -4, 5, 0, Math.PI*2); c.fill();
        c.fillStyle = '#d7ccc8';
        c.beginPath(); c.arc(-2.5, -6, 2, 0, Math.PI*2); c.fill();
        c.beginPath(); c.arc(2.5, -6, 2, 0, Math.PI*2); c.fill();
      } else if (pick < 0.65) {
        // Fire pillar
        c.fillStyle = '#b71c1c';
        c.beginPath(); c.moveTo(-5,12); c.quadraticCurveTo(-7,-2,0,-14); c.quadraticCurveTo(7,-2,5,12); c.fill();
        c.fillStyle = '#e53935';
        c.beginPath(); c.moveTo(-3,12); c.quadraticCurveTo(-4,0,0,-9); c.quadraticCurveTo(4,0,3,12); c.fill();
        c.fillStyle = '#ff8f00';
        c.beginPath(); c.moveTo(-1.5,12); c.quadraticCurveTo(-2,4,0,-3); c.quadraticCurveTo(2,4,1.5,12); c.fill();
      } else {
        // Demon skull
        c.fillStyle = '#5d4037';
        c.beginPath(); c.arc(0,-2,8,0,Math.PI*2); c.fill();
        c.fillRect(-5,3,10,8);
        c.fillStyle = '#b71c1c';
        c.beginPath(); c.arc(-3,-3,2.5,0,Math.PI*2); c.fill();
        c.beginPath(); c.arc(3,-3,2.5,0,Math.PI*2); c.fill();
        c.fillStyle = '#5d4037';
        for(let i=0;i<4;i++) c.fillRect(-4+i*2.5,4,1.8,5);
      }
      break;
    }
    case 'nuclear': {
      if (pick < 0.35) {
        // Radiation sign
        c.strokeStyle = '#f9a825'; c.lineWidth = 1.5;
        c.beginPath(); c.arc(0,0,12,0,Math.PI*2); c.stroke();
        c.beginPath(); c.arc(0,0,4,0,Math.PI*2); c.fillStyle='#f9a825'; c.fill();
        for(let i=0;i<3;i++){
          const a=i/3*Math.PI*2-Math.PI/2;
          c.fillStyle='#f9a825';
          c.beginPath();
          c.moveTo(Math.cos(a)*5,Math.sin(a)*5);
          c.arc(0,0,11,a+.3,a+Math.PI/1.5-0.3);
          c.closePath(); c.fill();
        }
      } else if (pick < 0.7) {
        // Mutant plant
        c.strokeStyle = '#558b2f'; c.lineWidth = 2; c.lineCap = 'round';
        c.beginPath(); c.moveTo(0,12); c.lineTo(0,-2); c.stroke();
        c.fillStyle = '#33691e';
        c.beginPath(); c.ellipse(-6,-6,7,4,-0.5,0,Math.PI*2); c.fill();
        c.beginPath(); c.ellipse(6,-8,7,4,0.5,0,Math.PI*2); c.fill();
        c.beginPath(); c.ellipse(0,-11,5,3,0,0,Math.PI*2); c.fill();
        c.fillStyle = '#8bc34a';
        c.beginPath(); c.arc(0,-11,2,0,Math.PI*2); c.fill();
      } else {
        // Barrel
        c.fillStyle = '#33691e';
        c.beginPath(); c.roundRect(-6,-10,12,20,2); c.fill();
        c.fillStyle = '#1b5e20';
        c.fillRect(-6,-2,12,3); c.fillRect(-6,4,12,3);
        c.fillStyle = '#f9a825';
        c.fillRect(-3,-7,6,5);
        // Biohazard mini
        c.fillStyle = '#558b2f';
        c.beginPath(); c.arc(-1,-4,1.5,0,Math.PI*2); c.fill();
      }
      break;
    }
    case 'shadow': {
      if (pick < 0.4) {
        // Candle
        c.fillStyle = '#795548';
        c.beginPath(); c.roundRect(-3, -2, 6, 14, 1); c.fill();
        c.fillStyle = '#fff8e1';
        c.beginPath(); c.ellipse(0,-2,3,2,0,0,Math.PI*2); c.fill();
        // Flame
        c.fillStyle = '#ff6d00';
        c.beginPath(); c.moveTo(0,-13); c.quadraticCurveTo(4,-8,0,-3); c.quadraticCurveTo(-4,-8,0,-13); c.fill();
        c.fillStyle = '#ffe082';
        c.beginPath(); c.moveTo(0,-11); c.quadraticCurveTo(2,-8,0,-5); c.quadraticCurveTo(-2,-8,0,-11); c.fill();
      } else if (pick < 0.7) {
        // Floating eye
        c.fillStyle = 'rgba(30,0,60,0.8)';
        c.beginPath(); c.ellipse(0,0,11,7,0,0,Math.PI*2); c.fill();
        c.fillStyle = '#7b1fa2';
        c.beginPath(); c.arc(0,0,5,0,Math.PI*2); c.fill();
        c.fillStyle = '#e040fb';
        c.beginPath(); c.arc(0,0,3,0,Math.PI*2); c.fill();
        c.fillStyle = '#000';
        c.beginPath(); c.arc(0,0,1.5,0,Math.PI*2); c.fill();
        c.fillStyle = '#fff';
        c.beginPath(); c.arc(-1,-1,0.8,0,Math.PI*2); c.fill();
      } else {
        // Shadow void rift
        c.fillStyle = 'rgba(20,0,40,0.9)';
        c.beginPath(); c.ellipse(0,0,10,6,0,0,Math.PI*2); c.fill();
        c.strokeStyle = '#7c4dff'; c.lineWidth=1.5;
        c.beginPath(); c.ellipse(0,0,10,6,0,0,Math.PI*2); c.stroke();
        c.fillStyle='#ea80fc';
        c.beginPath(); c.arc(0,0,2,0,Math.PI*2); c.fill();
      }
      break;
    }
    case 'omega': {
      if (pick < 0.35) {
        // Red warning light
        c.fillStyle = '#1a0000';
        c.beginPath(); c.roundRect(-4,-10,8,20,2); c.fill();
        c.fillStyle = '#e53935';
        c.beginPath(); c.arc(0,-7,4,0,Math.PI*2); c.fill();
        c.fillStyle='#ff8a80';
        c.beginPath(); c.arc(-1,-8,1.5,0,Math.PI*2); c.fill();
        c.fillStyle='#e53935'; c.globalAlpha=0.3;
        c.beginPath(); c.arc(0,-7,8,0,Math.PI*2); c.fill();
      } else if (pick < 0.65) {
        // Tech pillar
        c.fillStyle = '#0a0a1a';
        c.beginPath(); c.roundRect(-5,-12,10,24,1); c.fill();
        c.fillStyle = '#1a237e';
        c.fillRect(-4,-8,8,4); c.fillRect(-4,0,8,4);
        c.fillStyle = '#304ffe';
        c.fillRect(-3,-7,6,2); c.fillRect(-3,1,6,2);
        c.fillStyle = '#e53935';
        c.beginPath(); c.arc(0,8,2,0,Math.PI*2); c.fill();
      } else {
        // Cracked floor mark
        c.strokeStyle = '#b71c1c'; c.lineWidth = 1.5; c.lineCap = 'round';
        c.beginPath(); c.moveTo(0,-12); c.lineTo(-3,-4); c.lineTo(5,0); c.lineTo(-2,6); c.lineTo(3,12); c.stroke();
        c.strokeStyle = '#ff1744'; c.lineWidth = 0.8;
        c.globalAlpha *= 0.5;
        c.beginPath(); c.moveTo(0,-12); c.lineTo(-3,-4); c.lineTo(5,0); c.lineTo(-2,6); c.lineTo(3,12); c.stroke();
      }
      break;
    }
    default: {
      c.fillStyle = '#444';
      c.beginPath(); c.arc(0,0,s,0,Math.PI*2); c.fill();
    }
  }
  c.restore();
}

function mulberry32Preview(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t>>>15, t|1);
    t ^= t + Math.imul(t ^ t>>>7, t|61);
    return ((t ^ t>>>14)>>>0) / 0xFFFFFFFF;
  };
}
