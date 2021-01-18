import React, { useState, useContext } from 'react'
import StreamingApi from './Api'
import Alert from './Alert'
import UserContext from './UserContext'

function DataInput(){
    const { currUser } = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(false);
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

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setFormData(f => ({
            ...f,
            [name]: value
        }));
    }
    
    let responses = [];

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setIsLoading(true);

        const starterPromise = Promise.resolve(null);
        //run through each submissing in sequence as to not overload db at once
        await [handleBandcamp(), handleSpotifyAll(), handleSpotifyMonth(), handleSpotifyCredentials(), handleDistrokid()].reduce(
            (p, spec) => p.then(() => spec.then()),
            starterPromise
        )
        
        setIsLoading(false);
        return responses;
    }

    async function handleDistrokid() {
        if (formData.distrokid) {
            //format the pasted distrokid page
            let data = { page: formData.distrokid };

            try {
                let res = await StreamingApi.distrokidImport(data, currUser.username);
                //add response to response list
                responses.push(res);
            } catch (errors) {
                return setFormData(f => ({ ...f, errors }));
            }
        }
    }

    async function handleBandcamp() {
        //if bandcamp data is passed, process it
        if (formData.bandcamp) {
            //format the pasted bandcamp page
            let data = { page: formData.bandcamp };

            try {
                let res = await StreamingApi.bandcampImport(data, currUser.username);
                //add response to response list
                responses.push(res);
            } catch (errors) {
                return setFormData(f => ({ ...f, errors }));
            }
        }
    }

    async function handleSpotifyCredentials() {
        //if spotify credentials are passed, process them
        if (formData.spotifyEmail && formData.spotifyPwd) {
            //send pre-hashed password and email for spotify credentials to be saved
            let data = { email: formData.spotifyEmail, password: formData.spotifyPwd }

            try {
                // let res = await StreamingApi.saveUserSpotifyCredentials(data);
                let res = await StreamingApi.gatherSpotifyData(data, currUser.username)
                //add response to response list
                responses.push(res);
            } catch (errors) {
                return setFormData(f => ({ ...f, errors }));
            }
        }
    }

    async function handleSpotifyMonth() {
        //if spotify page for a month sort is passed, process it
        if (formData.spotifyRawMonth) {
            let data = { page: formData.spotifyRawMonth };

            try {
                let res = await StreamingApi.spotifyMonthImport(data, currUser.username);
                //add response to response list
                responses.push(res);
            } catch (errors) {
                return setFormData(f => ({ ...f, errors }));
            }
        }
    }

    async function handleSpotifyAll() {
        //if spotify page for all time is passed, process it
        if (formData.spotifyRawAll) {
            let data = { page: formData.spotifyRawAll };

            try {
                let res = await StreamingApi.spotifyAlltimeImport(data, currUser.username);
                //add response to response list
                responses.push(res);
            } catch (errors) {
                return setFormData(f => ({ ...f, errors }));
            }
        }
    }

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
                        <label htmlFor="spotifyRawMonth">Paste the "Last 28 days" Spotify page here:
                        <textarea name="spotifyRawMonth" value={formData.spotifyRawMonth} id="spotifyRawMonth" onChange={(evt) => handleChange(evt)}  onPaste={handleChange} className="form-control"></textarea>
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="spotifyRawAll">Paste the "All time" Spotify page here:</label>
                        <textarea name="spotifyRawAll" value={formData.spotifyRawAll} id="spotifyRawAll" onChange={(evt) => handleChange(evt)}  onPaste={handleChange} className="form-control"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="distrokid">Paste the Distrokid page here:</label>
                        <textarea name="distrokid" value={formData.distrokid} id="distrokid" onChange={(evt) => handleChange(evt)} className="form-control" onPaste={handleChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bandcamp">Paste the Bandcamp page here:</label>
                        <textarea name="bandcamp" value={formData.bandcamp} id="bandcamp" onChange={(evt) => handleChange(evt)} className="form-control" onPaste={handleChange}></textarea>
                    </div>
                    {formData.errors ? <Alert type="danger" messages={formData.errors}/> : null}
                    {!isLoading ? <button className="submitButton btn-primary rounded" type="submit">Submit</button> : <button className="loadingButton btn-primary rounded" type="button" disabled><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...</button>}
                </form>
                {/* <button onClick={gatherSpotifyData}>Gather Data!</button> */}
            </div>
        </div>
    )
}

export default DataInput;