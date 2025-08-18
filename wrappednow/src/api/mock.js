// src/api/mock.js
export async function getDashboardStats() {
  return {
    greetingName: "Blanka",
    topSong: { title: "Houdini", artist: "Dua Lipa" },
    topArtist: "Dua Lipa",
    minutes: 12345,
  };
}

export async function getWrapped(period = '6m') {
  return {
    period,
    topSongs: [{ title:"Houdini", artist:"Dua Lipa" }, { title:"As It Was", artist:"Harry Styles"}],
    topArtists: ["Dua Lipa","The Weeknd","Taylor Swift"],
    totalMinutes: 54321,
  };
}

export async function getDailyTrends() {
  return {
    weekdayMinutes: [320, 250, 410, 300, 500, 600, 200], // Mon..Sun
    mostActiveDay: "Saturday",
    topActivity: "Walking",
  };
}
