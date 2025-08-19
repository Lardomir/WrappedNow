// wrappednow/www/js/history-tracker.js
(function () {
  let firestoreDB;
  let currentUserId;
  let trackingInterval;
  let lastPlayedAt = null; // Stores the ISO string of the last track's played_at timestamp

  // Function to save new plays to Firestore
  async function saveNewPlays(plays) {
    if (!firestoreDB || !currentUserId || plays.length === 0) return;

    // Use the globally available Firebase object
    const { collection, addDoc } = window.Firebase;

    for (const play of plays) {
      try {
        const playData = {
          played_at: play.played_at,
          track: {
            id: play.track.id,
            name: play.track.name,
            duration_ms: play.track.duration_ms,
            uri: play.track.uri,
            artist: play.track.artists[0]?.name || 'Unknown Artist',
            album: play.track.album?.name || 'Unknown Album',
            album_art: play.track.album?.images[0]?.url || null,
          }
        };
        // Add a new document to the user's "plays" subcollection
        await addDoc(collection(firestoreDB, `users/${currentUserId}/plays`), playData);
      } catch (e) {
        console.error("Error writing document to Firestore: ", e);
      }
    }
  }

  // Fetches recently played tracks from Spotify
  async function checkForNewPlays() {
    const token = localStorage.getItem('spotify_access_token');
    if (!token || !currentUserId) {
      console.log("History Tracker: No token or user ID, stopping.");
      stopTracking();
      return;
    }

    try {
      // Fetch tracks played *after* the last one we saved
      const endpoint = lastPlayedAt
        ? `/me/player/recently-played?limit=50&after=${new Date(lastPlayedAt).getTime()}`
        : '/me/player/recently-played?limit=50';

      const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) stopTracking();
        return;
      }

      const data = await response.json();
      const newPlays = data.items || [];

      if (newPlays.length > 0) {
        const chronPlays = newPlays.reverse();
        console.log(`Found ${chronPlays.length} new track(s) to save.`);
        await saveNewPlays(chronPlays);
        lastPlayedAt = chronPlays[chronPlays.length - 1].played_at;
      } else {
        console.log("No new tracks to save.");
      }

    } catch (error) {
      console.error("Error checking for new plays:", error);
    }
  }

  // Public functions to control the tracker
  window.HistoryTracker = {
    start: (db, userId) => {
      if (trackingInterval) return;
      console.log("Starting history tracker...");
      firestoreDB = db;
      currentUserId = userId;
      lastPlayedAt = null;

      checkForNewPlays();
      trackingInterval = setInterval(checkForNewPlays, 2 * 60 * 1000);
    },
    stop: () => {
      console.log("Stopping history tracker.");
      clearInterval(trackingInterval);
      trackingInterval = null;
      currentUserId = null;
      firestoreDB = null;
    }
  };
})();
