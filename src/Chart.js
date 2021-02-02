import React, { useState, useEffect, useContext } from 'react';
import StreamingApi from './Api';
import UserContext from './UserContext';
import { useLocalStorage } from './hooks.js';
import BarGraph from './BarGraph'
import { checkEmpty, formatDistrokidData, setupSeriesData } from './helpers'

function Chart(){
    const { currUser } = useContext(UserContext);
    const username = currUser.username;
    
    const [localData, setLocalData] = useLocalStorage("data");
    const [allSongs, setAllSongs] = useState([]);
    const [tryCount, setTryCount] = useState(0);
    const [chartRange, setChartRange] = useState("alltime");
    const [loadedVal, setLoadedVal] = useState(0);

    let seriesData = {};
    
    //Helper function for incrementing the loader.
    function incrementLoadingVal(){
        loadedVal === 100 ? setLoadedVal(0) : setLoadedVal(old => old + 25);
    }

    //Toggle between view ranges
    const toggleView = (evt) => {
        if (chartRange === "alltime") {
            setChartRange("month");
        } else {
            setChartRange("alltime");
        }
    }

    //Get all streaming data for a user when the page loads.
    useEffect(() => {
        async function loadUserData() {
            //Reset the value of the loading bar.
            incrementLoadingVal();

            try {
                //Temporary fix for error of hook adding [object Object] to local storage
                if (Object.keys(localData).length === 15) setLocalData(old => ({ bandcamp_alltime: old.bandcamp_alltime || [], bandcamp_month: old.bandcamp_month || [], distrokid: old.distrokid || [], spotify_alltime: old.spotify_alltime || [], spotify_month: old.spotify_month || [] }));

                //if the bandcamp data is not in local storage, retrieve and save it.
                if (localData[`bandcamp_${chartRange}`] === undefined || !localData[`bandcamp_${chartRange}`].length){
                    let bdata = await StreamingApi.getUserBandcampData(username, { range: chartRange });

                    //set the local data for the correct range
                    chartRange === "alltime" ? setLocalData(old => ({ ...old, bandcamp_alltime: bdata})) : setLocalData(old => ({ ...old, bandcamp_month: bdata}));
                }
                incrementLoadingVal();

                //if the spotify data is not in local storage, retrieve and save it.
                if (localData[`spotify_${chartRange}`] === undefined || !localData[`spotify_${chartRange}`].length){
                    let sdata = await StreamingApi.getUserSpotifyData({ range: chartRange }, username);

                    //set the local data for the correct range
                    chartRange === "alltime" ? setLocalData(old => ({ ...old, spotify_alltime: sdata})) :
                    setLocalData(old => ({ ...old, spotify_month: sdata}));
                }
                incrementLoadingVal();

                //if the distrokid data is not in local storage, retrieve and save it.
                if(localData[`distrokid`] === undefined || !localData[`distrokid`].length){
                    let ddata = await StreamingApi.getUserDistrokidData(username, { range: chartRange });
                    let formatted = formatDistrokidData(ddata);
                    setLocalData(old => ({ ...old, distrokid: formatted}));
                }
                incrementLoadingVal();

                //if the state for all songs isn't set, retrieve all songs for the user.
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

    if (localData[`distrokid`]) {
        seriesData = setupSeriesData(localData, chartRange, seriesData, allSongs);
    }

    const chartTitle = chartRange === "alltime" ? "All time" : "30-day";


    function renderToggleButton(){
        return (<><button className="btn btn-primary round mt-3 mb-3 btn-sm" onClick={toggleView} id="toggleButton">{chartRange === "month" ? "Alltime" : "30-day"}</button>
            </>)
    }

    function renderProgressBar(){
        return (
            <div className="progress"><div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={`${loadedVal}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${loadedVal}%` }}></div></div>
        )
    }
    
    return(
        <div className="container-narrow">
            <div className="container" style={{height: "75vh", paddingRight: "2vw"}}>
                <h2 className="chart-title" data-testid="chartTitle">{chartTitle}</h2>
                <>{renderToggleButton()}</>
                {loadedVal > 0 && loadedVal < 100 ? renderProgressBar() : seriesData !== {} && allSongs.length ? <BarGraph songs={allSongs} seriesData={seriesData} range={chartRange} className="mt-3" /> : <><h4>No data has been imported for {chartTitle} yet. Wait a few seconds, or import data now.</h4></>}
            </div>
        </div>
    )
}

export default Chart;