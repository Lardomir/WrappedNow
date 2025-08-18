// src/app.js

// --- PKCE Helper Functions ---
// This function generates a random string of a specified length.
// It's used to create the 'code_verifier', a unique key for each login attempt.
function generateRandomString(length) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// This asynchronous function creates a 'code_challenge' from the 'code_verifier'.
// It uses the SHA-256 algorithm to hash the verifier and then encodes it in Base64Url format.
// This is the key to the PKCE security flow.
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return window.btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)])).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Configuration object for the Spotify API.
// Contains your app's client ID, the redirect URI, and the user permissions (scope).
var spotifyConfig = {
  clientId: "d9ba24940baa404fb039c92774ed2dda",
  redirectUri: "ch.example.wrappednow://callback",
  scope: "user-read-private user-read-email user-top-read user-read-recently-played"
};

// --- Login Functions ---
// This is the main function to start the Spotify login process.
async function loginWithSpotify() {
  // Generate the unique code verifier and its corresponding challenge.
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  // Store the verifier in the browser's local storage to be retrieved later.
  window.localStorage.setItem("spotify_code_verifier", codeVerifier);

  // Construct the URL parameters for the Spotify authorization request.
  const args = new URLSearchParams({
    response_type: "code", // We are requesting an authorization code
    client_id: spotifyConfig.clientId,
    scope: spotifyConfig.scope,
    redirect_uri: spotifyConfig.redirectUri,
    code_challenge_method: "S256", // Specifies the hashing method used for the challenge
    code_challenge: codeChallenge
  });

  // Construct the full authorization URL. This URL is where the user will be sent.
  // NOTE: The `https://accounts.spotify.com/authorize?$` part is a placeholder
  // and needs to be replaced with the actual Spotify authorization endpoint.
  const authUrl = `https://accounts.spotify.com/authorize?${args}`;

  // Use the Cordova BrowserTab plugin to open the URL in a secure in-app browser.
  if (cordova.plugins && cordova.plugins.browsertab) {
    cordova.plugins.browsertab.openUrl(authUrl);
  } else {
    // Fallback for when the plugin is not found.
    alert("BrowserTab-Plugin nicht gefunden!");
  }
}

// --- Callback and Token Functions ---
// This is a special function in Cordova that gets called when the app receives
// a redirect URL from an external source (like the in-app browser after login).
window.handleOpenURL = async (url) => {
  console.log("Received redirect URL: " + url);

  // Close the in-app browser tab.
  if (cordova.plugins && cordova.plugins.browsertab) {
    cordova.plugins.browsertab.close();
  }

  // Parse the received URL to get the authorization code.
  const code = new URL(url).searchParams.get("code");
  if (code) {
    // If a code is found, proceed to get the access token.
    await getSpotifyAccessToken(code);
  } else {
    // If there's no code, it's an error. Log it and alert the user.
    const error = new URL(url).searchParams.get("error");
    console.error("Spotify login failed:", error);
    alert("Login failed: " + error);
  }
};

// This function exchanges the authorization code for an access token.
async function getSpotifyAccessToken(code) {
  // Retrieve the stored code verifier.
  const codeVerifier = window.localStorage.getItem("spotify_code_verifier");
  if (!codeVerifier) {
    console.error("Code verifier not found!");
    return;
  }

  // Construct the request body for the token exchange.
  const body = new URLSearchParams({
    client_id: spotifyConfig.clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: spotifyConfig.redirectUri,
    code_verifier: codeVerifier // This proves we are the same app that initiated the login.
  });

  try {
    // Send a POST request to the Spotify token endpoint.
    // NOTE: `https://accounts.spotify.com/api/token` is a placeholder.
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });

    // Check if the request was successful.
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP status ${response.status}: ${errorBody}`);
    }

    // Parse the JSON response.
    const data = await response.json();

    // Store the access token and refresh token in local storage.
    window.localStorage.setItem("spotify_access_token", data.access_token);
    window.localStorage.setItem("spotify_refresh_token", data.refresh_token);

    alert("Login successful!");
    console.log("Access Token received and stored.");
  } catch (error) {
    // Handle any errors during the token exchange.
    console.error("Error getting access token:", error);
    alert("Error getting access token. See console for details.");
  }
}

// --- App Initialization ---
// The main boot function for the app.
function boot() {
  const loginButton = document.getElementById("loginButton");
  // Make sure the login button is visible.
  loginButton.style.display = "block";
  // Add an event listener to the login button to start the process on click.
  loginButton.addEventListener("click", loginWithSpotify);
}

// Listen for the 'deviceready' event, which is triggered when Cordova is fully loaded.
// This ensures that all Cordova plugins are ready to be used before we run our code.
document.addEventListener("deviceready", boot);