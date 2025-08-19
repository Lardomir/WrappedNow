// =======================
// Spotify + App bootstrap
// =======================

// --- PKCE helpers ---

function generateRandomString(length) {
  let text = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) text += chars.charAt(Math.floor(Math.random() * chars.length));
  return text;
}
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return window.btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// --- Config ---
const spotifyConfig = {
  clientId: 'd9ba24940baa404fb039c92774ed2dda',
  redirectUri: 'ch.example.wrappednow://callback',
  scope: 'user-read-private user-read-email user-top-read user-read-recently-played'
};

// --- UI + routing helpers ---
function showLoginUI() {
  if (location.hash !== '#/login') location.hash = '#/login';
}
function showLoggedInUI(profileData) {
  localStorage.setItem('spotify_user_data', JSON.stringify(profileData));
  const next = localStorage.getItem('post_login_route') || '#/home';
  localStorage.removeItem('post_login_route');
  location.hash = next;
}

// Re-bind after each render
window.wireUi = function wireUi() {
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn && !loginBtn._wired) { loginBtn.addEventListener('click', loginWithSpotify); loginBtn._wired = true; }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn && !logoutBtn._wired) { logoutBtn.addEventListener('click', logout); logoutBtn._wired = true; }

  // Home stats
  const songEl = document.getElementById('top-song');
  if (songEl && !songEl.dataset.loaded && typeof window.loadHomeStats === 'function') {
    window.loadHomeStats();
  }

  // Daily Trends chart
  const chartEl = document.getElementById('dt-chart');
  if (chartEl && typeof window.loadDailyTrends === 'function') {
    window.loadDailyTrends();
  }

  // Music Map mount (fixes "empty map" by mounting once visible)
  const mapEl = document.getElementById('map');
  if (mapEl && typeof window.mountMusicMap === 'function' && !mapEl.dataset.ready) {
    window.mountMusicMap();
  }
};

// --- Auth flow ---
async function loginWithSpotify() {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem('spotify_code_verifier', codeVerifier);

  const args = new URLSearchParams({
    response_type: 'code',
    client_id: spotifyConfig.clientId,
    scope: spotifyConfig.scope,
    redirect_uri: spotifyConfig.redirectUri,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge
  });
  const authUrl = `https://accounts.spotify.com/authorize?${args.toString()}`;

  if (cordova.plugins && cordova.plugins.browsertab) {
    cordova.plugins.browsertab.openUrl(authUrl);
  } else {
    window.location.href = authUrl;
  }
}

window.handleOpenURL = async (url) => {
  try { if (cordova.plugins && cordova.plugins.browsertab) cordova.plugins.browsertab.close(); } catch(_) {}
  console.log('[OAuth] redirect URL:', url);
  const u = new URL(url);
  const code = u.searchParams.get('code');
  const err  = u.searchParams.get('error');
  console.log('[OAuth] code:', code, 'error:', err);
  if (code) await getSpotifyAccessToken(code);
  else { alert('Login failed: ' + err); showLoginUI(); }
};

async function getSpotifyAccessToken(code) {
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  if (!codeVerifier) { console.error('Missing PKCE verifier'); alert('Missing PKCE verifier'); return; }

  const http = cordova.plugin.http;          // cordova-plugin-advanced-http
  http.setDataSerializer('urlencoded');      // form encoding

  const data = {
    client_id: spotifyConfig.clientId,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: spotifyConfig.redirectUri,
    code_verifier: codeVerifier
  };

  try {
    const resp = await new Promise((resolve, reject) => {
      http.sendRequest('https://accounts.spotify.com/api/token', {
        method: 'post',
        data,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }, resolve, reject);
    });

    console.log('[OAuth] token status:', resp.status);
    console.log('[OAuth] token raw:', resp.data);

    const payload = JSON.parse(resp.data);
    if (!payload.access_token) throw new Error('No access_token: ' + resp.data);

    localStorage.setItem('spotify_access_token', payload.access_token);
    if (payload.refresh_token) localStorage.setItem('spotify_refresh_token', payload.refresh_token);

    await getSpotifyProfile();
  } catch (e) {
    console.error('[OAuth] token error:', e);
    const msg = (e && (e.error || e.message)) ? String(e.error || e.message).slice(0, 500) : 'Unknown';
    alert('Error getting access token: ' + msg);
    showLoginUI();
  }
}

async function getSpotifyProfile() {
  const token = localStorage.getItem('spotify_access_token');
  if (!token) return showLoginUI();
  try {
    const resp = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
    const profile = await resp.json();
    showLoggedInUI(profile);
  } catch (e) {
    console.error('Spotify /me error (keeping token):', e);
    // Do NOT logout(); keep token so the guard won't bounce.
    // Optionally show a toast here.
    location.hash = '#/home';
  }
}


function logout() {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_code_verifier');
  showLoginUI();
}

// --- Boot ---
function boot() {
  if (typeof startRouter === 'function') startRouter();
  if (typeof window.wireUi === 'function') window.wireUi();

  const token = localStorage.getItem('spotify_access_token');
  if (token) getSpotifyProfile();
  else showLoginUI();
}
document.addEventListener('deviceready', boot);

// ---------- Data loaders ----------

// Home stats (Top Song, Top Artist, Minutes)
window.loadHomeStats = async function loadHomeStats() {
  const token = localStorage.getItem('spotify_access_token');
  if (!token) return;
  const setText = (id, text) => { const el = document.getElementById(id); if (el) { el.textContent = text; el.dataset.loaded = "1"; } };

  try {
    const topTrackResp = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=1&time_range=short_term', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (topTrackResp.ok) {
      const tdata = await topTrackResp.json();
      setText('top-song', tdata.items?.[0]?.name || '—');
    } else setText('top-song', '—');

    const topArtistResp = await fetch('https://api.spotify.com/v1/me/top/artists?limit=1&time_range=short_term', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (topArtistResp.ok) {
      const adata = await topArtistResp.json();
      setText('top-artist', adata.items?.[0]?.name || '—');
    } else setText('top-artist', '—');

    const recentResp = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (recentResp.ok) {
      const rdata = await recentResp.json();
      const totalMs = (rdata.items || []).reduce((sum, it) => sum + (it.track?.duration_ms || 0), 0);
      setText('minutes-listened', String(Math.max(0, Math.round(totalMs / 60000))));
    } else setText('minutes-listened', '—');
  } catch (e) {
    console.error('loadHomeStats error:', e);
  }
};

// ---- Daily Trends (real /me/player/recently-played data) ----
window.loadDailyTrends = async function loadDailyTrends() {
  const token = localStorage.getItem('spotify_access_token');
  const svg = document.getElementById('dt-chart');
  if (!token || !svg) return;

  // 1) Fetch recent plays (last ~50 tracks)
  let items = [];
  try {
    const r = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (r.ok) {
      const data = await r.json();
      items = data.items || [];
    }
  } catch (e) {
    console.error('DailyTrends fetch error:', e);
  }

  // 2) Aggregate minutes by weekday (Mon..Sun)
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const mins = new Array(7).fill(0);
  items.forEach(it => {
    const playedAt = new Date(it.played_at);
    const durMs = it.track?.duration_ms || 0;
    const idx = (playedAt.getDay() + 6) % 7; // JS: Sun=0..Sat=6 -> Mon=0..Sun=6
    mins[idx] += Math.round(durMs / 60000);
  });

  const total = mins.reduce((a,b)=>a+b,0);
  const maxVal = Math.max(10, ...mins);
  const yTop = Math.ceil(maxVal / 10) * 10 || 10;

  // 3) Top Activity (time-of-day bucket)
  const hourBuckets = { Night:0, Morning:0, Afternoon:0, Evening:0 };
  items.forEach(it => {
    const h = new Date(it.played_at).getHours();
    const dur = Math.round((it.track?.duration_ms || 0)/60000);
    const key = (h < 6) ? 'Night' : (h < 12) ? 'Morning' : (h < 18) ? 'Afternoon' : 'Evening';
    hourBuckets[key] += dur;
  });
  const topActivity = Object.entries(hourBuckets).sort((a,b)=>b[1]-a[1])[0]?.[0] || '—';

  // 4) Draw chart (SVG)
  const W = 340, H = 200, mL = 36, mR = 12, mT = 20, mB = 36;
  const innerW = W - mL - mR, innerH = H - mT - mB;
  const x = i => mL + (i * innerW / 6);
  const y = v => mT + (innerH - (v / yTop) * innerH);

  const path = mins.map((v,i)=>`${i===0?'M':'L'} ${x(i)} ${y(v)}`).join(' ');
  const dots = mins.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="#1DB954"/>`).join('');

  // Ensure SVG has its own size so it isn't "invisible"
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('width', '100%');   // CSS will give it height
  svg.setAttribute('height', '220');   // safety for environments ignoring CSS height

  // Y grid (0, mid, max)
  const yTicks = [0, yTop/2, yTop].map(val => {
    const Y = y(val);
    return `
      <line x1="${mL}" y1="${Y}" x2="${W - mR}" y2="${Y}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <text x="${mL - 10}" y="${Y + 4}" font-size="10" text-anchor="end" fill="rgba(255,255,255,0.7)">${Math.round(val)}</text>
    `;
  }).join('');

  svg.innerHTML = `
    <rect x="0" y="0" width="${W}" height="${H}" rx="14" fill="#0b0f14" stroke="rgba(255,255,255,0.08)"/>
    ${yTicks}
    <path d="${path}" fill="none" stroke="#1DB954" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
  `;

  // 5) Fill stat tiles
  const mostIdx = mins.indexOf(Math.max(...mins));
  const mostDay = mostIdx >= 0 ? days[mostIdx] : '—';
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('dt-total', String(total));
  set('dt-most-day', mostDay);
  set('dt-top-activity', topActivity);
};
