const songs = ['song1', 'song2', 'song3'];

const seriesData = {
    "bandcamp_month": {"name": "Bandcamp", "data": [50, 300, 200]},
    "spotify_month": {"name": "Spotify", "data": [0, 20, 200]}
}

const testDistrokidData = [
    {"plays": "200" , "profit": "0.1111","store": "applemusic", "title": "song1"},
    { "plays": "300", "profit": "0.1111", "store": "amazon unlimited", "title": "song1"},
    { "plays": "100", "profit": "0.1111", "store": "deezer" , "title": "song1" },
    { "plays": "100", "profit": "0.1111", "store": "itunes", "title": "song2" },
    { "plays": "200", "profit": "0.1111", "store": "google play", "title": "song2" },
    { "plays": "100", "profit": "0.1111", "store": "youtube red", "title": "song2" },
    { "plays": "300", "profit": "0.1111", "store": "tidal", "title": "song2" },
    { "plays": "200", "profit": "0.1111", "store": "tiktok", "title": "song2" }
]

exports.songs = songs;
exports.seriesData = seriesData;
exports.testDistrokidData = testDistrokidData;

// module.exports = { songs, seriesData }