/**
 * server.js — Zombie Tower Defence Backend v27
 */
const express = require('express');
const cors    = require('cors');
const fetch   = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const TITLE_ID        = process.env.PLAYFAB_TITLE_ID   || '100286';
const SECRET_KEY      = process.env.PLAYFAB_SECRET_KEY || 'PGWTGH1FY6CS4A7SJFHMCKQBADIMOAPKWTCRN8EHMMCUOM7OEK';
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK_URL || '';
const CATALOG_VERSION = 'ZTD_Cosmetics_v1';
const BASE            = `https://${TITLE_ID}.playfabapi.com`;
const ACTION_LOG_KEY  = 'ActionLog';
const MAX_LOG         = 200;

async function pfServer(endpoint, body) {
  const res  = await (await fetch)(BASE + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-SecretKey': SECRET_KEY },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  return { ok: json.code === 200, data: json.data, msg: json.errorMessage || '' };
}

async function resolvePlayFabId(nameOrId) {
  if (!nameOrId) return { ok: false, msg: 'No player specified' };
  const v = nameOrId.trim();
  if (/^[0-9A-Fa-f]{16}$/.test(v)) return { ok: true, playFabId: v };
  const r = await pfServer('/Server/GetUserAccountInfo', { Username: v });
  if (r.ok && r.data?.UserInfo?.PlayFabId)
    return { ok: true, playFabId: r.data.UserInfo.PlayFabId };
  return { ok: false, msg: `Player "${v}" not found. Username is case-sensitive or use PlayFab ID.` };
}

async function verifySession(sessionTicket) {
  if (!sessionTicket) return { ok: false, msg: 'No session ticket' };
  const auth = await pfServer('/Server/AuthenticateSessionTicket', { SessionTicket: sessionTicket });
  if (!auth.ok) return { ok: false, msg: 'Invalid or expired session' };
  const callerId = auth.data.UserInfo.PlayFabId;
  const [dataRes, invRes] = await Promise.all([
    pfServer('/Server/GetUserData',      { PlayFabId: callerId, Keys: ['IsOwner', 'IsMod'] }),
    pfServer('/Server/GetUserInventory', { PlayFabId: callerId }),
  ]);
  const d   = dataRes.data?.Data || {};
  const inv = (invRes.data?.Inventory || []).map(i => i.ItemId);
  const isOwner = d.IsOwner?.Value === 'true' || inv.includes('owner_panel');
  const isMod   = d.IsMod?.Value   === 'true' || inv.includes('mod_panel') || isOwner;
  return { ok: true, callerId, isOwner, isMod };
}

async function logAction(entry) {
  try {
    const r   = await pfServer('/Server/GetTitleData', { Keys: [ACTION_LOG_KEY] });
    const log = JSON.parse(r.data?.Data?.[ACTION_LOG_KEY] || '[]');
    log.unshift({ ...entry, ts: new Date().toISOString() });
    if (log.length > MAX_LOG) log.length = MAX_LOG;
    await pfServer('/Admin/SetTitleData', { TitleData: { [ACTION_LOG_KEY]: JSON.stringify(log) } });
  } catch (e) { console.error('[ActionLog]', e.message); }
}

async function sendDiscordReport(report, staffId) {
  if (!DISCORD_WEBHOOK) return;
  const isBanned   = (report.activeBans || []).length > 0;
  const role       = report.isOwner ? '`owner`' : report.isMod ? '`mod`' : '`player`';
  const banText    = isBanned
    ? report.activeBans.map(b => `${b.Reason || 'no reason'}  ·  ${b.Expires ? `expires <t:${Math.floor(new Date(b.Expires)/1000)}:R>` : '**permanent**'}`).join('\n')
    : 'no active bans';
  const warnText   = (report.warnings || []).length
    ? report.warnings.slice(0, 5).map(w => `${w.reason}  ·  ${new Date(w.date).toLocaleDateString()}`).join('\n')
    : 'none';
  const cosmetics  = (report.inventory || []).join(', ') || 'none';

  const embed = {
    color: isBanned ? 0xed4245 : 0x5865f2,
    title: `Staff Report: ${report.displayName}`,
    description: `**${report.displayName}**  ·  \`${report.playFabId}\`\n${role}  ·  last login ${report.lastLogin ? new Date(report.lastLogin).toLocaleDateString() : 'unknown'}`,
    fields: [
      { name: 'Stats', value: `Wave **${report.bestWave}**  ·  Kills **${report.totalKills}**  ·  XP **${report.accountXP}**  ·  Coins **${report.coins}**`, inline: false },
      { name: 'Inventory / Cosmetics', value: cosmetics.slice(0, 1024), inline: false },
      { name: 'Active Bans', value: banText, inline: false },
      ...(report.warnings?.length ? [{ name: `Warnings (${report.warnings.length})`, value: warnText, inline: false }] : []),
    ],
    timestamp: new Date().toISOString(),
    footer: { text: `Reported by ${staffId}  ·  ZTD` },
  };
  try {
    await (await fetch)(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch (e) { console.error('[Discord]', e.message); }
}

async function buildPlayerReport(pfId) {
  const [profileRes, statsRes, banRes, invRes, dataRes] = await Promise.all([
    pfServer('/Server/GetUserAccountInfo',  { PlayFabId: pfId }),
    pfServer('/Server/GetPlayerStatistics', { PlayFabId: pfId }),
    pfServer('/Server/GetUserBans',         { PlayFabId: pfId }),
    pfServer('/Server/GetUserInventory',    { PlayFabId: pfId }),
    pfServer('/Server/GetUserData', { PlayFabId: pfId, Keys: ['Warnings','OwnedTowers','Coins','BestWave','TotalKills','AccountXP','IsOwner','IsMod'] }),
  ]);
  const profile    = profileRes.data?.UserInfo || {};
  const stats      = {};
  (statsRes.data?.Statistics || []).forEach(s => { stats[s.StatisticName] = s.Value; });
  const now        = Date.now();
  const allBans    = banRes.data?.BanData || [];
  const activeBans = allBans.filter(b => b.Active && (!b.Expires || new Date(b.Expires).getTime() > now));
  const inventory  = (invRes.data?.Inventory || []).map(i => i.ItemId);
  const ud         = dataRes.data?.Data || {};
  const safeJson   = (val, fb) => { try { return JSON.parse(val || JSON.stringify(fb)); } catch { return fb; } };
  return {
    playFabId:   pfId,
    displayName: profile.TitleInfo?.DisplayName || profile.Username || pfId,
    username:    profile.Username || pfId,
    created:     profile.TitleInfo?.Created  || null,
    lastLogin:   profile.TitleInfo?.LastLogin || null,
    stats,
    coins:       ud.Coins?.Value      || '0',
    bestWave:    ud.BestWave?.Value   || '0',
    totalKills:  ud.TotalKills?.Value || '0',
    accountXP:   ud.AccountXP?.Value  || '0',
    ownedTowers: safeJson(ud.OwnedTowers?.Value, []),
    inventory,
    activeBans,
    allBans,
    warnings:    safeJson(ud.Warnings?.Value, []),
    isOwner:     ud.IsOwner?.Value === 'true' || inventory.includes('owner_panel'),
    isMod:       ud.IsMod?.Value   === 'true' || inventory.includes('mod_panel'),
  };
}

// ── Routes ────────────────────────────────────────────────────────
app.get('/', (_, res) => res.json({ status: 'ZTD online', title: TITLE_ID }));

app.get('/leaderboard/:stat', async (req, res) => {
  try {
    const r = await pfServer('/Server/GetLeaderboard', { StatisticName: req.params.stat, StartPosition: 0, MaxResultsCount: Math.min(parseInt(req.query.max)||100,100) });
    res.json({ ok: true, leaderboard: r.data?.Leaderboard || [] });
  } catch (e) { res.json({ ok: false, leaderboard: [], msg: e.message }); }
});

// Ban check — called on every login, returns ban info for ban screen
app.post('/auth/checkBan', async (req, res) => {
  const { playFabId } = req.body;
  if (!playFabId) return res.json({ ok: true, banned: false });
  try {
    const r   = await pfServer('/Server/GetUserBans', { PlayFabId: playFabId });
    const now = Date.now();
    const ban = (r.data?.BanData || []).find(b => b.Active && (!b.Expires || new Date(b.Expires).getTime() > now));
    if (ban) {
      const ms   = ban.Expires ? new Date(ban.Expires).getTime() - now : null;
      const dur  = ms ? (ms < 3600000 ? `${Math.floor(ms/60000)} minutes` : ms < 86400000 ? `${Math.floor(ms/3600000)} hours` : `${Math.floor(ms/86400000)} days`) : null;
      return res.json({ ok: true, banned: true, reason: ban.Reason || 'No reason given', expires: ban.Expires || null, permanent: !ban.Expires, durationText: dur });
    }
    res.json({ ok: true, banned: false });
  } catch { res.json({ ok: true, banned: false }); }
});

app.post('/owner/lookupPlayer', async (req, res) => {
  const auth = await verifySession(req.body.callerSession);
  if (!auth.ok || !auth.isMod) return res.json({ ok: false, msg: 'Not authorized' });
  const resolved = await resolvePlayFabId(req.body.targetPlayerId);
  if (!resolved.ok) return res.json({ ok: false, msg: resolved.msg });
  const pfId = resolved.playFabId;
  const [profileRes, statsRes, banRes] = await Promise.all([
    pfServer('/Server/GetUserAccountInfo',  { PlayFabId: pfId }),
    pfServer('/Server/GetPlayerStatistics', { PlayFabId: pfId }),
    pfServer('/Server/GetUserBans',         { PlayFabId: pfId }),
  ]);
  const profile   = profileRes.data?.UserInfo || {};
  const stats     = {};
  (statsRes.data?.Statistics || []).forEach(s => { stats[s.StatisticName] = s.Value; });
  const now       = Date.now();
  const activeBan = (banRes.data?.BanData || []).find(b => b.Active && (!b.Expires || new Date(b.Expires).getTime() > now));
  res.json({ ok: true, playFabId: pfId, profile: {
    DisplayName: profile.TitleInfo?.DisplayName || profile.Username || pfId,
    Username: profile.Username, Created: profile.TitleInfo?.Created, LastLogin: profile.TitleInfo?.LastLogin,
    BannedUntil: activeBan?.Expires || null, BanReason: activeBan?.Reason || null, IsBanned: !!activeBan,
  }, stats });
});

app.post('/staff/playerReport', async (req, res) => {
  const { callerSession, targetPlayerId, sendToDiscord } = req.body;
  const auth = await verifySession(callerSession);
  if (!auth.ok || !auth.isMod) return res.json({ ok: false, msg: 'Not authorized' });
  const resolved = await resolvePlayFabId(targetPlayerId);
  if (!resolved.ok) return res.json({ ok: false, msg: resolved.msg });
  try {
    const report = await buildPlayerReport(resolved.playFabId);
    await logAction({ action: 'STAFF_REPORT', staffId: auth.callerId, targetId: resolved.playFabId, targetName: report.displayName });
    if (sendToDiscord) await sendDiscordReport(report, auth.callerId);
    res.json({ ok: true, report });
  } catch (e) { res.json({ ok: false, msg: e.message }); }
});

app.post('/staff/actionLog', async (req, res) => {
  const auth = await verifySession(req.body.callerSession);
  if (!auth.ok || !auth.isMod) return res.json({ ok: false, log: [], msg: 'Not authorized' });
  try {
    const r = await pfServer('/Server/GetTitleData', { Keys: [ACTION_LOG_KEY] });
    res.json({ ok: true, log: JSON.parse(r.data?.Data?.[ACTION_LOG_KEY] || '[]') });
  } catch (e) { res.json({ ok: false, log: [], msg: e.message }); }
});

app.post('/owner/banPlayer', async (req, res) => {
  const { callerSession, targetPlayerId, reason, hours } = req.body;
  const auth = await verifySession(callerSession);
  if (!auth.ok || !auth.isMod) return res.json({ ok: false, msg: 'Not authorized' });
  const resolved = await resolvePlayFabId(targetPlayerId);
  if (!resolved.ok) return res.json({ ok: false, msg: resolved.msg });
  const pfId = resolved.playFabId;
  const dur  = hours && parseInt(hours) > 0 ? parseInt(hours) : null;
  const r    = await pfServer('/Server/BanUsers', { Bans: [{ PlayFabId: pfId, Reason: reason || 'No reason given', ...(dur ? { DurationInHours: dur } : {}) }] });
  if (r.ok) {
    await pfServer('/Server/UpdateUserData', { PlayFabId: pfId, Data: { IsBanned: 'true', BanReason: reason || 'Banned' } });
    await logAction({ action: 'BAN', staffId: auth.callerId, targetId: pfId, detail: `${reason || 'No reason'}${dur ? ` for ${dur}h` : ' — PERMANENT'}` });
  }
  res.json({ ok: r.ok, msg: r.ok ? `Banned${dur ? ` for ${dur}h` : ' permanently'}` : (r.msg || 'Ban failed') });
});

app.post('/owner/unbanPlayer', async (req, res) => {
  const { callerSession, targetPlayerId } = req.body;
  const auth = await verifySession(callerSession);
  if (!auth.ok || !auth.isMod) return res.json({ ok: false, msg: 'Not authorized' });
  const resolved = await resolvePlayFabId(targetPlayerId);
  if (!resolved.ok) return res.json({ ok: false, msg: resolved.msg });
  const pfId   = resolved.playFabId;
  const banRes = await pfServer('/Server/GetUserBans', { PlayFabId: pfId });
  const active = (banRes.data?.BanData || []).filter(b => b.Active && (!b.Expires || new Date(b.Expires) > new Date()));
  if (!active.length) return res.json({ ok: false, msg: 'No active bans found' });
  const r = await pfServer('/Server/RevokeBans', { BanIds: active.map(b => b.BanId) });
  if (r.ok) {
    await pfServer('/Server/UpdateUserData', { PlayFabId: pfId, Data: { IsBanned: 'false', BanReason: '' } });
    await logAction({ action: 'UNBAN', staffId: auth.callerId, targetId: pfId });
  }
  res.json({ ok: r.ok, msg: r.ok ? 'Unbanned' : (r.msg || 'Unban failed') });
});

app.post('/owner/warnPlayer', async (req, res) => {
  const { callerSession, targetPlayerId, reason } = req.body;
  const auth = await verifySession(callerSession);
  if (!auth.ok || !auth.isMod) return res.json({ ok: false, msg: 'Not authorized' });
  const resolved = await resolvePlayFabId(targetPlayerId);
  if (!resolved.ok) return res.json({ ok: false, msg: resolved.msg });
  const pfId  = resolved.playFabId;
  const ex    = await pfServer('/Server/GetUserData', { PlayFabId: pfId, Keys: ['Warnings'] });
  const warns = JSON.parse(ex.data?.Data?.Warnings?.Value || '[]');
  warns.push({ reason: reason || 'No reason', date: new Date().toISOString(), by: auth.callerId });
  const r = await pfServer('/Server/UpdateUserData', { PlayFabId: pfId, Data: { Warnings: JSON.stringify(warns) } });
  if (r.ok) await logAction({ action: 'WARN', staffId: auth.callerId, targetId: pfId, detail: reason || 'No reason' });
  res.json({ ok: r.ok, msg: r.ok ? `Warning #${warns.length} issued` : (r.msg || 'Failed') });
});

app.post('/owner/kickPlayer', async (req, res) => {
  const { callerSession, targetPlayerId } = req.body;
  const auth = await verifySession(callerSession);
  if (!auth.ok || !auth.isMod) return res.json({ ok: false, msg: 'Not authorized' });
  const resolved = await resolvePlayFabId(targetPlayerId);
  if (!resolved.ok) return res.json({ ok: false, msg: resolved.msg });
  const r = await pfServer('/Server/UpdateUserData', { PlayFabId: resolved.playFabId, Data: { ForceKick: Date.now().toString() } });
  if (r.ok) await logAction({ action: 'KICK', staffId: auth.callerId, targetId: resolved.playFabId });
  res.json({ ok: r.ok, msg: r.ok ? 'Kick sent' : (r.msg || 'Failed') });
});

app.post('/owner/mutePlayer', async (req, res) => {
  const { callerSession, targetPlayerId, hours } = req.body;
  const auth = await verifySession(callerSession);
  if (!auth.ok || !auth.isMod) return res.json({ ok: false, msg: 'Not authorized' });
  const resolved = await resolvePlayFabId(targetPlayerId);
  if (!resolved.ok) return res.json({ ok: false, msg: resolved.msg });
  const until = new Date(Date.now() + (parseInt(hours) || 1) * 3600000).toISOString();
  const r     = await pfServer('/Server/UpdateUserData', { PlayFabId: resolved.playFabId, Data: { MutedUntil: until } });
  if (r.ok) await logAction({ action: 'MUTE', staffId: auth.callerId, targetId: resolved.playFabId, detail: `${hours || 1}h` });
  res.json({ ok: r.ok, msg: r.ok ? `Muted until ${until}` : (r.msg || 'Failed') });
});

app.post('/owner/grantCatalogItem', async (req, res) => {
  const { callerSession, targetPlayerId, itemId, catalogVersion } = req.body;
  const auth = await verifySession(callerSession);
  if (!auth.ok || !auth.isOwner) return res.json({ ok: false, msg: 'Owner only' });
  const r = await pfServer('/Server/GrantItemsToUser', { PlayFabId: targetPlayerId, ItemIds: [itemId], CatalogVersion: catalogVersion || CATALOG_VERSION });
  if (r.ok) await logAction({ action: 'GRANT_ITEM', staffId: auth.callerId, targetId: targetPlayerId, detail: itemId });
  res.json({ ok: r.ok, msg: r.ok ? 'Granted' : r.msg });
});

app.post('/owner/giveAllTowers', async (req, res) => {
  const { callerSession, targetPlayerId, towerIds } = req.body;
  const auth = await verifySession(callerSession);
  if (!auth.ok || !auth.isOwner) return res.json({ ok: false, msg: 'Owner only' });
  const r = await pfServer('/Server/UpdateUserData', { PlayFabId: targetPlayerId, Data: { OwnedTowers: JSON.stringify(towerIds || []) } });
  res.json({ ok: r.ok, msg: r.ok ? 'Towers granted' : r.msg });
});

app.post('/owner/unlockAllPerks', async (req, res) => {
  const { callerSession, targetPlayerId, mapIds } = req.body;
  const auth = await verifySession(callerSession);
  if (!auth.ok || !auth.isOwner) return res.json({ ok: false, msg: 'Owner only' });
  const maps = mapIds || ['graveyard','city_ruins','volcano','arctic','inferno','nuclear_wasteland','shadow_realm','omega_facility'];
  const r    = await pfServer('/Server/UpdateUserData', { PlayFabId: targetPlayerId, Data: { AllPerksUnlocked: 'true', UnlockedMaps: JSON.stringify(maps) } });
  res.json({ ok: r.ok, msg: r.ok ? `${maps.length} maps unlocked` : r.msg });
});

app.post('/owner/giveCoins', async (req, res) => {
  const { callerSession, targetPlayerId, amount } = req.body;
  const auth = await verifySession(callerSession);
  if (!auth.ok || !auth.isOwner) return res.json({ ok: false, msg: 'Owner only' });
  const ex  = await pfServer('/Server/GetUserData', { PlayFabId: targetPlayerId, Keys: ['Coins'] });
  const cur = parseInt(ex.data?.Data?.Coins?.Value || '0');
  const r   = await pfServer('/Server/UpdateUserData', { PlayFabId: targetPlayerId, Data: { Coins: String(cur + (parseInt(amount) || 0)) } });
  res.json({ ok: r.ok, msg: r.ok ? `${cur + parseInt(amount)} coins` : r.msg });
});

app.post('/owner/makeOwner', async (req, res) => {
  const { callerSession, targetPlayerId } = req.body;
  const auth = await verifySession(callerSession);
  if (!auth.ok || !auth.isOwner) return res.json({ ok: false, msg: 'Owner only' });
  const r = await pfServer('/Server/UpdateUserData', { PlayFabId: targetPlayerId, Data: { IsOwner: 'true' } });
  if (r.ok) await logAction({ action: 'MAKE_OWNER', staffId: auth.callerId, targetId: targetPlayerId });
  res.json({ ok: r.ok, msg: r.ok ? 'Owner granted' : r.msg });
});

app.post('/owner/grantDevPanel', async (req, res) => {
  const { callerSession, targetPlayerId } = req.body;
  const auth = await verifySession(callerSession);
  if (!auth.ok || !auth.isOwner) return res.json({ ok: false, msg: 'Owner only' });
  const r = await pfServer('/Server/UpdateUserData', { PlayFabId: targetPlayerId, Data: { HasDevPanel: 'true' } });
  res.json({ ok: r.ok, msg: r.ok ? 'Dev panel granted' : r.msg });
});

app.post('/owner/revokeDevPanel', async (req, res) => {
  const { callerSession, targetPlayerId } = req.body;
  const auth = await verifySession(callerSession);
  if (!auth.ok || !auth.isOwner) return res.json({ ok: false, msg: 'Owner only' });
  const r = await pfServer('/Server/UpdateUserData', { PlayFabId: targetPlayerId, Data: { HasDevPanel: 'false' } });
  res.json({ ok: r.ok, msg: r.ok ? 'Dev panel revoked' : r.msg });
});

app.post('/owner/resetPlayer', async (req, res) => {
  const { callerSession, targetPlayerId } = req.body;
  const auth = await verifySession(callerSession);
  if (!auth.ok || !auth.isOwner) return res.json({ ok: false, msg: 'Owner only' });
  const r = await pfServer('/Server/UpdateUserData', { PlayFabId: targetPlayerId, Data: { Coins:'100', BestWave:'0', TotalKills:'0', OwnedTowers:'["gunner","archer"]', UnlockedMaps:'["graveyard"]' } });
  if (r.ok) await logAction({ action: 'RESET_PLAYER', staffId: auth.callerId, targetId: targetPlayerId });
  res.json({ ok: r.ok, msg: r.ok ? 'Player reset' : r.msg });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`\n🧟 ZTD Server v27 → http://localhost:${PORT}`);
  console.log(`   Discord webhook: ${DISCORD_WEBHOOK ? '✅ set' : '⚠️  not set (optional)'}`);
  try {
    const test = await pfServer('/Server/GetTitleData', { Keys: ['_ping'] });
    console.log(`   PlayFab (${TITLE_ID}): ${test.ok ? '✅ connected' : '⚠️  ' + test.msg}`);
  } catch (e) { console.log(`   PlayFab: ⚠️  ${e.message}`); }
  console.log('');
});
