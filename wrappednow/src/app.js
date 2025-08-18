// This code is a JavaScript file (e.g., app.js) that handles the Spotify authentication process
// for a Cordova mobile application using the Proof Key for Code Exchange (PKCE) flow.

// --- PKCE Helper Functions ---
// `generateRandomString`: Generates a cryptographically secure random string.
// This string serves as the `code_verifier`, a secret key for each login attempt.
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// `generateCodeChallenge`: Creates a one-way hash of the `code_verifier`.
// This `code_challenge` is sent to Spotify to link the app's login request to the user's browser session.
// The `code_verifier` is never sent over the network, making the process secure.
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return window.btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// `spotifyConfig`: A configuration object holding the app's Spotify API details.
// `clientId`: Your unique Spotify application ID.
// `redirectUri`: The URI that Spotify will redirect back to after the user logs in.
// `scope`: The permissions the app is requesting from the user.
const spotifyConfig = {
    clientId: 'd9ba24940baa404fb039c92774ed2dda',
    redirectUri: 'ch.example.wrappednow://callback',
    scope: 'user-read-private user-read-email user-top-read user-read-recently-played'
};

// --- Login Flow ---
// `loginWithSpotify`: Initiates the entire Spotify login process.
// It generates the PKCE keys, saves the verifier, and builds the Spotify authorization URL.
async function loginWithSpotify() {
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // The code verifier is stored locally. It will be needed later to exchange the authorization code for an access token.
    window.localStorage.setItem('spotify_code_verifier', codeVerifier);

    // Constructs the URL parameters for the authorization request.
    const args = new URLSearchParams({
        response_type: 'code', // Specifies that we want an authorization code
        client_id: spotifyConfig.clientId,
        scope: spotifyConfig.scope,
        redirect_uri: spotifyConfig.redirectUri,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge
    });

    // `authUrl`: The full URL to which the user will be redirected to log in to their Spotify account.
    // NOTE: The `https://accounts.spotify.com/authorize?${args}` part is a placeholder
    // for the actual Spotify authorization endpoint (`https://accounts.spotify.com/authorize?`).
    const authUrl = `https://accounts.spotify.com/authorize?${args}`;

    // Uses the Cordova `BrowserTab` plugin to open the URL in a secure in-app browser tab.
    if (cordova.plugins && cordova.plugins.browsertab) {
        cordova.plugins.browsertab.openUrl(authUrl);
    } else {
        alert('BrowserTab-Plugin nicht gefunden!');
    }
}


// --- Redirect and Token Exchange ---
// `window.handleOpenURL`: A Cordova-specific function that intercepts the redirect back to the app from the browser.
// The browser sends a URL with the authorization code, which this function processes.
window.handleOpenURL = async (url) => {
  console.log("Received redirect URL: " + url);

  // Closes the in-app browser tab once the app receives the redirect.
  if (cordova.plugins && cordova.plugins.browsertab) {
    cordova.plugins.browsertab.close();
  }

  // Extracts the authorization code from the URL's query parameters.
  const code = new URL(url).searchParams.get('code');

  if (code) {
    // If a code is successfully received, this function is called to get the access token.
    await getSpotifyAccessToken(code);
  } else {
    // If an error occurred, log it and inform the user.
    const error = new URL(url).searchParams.get('error');
    console.error("Spotify login failed:", error);
    alert("Login failed: " + error);
  }
};

// `getSpotifyAccessToken`: This function completes the final step of the PKCE flow.
// It sends the authorization code and the `code_verifier` (from local storage) to Spotify's
// token endpoint to securely obtain the access token.
async function getSpotifyAccessToken(code) {
  // Retrieves the stored `code_verifier` to prove the request's authenticity.
  const codeVerifier = window.localStorage.getItem('spotify_code_verifier');
  if (!codeVerifier) {
    console.error("Code verifier not found!");
    return;
  }

  // Constructs the request body for the token exchange POST request.
  const body = new URLSearchParams({
    client_id: spotifyConfig.clientId,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: spotifyConfig.redirectUri,
    code_verifier: codeVerifier // This proves that this app is the one that initiated the login.
  });

  try {
    // Performs a POST request to Spotify's token endpoint to get the access token.
    // NOTE: `https://accounts.spotify.com/api/token` is a placeholder
    // for the actual Spotify token endpoint (`https://accounts.spotify.com/api/token`).
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP status ${response.status}: ${errorBody}`);
    }

    // Parses the JSON response from Spotify.
    const data = await response.json();

    // Stores the received access token and refresh token in local storage for later API calls.
    window.localStorage.setItem('spotify_access_token', data.access_token);
    window.localStorage.setItem('spotify_refresh_token', data.refresh_token);

    alert("Login successful!");
    console.log("Access Token received and stored.");

  } catch (error) {
    console.error('Error getting access token:', error);
    alert('Error getting access token. See console for details.');
  }
}

// --- App Initialization ---
// `boot`: The main function that runs when the app starts. It's responsible for setting up the UI and event listeners.
function boot() {
  const loginButton = document.getElementById('loginButton');
  // Ensures the login button is visible.
  loginButton.style.display = 'block';
  // Adds an event listener to the login button that triggers the `loginWithSpotify` function on a click.
  loginButton.addEventListener('click', loginWithSpotify);
}

// `document.addEventListener('deviceready', boot)`: This is a crucial line for Cordova apps.
// It waits for the `deviceready` event to be fired, which signals that Cordova's
// native components (plugins) have loaded and are safe to use. Once ready, it calls the `boot` function.
document.addEventListener('deviceready', boot);