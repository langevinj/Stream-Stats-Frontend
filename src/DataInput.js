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
        bandcampAlltime: "",
        bandcampMonth: "",
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
                let data = { page: formData[dataset], endpoint: endpoint, range: range };

                try {
                    //send the data to the import endpoint
                    let res = await StreamingApi.dataImport(data, currUser.username);
                    responses.push(res);
                } catch (errors) {
                    return setFormData(f => ({ ...f, errors }));
                }
                
            }
        }, 1000);

        setIsLoading(false);
        return responses;
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
                        <label htmlFor="bandcampAlltime">Paste the "All time" Bandcamp page here:</label>
                        <textarea name="bandcampAlltime" value={formData.bandcampAlltime} id="bandcampAlltime" className="form-control" onChange={(evt) => handleChange(evt)}></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="bandcampMonth">Paste the "30 days" Bandcamp page here:</label>
                        <textarea name="bandcampMonth" value={formData.bandcampMonth} id="bandcampMonth" onChange={(evt) => handleChange(evt)} className="form-control" onPaste={handleChange}></textarea>
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