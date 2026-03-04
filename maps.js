/* ═══════════════════════════════════════════════
   maps.js — Map definitions, themes, paths
   Each map uses a tile grid: 0=grass, 1=path, 2=tower-zone
   Path coords are [col, row] waypoints for enemies to follow.
   ═══════════════════════════════════════════════ */

const MAPS = [
  {
    id: 'graveyard',
    name: 'GRAVEYARD',
    theme: 'graveyard',
    difficulty: 1,
    waves: 15,
    description: 'A foggy cemetery. Perfect for beginners.',
    bgColor: '#1a2a15',
    pathColor: '#4a3820',
    grassColor: '#1e3018',
    accentColor: '#2d4a28',
    decorations: ['🪦','🌲','🌫️'],
    unlocked: true,
    cols: 20, rows: 14,
    // Path as waypoints [x,y] in tile coords — enemy follows these
    path: [
      [0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[5,4],[5,5],[5,6],[5,7],
      [6,7],[7,7],[8,7],[9,7],[10,7],[10,6],[10,5],[10,4],[10,3],[11,3],
      [12,3],[13,3],[14,3],[14,4],[14,5],[14,6],[14,7],[14,8],[14,9],[14,10],
      [13,10],[12,10],[11,10],[10,10],[9,10],[8,10],[7,10],[6,10],[5,10],[4,10],
      [4,9],[4,8],[4,7],[3,7],[2,7],[1,7],[0,7]
    ],
    // Blocked tiles (path tiles — no towers here)
    // Tower zones are every non-path tile
    startGold: 150, livesStart: 20,
    waveModifier: 1.0,
    music: 'dark',
  },
  {
    id: 'city_ruins',
    name: 'CITY RUINS',
    theme: 'urban',
    difficulty: 2,
    waves: 18,
    description: 'Overrun streets. Tighter placement.',
    bgColor: '#1a1a1a',
    pathColor: '#555',
    grassColor: '#222',
    accentColor: '#333',
    decorations: ['🏚️','🚗','💡'],
    unlocked: false,
    cols: 22, rows: 14,
    path: [
      [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],
      [9,3],[9,4],[9,5],[9,6],[9,7],[8,7],[7,7],[6,7],[5,7],[5,8],
      [5,9],[5,10],[5,11],[6,11],[7,11],[8,11],[9,11],[10,11],[11,11],
      [12,11],[13,11],[14,11],[14,10],[14,9],[14,8],[14,7],[15,7],[16,7],
      [17,7],[17,6],[17,5],[17,4],[17,3],[17,2],[18,2],[19,2],[20,2],[21,2]
    ],
    startGold: 175, livesStart: 18,
    waveModifier: 1.3,
    music: 'tense',
  },
  {
    id: 'volcano',
    name: 'VOLCANO',
    theme: 'volcanic',
    difficulty: 3,
    waves: 20,
    description: 'Molten rock. Enemies hit harder.',
    bgColor: '#1a0a00',
    pathColor: '#3a1500',
    grassColor: '#1f0d00',
    accentColor: '#5a1a00',
    decorations: ['🌋','🔥','💎'],
    unlocked: false,
    cols: 20, rows: 14,
    path: [
      [0,6],[1,6],[2,6],[3,6],[3,5],[3,4],[3,3],[4,3],[5,3],[6,3],
      [7,3],[7,4],[7,5],[7,6],[7,7],[7,8],[7,9],[8,9],[9,9],[10,9],
      [10,8],[10,7],[10,6],[10,5],[10,4],[10,3],[11,3],[12,3],[13,3],
      [13,4],[13,5],[13,6],[13,7],[13,8],[13,9],[13,10],[14,10],[15,10],
      [16,10],[16,9],[16,8],[16,7],[16,6],[16,5],[17,5],[18,5],[19,5]
    ],
    startGold: 200, livesStart: 15,
    waveModifier: 1.7,
    music: 'intense',
  },
  {
    id: 'arctic',
    name: 'ARCTIC BASE',
    theme: 'arctic',
    difficulty: 4,
    waves: 22,
    description: 'Frozen tundra. Slippery enemies.',
    bgColor: '#0a1525',
    pathColor: '#a8c8e8',
    grassColor: '#0d1e33',
    accentColor: '#1a3050',
    decorations: ['🏔️','❄️','🐧'],
    unlocked: false,
    cols: 24, rows: 14,
    path: [
      [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[5,2],[5,3],[5,4],[5,5],
      [5,6],[5,7],[5,8],[5,9],[5,10],[5,11],[5,12],[6,12],[7,12],[8,12],
      [9,12],[9,11],[9,10],[9,9],[9,8],[9,7],[9,6],[9,5],[9,4],[9,3],
      [9,2],[9,1],[10,1],[11,1],[12,1],[13,1],[14,1],[14,2],[14,3],[14,4],
      [14,5],[14,6],[14,7],[14,8],[14,9],[14,10],[14,11],[14,12],[15,12],
      [16,12],[17,12],[18,12],[18,11],[18,10],[18,9],[18,8],[18,7],[18,6],
      [18,5],[18,4],[18,3],[18,2],[18,1],[19,1],[20,1],[21,1],[22,1],[23,1]
    ],
    startGold: 225, livesStart: 15,
    waveModifier: 2.0,
    music: 'intense',
  },
  {
    id: 'inferno',
    name: 'INFERNO',
    theme: 'hell',
    difficulty: 5,
    waves: 25,
    description: 'The final hellscape. Only the best survive.',
    bgColor: '#0f0000',
    pathColor: '#5a0000',
    grassColor: '#1a0000',
    accentColor: '#3a0000',
    decorations: ['👹','💀','🔥'],
    unlocked: false,
    cols: 22, rows: 14,
    path: [
      [0,7],[1,7],[2,7],[2,6],[2,5],[2,4],[2,3],[3,3],[4,3],[5,3],
      [6,3],[7,3],[7,4],[7,5],[7,6],[7,7],[7,8],[7,9],[7,10],[8,10],
      [9,10],[10,10],[10,9],[10,8],[10,7],[10,6],[10,5],[10,4],[10,3],[11,3],
      [12,3],[13,3],[13,4],[13,5],[13,6],[13,7],[13,8],[13,9],[13,10],[13,11],
      [14,11],[15,11],[16,11],[16,10],[16,9],[16,8],[16,7],[16,6],[16,5],[16,4],
      [16,3],[17,3],[18,3],[19,3],[19,4],[19,5],[19,6],[19,7],[20,7],[21,7]
    ],
    startGold: 250, livesStart: 12,
    waveModifier: 2.5,
    music: 'boss',
  },
];

// Build a Set of path tile keys for fast lookup
MAPS.forEach(map => {
  map.pathSet = new Set(map.path.map(([c,r]) => `${c},${r}`));
});

function getMap(id) { return MAPS.find(m => m.id === id); }

// Draw a small preview of the map onto a canvas element
function drawMapPreview(canvas, map) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const tW = W / map.cols, tH = H / map.rows;

  // Background
  ctx.fillStyle = map.bgColor || '#1a2a15';
  ctx.fillRect(0, 0, W, H);

  // Subtle texture dots
  ctx.fillStyle = map.accentColor || '#2d4a28';
  const rng = mulberry32Preview(7);
  for (let i = 0; i < 80; i++) {
    ctx.globalAlpha = 0.5;
    ctx.fillRect(rng() * W, rng() * H, rng() < 0.3 ? 2 : 1, rng() < 0.3 ? 2 : 1);
  }
  ctx.globalAlpha = 1;

  // Path with thick stroke
  ctx.save();
  ctx.strokeStyle = map.pathColor || '#4a3820';
  ctx.lineWidth = Math.max(tW, tH) * 0.85;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  map.path.forEach(([c, r], i) => {
    const px = c * tW + tW / 2;
    const py = r * tH + tH / 2;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  });
  ctx.stroke();

  // Path highlight
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = Math.max(tW, tH) * 0.5;
  ctx.stroke();
  ctx.restore();

  // Start marker
  const [sc, sr] = map.path[0];
  ctx.fillStyle = 'rgba(34,197,94,0.9)';
  ctx.fillRect(sc * tW + 1, sr * tH + 1, tW - 2, tH - 2);
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.floor(tH * 0.55)}px monospace`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('S', sc * tW + tW / 2, sr * tH + tH / 2);

  // End marker
  const [ec, er] = map.path[map.path.length - 1];
  ctx.fillStyle = 'rgba(220,38,38,0.9)';
  ctx.fillRect(ec * tW + 1, er * tH + 1, tW - 2, tH - 2);
  ctx.fillStyle = '#fff';
  ctx.fillText('E', ec * tW + tW / 2, er * tH + tH / 2);
}

function mulberry32Preview(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 0xFFFFFFFF;
  };
}
