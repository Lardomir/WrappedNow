// src/app.js

// --- PKCE Helper Functions ---
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
// --- End of PKCE Helper Functions ---

const spotifyConfig = {
    clientId: 'd9ba24940baa404fb039c92774ed2dda',
    redirectUri: 'ch.example.wrappednow://callback',
    scope: 'user-read-private user-read-email user-top-read user-read-recently-played'
};

// --- Spotify API Functions ---

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

function getSpotifyAccessToken(code) {
  const codeVerifier = window.localStorage.getItem('spotify_code_verifier');
  if (!codeVerifier) {
    console.error("Code verifier not found!");
    return;
  }

  const params = {
    client_id: spotifyConfig.clientId,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: spotifyConfig.redirectUri,
    code_verifier: codeVerifier
  };

  cordova.plugin.http.setHeader('Content-Type', 'application/x-www-form-urlencoded');
  cordova.plugin.http.post('https://accounts.spotify.com/api/token', params, {},
    function(response) { // Success Callback
        try {
          const data = JSON.parse(response.data);
          window.localStorage.setItem('spotify_access_token', data.access_token);
          window.localStorage.setItem('spotify_refresh_token', data.refresh_token);
          console.log("Access Token received and stored.");

          // Move to Task 2: Fetch user profile
          getSpotifyProfile();
        } catch (e) {
          console.error('Failed to parse token response', e);
          alert('Error: Could not read token response.');
        }
    },
    function(response) { // Error Callback
        console.error('Error getting access token:', response.error);
        alert('Error getting access token. See console for details.');
    }
  );
}

// in src/app.js

function getSpotifyProfile() {
  const accessToken = window.localStorage.getItem('spotify_access_token');
  if (!accessToken) {
    alert("Authentication error: No access token found.");
    return;
  }

  cordova.plugin.http.setHeader('Authorization', `Bearer ${accessToken}`);

  // HIER IST DIE KORREKTUR:
  cordova.plugin.http.get('https://api.spotify.com/v1/me', {}, {},
    function(response) { // Success Callback
        try {
          const profileData = JSON.parse(response.data);
          console.log("Spotify Profile Data:", profileData);

          document.getElementById('loginButton').style.display = 'none';
          document.getElementById('deviceready').innerHTML = `<p>Welcome, ${profileData.display_name}!</p>`;

        } catch (e) {
          console.error('Failed to parse profile data', e);
          alert('Error: Could not read profile data.');
        }
    },
    function(response) { // Error Callback
        console.error('Spotify API request failed', response.error);
        alert(`Error fetching profile: ${response.error}`);
    }
  );
}

// --- App Initialization ---

window.handleOpenURL = async (url) => {
  console.log("Received redirect URL: " + url);

  if (cordova.plugins && cordova.plugins.browsertab) {
    cordova.plugins.browsertab.close();
  }

  const code = new URL(url).searchParams.get('code');

  if (code) {
    getSpotifyAccessToken(code);
  } else {
    const error = new URL(url).searchParams.get('error');
    console.error("Spotify login failed:", error);
    alert("Login failed: " + error);
  }
};

function boot() {
  const accessToken = window.localStorage.getItem('spotify_access_token');
  if (accessToken) {
    console.log("Access token found, fetching profile...");
    getSpotifyProfile();
  } else {
    const loginButton = document.getElementById('loginButton');
    loginButton.style.display = 'block';
    loginButton.addEventListener('click', loginWithSpotify);
  }
}

document.addEventListener('deviceready', boot);