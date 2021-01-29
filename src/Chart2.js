import React, { useState, useEffect, useContext } from 'react';
import StreamingApi from './Api';
import UserContext from './UserContext';
import useLocalStorage from './hooks';
import BarGraph from './BarGraph'
import { servicePicker } from './helpers'

function Chart2(){
    //get the username for the current user
    const { currUser } = useContext(UserContext);
    const username = currUser.username;
    const [localData, setLocalData] = useLocalStorage("data");
    const [allSongs, setAllSongs] = useState([]);
    let seriesData = {};
    const [chartRange, setChartRange] = useState("alltime");
    const [loadedVal, setLoadedVal] = useState(0);
    
    //helper function for incrementing the loader
    function incrementLoadingVal(){
        loadedVal === 100 ? setLoadedVal(0) : setLoadedVal(old => old + 25);
    }

    function formatDistrokidData(data) {
        let masterObj = { 'amazon': [], 'apple': [], 'deezer': [], 'itunes': [], 'google': [], 'tidal': [], 'tiktok': [], 'youtube': [] };
        
        for (let dataset of data) {
            let store = servicePicker(dataset);
            if (store){
                //push together similar services
                if(masterObj[store].length){
                    let found = masterObj[store].filter(el => el.title === dataset.title);
                    if(found[0]){
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

    //toggle between view ranges
    const toggleView = (evt) => {
        if (chartRange === "alltime") {
            setChartRange("month");
        } else {
            setChartRange("alltime");
        }
    }

    //Get all streaming data for a user when the page loads
    useEffect(() => {
        async function loadUserData() {
            //reset the value of the loading bar
            incrementLoadingVal();

            try {
                //.temp fix for error of hook adding [object Object] to local storage
                if (Object.keys(localData).length === 15) setLocalData(old => ({ bandcamp_alltime: old.bandcamp_alltime || [], bandcamp_month: old.bandcamp_month || [], distrokid: old.distrokid || [], spotify_alltime: old.spotify_alltime || [], spotify_month: old.spotify_month || [] }));

                //if the bandcamp data is not in local storage, retrieve and save it
                if (localData[`bandcamp_${chartRange}`] === undefined || !localData[`bandcamp_${chartRange}`].length){
                    let bdata = await StreamingApi.getUserBandcampDat(username, { range: chartRange });

                    //set the local data for the correct range
                    chartRange === "alltime" ? setLocalData(old => ({ ...old, bandcamp_alltime: bdata})) : setLocalData(old => ({ ...old, bandcamp_month: bdata}));
                }
                incrementLoadingVal();

                //if the spotify data is not in local storage, retrieve and save it
                if (localData[`spotify_${chartRange}`] === undefined || !localData[`spotify_${chartRange}`].length){
                    let sdata = await StreamingApi.getUserSpotifyData({ range: chartRange }, username);

                    //set the local data for the correct range
                    chartRange === "alltime" ? setLocalData(old => ({ ...old, spotify_alltime: sdata})) :
                    setLocalData(old => ({ ...old, spotify_month: sdata}));
                }
                incrementLoadingVal();

                //if the distrokid data is not in local storage, retrieve and save it
                if(localData[`distrokid`] === undefined || !localData[`distrokid`].length){
                    let ddata = await StreamingApi.getUserDistrokidData({range: chartRange}, username);
                    let formatted = formatDistrokidData(ddata);
                    setLocalData(old => ({ ...old, distrokid: formatted}));
                }
                incrementLoadingVal();

                //if the state for all songs isn't set, retrieve all songs for the user
                if(!allSongs.length){
                    let songs = await StreamingApi.getAllSongs(username);
                    setAllSongs(songs.map(s => s.title));
                }

                incrementLoadingVal();
            } catch (err) {
                throw err;
            }
        }
        loadUserData()
    }, [username, chartRange]);

    //format the local data into series data for the bargraph
    function setupSeriesData(){
        const toFormat = chartRange === "alltime" ? [`bandcamp_${chartRange}`, `spotify_${chartRange}`, 'amazon', 'apple', 'deezer', 'itunes', 'google', 'tidal', 'tiktok', 'youtube'] :
        [`bandcamp_${chartRange}`, `spotify_${chartRange}`]
        //iterate through each service
        for(let service of toFormat){
            let serviceData;
            //set the name for each service
            let name;
            if(service.includes('bandcamp')){
                name = "Bandcamp";
                serviceData = localData[service];
            } else if (service.includes('spotify')){
                name = "Spotify";
                serviceData = localData[service];
            } else {
                serviceData = (localData.distrokid)[service]
                name = service.charAt(0).toUpperCase() + service.slice(1);
            }



            let temp = [];
            //account for all songs
            if(serviceData){
                for (let song of allSongs) {
                    //find if the service has a record of the song
                    let found = serviceData.filter(s => s.title === song);

                    if (found.length) {
                        temp.push(found[0].plays || found[0].streams);
                    } else {
                        temp.push(0)
                    }
                }
                
            } else {
                temp = new Array(allSongs.length).fill(0)
            }
            seriesData[service] = { name: name, data: temp }
        }
    }

    if (localData[`distrokid`]) {
        setupSeriesData();
    }

    const checkEmpty = (obj) => {
        const isEmpty = true;
        for (let el of ['distrokid', 'bandcamp_alltime', 'bandcamp_month', 'spotify_alltime', 'spotify_month']) {
            if (obj[el] !== undefined && obj[el].length) return false
        }
        return true;
    }

    return(
        <div className="container-narrow">
            <div className="container" style={{height: "75vh", paddingRight: "2vw"}}>
                {loadedVal > 0 && loadedVal < 100 ? <div className="progress"><div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={`${loadedVal}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${loadedVal}%` }}></div></div> : <>{checkEmpty(localData) ? <><h1>Looks like you haven't imported any data yet!</h1></> : <>
                <button className="btn btn-primary round mt-3 btn-sm" onClick={toggleView} id="toggleButton">{chartRange === "month" ? "Alltime" : "30-day"}</button>
                <h2 className="chart-title mt-2">{chartRange === "alltime" ? "Alltime" : "30-day"}</h2>
                {seriesData ? <BarGraph songs={allSongs} seriesData={seriesData} range={chartRange} /> : <></>}</>}</>}
            </div>
        </div>
    )
}

export default Chart2;