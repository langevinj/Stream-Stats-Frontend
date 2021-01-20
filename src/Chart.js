import React, {useState, useEffect, useContext} from 'react'
import StreamingApi from './Api'
import UserContext from './UserContext'
import { v4 as uuid} from 'uuid'
import { XYPlot, XAxis, YAxis, ChartLabel, VerticalGridLines, HorizontalGridLines, VerticalBarSeries, VerticalBarSeriesCanvas, LabelSeries, DiscreteColorLegend } from 'react-vis';
import { colorsMap } from './colors.js'

function ChartData(){
    const { currUser } = useContext(UserContext);
    const [bandcampData, setBandcampData] = useState([])
    const [distrokidData, setDistrokidData] = useState([])

    //get bandcamp data for user upon loading page
    useEffect(() => {
        async function getBandcampData() {
            try {
                let bdata = await StreamingApi.getUserBandcampData({ range: "alltime"}, currUser.username);
                setBandcampData(bdata)
                let ddata = await StreamingApi.getUserDistrokidData({ range: "alltime"}, currUser.username);
                setDistrokidData(ddata)
            } catch (err) {
                throw err;
            }
        }
        getBandcampData();
    }, []);

    //parse the distrokid data and set it up as an array of songs per store
    let allStoreData = {};
    for (let dataset of distrokidData) {
        if (allStoreData[dataset.store]) {
            allStoreData[dataset.store] = [...allStoreData[dataset.store], { title: dataset.title, plays: dataset.plays}]
        } else {
            allStoreData[dataset.store] = [{ title: dataset.title, plays: dataset.plays}]
        }
    }

    const bandcampPlaysData = [];

    for(let d of bandcampData){
       bandcampPlaysData.push({x: d.title, y: d.plays});
    }

    //create an array of all song titles
    const allSongs = bandcampPlaysData.map(b => b.x)

    const labelData = bandcampPlaysData.map((d, idx) => ({
        x: d.x,
        y: Math.max(bandcampPlaysData)
    }));
    

    const [state, setState] = useState({ useCanvas: false })
    const { useCanvas } = state;
    const content = useCanvas ? 'TOGGLE TO SVG' : 'TOGGLE TO CANVAS';
    const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;

    //format an option where keys are the name of the store and values are an array of objects formatted for the chart
    let masterObj = {}
    for(let [name, songs] of Object.entries(allStoreData)){
        let temp = [];
        for(let song of allSongs){
            let res = songs.filter(s => s.title === song)[0]
            if(res){
                temp.push({x: res.title, y: res.plays});
            } else {
                temp.push({x: song, y: 0})
            }
        }
        masterObj[name] = temp;
    }
    const colorItems = [{ title: 'Bandcamp', color: '#12939A'}];
    const graphItems = []

    // let graphItems = Object.values(masterObj).map(store => {
    //     let color = colorsMap[store.x];
    //     colorItems.push({ title: store.x, color: color })
    //     return <BarSeries data={store} className="vertical-bar-series" barWidth={1} fill={color} />
    // });
    //iterate through distrokid stores, applying correct color to each
    for(let [store, songs] of Object.entries(masterObj)){
        let foundColor = colorsMap.get(store)
        let tempEl = (<BarSeries data={songs} className="vertical-bar-series" barWidth={1} fill={foundColor} />)
        graphItems.push(tempEl);
        colorItems.push({ title: store, color: foundColor});
    }

    console.log(colorItems)
    return(
        <>
            <XYPlot xType="ordinal" width={3000} height={700} xDistance={1000} className="ml-5">
                <DiscreteColorLegend
                    style={{ position: 'absolute', left: '50px', top: '10px' }}
                    orientation="horizontal"
                    items={colorItems}
                />
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <BarSeries className="vertical-bar-series-example" data={bandcampPlaysData} />
                {graphItems.map(el => el)}
                {/* <BarSeries className="vertical-bar-series" data={data2} /> */}
                {/* <LabelSeries data={labelData} getLabel={d => d.x} /> */}
            </XYPlot>
        </>
    )
}

export default ChartData;