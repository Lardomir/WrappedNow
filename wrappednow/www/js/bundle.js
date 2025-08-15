// src/app.js
function generateRandomString(length) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return window.btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)])).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
var spotifyConfig = {
  clientId: "d9ba24940baa404fb039c92774ed2dda",
  redirectUri: "ch.example.wrappednow://callback",
  scope: "user-read-private user-read-email user-top-read user-read-recently-played"
};
async function loginWithSpotify() {
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  window.localStorage.setItem("spotify_code_verifier", codeVerifier);
  const args = new URLSearchParams({
    response_type: "code",
    client_id: spotifyConfig.clientId,
    scope: spotifyConfig.scope,
    redirect_uri: spotifyConfig.redirectUri,
    code_challenge_method: "S256",
    code_challenge: codeChallenge
  });
  const authUrl = `https://accounts.spotify.com/authorize?${args}`;
  if (cordova.plugins && cordova.plugins.browsertab) {
    cordova.plugins.browsertab.openUrl(authUrl);
  } else {
    alert("BrowserTab-Plugin nicht gefunden!");
  }
}
window.handleOpenURL = async (url) => {
  console.log("Received redirect URL: " + url);
  if (cordova.plugins && cordova.plugins.browsertab) {
    cordova.plugins.browsertab.close();
  }
  const code = new URL(url).searchParams.get("code");
  if (code) {
    await getSpotifyAccessToken(code);
  } else {
    const error = new URL(url).searchParams.get("error");
    console.error("Spotify login failed:", error);
    alert("Login failed: " + error);
  }
};
async function getSpotifyAccessToken(code) {
  const codeVerifier = window.localStorage.getItem("spotify_code_verifier");
  if (!codeVerifier) {
    console.error("Code verifier not found!");
    return;
  }
  const body = new URLSearchParams({
    client_id: spotifyConfig.clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: spotifyConfig.redirectUri,
    code_verifier: codeVerifier
  });
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP status ${response.status}: ${errorBody}`);
    }
    const data = await response.json();
    window.localStorage.setItem("spotify_access_token", data.access_token);
    window.localStorage.setItem("spotify_refresh_token", data.refresh_token);
    alert("Login successful!");
    console.log("Access Token received and stored.");
  } catch (error) {
    console.error("Error getting access token:", error);
    alert("Error getting access token. See console for details.");
  }
}
function boot() {
  const loginButton = document.getElementById("loginButton");
  loginButton.style.display = "block";
  loginButton.addEventListener("click", loginWithSpotify);
}
document.addEventListener("deviceready", boot);
//# sourceMappingURL=bundle.js.map
