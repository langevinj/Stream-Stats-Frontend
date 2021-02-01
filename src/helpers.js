/** Helper functions for components. */

//Returns the correct store key based on object given from distrokid.
function servicePicker(obj){
    const store = obj.store.toLowerCase();
    if(store.includes('amazon')) return 'amazon';
    if(store.includes('apple')) return 'apple';
    if(store.includes('deezer')) return 'deezer';
    if(store.includes('itunes')) return 'itunes';
    if(store.includes('google')) return 'google';
    if(store.includes('tidal')) return 'tidal';
    if(store.includes('tiktok')) return 'tiktok';
    if(store.includes('youtube')) return 'youtube';
    return null;
}

//Check if the localData object is empty, to indicate loading directions.
function checkEmpty(obj, chartRange) {
    if (chartRange === "alltime") {
        for (let el of ['distrokid', 'bandcamp_alltime', 'spotify_alltime']) {
            if (obj[el] !== undefined) {
                if (Array.isArray(obj[el]) && obj[el].length) return false
                if (typeof (obj[el]) === 'object' && obj[el] !== null && Object.keys(obj[el]).length) return false;
            }
        }
        return true
    } else {
        for (let el of ['bandcamp_month', 'spotify_month']) {
            if (obj[el] !== undefined && obj[el].length) return false
        }
        return true
    }
}

function formatDistrokidData(data) {
    let masterObj = { 'amazon': [], 'apple': [], 'deezer': [], 'itunes': [], 'google': [], 'tidal': [], 'tiktok': [], 'youtube': [] };

    for (let dataset of data) {
        let store = servicePicker(dataset);
        if (store) {
            //Push together similar services
            if (masterObj[store].length) {
                let found = masterObj[store].filter(el => el.title === dataset.title);
                if (found[0]) {
                    found[0].plays = found[0].plays + parseInt(dataset.plays);
                } else {
                    masterObj[store].push({ title: dataset.title, plays: parseInt(dataset.plays) })
                }
            } else {
                masterObj[store].push({ title: dataset.title, plays: parseInt(dataset.plays) })
            }
        }
    }

    return masterObj;
}

module.exports = { servicePicker, checkEmpty, formatDistrokidData}