import React, {useState, useEffect, useContext} from 'react'
import StreamingApi from './Api'
import UserContext from './UserContext'

function Chart(){
    const { currUser } = useContext(UserContext);
    const [bandcampData, setBandcampData] = useState(null)

    //get bandcamp data for user upon loading page
    useEffect(() => {
        async function getBandcampData() {
            try {
                let data = await StreamingApi.getUserBandcampData({ range: "alltime"}, currUser.username);
                console.log(data);
                setBandcampData(data);
            } catch (err) {
                throw err;
            }
        }
        getBandcampData();
    }, []);

    return(
        <>
            <p>{bandcampData}</p>
        </>
    )
}

export default Chart;