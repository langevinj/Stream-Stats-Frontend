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
            let data = formatBandcamp(formData.bandcamp);

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
            let data = { email: formData.spotifyEmail, password: formData.spotifyPwd }

            try {
                let res = await StreamingApi.userSpotifyCredentials(data);
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
        console.log(typeof(formData.distrokid))
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
                        <label htmlFor="distrokid">Paste the Distrokid page here:</label>
                        <textarea name="distrokid" value={formData.distrokid} id="distrokid" onChange={handleChange} className="form-control"></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bandcamp">Paste the Bandcamp page here:</label>
                        <textarea name="bandcamp" value={formData.bandcamp} id="bandcamp" onChange={handleChange} className="form-control"></textarea>
                    </div>
                    {formData.errors ? <Alert type="danger" messages={formData.errors}/> : null}
                    <button className="submitButton btn-primary rounded">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default DataInput;