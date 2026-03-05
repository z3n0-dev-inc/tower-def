/* ═══════════════════════════════════════════════
   maps.js — 8 maps with hand-designed paths
   Each map has a unique shape: S-curves, spirals,
   switchbacks, figure-eights, labyrinth serpentines
   ═══════════════════════════════════════════════ */

const MAPS = [
  {
    id: 'graveyard',
    name: 'GRAVEYARD',
    theme: 'graveyard',
    difficulty: 1,
    waves: 15,
    description: 'A foggy cemetery. Long S-curve with a sweeping turn.',
    bgColor: '#1a2a15', pathColor: '#4a3820',
    grassColor: '#1e3018', accentColor: '#2d4a28',
    decorations: ['🪦','🌲','🌫️'],
    unlocked: true,
    cols: 20, rows: 14,
    path: [
      [0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[6,5],[6,4],[6,3],
      [6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[13,2],[14,2],[14,3],
      [14,4],[14,5],[14,6],[15,6],[16,6],[17,6],[18,6],[18,7],[18,8],[18,9],
      [18,10],[17,10],[16,10],[15,10],[14,10],[13,10],[12,10],[11,10],[10,10],[9,10],
      [8,10],[7,10],[6,10],[5,10],[4,10],[4,11],[4,12],[4,13],[5,13],[6,13],
      [7,13],[8,13],[9,13],[10,13],[11,13],[12,13],[13,13],[14,13],[15,13],[16,13],
      [17,13],[18,13],[19,13]
    ],
    startGold: 150, livesStart: 25, waveModifier: 1.0,
  },
  {
    id: 'city_ruins',
    name: 'CITY RUINS',
    theme: 'urban',
    difficulty: 2,
    waves: 18,
    description: 'Overrun streets. Double-back loop through city blocks.',
    bgColor: '#1a1a1a', pathColor: '#555',
    grassColor: '#222', accentColor: '#333',
    decorations: ['🏚️','🚗','💡'],
    unlocked: false,
    cols: 22, rows: 14,
    path: [
      [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[8,2],
      [8,3],[8,4],[8,5],[8,6],[7,6],[6,6],[5,6],[4,6],[3,6],[2,6],
      [2,7],[2,8],[2,9],[2,10],[3,10],[4,10],[5,10],[6,10],[7,10],[8,10],
      [9,10],[10,10],[11,10],[12,10],[12,9],[12,8],[12,7],[12,6],[12,5],[13,5],
      [14,5],[15,5],[16,5],[17,5],[18,5],[19,5],[20,5],[20,6],[20,7],[20,8],
      [20,9],[20,10],[20,11],[19,11],[18,11],[17,11],[16,11],[15,11],[14,11],[13,11],
      [12,11],[11,11],[10,11],[10,12],[10,13],[11,13],[12,13],[13,13],[14,13],[15,13],
      [16,13],[17,13],[18,13],[19,13],[20,13],[21,13]
    ],
    startGold: 175, livesStart: 20, waveModifier: 1.3,
  },
  {
    id: 'volcano',
    name: 'VOLCANO',
    theme: 'volcanic',
    difficulty: 3,
    waves: 22,
    description: 'Lava channels. Three-lane serpentine through molten rock.',
    bgColor: '#1a0a00', pathColor: '#3a1500',
    grassColor: '#1f0d00', accentColor: '#5a1a00',
    decorations: ['🌋','🔥','💎'],
    unlocked: false,
    cols: 22, rows: 15,
    path: [
      [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],
      [10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[17,2],[17,3],
      [17,4],[17,5],[17,6],[16,6],[15,6],[14,6],[13,6],[12,6],[11,6],[10,6],
      [9,6],[8,6],[7,6],[6,6],[5,6],[4,6],[3,6],[3,7],[3,8],[3,9],
      [3,10],[4,10],[5,10],[6,10],[7,10],[8,10],[9,10],[10,10],[11,10],[12,10],
      [13,10],[14,10],[15,10],[16,10],[17,10],[18,10],[18,11],[18,12],[18,13],[19,13],
      [20,13],[21,13]
    ],
    startGold: 200, livesStart: 18, waveModifier: 1.7,
  },
  {
    id: 'arctic',
    name: 'ARCTIC BASE',
    theme: 'arctic',
    difficulty: 4,
    waves: 25,
    description: 'Frozen tundra. Six-pass serpentine — very long path.',
    bgColor: '#0a1525', pathColor: '#a8c8e8',
    grassColor: '#0d1e33', accentColor: '#1a3050',
    decorations: ['🏔️','❄️','🐧'],
    unlocked: false,
    cols: 26, rows: 15,
    path: [
      [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],
      [10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],
      [20,1],[21,1],[22,1],[23,1],[24,1],[24,2],[24,3],[23,3],[22,3],[21,3],
      [20,3],[19,3],[18,3],[17,3],[16,3],[15,3],[14,3],[13,3],[12,3],[11,3],
      [10,3],[9,3],[8,3],[7,3],[6,3],[5,3],[4,3],[3,3],[3,4],[3,5],
      [4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],[12,5],[13,5],
      [14,5],[15,5],[16,5],[17,5],[18,5],[19,5],[20,5],[21,5],[22,5],[23,5],
      [24,5],[24,6],[24,7],[23,7],[22,7],[21,7],[20,7],[19,7],[18,7],[17,7],
      [16,7],[15,7],[14,7],[13,7],[12,7],[11,7],[10,7],[9,7],[8,7],[7,7],
      [6,7],[5,7],[4,7],[3,7],[2,7],[2,8],[2,9],[3,9],[4,9],[5,9],
      [6,9],[7,9],[8,9],[9,9],[10,9],[11,9],[12,9],[13,9],[14,9],[15,9],
      [16,9],[17,9],[18,9],[19,9],[20,9],[21,9],[22,9],[23,9],[24,9],[24,10],
      [24,11],[23,11],[22,11],[21,11],[20,11],[19,11],[18,11],[17,11],[16,11],[15,11],
      [14,11],[13,11],[12,11],[11,11],[10,11],[9,11],[8,11],[7,11],[6,11],[5,11],
      [4,11],[3,11],[2,11],[1,11],[1,12],[2,12],[3,12],[4,12],[5,12],[6,12],
      [7,12],[8,12],[9,12],[10,12],[11,12],[12,12],[13,12],[14,12],[15,12],[16,12],
      [17,12],[18,12],[19,12],[20,12],[21,12],[22,12],[23,12],[24,12],[25,12]
    ],
    startGold: 225, livesStart: 15, waveModifier: 2.0,
  },
  {
    id: 'inferno',
    name: 'INFERNO',
    theme: 'hell',
    difficulty: 5,
    waves: 28,
    description: 'Hellfire maze. Enemies charge in from three angles.',
    bgColor: '#0f0000', pathColor: '#5a0000',
    grassColor: '#1a0000', accentColor: '#3a0000',
    decorations: ['👹','💀','🔥'],
    unlocked: false,
    cols: 24, rows: 15,
    path: [
      [0,7],[1,7],[2,7],[3,7],[3,6],[3,5],[3,4],[3,3],[3,2],[4,2],
      [5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[13,2],[14,2],
      [15,2],[16,2],[17,2],[18,2],[19,2],[20,2],[21,2],[21,3],[21,4],[21,5],
      [21,6],[21,7],[20,7],[19,7],[18,7],[17,7],[16,7],[15,7],[14,7],[13,7],
      [12,7],[11,7],[10,7],[9,7],[8,7],[7,7],[7,8],[7,9],[7,10],[7,11],
      [7,12],[8,12],[9,12],[10,12],[11,12],[12,12],[13,12],[14,12],[15,12],[16,12],
      [17,12],[18,12],[19,12],[20,12],[21,12],[22,12],[23,12]
    ],
    startGold: 250, livesStart: 12, waveModifier: 2.5,
  },
  {
    id: 'nuclear_wasteland',
    name: 'NUCLEAR WASTELAND',
    theme: 'nuclear',
    difficulty: 6,
    waves: 32,
    description: 'Irradiated maze. Eight tight switchbacks. No room for error.',
    bgColor: '#0d1a00', pathColor: '#4a6600',
    grassColor: '#0f1f00', accentColor: '#2a3d00',
    decorations: ['☢️','💚','🌿'],
    unlocked: false,
    cols: 26, rows: 16,
    path: [
      [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],
      [10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],
      [20,1],[21,1],[22,1],[23,1],[24,1],[24,2],[24,3],[23,3],[22,3],[21,3],
      [20,3],[19,3],[18,3],[17,3],[16,3],[15,3],[14,3],[13,3],[12,3],[11,3],
      [10,3],[9,3],[8,3],[7,3],[6,3],[5,3],[4,3],[4,4],[4,5],[5,5],
      [6,5],[7,5],[8,5],[9,5],[10,5],[11,5],[12,5],[13,5],[14,5],[15,5],
      [16,5],[17,5],[18,5],[19,5],[20,5],[21,5],[22,5],[22,6],[22,7],[21,7],
      [20,7],[19,7],[18,7],[17,7],[16,7],[15,7],[14,7],[13,7],[12,7],[11,7],
      [10,7],[9,7],[8,7],[7,7],[6,7],[5,7],[4,7],[3,7],[3,8],[3,9],
      [4,9],[5,9],[6,9],[7,9],[8,9],[9,9],[10,9],[11,9],[12,9],[13,9],
      [14,9],[15,9],[16,9],[17,9],[18,9],[19,9],[20,9],[21,9],[22,9],[23,9],
      [23,10],[23,11],[22,11],[21,11],[20,11],[19,11],[18,11],[17,11],[16,11],[15,11],
      [14,11],[13,11],[12,11],[11,11],[10,11],[9,11],[8,11],[7,11],[6,11],[5,11],
      [4,11],[3,11],[2,11],[2,12],[2,13],[3,13],[4,13],[5,13],[6,13],[7,13],
      [8,13],[9,13],[10,13],[11,13],[12,13],[13,13],[14,13],[15,13],[16,13],[17,13],
      [18,13],[19,13],[20,13],[21,13],[22,13],[23,13],[24,13],[25,13]
    ],
    startGold: 275, livesStart: 10, waveModifier: 3.2,
  },
  {
    id: 'shadow_realm',
    name: 'SHADOW REALM',
    theme: 'shadow',
    difficulty: 7,
    waves: 36,
    description: 'Invisible enemies. Ten-pass labyrinth. Elites from wave 5.',
    bgColor: '#05050f', pathColor: '#2a0060',
    grassColor: '#08080f', accentColor: '#150030',
    decorations: ['🌑','👁️','🕯️'],
    unlocked: false,
    cols: 28, rows: 16,
    path: [
      [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],
      [10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],
      [20,1],[21,1],[22,1],[23,1],[24,1],[25,1],[26,1],[26,2],[26,3],[25,3],
      [24,3],[23,3],[22,3],[21,3],[20,3],[19,3],[18,3],[17,3],[16,3],[15,3],
      [14,3],[13,3],[12,3],[11,3],[10,3],[9,3],[8,3],[7,3],[6,3],[5,3],
      [4,3],[4,4],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],
      [12,5],[13,5],[14,5],[15,5],[16,5],[17,5],[18,5],[19,5],[20,5],[21,5],
      [22,5],[23,5],[24,5],[25,5],[25,6],[25,7],[24,7],[23,7],[22,7],[21,7],
      [20,7],[19,7],[18,7],[17,7],[16,7],[15,7],[14,7],[13,7],[12,7],[11,7],
      [10,7],[9,7],[8,7],[7,7],[6,7],[5,7],[4,7],[3,7],[3,8],[3,9],
      [4,9],[5,9],[6,9],[7,9],[8,9],[9,9],[10,9],[11,9],[12,9],[13,9],
      [14,9],[15,9],[16,9],[17,9],[18,9],[19,9],[20,9],[21,9],[22,9],[23,9],
      [24,9],[25,9],[25,10],[25,11],[24,11],[23,11],[22,11],[21,11],[20,11],[19,11],
      [18,11],[17,11],[16,11],[15,11],[14,11],[13,11],[12,11],[11,11],[10,11],[9,11],
      [8,11],[7,11],[6,11],[5,11],[4,11],[3,11],[3,12],[3,13],[4,13],[5,13],
      [6,13],[7,13],[8,13],[9,13],[10,13],[11,13],[12,13],[13,13],[14,13],[15,13],
      [16,13],[17,13],[18,13],[19,13],[20,13],[21,13],[22,13],[23,13],[24,13],[25,13],
      [26,13],[27,13]
    ],
    startGold: 300, livesStart: 8, waveModifier: 3.8,
  },
  {
    id: 'omega_facility',
    name: 'OMEGA FACILITY',
    theme: 'omega',
    difficulty: 8,
    waves: 42,
    description: 'ENDGAME. The grand spiral. 272 tiles. Legends only.',
    bgColor: '#000005', pathColor: '#ff0030',
    grassColor: '#020208', accentColor: '#0a000f',
    decorations: ['💀','⚠️','🔴'],
    unlocked: false,
    cols: 30, rows: 16,
    path: [
      [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],
      [10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1],[18,1],[19,1],
      [20,1],[21,1],[22,1],[23,1],[24,1],[25,1],[26,1],[27,1],[28,1],[28,2],
      [27,2],[26,2],[25,2],[24,2],[23,2],[22,2],[21,2],[20,2],[19,2],[18,2],
      [17,2],[16,2],[15,2],[14,2],[13,2],[12,2],[11,2],[10,2],[9,2],[8,2],
      [7,2],[6,2],[5,2],[4,2],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],
      [10,3],[11,3],[12,3],[13,3],[14,3],[15,3],[16,3],[17,3],[18,3],[19,3],
      [20,3],[21,3],[22,3],[23,3],[24,3],[25,3],[26,3],[27,3],[27,4],[26,4],
      [25,4],[24,4],[23,4],[22,4],[21,4],[20,4],[19,4],[18,4],[17,4],[16,4],
      [15,4],[14,4],[13,4],[12,4],[11,4],[10,4],[9,4],[8,4],[7,4],[6,4],
      [5,4],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],[12,5],[13,5],
      [14,5],[15,5],[16,5],[17,5],[18,5],[19,5],[20,5],[21,5],[22,5],[23,5],
      [24,5],[25,5],[26,5],[27,5],[27,6],[26,6],[25,6],[24,6],[23,6],[22,6],
      [21,6],[20,6],[19,6],[18,6],[17,6],[16,6],[15,6],[14,6],[13,6],[12,6],
      [11,6],[10,6],[9,6],[8,6],[7,6],[6,6],[5,6],[4,6],[4,7],[5,7],
      [6,7],[7,7],[8,7],[9,7],[10,7],[11,7],[12,7],[13,7],[14,7],[15,7],
      [16,7],[17,7],[18,7],[19,7],[20,7],[21,7],[22,7],[23,7],[24,7],[25,7],
      [26,7],[27,7],[27,8],[27,9],[26,9],[25,9],[24,9],[23,9],[22,9],[21,9],
      [20,9],[19,9],[18,9],[17,9],[16,9],[15,9],[14,9],[13,9],[12,9],[11,9],
      [10,9],[9,9],[8,9],[7,9],[6,9],[5,9],[4,9],[4,10],[4,11],[5,11],
      [6,11],[7,11],[8,11],[9,11],[10,11],[11,11],[12,11],[13,11],[14,11],[15,11],
      [16,11],[17,11],[18,11],[19,11],[20,11],[21,11],[22,11],[23,11],[24,11],[25,11],
      [26,11],[26,12],[25,12],[24,12],[23,12],[22,12],[21,12],[20,12],[19,12],[18,12],
      [17,12],[16,12],[15,12],[14,12],[13,12],[12,12],[11,12],[10,12],[9,12],[8,12],
      [7,12],[6,12],[5,12],[4,12],[3,12],[3,13],[4,13],[5,13],[6,13],[7,13],
      [8,13],[9,13],[10,13],[11,13],[12,13],[13,13],[14,13],[15,13],[16,13],[17,13],
      [18,13],[19,13],[20,13],[21,13],[22,13],[23,13],[24,13],[25,13],[26,13],[27,13],
      [28,13],[29,13]
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

// ══════════════════════════════════════════════
// drawMapPreview — rich canvas art per theme
// ══════════════════════════════════════════════
function drawMapPreview(canvas, map) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const tW = W / map.cols, tH = H / map.rows;
  const seed = map.id.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
  const rng = mulberry32Preview(seed * 7 + 3);
  const rng2 = mulberry32Preview(seed * 13 + 9);

  const TC = {
    graveyard:{ bg1:'#141f10', bg2:'#1c2b15', acc:'#253d1c', fog:'rgba(140,200,120,0.05)' },
    urban:    { bg1:'#111214', bg2:'#181b1e', acc:'#242628', fog:null },
    volcanic: { bg1:'#120400', bg2:'#1c0700', acc:'#280c00', fog:'rgba(255,70,0,0.05)' },
    arctic:   { bg1:'#08111e', bg2:'#0c1928', acc:'#142035', fog:'rgba(180,220,255,0.05)' },
    hell:     { bg1:'#0c0000', bg2:'#130000', acc:'#1c0000', fog:'rgba(255,20,0,0.06)' },
    nuclear:  { bg1:'#091000', bg2:'#0f1800', acc:'#172300', fog:'rgba(100,190,0,0.04)' },
    shadow:   { bg1:'#020206', bg2:'#04040c', acc:'#080818', fog:'rgba(80,0,200,0.05)' },
    omega:    { bg1:'#000002', bg2:'#010006', acc:'#04000c', fog:'rgba(200,0,30,0.06)' },
  };
  const th = TC[map.theme] || TC.graveyard;

  // 1. Background gradient
  const bg = ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0, th.bg1); bg.addColorStop(0.6, th.bg2); bg.addColorStop(1, th.bg1);
  ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

  // 2. Ground texture
  for (let i = 0; i < 55; i++) {
    ctx.globalAlpha = 0.1 + rng()*0.18;
    ctx.fillStyle = th.acc;
    ctx.beginPath();
    ctx.ellipse(rng()*W, rng()*H, rng()*14+4, rng()*9+3, rng()*Math.PI, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // 3. Fine noise
  for (let i = 0; i < 180; i++) {
    ctx.globalAlpha = 0.07 + rng2()*0.14;
    ctx.fillStyle = th.acc;
    ctx.fillRect(rng2()*W, rng2()*H, rng2()<0.3?2:1, rng2()<0.3?2:1);
  }
  ctx.globalAlpha = 1;

  // 4. Theme FX
  if (map.theme === 'volcanic' || map.theme === 'hell') {
    for (let i = 0; i < 5; i++) {
      const lx = rng2()*W, ly = rng2()*H;
      const lg = ctx.createRadialGradient(lx,ly,0,lx,ly,28);
      lg.addColorStop(0, map.theme==='hell'?'rgba(180,0,0,0.22)':'rgba(255,60,0,0.18)');
      lg.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=lg; ctx.fillRect(0,0,W,H);
    }
  }
  if (map.theme === 'arctic') {
    for (let i = 0; i < 7; i++) {
      ctx.globalAlpha = 0.05 + rng2()*0.07; ctx.fillStyle='#b3e5fc';
      ctx.beginPath(); ctx.ellipse(rng2()*W,rng2()*H,rng2()*22+8,rng2()*14+5,rng2()*Math.PI,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  if (map.theme === 'nuclear') {
    for (let i = 0; i < 5; i++) {
      ctx.globalAlpha = 0.1+rng2()*0.12; ctx.fillStyle='#a4c400';
      ctx.beginPath(); ctx.ellipse(rng2()*W,rng2()*H,rng2()*18+6,rng2()*11+4,rng2()*Math.PI,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  if (map.theme === 'shadow' || map.theme === 'omega') {
    ctx.strokeStyle = map.theme==='omega'?'rgba(180,0,20,0.28)':'rgba(80,0,180,0.22)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.globalAlpha = 0.3+rng2()*0.4; ctx.beginPath();
      let cx2=rng2()*W, cy2=rng2()*H; ctx.moveTo(cx2,cy2);
      for(let j=0;j<4;j++){cx2+=(rng2()-0.5)*42;cy2+=(rng2()-0.5)*38;ctx.lineTo(cx2,cy2);}
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  // 5. Path colors
  const PC = {
    graveyard:{ p1:'#4f3e22', p2:'#6b5530', edge:'rgba(0,0,0,0.5)',   hi:'rgba(255,255,255,0.07)' },
    urban:    { p1:'#484848', p2:'#686868', edge:'rgba(0,0,0,0.6)',   hi:'rgba(255,255,255,0.06)' },
    volcanic: { p1:'#3d1500', p2:'#5a2000', edge:'rgba(200,60,0,0.5)',hi:'rgba(255,100,0,0.07)' },
    arctic:   { p1:'#7aaac8', p2:'#b0d0e8', edge:'rgba(180,220,255,0.3)',hi:'rgba(255,255,255,0.12)' },
    hell:     { p1:'#580000', p2:'#800000', edge:'rgba(220,0,0,0.55)',hi:'rgba(255,0,0,0.07)' },
    nuclear:  { p1:'#445e00', p2:'#607a00', edge:'rgba(140,190,0,0.3)',hi:'rgba(180,240,0,0.06)' },
    shadow:   { p1:'#220055', p2:'#380090', edge:'rgba(100,0,240,0.4)',hi:'rgba(160,0,255,0.07)' },
    omega:    { p1:'#380000', p2:'#560000', edge:'rgba(220,0,30,0.5)',hi:'rgba(255,0,30,0.08)' },
  };
  const pc = PC[map.theme] || PC.graveyard;
  const pw = Math.max(tW, tH);

  // Use tile-based path rendering if available (from game.js)
  const T = Math.min(tW, tH);
  if (typeof _makePathTile === 'function' && typeof _getPathTileType === 'function') {
    const tileCache = {};
    ['h','v','tl','tr','bl','br'].forEach(tp => {
      const tile = _makePathTile(T, tp, map.theme);
      if (tile) tileCache[tp] = tile;
    });
    map.path.forEach(([c, r], idx) => {
      const tp = _getPathTileType(map.path, idx);
      const tile = tileCache[tp];
      if (tile) ctx.drawImage(tile, c * tW, r * tH, tW, tH);
    });
  } else {
    // Fallback stroked path
    const strokePath = (lw, col, alpha, dash) => {
      ctx.save();
      if (alpha!==undefined) ctx.globalAlpha = alpha;
      if (dash) ctx.setLineDash(dash);
      ctx.strokeStyle = col; ctx.lineWidth = T * lw;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      map.path.forEach(([c,r],i)=>{
        const px2=c*tW+tW/2, py2=r*tH+tH/2;
        i===0?ctx.moveTo(px2,py2):ctx.lineTo(px2,py2);
      });
      ctx.stroke(); ctx.restore();
    };
    strokePath(1.05, 'rgba(0,0,0,0.75)');
    strokePath(0.88, pc.p1);
    strokePath(0.42, pc.p2, 0.68);
  }
  // Direction arrows along path
  _drawPathArrows(ctx, map, tW, tH, pc.p2);

  // 6. Decorations
  const dRng = mulberry32Preview(seed + 42);
  let placed = 0;
  for (let row = 0; row < map.rows && placed < 22; row++) {
    for (let col = 0; col < map.cols && placed < 22; col++) {
      if (map.pathSet && map.pathSet.has(`${col},${row}`)) continue;
      const ps = new Set(map.path.map(([c,r])=>`${c},${r}`));
      if (ps.has(`${col},${row}`)) continue;
      if (dRng() < 0.12) {
        const dx = col*tW+tW/2, dy = row*tH+tH/2, sz = tW*0.32;
        ctx.globalAlpha = 0.55 + dRng()*0.32;
        if (typeof _drawMapDeco === 'function') {
          _drawMapDeco(ctx, map.theme, dx, dy, Math.min(tW,tH)*0.42, dRng);
        } else {
          _drawPreviewDeco(ctx, map.theme, dx, dy, Math.min(tW,tH)*0.42, dRng);
        }
        placed++;
      }
    }
  }
  ctx.globalAlpha = 1;

  // 7. Fog & vignette
  if (th.fog) { ctx.fillStyle = th.fog; ctx.fillRect(0,0,W,H); }
  const vig = ctx.createRadialGradient(W/2,H/2,H*0.1,W/2,H/2,H*0.95);
  vig.addColorStop(0,'rgba(0,0,0,0)'); vig.addColorStop(1,'rgba(0,0,0,0.55)');
  ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);

  // 8. Portals
  const [sc,sr] = map.path[0], [ec,er] = map.path[map.path.length-1];
  _drawPortalPrev(ctx, sc*tW+tW/2, sr*tH+tH/2, Math.min(tW,tH)*0.5, '#27ae60','#2ecc71','S');
  _drawPortalPrev(ctx, ec*tW+tW/2, er*tH+tH/2, Math.min(tW,tH)*0.5, '#c0392b','#e74c3c','E');
}

// Draw small direction arrows periodically along path
function _drawPathArrows(ctx, map, tW, tH, color) {
  const path = map.path;
  const step = Math.max(4, Math.floor(path.length / 12));
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.55;
  for (let i = step; i < path.length - 1; i += step) {
    const [c,r] = path[i];
    const [nc,nr] = path[i+1];
    const x = c*tW+tW/2, y = r*tH+tH/2;
    const angle = Math.atan2(nr-r, nc-c);
    const sz = Math.min(tW,tH)*0.38;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(sz, 0);
    ctx.lineTo(-sz*0.5, -sz*0.5);
    ctx.lineTo(-sz*0.5, sz*0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function _drawPortalPrev(ctx, x, y, r, c1, c2, label) {
  const g = ctx.createRadialGradient(x,y,0,x,y,r*2.2);
  g.addColorStop(0,c2+'66'); g.addColorStop(1,c1+'00');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r*2.2,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=c2; ctx.lineWidth=r*0.22;
  ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle=c1+'99'; ctx.beginPath(); ctx.arc(x,y,r*0.68,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#fff'; ctx.font=`bold ${Math.floor(r*1.0)}px monospace`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.shadowBlur=5; ctx.shadowColor='#000';
  ctx.fillText(label,x,y); ctx.shadowBlur=0;
}

function _drawPreviewDeco(ctx, theme, x, y, s, rng) {
  ctx.save(); ctx.translate(x,y); ctx.scale(s/10,s/10);
  const p = rng();
  switch(theme) {
    case 'graveyard':
      if (p<0.4) {
        ctx.fillStyle='#7f8c8d';
        ctx.beginPath(); ctx.roundRect(-4.5,-9.5,9,13,1.5); ctx.fill();
        ctx.fillStyle='#95a5a6';
        ctx.beginPath(); ctx.arc(0,-9.5,4.5,Math.PI,0); ctx.fill();
        ctx.fillStyle='rgba(0,0,0,0.35)';
        ctx.fillRect(-3,-7.5,6,1.5); ctx.fillRect(-1.2,-9,2.5,4);
      } else if (p<0.75) {
        ctx.strokeStyle='#4a3728'; ctx.lineWidth=2.5; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(0,12); ctx.lineTo(0,-3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,2); ctx.lineTo(-7,-4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,-1); ctx.lineTo(7,-7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,-3); ctx.lineTo(-4,-10); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,-3); ctx.lineTo(5,-10); ctx.stroke();
      } else {
        ctx.fillStyle='rgba(180,210,165,0.45)';
        ctx.beginPath(); ctx.ellipse(0,0,10,4,0,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(-4,3,7,3,0,0,Math.PI*2); ctx.fill();
      }
      break;
    case 'urban':
      if (p<0.35) {
        ctx.fillStyle='#555'; ctx.fillRect(-7,-3,5.5,13); ctx.fillStyle='#666'; ctx.fillRect(2,2,6.5,8);
      } else if (p<0.65) {
        ctx.fillStyle='#7f8c8d'; ctx.beginPath(); ctx.roundRect(-9,-3,18,7,2); ctx.fill();
        ctx.fillStyle='#222'; ctx.beginPath(); ctx.arc(-5.5,5,3.5,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(5.5,5,3.5,0,Math.PI*2); ctx.fill();
      } else {
        ctx.strokeStyle='#888'; ctx.lineWidth=1.5; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(0,11); ctx.lineTo(0,-7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,-7); ctx.quadraticCurveTo(0,-12,5.5,-12); ctx.stroke();
        ctx.fillStyle='#ffe082'; ctx.beginPath(); ctx.arc(5.5,-12,2.2,0,Math.PI*2); ctx.fill();
      }
      break;
    case 'volcanic':
      if (p<0.4) {
        ctx.fillStyle='#4a2c0a';
        ctx.beginPath(); ctx.moveTo(-10,11); ctx.lineTo(-11,-3); ctx.lineTo(-3,-11); ctx.lineTo(3,-9); ctx.lineTo(11,-2); ctx.lineTo(10,11); ctx.fill();
      } else if (p<0.7) {
        ctx.strokeStyle='#e64a19'; ctx.lineWidth=2.5;
        ctx.beginPath(); ctx.moveTo(-9,-2); ctx.lineTo(-3,2); ctx.lineTo(0,-1); ctx.lineTo(5,4); ctx.lineTo(9,1); ctx.stroke();
        ctx.strokeStyle='#ff6d00'; ctx.lineWidth=0.9;
        ctx.beginPath(); ctx.moveTo(-9,-2); ctx.lineTo(-3,2); ctx.lineTo(0,-1); ctx.lineTo(5,4); ctx.lineTo(9,1); ctx.stroke();
      } else {
        ctx.fillStyle='#880e4f';
        ctx.beginPath(); ctx.moveTo(0,-12); ctx.lineTo(4.5,-2); ctx.lineTo(3,11); ctx.lineTo(-3,11); ctx.lineTo(-4.5,-2); ctx.closePath(); ctx.fill();
        ctx.fillStyle='#ad1457';
        ctx.beginPath(); ctx.moveTo(0,-12); ctx.lineTo(4.5,-2); ctx.lineTo(0,0); ctx.lineTo(-4.5,-2); ctx.fill();
      }
      break;
    case 'arctic':
      if (p<0.45) {
        ctx.fillStyle='#b3e5fc';
        for(let i=-1;i<=1;i++){
          ctx.save(); ctx.translate(i*4.5,0); ctx.rotate(i*0.14);
          ctx.beginPath(); ctx.moveTo(-2.5,10); ctx.lineTo(0,-11+Math.abs(i)*2.5); ctx.lineTo(2.5,10); ctx.fill();
          ctx.restore();
        }
      } else {
        ctx.fillStyle='#e1f5fe'; ctx.beginPath(); ctx.ellipse(0,3.5,10.5,5.5,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(0,0,7.5,4.5,0,0,Math.PI*2); ctx.fill();
      }
      break;
    case 'hell':
      if (p<0.4) {
        ctx.fillStyle='#b71c1c';
        ctx.beginPath(); ctx.moveTo(-4,11); ctx.quadraticCurveTo(-6,-1,0,-12); ctx.quadraticCurveTo(6,-1,4,11); ctx.fill();
        ctx.fillStyle='#e53935';
        ctx.beginPath(); ctx.moveTo(-2.5,11); ctx.quadraticCurveTo(-3.5,1,0,-8); ctx.quadraticCurveTo(3.5,1,2.5,11); ctx.fill();
        ctx.fillStyle='#ff8f00';
        ctx.beginPath(); ctx.moveTo(-1.2,11); ctx.quadraticCurveTo(-1.5,4,0,-2); ctx.quadraticCurveTo(1.5,4,1.2,11); ctx.fill();
      } else {
        ctx.fillStyle='#5d4037'; ctx.beginPath(); ctx.arc(0,-1.5,7.5,0,Math.PI*2); ctx.fill(); ctx.fillRect(-4.5,4,9,7.5);
        ctx.fillStyle='#b71c1c'; ctx.beginPath(); ctx.arc(-2.5,-3,2.2,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(2.5,-3,2.2,0,Math.PI*2); ctx.fill();
      }
      break;
    case 'nuclear':
      if (p<0.4) {
        ctx.strokeStyle='#f9a825'; ctx.lineWidth=1.3;
        ctx.beginPath(); ctx.arc(0,0,10,0,Math.PI*2); ctx.stroke();
        ctx.fillStyle='#f9a825'; ctx.beginPath(); ctx.arc(0,0,2.8,0,Math.PI*2); ctx.fill();
        for(let i=0;i<3;i++){
          const a=i/3*Math.PI*2-Math.PI/2;
          ctx.beginPath(); ctx.moveTo(Math.cos(a)*3.8,Math.sin(a)*3.8);
          ctx.arc(0,0,9.5,a+0.3,a+Math.PI/1.5-0.3); ctx.closePath(); ctx.fill();
        }
      } else {
        ctx.strokeStyle='#558b2f'; ctx.lineWidth=1.8; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(0,11); ctx.lineTo(0,-1); ctx.stroke();
        ctx.fillStyle='#33691e';
        ctx.beginPath(); ctx.ellipse(-5.5,-5,6.5,3.5,-0.45,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(5.5,-7,6.5,3.5,0.45,0,Math.PI*2); ctx.fill();
      }
      break;
    case 'shadow':
      if (p<0.4) {
        ctx.fillStyle='#795548'; ctx.beginPath(); ctx.roundRect(-2.5,-1,5,13,1); ctx.fill();
        ctx.fillStyle='#ff6d00';
        ctx.beginPath(); ctx.moveTo(0,-12); ctx.quadraticCurveTo(3.5,-7,0,-2); ctx.quadraticCurveTo(-3.5,-7,0,-12); ctx.fill();
      } else {
        ctx.fillStyle='rgba(20,0,45,0.88)'; ctx.beginPath(); ctx.ellipse(0,0,9.5,6,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#7b1fa2'; ctx.beginPath(); ctx.arc(0,0,4.5,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#e040fb'; ctx.beginPath(); ctx.arc(0,0,2.8,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(0,0,1.4,0,Math.PI*2); ctx.fill();
      }
      break;
    case 'omega':
      if (p<0.4) {
        ctx.fillStyle='#1a0000'; ctx.beginPath(); ctx.roundRect(-3.5,-9,7,18,1.5); ctx.fill();
        ctx.fillStyle='#e53935'; ctx.beginPath(); ctx.arc(0,-6,3.8,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#ff8a80'; ctx.beginPath(); ctx.arc(-1,-7,1.4,0,Math.PI*2); ctx.fill();
      } else {
        ctx.strokeStyle='#b71c1c'; ctx.lineWidth=1.4; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(0,-12); ctx.lineTo(-2.8,-3); ctx.lineTo(4.5,0); ctx.lineTo(-2,5.5); ctx.lineTo(3,12); ctx.stroke();
      }
      break;
    default:
      ctx.fillStyle='#444'; ctx.beginPath(); ctx.arc(0,0,6,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

function mulberry32Preview(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t>>>15, t|1);
    t ^= t + Math.imul(t ^ t>>>7, t|61);
    return ((t ^ t>>>14)>>>0) / 0xFFFFFFFF;
  };
}
