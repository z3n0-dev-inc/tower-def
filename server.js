/**
 * server.js — Zombie Tower Defence Backend
 * Handles privileged PlayFab calls (Secret Key stays server-side).
 *
 * SETUP:
 *   npm install
 *   node server.js
 *
 * For deployment: Render, Railway, Fly.io, etc.
 * Then update SERVER_URL in js/playfab.js to your deployed URL.
 */

const express = require('express');
const cors    = require('cors');

// node-fetch v3 is ESM only, use dynamic import
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const TITLE_ID        = '100286';
const SECRET_KEY      = 'PGWTGH1FY6CS4A7SJFHMCKQBADIMOAPKWTCRN8EHMMCUOM7OEK';
const BASE            = `https://${TITLE_ID}.playfabapi.com`;
const CATALOG_VERSION = 'ZTD_Cosmetics_v1';

// ── PlayFab Server API helper ─────────────────────────────
async function pfServer(endpoint, body) {
  const res = await (await fetch)(BASE + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-SecretKey': SECRET_KEY },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return { ok: json.code === 200, data: json.data, msg: json.errorMessage };
}

// ── Verify caller has IsOwner = true ──────────────────────
async function verifyOwner(sessionTicket) {
  if (!sessionTicket) return { ok: false, msg: 'No session ticket' };
  // Authenticate session
  const auth = await pfServer('/Server/AuthenticateSessionTicket', { SessionTicket: sessionTicket });
  if (!auth.ok) return { ok: false, msg: 'Invalid session' };
  const pfId = auth.data.UserInfo.PlayFabId;
  // Check IsOwner flag
  const data = await pfServer('/Server/GetUserData', { PlayFabId: pfId, Keys: ['IsOwner'] });
  if (!data.ok || data.data?.Data?.IsOwner?.Value !== 'true') {
    return { ok: false, msg: 'Not authorized as owner' };
  }
  return { ok: true, callerId: pfId };
}

// ─────────────────────────────────────────────────────────
//  ROUTES
// ─────────────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => res.json({ status: 'ZTD Server online', title: TITLE_ID }));

// ── Grant catalog item (cosmetics) ───────────────────────
// This is the primary cosmetic grant method.
// All cosmetics live in the PlayFab catalog (ZTD_Cosmetics_v1).
app.post('/owner/grantCatalogItem', async (req, res) => {
  const { callerSession, targetPlayerId, itemId, catalogVersion } = req.body;
  const auth = await verifyOwner(callerSession);
  if (!auth.ok) return res.json({ ok: false, msg: auth.msg });
  if (!targetPlayerId || !itemId) return res.json({ ok: false, msg: 'Missing targetPlayerId or itemId' });

  const r = await pfServer('/Server/GrantItemsToUser', {
    PlayFabId:      targetPlayerId,
    ItemIds:        [itemId],
    CatalogVersion: catalogVersion || CATALOG_VERSION,
  });

  // If the item has a linked tower ID, also update OwnedTowers
  if (r.ok) {
    // Fetch catalog item CustomData to get towerId
    const catalog = await pfServer('/Server/GetCatalogItems', { CatalogVersion: catalogVersion || CATALOG_VERSION });
    if (catalog.ok) {
      const catItem = (catalog.data.Catalog || []).find(i => i.ItemId === itemId);
      if (catItem) {
        let custom = {};
        try { custom = typeof catItem.CustomData === 'string' ? JSON.parse(catItem.CustomData) : (catItem.CustomData || {}); } catch {}
        if (custom.towerId) {
          const existing = await pfServer('/Server/GetUserData', { PlayFabId: targetPlayerId, Keys: ['OwnedTowers'] });
          const towers = JSON.parse(existing.data?.Data?.OwnedTowers?.Value || '[]');
          if (!towers.includes(custom.towerId)) towers.push(custom.towerId);
          await pfServer('/Server/UpdateUserData', { PlayFabId: targetPlayerId, Data: { OwnedTowers: JSON.stringify(towers) } });
        }
      }
    }
  }

  res.json({ ok: r.ok, msg: r.ok ? 'Item granted' : r.msg });
});

// ── Give all towers ───────────────────────────────────────
app.post('/owner/giveAllTowers', async (req, res) => {
  const { callerSession, targetPlayerId, towerIds } = req.body;
  const auth = await verifyOwner(callerSession);
  if (!auth.ok) return res.json({ ok: false, msg: auth.msg });

  const r = await pfServer('/Server/UpdateUserData', {
    PlayFabId: targetPlayerId,
    Data: { OwnedTowers: JSON.stringify(towerIds || []) },
  });
  res.json({ ok: r.ok, msg: r.ok ? 'All towers granted' : r.msg });
});

// ── Unlock all perks ─────────────────────────────────────
app.post('/owner/unlockAllPerks', async (req, res) => {
  const { callerSession, targetPlayerId } = req.body;
  const auth = await verifyOwner(callerSession);
  if (!auth.ok) return res.json({ ok: false, msg: auth.msg });

  const r = await pfServer('/Server/UpdateUserData', {
    PlayFabId: targetPlayerId,
    Data: { AllPerksUnlocked: 'true', UnlockedMaps: JSON.stringify(['graveyard','city_ruins','volcano','arctic','inferno']) },
  });
  res.json({ ok: r.ok, msg: r.ok ? 'All perks unlocked' : r.msg });
});

// ── Give coins ────────────────────────────────────────────
app.post('/owner/giveCoins', async (req, res) => {
  const { callerSession, targetPlayerId, amount } = req.body;
  const auth = await verifyOwner(callerSession);
  if (!auth.ok) return res.json({ ok: false, msg: auth.msg });

  const existing = await pfServer('/Server/GetUserData', { PlayFabId: targetPlayerId, Keys: ['Coins'] });
  const current  = parseInt(existing.data?.Data?.Coins?.Value || '0');
  const newCoins = current + (parseInt(amount) || 0);

  const r = await pfServer('/Server/UpdateUserData', {
    PlayFabId: targetPlayerId,
    Data: { Coins: String(newCoins) },
  });
  res.json({ ok: r.ok, msg: r.ok ? `${newCoins} total coins set` : r.msg });
});

// ── Grant owner status ────────────────────────────────────
app.post('/owner/makeOwner', async (req, res) => {
  const { callerSession, targetPlayerId } = req.body;
  const auth = await verifyOwner(callerSession);
  if (!auth.ok) return res.json({ ok: false, msg: auth.msg });

  const r = await pfServer('/Server/UpdateUserData', {
    PlayFabId: targetPlayerId,
    Data: { IsOwner: 'true' },
  });
  res.json({ ok: r.ok, msg: r.ok ? 'Owner status granted' : r.msg });
});

// ── Reset player ──────────────────────────────────────────
app.post('/owner/resetPlayer', async (req, res) => {
  const { callerSession, targetPlayerId } = req.body;
  const auth = await verifyOwner(callerSession);
  if (!auth.ok) return res.json({ ok: false, msg: auth.msg });

  const r = await pfServer('/Server/UpdateUserData', {
    PlayFabId: targetPlayerId,
    Data: { Coins:'100', BestWave:'0', TotalKills:'0',
            OwnedTowers:'["gunner","archer"]',
            UnlockedMaps:'["graveyard"]' },
  });
  res.json({ ok: r.ok, msg: r.ok ? 'Player reset' : r.msg });
});

// ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🧟 ZTD Server running → http://localhost:${PORT}`);
  console.log(`   PlayFab Title:    ${TITLE_ID}`);
  console.log(`   Catalog Version:  ${CATALOG_VERSION}`);
  console.log(`   Endpoints:        /owner/*\n`);
});
