import React, {useState, useEffect, useContext} from 'react'
import StreamingApi from './Api'
import UserContext from './UserContext'
import { v4 as uuid} from 'uuid'

function Chart(){
    const { currUser } = useContext(UserContext);
    const [bandcampData, setBandcampData] = useState([])

    //get bandcamp data for user upon loading page
    useEffect(() => {
        async function getBandcampData() {
            try {
                let data = await StreamingApi.getUserBandcampData({ range: "alltime"}, currUser.username);
                console.log(data)
                setBandcampData(data)
            } catch (err) {
                throw err;
            }
        }
        getBandcampData();
    }, []);

    return(
        <>
            {bandcampData ? <>{bandcampData.map(d => <p key={uuid()}>{d.title}</p>)}</> : <p>NOTHING</p>}
        </>
    )
}

export default Chart;