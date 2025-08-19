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
  location.hash = '#/home';
}

// Re-bind buttons after each render
window.wireUi = function wireUi() {
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn && !loginBtn._wired) {
    loginBtn.addEventListener('click', loginWithSpotify);
    loginBtn._wired = true;
  }
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn && !logoutBtn._wired) {
    logoutBtn.addEventListener('click', logout);
    logoutBtn._wired = true;
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
    // Fallback
    window.location.href = authUrl;
  }
}

// Deep link handler for Cordova
window.handleOpenURL = async (url) => {
  try {
    if (cordova.plugins && cordova.plugins.browsertab) {
      cordova.plugins.browsertab.close();
    }
  } catch (_) {}
  const u = new URL(url);
  const code = u.searchParams.get('code');
  if (code) {
    await getSpotifyAccessToken(code);
  } else {
    const error = u.searchParams.get('error');
    console.error('Spotify login failed:', error);
    alert('Login failed: ' + error);
    showLoginUI();
  }
};

async function getSpotifyAccessToken(code) {
  const codeVerifier = localStorage.getItem('spotify_code_verifier');
  if (!codeVerifier) {
    console.error('Code verifier not found');
    showLoginUI();
    return;
  }

  const body = new URLSearchParams({
    client_id: spotifyConfig.clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: spotifyConfig.redirectUri,
    code_verifier: codeVerifier
  });

  try {
    const resp = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`HTTP ${resp.status}: ${t}`);
    }
    const data = await resp.json();
    localStorage.setItem('spotify_access_token', data.access_token);
    if (data.refresh_token) localStorage.setItem('spotify_refresh_token', data.refresh_token);
    await getSpotifyProfile();
  } catch (e) {
    console.error('Error getting access token:', e);
    alert('Error getting access token. See console for details.');
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
    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`HTTP ${resp.status}: ${t}`);
    }
    const profile = await resp.json();
    console.log('Spotify Profile:', profile);
    showLoggedInUI(profile);
  } catch (e) {
    console.error('Spotify API error:', e);
    alert('Could not fetch profile. Logging out.');
    logout();
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
  // Start router first so screens exist
  if (typeof startRouter === 'function') startRouter();

  // Bind initial screen controls
  if (typeof window.wireUi === 'function') window.wireUi();

  // Auto-login if token exists
  const token = localStorage.getItem('spotify_access_token');
  if (token) {
    getSpotifyProfile();
  } else {
    showLoginUI();
  }
}

document.addEventListener('deviceready', boot);
