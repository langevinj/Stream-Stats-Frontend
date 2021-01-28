import React, {useState, useEffect, useContext} from 'react'
import StreamingApi from './Api'
import UserContext from './UserContext';
import { v4 as uuid} from 'uuid'
import { colorsMap } from './colors.js'
import './style.css';
import './Chart.css'
import useLocalStorage from './hooks'
import BarGraph from './BarGraph';



function ChartData(){
    const { currUser } = useContext(UserContext);
    const [chartRange, setChartRange] = useState("alltime");
    const [isLoading, setIsLoading] = useState(false);
    const [loadedVal, setLoadedVal] = useState(0);
    const [localData, setLocalData] = useLocalStorage("data");
    const [tryCount, setTryCount] = useState(0);
    const [allSongs, setAllSongs] = useState([]);
    const graphItems = []

    //toggle between the two date ranges
    const toggleView = (evt) => {
        if (chartRange === "alltime") {
            setChartRange("month");
        } else {
            setChartRange("alltime");
        }
    }

    //get streaming data for user when page loads
    useEffect(() => {
        async function getUserData() {
            setIsLoading(true);
            setLoadedVal(0);
            try {
                if(!localData[`bandcamp_${chartRange}`]){
                    let bdata = await StreamingApi.getUserBandcampData({ range: chartRange }, currUser.username);
                    chartRange === "alltime" ? setLocalData(old => ({ ...localData, bandcamp_alltime: [...bdata] })) : setLocalData(old => ({ ...old, bandcamp_month: bdata }));
                }
                setLoadedVal(25);

                if(!localData[`distrokid`]){
                    let ddata = await StreamingApi.getUserDistrokidData({ range: chartRange }, currUser.username);
                    setLocalData(old => ({...old, distrokid: ddata}));
                };
                setLoadedVal(50);

                if(!localData[`spotify_${chartRange}`]){
                    let sdata = await StreamingApi.getUserSpotifyData({ range: chartRange }, currUser.username);
                    chartRange === "alltime" ? setLocalData(old => ({ ...old, spotify_alltime: [...sdata] })) : setLocalData(old => ({ ...old, spotify_month: sdata }));
                }
                setLoadedVal(75);
                
                const songs = await StreamingApi.getAllSongs(currUser.username);
                setAllSongs(songs.map(s => s.title));
                setLoadedVal(100);
            } catch (err) {
                throw err;
            }
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
            
        }
        getUserData()
    }, [chartRange, currUser.username]);

    //if local isn't present, set it to the default, not sure if this is needed
    if(!localData){ 
        setLocalData({ distrokid: [], bandcamp_alltime: [], bandcamp_month: [], spotify_alltime: [], spotify_month: [] });
    }

    //if there is no alltime data to load, automatically check if there is any in the 30day chart
    if(tryCount === 0 && !localData['distrokid'] && !localData['spotify_alltime'] && !localData['bandcamp_alltime']){
        setTryCount(tryCount => tryCount + 1);
        toggleView();
    }
    
    //go through the bandcamp data and format it correctly, then push into main data area
    if (localData[`bandcamp_${chartRange}`]){
        let temp = localData[`bandcamp_${chartRange}`].map(d => ({ x: d.title, y: d.plays }));
        graphItems.push(temp);
    }

    //iterate through spotify data, add it to the main items array
    if (localData[`spotify_${chartRange}`]) {
        const temp = localData[`spotify_${chartRange}`].map((d) => ({ x: d.title, y: d.streams  }))
        graphItems.push(temp);
    }

    //parse the distrokid data and set it up as an array of songs per store
    let allStoreData = {};
    if(localData[`distrokid`]){
        for (let dataset of localData[`distrokid`]) {
            if (allStoreData[dataset.store]) {
                allStoreData[dataset.store] = [...allStoreData[dataset.store], { title: dataset.title, plays: dataset.plays }]
            } else {
                allStoreData[dataset.store] = [{ title: dataset.title, plays: dataset.plays }]
            }
        }
    }
  
    //format an option where keys are the name of the store and values are an array of objects formatted for the chart
    let masterObj = {}
    for (let [name, songs] of Object.entries(allStoreData)) {
        let temp = [];
        for(let song of songs){
            temp.push({ y: parseInt(song.plays) , x: song.title})
        }
        masterObj[name] = temp;
    }
    
    //set the array of color indicators up for the legend
    const colorItems = [{ title: 'Bandcamp', color: '#12939A' }, { title: 'Spotify', color: '#1DB954' }];

    
    
    //iterate through distrokid stores, applying correct color to each
    if(chartRange === "alltime"){
        for (let [store, songs] of Object.entries(masterObj)) {
            if (store !== "spotify") {
                let foundColor = colorsMap.get(store)
                colorItems.push({ title: store, color: foundColor });
                graphItems.push(songs);
            }
        }
    }
    
    const checkEmpty = (obj) => {
        const isEmpty = true;
        for(let el of ['distrokid', 'bandcamp_alltime', 'bandcamp_month', 'spotify_alltime', 'spotify_month']){
            if(obj[el] !== undefined && obj[el].length) return false
        }
        return isEmpty;
    }

    //list all of the songs from the data given
    // for(let store of graphItems){
    //     for(let song of store){
    //         if(!allSongs.includes(song.x)){
    //             allSongs.push(song.x);
    //         }
    //     }
    // }

    //prep data for service
    const bandcampGraphData = [];
    if(localData[`bandcamp_${chartRange}`]){
        for(let song of allSongs){
            if (localData[`bandcamp_${chartRange}`].filter(el => el.title === song).length===0){

            }
            if(allSongs.includes(song.title)){
                bandcampGraphData.push(song.plays)
            } else {
                bandcampGraphData.push(0)
            }
        }
    }
    // console.log(bandcampGraphData)
    console.log(allSongs)

    return(
        <div className="container-narrow">
        <div className="container-fluid" id="main-container">
            
            <div className="row">
                <div className="col-1"></div>
                <div className="col-10 pt-4 pl-2 pr-2" id="chart-container">
                    {isLoading ? <div className="progress">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={`${loadedVal}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${loadedVal}%` }}></div>
                    </div> : <>{!isLoading && checkEmpty(localData) ? <><h1>Looks like you haven't imported any data yet!</h1></> : <>
                            <button className="btn btn-primary round m-1 btn-sm" onClick={toggleView} id="toggleButton">{chartRange === "month" ? "Alltime" : "30-day"}</button>
                            <h2 className="chart-title mt-2">{chartRange === "alltime" ? "Alltime" : "30-day"}</h2>
                            <div>
                                    <BarGraph songs={allSongs} seriesData={bandcampGraphData}/>
                            </div>  
                        </>}</>}
                </div>
            </div>
                <div className="col-1"></div>
            </div>
            </div>
        
    )
}

export default ChartData;