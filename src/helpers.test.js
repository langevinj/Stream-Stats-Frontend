const { servicePicker, checkEmpty, formatDistrokidData, setupSeriesData } = require('./helpers.js');

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