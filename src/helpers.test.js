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