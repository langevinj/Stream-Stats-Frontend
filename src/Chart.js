import React, {useState, useEffect, useContext} from 'react'
import StreamingApi from './Api'
import UserContext from './UserContext';
import DataContext from './DataContext';
import { v4 as uuid} from 'uuid'
import { XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, VerticalBarSeries, DiscreteColorLegend, Hint, makeVisFlexible } from 'react-vis';
import { colorsMap } from './colors.js'
import './style.css';
import './Chart.css'

function ChartData(){
    const { currUser } = useContext(UserContext);
    const { userData, setUserData } = useContext(DataContext);
    const [chartRange, setChartRange] = useState("alltime");
    const [isLoading, setIsLoading] = useState(false);
    const [loadedVal, setLoadedVal] = useState(0);
    const graphItems = []
    const FlexibleXYPlot = makeVisFlexible(XYPlot);

    //get streaming data for user upon loading page
    useEffect(() => {
        async function getUserData() {
            setIsLoading(true)
            setLoadedVal(0)
            try {
                if(!userData[`bandcamp_${chartRange}`].length){
                    let bdata = await StreamingApi.getUserBandcampData({ range: chartRange }, currUser.username);
                    chartRange === "alltime" ? setUserData(d => ({ ...d, bandcamp_alltime: [...bdata] })) : setUserData(d => ({ ...d, bandcamp_month: bdata }));
                }
                setLoadedVal(25);

                if(userData[`distrokid`].length === 0){
                    let ddata = await StreamingApi.getUserDistrokidData({ range: chartRange }, currUser.username);
                    setUserData(d => ({ ...d, distrokid: [...ddata]}));
                };
                setLoadedVal(50);
                // let bdata = await StreamingApi.getUserBandcampData({ range: chartRange }, currUser.username);
                // setBandcampData(bdata);
                if(!userData[`spotify_${chartRange}`].length){
                    let sdata = await StreamingApi.getUserSpotifyData({ range: chartRange }, currUser.username);
                    chartRange === "alltime" ? setUserData(d => ({ ...d, spotify_alltime: [...sdata] })) : setUserData(d => ({ ...d, spotify_month: sdata }));
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
    
    //go through the bandcamp data and format it correctly
    const bandcampPlaysData = [];
    if (userData[`bandcamp_${chartRange}`]){
        for (let d of userData[`bandcamp_${chartRange}`]) {
            bandcampPlaysData.push({ x: d.title, y: d.plays });
        }
    }
    

    //add bandcamp data to the overall graphItems data list
    graphItems.push(bandcampPlaysData);

    //parse the distrokid data and set it up as an array of songs per store
    let allStoreData = {};
    for (let dataset of userData[`distrokid`]) {
        if (allStoreData[dataset.store]) {
            allStoreData[dataset.store] = [...allStoreData[dataset.store], { title: dataset.title, plays: dataset.plays}]
        } else {
            allStoreData[dataset.store] = [{ title: dataset.title, plays: dataset.plays}]
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
    
    const formattedSpotifyData = [];
    if (userData[`spotify_${chartRange}`]) {
        for (let d of userData[`spotify_${chartRange}`]) {
            formattedSpotifyData.push({ x: d.title, y: d.streams })
        }
    }
    

    graphItems.push(formattedSpotifyData);
    
    //set the array of color indicators up for the legend
    const colorItems = [{ title: 'Bandcamp', color: '#12939A' }, { title: 'Spotify', color: '#1DB954' }];

    //set the hint when a bar is hovered over
    const [hintValue, setHintValue] = useState({});
    const _onNearestX = (value, {index}) => {
        if(hintValue !== value){
            setHintValue(value)
        }
    }

    //iterate through graphItems nested array and find the max height
    // const findMaxHeight = (allItems) => {
    //     const heights = allItems.map(service => service.map(song => parseInt(song.y)));

    //     //flatten the array of all heights
    //     let flattenedHeights = [];
    //     for(let el of heights){
    //         if(Array.isArray(el)){
    //             flattenedHeights = [...flattenedHeights, ...el]
    //         } else {
    //             flattenedHeights = [...flattenedHeights, el]
    //         }
    //     }

    //     //find the max height
    //     return Math.max(...flattenedHeights);
    // }

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
    

    //toggle between the two date ranges
    const toggleView = (evt) => {
        if(chartRange === "alltime"){
            setChartRange("month");
        } else {
            setChartRange("alltime")
        }
    }
    
    return(
        <div className="container-fluid" id="main-container">
            <div className="row">
                <div className="col-1"></div>
                <div className="container-fluid col-10" id="chart-container">
                    {isLoading ? <div className="progress mt-5">
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={`${loadedVal}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${loadedVal}%` }}></div>
                    </div> : <>
                    <button className="btn btn-primary round m-1 btn-sm" onClick={toggleView}>{chartRange === "month" ? "Alltime" : "30-day"}</button>
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
                    </FlexibleXYPlot></>}
                </div>
            </div>
                <div className="col-1"></div>
            </div>
        
    )
}

export default ChartData;