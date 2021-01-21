import React, {useState, useEffect, useContext} from 'react'
import StreamingApi from './Api'
import UserContext from './UserContext'
import { v4 as uuid} from 'uuid'
import { XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, VerticalBarSeries, VerticalBarSeriesCanvas, DiscreteColorLegend, Hint } from 'react-vis';
import { colorsMap } from './colors.js'
import './style.css';

function ChartData(){
    const { currUser } = useContext(UserContext);
    const [bandcampData, setBandcampData] = useState([]);
    const [distrokidData, setDistrokidData] = useState([]);
    const [spotifyData, setSpotifyData] = useState([]);
    const [chartRange, setChartRange] = useState("alltime");
    const graphItems = []

    //get streaming data for user upon loading page
    useEffect(() => {
        async function getUserData() {
            try {
                let bdata = await StreamingApi.getUserBandcampData({ range: chartRange }, currUser.username);
                setBandcampData(bdata);
                let ddata = await StreamingApi.getUserDistrokidData({ range: chartRange }, currUser.username);
                setDistrokidData(ddata);
                let sdata = await StreamingApi.getUserSpotifyData({ range: chartRange }, currUser.username);
                setSpotifyData(sdata);
            } catch (err) {
                throw err;
            }
        }
        getUserData();
    }, [currUser.username]);
    console.log(spotifyData)
    //create an array of all songs released by the artist/musician
    const allSongs = []
    function listAllSongs(bandcampData, spotifyData, distrokidData){
        if(bandcampData){
            for(let d of bandcampData){
                if(!allSongs.includes(d.title)) allSongs.push(d.title);
            }
        }

        if(spotifyData){
            for(let d of spotifyData) {
                if(!allSongs.includes(d.title)) allSongs.push(d.title);
            }
        }

        if(distrokidData){
            for(let d of distrokidData){
                if(!allSongs.includes(d.title)) allSongs.push(d.title)
            }
        }

    }
    listAllSongs(bandcampData, spotifyData, distrokidData)
    console.log(allSongs)
    //go through the bandcamp data and format it correctly
    const bandcampPlaysData = [];

    for (let d of bandcampData) {
        bandcampPlaysData.push({ x: d.title, y: d.plays });
    }

    //add bandcamp data to the overall graphItems data list
    graphItems.push(bandcampPlaysData);

    //create an array of all song titles
    // const allSongs = bandcampPlaysData.map(b => b.x)

    //make an array of all the songs listed on spotify
    const spotifySongs = []
    for(let dataset of spotifyData) {
        spotifySongs.push(dataset.title)
    }

    //parse the distrokid data and set it up as an array of songs per store
    let allStoreData = {};
    for (let dataset of distrokidData) {
        if (allStoreData[dataset.store]) {
            allStoreData[dataset.store] = [...allStoreData[dataset.store], { title: dataset.title, plays: dataset.plays}]
        } else {
            allStoreData[dataset.store] = [{ title: dataset.title, plays: dataset.plays}]
        }
    }

    

    const formattedSpotifyData = [];
    //format the spotify data for the table
    for (let song of allSongs) {
        //if the song is not on spotify, pass it in without data
        if(!spotifySongs.includes(song)){
            formattedSpotifyData.push({ x: song, y: 0});
        } else {
            let res = spotifyData.filter(dataset => dataset.title === song)[0]
            formattedSpotifyData.push({x: res.title, y: res.streams})
        }
    }

    graphItems.push(formattedSpotifyData);

    // const labelData = bandcampPlaysData.map((d, idx) => ({
    //     x: d.x,
    //     y: bandcampPlaysData + 100
    // }));
    

    const [state] = useState({ useCanvas: false })
    const { useCanvas } = state;
    // const content = useCanvas ? 'TOGGLE TO SVG' : 'TOGGLE TO CANVAS';
    const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;

    //format an option where keys are the name of the store and values are an array of objects formatted for the chart
    let masterObj = {}
    for(let [name, songs] of Object.entries(allStoreData)){
        let temp = [];
        for(let song of allSongs){
            let res = songs.filter(s => s.title === song)[0]
            if(res){
                temp.push({x: res.title, y: parseInt(res.plays)});
            } else {
                temp.push({x: song, y: 0})
            }
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

    // const [heightMax, setMaxHeight] = useState(0);

    //iterate through graphItems nested array and find the max height
    const findMaxHeight = (allItems) => {
        const heights = allItems.map(service => service.map(song => parseInt(song.y)));

        //flatten the array of all heights
        let flattenedHeights = [];
        for(let el of heights){
            if(Array.isArray(el)){
                flattenedHeights = [...flattenedHeights, ...el]
            } else {
                flattenedHeights = [...flattenedHeights, el]
            }
        }

        //find the max height
        return Math.max(...flattenedHeights);
    }

    //iterate through distrokid stores, applying correct color to each
    for (let [store, songs] of Object.entries(masterObj)) {
        if (store !== "Spotify") {
            let foundColor = colorsMap.get(store)
            colorItems.push({ title: store, color: foundColor });
            graphItems.push(songs);
        }    
    }

    //call the function to set max height now that all graphdata is stored in one plac
    // setMaxHeight(findMaxHeight(graphItems));

    

    

    return(
        <div>
            <XYPlot xType="ordinal" width={3000} height={findMaxHeight(graphItems)} xDistance={1000} className="ml-5">
                <DiscreteColorLegend
                    style={{ position: 'absolute', left: '150px', top: '10px' }}
                    orientation="horizontal"
                    items={colorItems}
                />
                <Hint value={hintValue}>
                    {hintValue ? <div style={{ background: 'black'}}>
                        <p>{hintValue.y}</p>
                    </div> : <></>}
                    
                </Hint>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                {graphItems.map((service, idx) => <BarSeries data={service} key={uuid()} className="vertical-bar-series" barWidth={1} onValueMouseOver={_onNearestX} fill={colorItems[idx].color}/>)}
            </XYPlot>
        </div>
    )
}

export default ChartData;