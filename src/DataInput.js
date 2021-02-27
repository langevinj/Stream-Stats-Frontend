import React, { useState, useContext, useEffect } from 'react'
import StreamingApi from './Api'
import Alert from './Alert'
import UserContext from './UserContext'
import './DataInput.css'

function DataInput(){
    const { currUser } = useContext(UserContext);
    const INITIAL_STATE = {
        distrokid: "", bandcampAlltime: "", bandcampMonth: "", spotifyEmail: "",
        spotifyPwd: "", spotifyRawMonth: "", spotifyRawAll: "", errors: []
    };

    const [loadedVal, setLoadedVal] = useState(0);
    const[toggleData, setToggleData] = useState({"spotifyPaste": false, "videoView": false});
    const [responses, setResponses] = useState([]);
    const [formData, setFormData] = useState({...INITIAL_STATE});
    const errorHolder = [];

/*************************************************** */

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData(f => ({
            ...f,
            [name]: value
        }));
    }

    const toggler = (evt) => {
        evt.preventDefault();
        const { name } = evt.target;
        setToggleData(s => ({ ...s, [name]: !s[name] }));
    }

    //send the API call to import data, if an error is received store it
    const dataImport = async function (data, username) {
        try {
            let res = await StreamingApi.dataImport(data, username);
            return { response: res, passed: true }
        } catch (errs) {
            return { response: errs, passed: false }
        }
    }

    const setErrors = async function(){
        setFormData(f => ({ ...f, errors: [...errorHolder] }));
    }

    useEffect(() => {
        function unloadVal() {
            if (loadedVal === 100) {
                setTimeout(() => {
                    setLoadedVal(loadedVal => 0);
                }, 1000);
            }
        }
        unloadVal()
    }, [loadedVal]);

/********************************************* */

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setResponses([]);
        setLoadedVal(10);

        const dataToSend = ['distrokid', 'bandcampAlltime', 'bandcampMonth', 'spotifyRawMonth', 'spotifyRawAll'];
        setTimeout(async () => {

            for(let dataset of dataToSend){
                let endpoint;
                if(dataset.includes('distrokid')) endpoint = 'distrokid';
                if(dataset.includes('bandcamp')) endpoint = 'bandcamp';
                if(dataset.includes('spotify')) endpoint = 'spotify';

                //set the range of the dataset
                const range = dataset.includes('Month') ? 'month' : 'alltime';

                //format the data in an object
                if(formData[dataset] !== undefined){
                    const data = { page: formData[dataset], endpoint: endpoint, range: range };
                    const res = await dataImport(data, currUser.username);
                    if(res.passed){
                        setResponses(r => [...r, res.response]);
                    } else {
                        errorHolder.push(res.response)
                    }   
                }
                setTimeout(() => {
                    setLoadedVal(l => l + 15);
                }, 1000);
            }

            //set the form errors to all errors received during importing of data
            await setErrors();
        }, 1000);

        // send credentials for spotify scrape off
        if(formData.spotifyEmail || formData.spotifyPwd){
            try {
                const data = { email: formData.spotifyEmail, password: formData.spotifyPwd }
                const res = await StreamingApi.gatherSpotifyData(data, currUser.username);
                setResponses(r => [...r, res]);
                setLoadedVal(l => l + 15);
            } catch (errors) {
                setLoadedVal(l => l + 15);
                errorHolder.push(errors);
            }

            await setErrors();
            setFormData(f => ({ ...INITIAL_STATE, errors: f.errors }));
        } else {
            setTimeout(() => {
                setLoadedVal(l => l + 15);
                setFormData(f => ({ ...INITIAL_STATE, errors: f.errors }));
            }, 1000);        
        }       
    }
/*************************************** */

    return (
        <div className="container-narrow">
        <div className="container">
            <div>
                <h3 id="prompt">Want to add some stats?</h3>
                {/* {toggleData.videoView ? 
                <>
                            <button className="btn-primary rounded mb-4" onClick={toggler} name="videoView" data-testid="toggleVideoOff">Hide Video</button> */}
                <div className="media mb-3">
                    <div className="embed-responsive embed-responsive-16by9 text-center align-self-center" id="howtovid">
                            <iframe className="embed-responsive-item align-self-center" src="https://www.youtube.com/embed/5bGsiBzUQ5U" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                    </div>
                    {/* </div></> : < button className="btn-primary rounded mb-4" onClick={toggler} name="videoView" data-testid="toggleVideoOn">View how-to video</button>} */}
                    </div>
            <div className="form-container">
                <form className="form-container" onSubmit={(evt) => handleSubmit(evt)}>
        
                        {!toggleData.spotifyPaste ? 
                        <div className="form-group">
                        <div id="spotifyForArtists">
                            <h5>Add your login info for Spotify for Artists:</h5> 
                            {/* <p>This service currently being updated. Please check back for updates.</p> */}
                            <label htmlFor="spotifyEmail">Email:</label>
                            <input name="spotifyEmail" value={formData.spotifyEmail} id="spotifyEmail" onChange={handleChange} type="text" className="form-control"></input>
                            <label htmlFor="spotifyPwd">Password:</label>
                            <input name="spotifyPwd" value={formData.spotifyPwd} id="spotifyPwd" type="password" onChange={handleChange} className="form-control"></input>
                        </div> 
                        </div>: <>
                        <div className="form-group">
                            <label htmlFor="spotifyRawMonth">Paste the "Last 28 days" Spotify page here:
                            <textarea name="spotifyRawMonth" value={formData.spotifyRawMonth} id="spotifyRawMonth" onChange={(evt) => handleChange(evt)}  onPaste={handleChange} className="form-control"></textarea>
                            </label>
                        </div>
                        <div className="form-group">
                            <label htmlFor="spotifyRawAll">Paste the "All time" Spotify page here:</label>
                            <textarea name="spotifyRawAll" value={formData.spotifyRawAll} id="spotifyRawAll" onChange={(evt) => handleChange(evt)}  onPaste={handleChange} className="form-control"></textarea>
                        </div> </>}

                    <button onClick={toggler} className="btn-primary rounded mb-4" name="spotifyPaste">{!toggleData.spotifyPaste ? "I prefer to paste my spotify data" : "I'll login with my username/password"}</button>
                    <div className="form-group">
                        <label htmlFor="distrokid">Paste the Distrokid page here:</label>
                        <textarea name="distrokid" value={formData.distrokid} id="distrokid" onChange={(evt) => handleChange(evt)} className="form-control" onPaste={handleChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bandcampAlltime">Paste the "All time" Bandcamp page here:</label>
                        <textarea name="bandcampAlltime" value={formData.bandcampAlltime} id="bandcampAlltime" className="form-control" onChange={(evt) => handleChange(evt)}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bandcampMonth">Paste the "30 days" Bandcamp page here:</label>
                        <textarea name="bandcampMonth" value={formData.bandcampMonth} id="bandcampMonth" onChange={(evt) => handleChange(evt)} className="form-control" onPaste={handleChange}></textarea>
                    </div>
                    {formData.errors ? <Alert type="danger" messages={formData.errors}/> : null}

                    {loadedVal === 0 || loadedVal === 100 ? <button className="submitButton btn-primary rounded mb-3" type="submit">Submit</button> : <><small>Loading your data, this may take a minute...</small> <div className="progress mt-2 mb-3">
                        
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={`${loadedVal}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${loadedVal}%` }}></div></div></>}
                    {!responses.every((el) => el === undefined) ? <Alert type="success" messages={['importSuccesses', ...responses]} /> : null}
                </form>
            </div>
        </div>
        </div>
    )
}

export default DataInput;