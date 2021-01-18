import React, { useState, useContext } from 'react'
import StreamingApi from './Api'
import Alert from './Alert'
import { formatBandcamp, formatDistrokid } from './parser'
import UserContext from './UserContext'

function DataInput(){

    const { currUser } = useContext(UserContext);
    //set intiail state of the form
    const [formData, setFormData] = useState({
        distrokid: "",
        bandcamp: "",
        spotifyEmail: "",
        spotifyPwd: "",
        spotifyRawMonth: "",
        spotifyRawAll: "",
        errors: []
    });

    async function handleSubmit(evt) {
        evt.preventDefault();

        //list of responses from adding data to the backend
        let responses = []
        
        //if distrokid information is passed, process it
        if(formData.distrokid){
            //format the pasted distrokid page
            let data = {page: formData.distrokid, username: currUser.username};

            try {
                let res = await StreamingApi.distrokidImport(data);
                //add response to response list
                responses.push(res);
            } catch (errors) {
                return setFormData(f => ({ ...f, errors }));
            }
        }

        //if bandcamp data is passed, process it
        if(formData.bandcamp){
            //format the pasted bandcamp page
            let data = {page: formData.bandcamp, username: currUser.username};

            try {
                let res = await StreamingApi.bandcampImport(data);
                //add response to response list
                responses.push(res);
            } catch (errors) {
                return setFormData(f => ({ ...f, errors }));
            }
        }

        //if spotify credentials are passed, process them
        if(formData.spotifyEmail && formData.spotifyPwd){
            //send pre-hashed password and email for spotify credentials to be saved
            let data = { email: formData.spotifyEmail, password: formData.spotifyPwd, username: currUser.username }

            try {
                // let res = await StreamingApi.saveUserSpotifyCredentials(data);
                let res = await StreamingApi.gatherSpotifyData(data)
                //add response to response list
                responses.push(res);
            } catch (errors) {
                return setFormData(f => ({ ...f, errors }));
            }
        }

        //if spotify page for a month sort is passed, process it
        if(formData.spotifyRawMonth){
            let data = { page: formData.spotifyRawMonth, username: currUser.username };

            try {
                let res = await StreamingApi.spotifyMonthImport(data);
                //add response to response list
                responses.push(res);
            } catch (errors) {
                return setFormData(f => ({ ...f, errors }));
            }
        }

        //if spotify page for all time is passed, process it
        if (formData.spotifyRawAll) {
            let data = { page: formData.spotifyRawAll, username: currUser.username };

            try {
                let res = await StreamingApi.spotifyAlltimeImport(data);
                //add response to response list
                responses.push(res);
            } catch (errors) {
                return setFormData(f => ({ ...f, errors }));
            }
        }

        //return to homepage, might want to change this depending on where you want to send user
        // history.push("/");
    }

    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(f => ({...f, [name]: value }));
    }

    //quick trial function for gathering spotify data via scrape
    // async function gatherSpotifyData(evt){
    //     evt.preventDefault();
    //     let res = await StreamingApi.gatherSpotifyData({ username: currUser.username });
    //     console.log(res)
    // }
    
    // Copy the entire page(MAC: Cmd + A / WIN: Ctrl + A) then paste here:
    return (
        <div className="container">
            <div className="form-container">
                <form className="form-container" onSubmit={handleSubmit}>
                    <h4>Want to import some stats?</h4>
                    <div className="form-group">
                        <h3>Enter your Spotify-for-Artists credentials here:</h3>
                        <label htmlFor="spotifyEmail">Email:</label>
                        <input name="spotifyEmail" value={formData.spotifyEmail} id="spotifyEmail" onChange={handleChange} type="text" className="form-control"></input>
                        <label htmlFor="spotifyPwd">Password:</label>
                        <input name="spotifyPwd" value={formData.spotifyPwd} id="spotifyPwd" type="password" onChange={handleChange} className="form-control"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="spotifyRawMonth">Paste the "Last 28 days" Spotify page here:</label>
                        <textarea name="spotifyRawMonth" value={formData.spotifyRawMonth} id="spotifyRawMonth" onChange={handleChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="spotifyRawAll">Paste the "All time" Spotify page here:</label>
                        <textarea name="spotifyRawAll" value={formData.spotifyRawAll} id="spotifyRawAll" onChange={handleChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="distrokid">Paste the Distrokid page here:</label>
                        <textarea name="distrokid" value={formData.distrokid} id="distrokid" onChange={handleChange} className="form-control"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bandcamp">Paste the Bandcamp page here:</label>
                        <textarea name="bandcamp" value={formData.bandcamp} id="bandcamp" onChange={handleChange} className="form-control"></textarea>
                    </div>
                    {/* {formData.errors ? <Alert type="danger" messages={formData.errors}/> : null} */}
                    <button className="submitButton btn-primary rounded">Submit</button>
                </form>
                {/* <button onClick={gatherSpotifyData}>Gather Data!</button> */}
            </div>
        </div>
    )
}

export default DataInput;