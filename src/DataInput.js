import React, { useState } from 'react'
import StreamingApi from './Api'
import Alert from './Alert'

function DataInput(){
    //set intiail state of the form
    const [formData, setFormData] = useState({
        distrokid: "",
        bandcamp: "",
        errors: []
    });

    async function handleSubmit(evt) {
        evt.preventDefault();

        //list of responses from adding data to the backend
        let responses = []
        
        if(formData.distrokid){
            let data = { page: formData.distrokid }

            try {
                let res = await StreamingApi.distrokidImport(data);
                //add response to response list
                responses.push(res);
            } catch (errors) {
                return setFormData(f => ({ ...f, errors }));
            }
        }

        if(formData.bandcamp){
            let data = { page: formData.bandcamp }

            try {
                let res = await StreamingApi.bandcampImport(data);
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
    // Copy the entire page(MAC: Cmd + A / WIN: Ctrl + A) then paste here:
    return (
        <div className="container">
            <div className="form-container">
                <form className="form-container" onSubmit={handleSubmit}>
                    <h4>Want to import some bandcamp data?</h4>
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