import React, {useState, useEffect, useContext} from 'react'
import StreamingApi from './Api'
import UserContext from './UserContext';
import { v4 as uuid} from 'uuid'
import { XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, VerticalBarSeries, DiscreteColorLegend, Hint, makeVisFlexible } from 'react-vis';
import { colorsMap } from './colors.js'
import './style.css';
import './Chart.css'
import useLocalStorage from './hooks'

function ChartData(){
    const { currUser } = useContext(UserContext);
    const [chartRange, setChartRange] = useState("alltime");
    const [isLoading, setIsLoading] = useState(false);
    const [loadedVal, setLoadedVal] = useState(0);
    const [localData, setLocalData] = useLocalStorage("data");
    const [tryCount, setTryCount] = useState(0);
    const graphItems = []
    const FlexibleXYPlot = makeVisFlexible(XYPlot);
    

    //toggle between the two date ranges
    const toggleView = (evt) => {
        if (chartRange === "alltime") {
            setChartRange("month");
        } else {
            setChartRange("alltime")
        }
    }

    //get streaming data for user upon loading page
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
        const temp = localData[`spotify_${chartRange}`].map(d => ({ x: d.title, y: d.streams }))
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
            temp.push({x: song.title, y: parseInt(song.plays)})
        }
        masterObj[name] = temp;
    }
    
    //set the array of color indicators up for the legend
    const colorItems = [{ title: 'Bandcamp', color: '#12939A' }, { title: 'Spotify', color: '#1DB954' }];

    //set the hint when a bar is hovered over
    const [hintValue, setHintValue] = useState({});
    const _onNearestX = (value, {index}) => {
        if(hintValue !== value){
            setHintValue(value)
        }
    }

    //iterate through distrokid stores, applying correct color to each
    if(chartRange === "alltime"){
        for (let [store, songs] of Object.entries(masterObj)) {
            if (store !== "Spotify") {
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
    
    return(
        <div className="container-fluid" id="main-container">
            <div className="row">
                <div className="col-1"></div>
                <div className="col-10" id="chart-container">
                    {isLoading ? <div className="progress mt-5">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={`${loadedVal}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${loadedVal}%` }}></div>
                    </div> : <>{!isLoading && checkEmpty(localData) ? <><h1>Looks like you haven't imported any data yet!</h1></> : <>
                            <button className="btn btn-primary round m-1 btn-sm" onClick={toggleView} id="toggleButton">{chartRange === "month" ? "Alltime" : "30-day"}</button>
                    <FlexibleXYPlot xType="ordinal" margin={{ bottom: 200 }}>
                        <DiscreteColorLegend
                            style={{ position: 'absolute', right: '1rem', top: '10px' }}
                            orientation="vertical"
                            items={colorItems}
                        />
                        <Hint value={hintValue}>
                            {hintValue ? <div style={{ background: 'black' }}>
                                <p>{hintValue.y}</p>
                            </div> : <></>}
                        </Hint>
                        <VerticalGridLines />
                        <HorizontalGridLines />
                        <XAxis tickLabelAngle={-45} style={{ text: { stroke: 'none', fill: 'black' } }} />
                        <YAxis />
                        {graphItems.map((service, idx) => <VerticalBarSeries data={service} key={uuid()} className="vertical-bar-series" barWidth={1} onValueMouseOver={_onNearestX} color={colorItems[idx].color}/>)}
                    </FlexibleXYPlot></>}</>}
                </div>
            </div>
                <div className="col-1"></div>
            </div>
        
    )
}

export default ChartData;