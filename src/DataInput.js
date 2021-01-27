import React, { useState, useContext, useEffect } from 'react'
import StreamingApi from './Api'
import Alert from './Alert'
import UserContext from './UserContext'
import './DataInput.css'

function DataInput(){
    const { currUser } = useContext(UserContext)
    const [loadedVal, setLoadedVal] = useState(0);
    const [spotifyPaste, setSpotifyPaste] = useState(false);
    const errorHolder = [];
    const [responses, setResponses] = useState([])
    const INITIAL_STATE = {
        distrokid: "",
        bandcampAlltime: "",
        bandcampMonth: "",
        spotifyEmail: "",
        spotifyPwd: "",
        spotifyRawMonth: "",
        spotifyRawAll: "",
        errors: [] 
    }
    //set intiail state of the form
    const [formData, setFormData] = useState({...INITIAL_STATE});

    const handleChange = (evt) => {
        // evt.preventDefault();
        const { name, value } = evt.target;
        setFormData(f => ({
            ...f,
            [name]: value
        }));
    }

/********************************************* */

    //send the API call to import data, if an error is received store it
    async function dataImport(data, username){
        try {
            //send the data to the import endpoint
            let res = await StreamingApi.dataImport(data, username);
            setResponses(r => [...r, res]);
        } catch (errs) {
            errorHolder.push(errs)
        }
    }

    async function setErrors(){
        setFormData(f => ({ ...f, errors: [...errorHolder] }));
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setResponses(r => []);
        setLoadedVal(10);

        const dataToSend = ['distrokid', 'bandcampAlltime', 'bandcampMonth', 'spotifyRawMonth', 'spotifyRawAll'];
        setTimeout(async () => {

            for(let dataset of dataToSend){
                //set endpoint for the request
                let endpoint;
                if(dataset.includes('distrokid')) endpoint = 'distrokid';
                if(dataset.includes('bandcamp')) endpoint = 'bandcamp';
                if(dataset.includes('spotify')) endpoint = 'spotify';

                //set the range of the dataset
                let range = dataset.includes('Month') ? 'month' : 'alltime';

                //format the data in an object
                if(formData[dataset] !== undefined){
                    let data = { page: formData[dataset], endpoint: endpoint, range: range };
                    await dataImport(data, currUser.username);
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
                        let data = { email: formData.spotifyEmail, password: formData.spotifyPwd }
                        let res = await StreamingApi.gatherSpotifyData(data, currUser.username);
                        console.log(`SPOTIFY RESPONSE IS: ${res}`)
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
                    }, 1000)
                   
                }

        
                
    }

    useEffect(() => {
        function unloadVal(){
            if(loadedVal === 100){
                setTimeout(() => {
                    setLoadedVal(loadedVal => 0);
                }, 1000);
            }
        }
        unloadVal()
    }, [loadedVal]);

    //currently not in use **** function to save a user's spotify credentials
    // async function handleSpotifyCredentials() {
    //     //if spotify credentials are passed, process them
    //     if (formData.spotifyEmail && formData.spotifyPwd) {
    //         //send pre-hashed password and email for spotify credentials to be saved
    //         let data = { email: formData.spotifyEmail, password: formData.spotifyPwd }

    //         try {
    //             // let res = await StreamingApi.saveUserSpotifyCredentials(data);
    //             let res = await StreamingApi.gatherSpotifyData(data, currUser.username)
    //             //add response to response list
    //             responses.push(res);
    //         } catch (errors) {
    //             return setFormData(f => ({ ...f, errors }));
    //         }
    //     }
    // }

    //switch between the methods of importing spotify data
    const toggleSpotifyView = (evt) => {
        evt.preventDefault();
        setSpotifyPaste(s => !s);
    }

    // Copy the entire page(MAC: Cmd + A / WIN: Ctrl + A) then paste here:
    return (
        <div className="container">
            <div className="form-container">
                <form className="form-container" onSubmit={(evt) => handleSubmit(evt)}>
                    <h3 id="prompt">Want to add some stats?</h3>
                        {!spotifyPaste ? 
                        <div className="form-group">
                        <div id="spotifyForArtists">
                            <h5>Add your login info for Spotify for Artists:</h5> 
                            
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

                    <button onClick={toggleSpotifyView} className="btn-primary rounded mb-4">{!spotifyPaste ? "I prefer to paste my spotify data" : "I'll login with my username/password"}</button>
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

                    {/* {responses.length ? <Alert type="success" messages={[`Successfully imported data for: ${responses.forEach((el) => { el.length > 1 ? `-${el}` : ""})`]} */}
                    {loadedVal === 0 || loadedVal === 100 ? <button className="submitButton btn-primary rounded mb-3" type="submit">Submit</button> : <><small>Loading your data, this may take a minute...</small> <div className="progress mt-2 mb-3">
                        
                        <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow={`${loadedVal}`} aria-valuemin="0" aria-valuemax="100" style={{ width: `${loadedVal}%` }}></div></div></>}
                    {!responses.every((el) => el === undefined) ? <Alert type="success" messages={['importSuccesses', ...responses]} /> : null}

                    
                </form>
            </div>
        </div>
    )
}

export default DataInput;