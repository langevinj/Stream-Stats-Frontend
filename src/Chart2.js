import React, { useState, useEffect, useContext } from 'react';
import StreamingApi from './Api';
import UserContext from './UserContext';
import useLocalStorage from './hooks';
import BarGraph from './BarGraph'

function Chart2(){
    //get the username for the current user
    const { currUser } = useContext(UserContext);
    const username = currUser.username;

    //use local storage to set a save the chart data so it doesn't need to be completely loaded again
    const [localData, setLocalData] = useLocalStorage("data");

    //state object to store a list of all of a user's songs in
    const [allSongs, setAllSongs] = useState([]);

    // const [seriesData, setSeriesData] = useState({});
    let seriesData = {};

    //set the range the chart should display
    const [chartRange, setChartRange] = useState("alltime");

    //the state object for holding the value for the loader
    const [loadedVal, setLoadedVal] = useState(0);
    
    //helper function for incrementing the loader
    function incrementLoadingVal(){
        loadedVal === 100 ? setLoadedVal(0) : setLoadedVal(old => old + 25);

    }

    //Get all streaming data for a user when the page loads
    useEffect(() => {
        async function loadUserData() {
            //reset the value of the loading bar
            incrementLoadingVal();

            try {
                //.temp fix for error of hook adding [object Object] to local storage
                if (localData) setLocalData(old => ({ bandcamp_alltime: old.bandcamp_alltime || [], bandcamp_month: old.bandcamp_month || [], distrokid: old.distrokid || [], spotify_alltime: old.spotify_alltime || [], spotify_month: old.spotify_month || [] }));

                //if the bandcamp data is not in local storage, retrieve and save it
                if(!localData[`bandcamp_${chartRange}`]){
                    let bdata = await StreamingApi.getUserBandcampData({ range: chartRange }, username);

                    //set the local data for the correct range
                    chartRange === "alltime" ? setLocalData(old => ({ ...old, bandcamp_alltime: bdata})) : setLocalData(old => ({ ...old, bandcamp_month: bdata}));
                }
                incrementLoadingVal();

                //if the spotify data is not in local storage, retrieve and save it
                if(!localData[`spotify_${chartRange}`]){
                    let sdata = await StreamingApi.getUserSpotifyData({ range: chartRange }, username);

                    //set the local data for the correct range
                    chartRange === "alltime" ? setLocalData(old => ({ ...old, spotify_alltime: sdata})) :
                    setLocalData(old => ({ ...old, spotify_month: sdata}));
                }
                incrementLoadingVal();
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
    }, [chartRange, currUser]);

    //format the local data into series data for the bargraph
    function setupSeriesData(){
        const toFormat = [`bandcamp_${chartRange}`, `spotify_${chartRange}`,`distrokid`];

        //iterate through each service
        for(let service of toFormat){

            //set the name for each service
            let name;
            if(service.includes('bandcamp')) name = "Bandcamp";
            if(service.includes('spotify')) name = "Spotify";
            if(service.includes('distrokid')) name = "Distrokid";

            let temp = [];
            //account for all songs
            if(localData[service]){
                for (let song of allSongs) {
                    //find if the service has a record of the song
                    let found = localData[service].filter(s => s.title === song);

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

    //format the data for the BarGraph component
    setupSeriesData();

    return(
        <div className="container-narrow">
            <BarGraph songs={allSongs} seriesData={seriesData} range={chartRange}/>
        </div>
    )
}

export default Chart2;