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

const testLocalData = {
    "bandcamp_alltime": [{"title": "song1", "streams": 100}, {"title": "song2", "streams": 200}],
    "bandcamp_month": [],
    "distrokid": {apple: [{"title": "song2", "plays": 200}]},
    "spotify_alltime": [{"title": "song1", "plays": 100}, {"title": "song2", "plays": 200}, {"title": "song3", "plays": 100}],
    "spotify_month": []
}

exports.songs = songs;
exports.seriesData = seriesData;
exports.testDistrokidData = testDistrokidData;
exports.testLocalData = testLocalData;

// module.exports = { songs, seriesData }