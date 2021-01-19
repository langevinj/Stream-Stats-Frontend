import React, {useState, useEffect, useContext} from 'react'
import StreamingApi from './Api'
import UserContext from './UserContext'
import { v4 as uuid} from 'uuid'
import { XYPlot, XAxis, YAxis, ChartLabel, VerticalGridLines, HorizontalGridLines, VerticalBarSeries, VerticalBarSeriesCanvas, LabelSeries, DiscreteColorLegend } from 'react-vis';

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

    // const dta = React.useMemo(
    //     () => bandcampData.map(d => {label': d.title, data: [d.plays]})
    // )
    const bandcampPlaysData = [];

    for(let d of bandcampData){
       bandcampPlaysData.push({x: d.title, y: d.plays});
    }

    let allStoreData = {};
    for(let dataset of distrokidData){
        if(allStoreData[dataset.store]){
            allStoreData[dataset.store] = [...allStoreData[dataset.store], { title: dataset.title, plays: dataset.plays, profit: dataset.profit }]
        } else {
            allStoreData[dataset.store] = [{ title: dataset.title, plays: dataset.plays, profit: dataset.profit }]
        }
        
    }
    console.log(allStoreData)
    

    // const distrokidPlaysData = [];

    // for(let d of distrokidPlay)

    // const labelData = playsData.map((d, idx) => ({
    //     x: d.x,
    //     y: playsData[idx].y
    // }));
    const [state, setState] = useState({ useCanvas: false })
    const { useCanvas } = state;
    const content = useCanvas ? 'TOGGLE TO SVG' : 'TOGGLE TO CANVAS';
    const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;

    return(
        <>
            <XYPlot xType="ordinal" width={1000} height={300} xDistance={100} className="ml-5">
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />
                <BarSeries className="vertical-bar-series-example" data={bandcampPlaysData} />
                {/* <LabelSeries data={labelData} getLabel={d => d.x} /> */}
            </XYPlot>
        </>
    )
}

export default ChartData;