const { servicePicker, checkEmpty, formatDistrokidData, setupSeriesData } = require('./helpers.js');
const { testDistrokidData, songs, testLocalData } = require('./_testcommon');

describe("servicePicker", function() {
    it("returns a correct key", function() {
        expect(servicePicker({"store": "Amazon Prime"})).toEqual('amazon');
        expect(servicePicker({"store": "Apple BEATS"})).toEqual('apple');
        expect(servicePicker({ "store": "DEeZeR" })).toEqual('deezer');
        expect(servicePicker({ "store": "iTunes" })).toEqual('itunes');
        expect(servicePicker({ "store": "Google Play Music" })).toEqual('google');
        expect(servicePicker({ "store": "Tidal Downloads" })).toEqual('tidal');
        expect(servicePicker({ "store": "TikTok/" })).toEqual('tiktok');
        expect(servicePicker({ "store": "Youtube Red" })).toEqual('youtube');
    });

    it("should return null if not a valid store", function(){
        expect(servicePicker({ "store": "Napster" })).toEqual(null);
    });
});

describe("checkEmpty", function() {
    it("should return true is an object is empty", function() {
        expect(checkEmpty({"distrokid": {}, "bandcamp_alltime": [], "spotify_alltime": []}, "alltime")).toEqual(true);
        expect(checkEmpty({}, "alltime")).toEqual(true);
    });

    it("should return false if an object is not empty", function() {
        expect(checkEmpty({ "distrokid": {"applemusic": [1, 2, 3]}, "bandcamp_alltime": [], "spotify_alltime": [] }, "alltime")).toEqual(false);
        expect(checkEmpty({"bandcamp_month": [1,2,3], "spotify_month": [] }, "month")).toEqual(false);
    });
});

describe("formatDistrokidData", function() {
    it("correctly formats the data", function() {
        const resp = formatDistrokidData(testDistrokidData);
        expect(resp).toEqual({
            'amazon': [{ "title": "song1", "plays": 300}], 'apple': [{ "title": "song1", "plays": 200}], 'deezer': [{ "title": "song1", "plays": 100}], 'itunes': [{ "title": "song2", "plays": 100}], 'google': [{ "title": "song2", "plays": 200}], 'tidal': [{ "title": "song2", "plays": 300}], 'tiktok': [{ "title": "song2", "plays": 200}], 'youtube': [{ "title": "song2", "plays": 100}] 
        });
    });

    it("pushes together data of streaming platforms with different titles", function() {
        testDistrokidData.push({"plays": "200", "profit": "0.111", "store": "youtube", "title": "song2"},
                                { "plays": "200", "profit": "0.111", "store": "google play all access", "title": "song2" },
                                { "plays": "100", "profit": "0.111", "store": "google play all access", "title": "song1" });
        const resp = formatDistrokidData(testDistrokidData);
        expect(resp).toEqual({
            'amazon': [{ "title": "song1", "plays": 300 }], 'apple': [{ "title": "song1", "plays": 200 }], 'deezer': [{ "title": "song1", "plays": 100 }], 'itunes': [{ "title": "song2", "plays": 100 }], 'google': [{ "title": "song2", "plays": 400 }, {"title": "song1", "plays": 100}], 'tidal': [{ "title": "song2", "plays": 300 }], 'tiktok': [{ "title": "song2", "plays": 200 }], 'youtube': [{ "title": "song2", "plays": 300 }]
        });
    });
});

describe("setupSeriesData", function() {
    it("properly formats the data", function() {

    });
});

