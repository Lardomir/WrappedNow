function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return window.btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const spotifyConfig = {
    clientId: 'd9ba24940baa404fb039c92774ed2dda',
    redirectUri: 'ch.example.wrappednow://callback',
    scope: 'user-read-private user-read-email user-top-read user-read-recently-played'
};

async function loginWithSpotify() {
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    window.localStorage.setItem('spotify_code_verifier', codeVerifier);

    const args = new URLSearchParams({
        response_type: 'code',
        client_id: spotifyConfig.clientId,
        scope: spotifyConfig.scope,
        redirect_uri: spotifyConfig.redirectUri,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge
    });

    const authUrl = `https://accounts.spotify.com/authorize?${args}`;

    if (cordova.plugins && cordova.plugins.browsertab) {
        cordova.plugins.browsertab.openUrl(authUrl);
    } else {
        alert('BrowserTab-Plugin nicht gefunden!');
    }
}

window.handleOpenURL = async (url) => {
  console.log("Received redirect URL: " + url);

  if (cordova.plugins && cordova.plugins.browsertab) {
    cordova.plugins.browsertab.close();
  }

  const code = new URL(url).searchParams.get('code');

  if (code) {
    await getSpotifyAccessToken(code);
  } else {
    const error = new URL(url).searchParams.get('error');
    console.error("Spotify login failed:", error);
    alert("Login failed: " + error);
  }
};

async function getSpotifyAccessToken(code) {
  const codeVerifier = window.localStorage.getItem('spotify_code_verifier');
  if (!codeVerifier) {
    console.error("Code verifier not found!");
    return;
  }

  const body = new URLSearchParams({
    client_id: spotifyConfig.clientId,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: spotifyConfig.redirectUri,
    code_verifier: codeVerifier
  });

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();

    window.localStorage.setItem('spotify_access_token', data.access_token);
    window.localStorage.setItem('spotify_refresh_token', data.refresh_token);

    console.log("Access Token received and stored.");
    window.location.href = 'dashboard.html';

  } catch (error) {
    console.error('Error getting access token:', error);
    alert('Error getting access token. See console for details.');
  }
}

async function loadDashboard() {
  const token = window.localStorage.getItem('spotify_access_token');
  if (!token) {
    return;
  }
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const profileResp = await fetch('https://api.spotify.com/v1/me', { headers });
    const profile = await profileResp.json();
    const nameEl = document.getElementById('user-name');
    if (nameEl && profile.display_name) {
      nameEl.textContent = profile.display_name;
    }
    const imgEl = document.getElementById('profile-image');
    if (imgEl && profile.images && profile.images.length > 0) {
      imgEl.src = profile.images[0].url;
    }

    const topTrackResp = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=1', { headers });
    const topTrack = await topTrackResp.json();
    if (topTrack.items && topTrack.items.length > 0) {
      const topSongEl = document.getElementById('top-song');
      if (topSongEl) topSongEl.textContent = topTrack.items[0].name;
    }

    const topArtistResp = await fetch('https://api.spotify.com/v1/me/top/artists?limit=1', { headers });
    const topArtist = await topArtistResp.json();
    if (topArtist.items && topArtist.items.length > 0) {
      const topArtistEl = document.getElementById('top-artist');
      if (topArtistEl) topArtistEl.textContent = topArtist.items[0].name;
    }

    const recentResp = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', { headers });
    const recent = await recentResp.json();
    if (recent.items) {
      const minutes = Math.round(recent.items.reduce((t, item) => t + item.track.duration_ms, 0) / 60000);
      const minutesEl = document.getElementById('minutes-listened');
      if (minutesEl) minutesEl.textContent = String(minutes);
    }
  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
}

function boot() {
  const loginButton = document.getElementById('loginButton');
  if (loginButton) {
    loginButton.style.display = 'block';
    loginButton.addEventListener('click', loginWithSpotify);
  }
  if (document.getElementById('dashboard')) {
    loadDashboard();
  }
}

document.addEventListener('deviceready', boot);
