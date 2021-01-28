
//returns the correct store key based on object given from distrokid
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

module.exports = { servicePicker }