import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Alert from './Alert'
import StreamingApi from './Api'
import './Login.css'

function Login({ setToken }) {
    const history = useHistory();
    const [formView, setFormView] = useState("login");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        band_name: "",
        errors: []
    });

    //Toggle between login and signup views.
    function toggleView(){
        if(formView === "login"){
            setFormView("signup");
        } else {
            setFormView("login");
        }
    }

    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(f => ({ ...f, [name]: value }));
    }

    //Handle submission and perform action of login or register.
    async function handleSubmit(evt) {
        evt.preventDefault();
        let data;
        let endpoint;
        let token;

        if (formView === "signup") {
            //If the field is not required, have undefined as default.
            data = {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                band_name: formData.band_name || undefined
            };
            endpoint = "register";
        } else {
            data = {
                username: formData.username,
                password: formData.password
            };
            endpoint = "login"
        }

        try {
            if (endpoint === 'login') {
                token = await StreamingApi.login(data);
                StreamingApi.token = token;
            } else {
                token = await StreamingApi.signup(data);
                StreamingApi.token = token;
            }
        } catch (errors) {
            return setFormData(f => ({ ...f, errors }));
        }

        //Set the token in local storage.
        setToken(token);

        //Bring the user to the chart page.
        history.push("/chartdata");
    }

    const signupForm = (<form className="signup-form form-container" onSubmit={handleSubmit} data-testid="signupView">
        <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input name="username" value={formData.username} id="username" onChange={handleChange} type="text" className="form-control"></input>
        </div>
        <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input name="password" value={formData.password} id="password" onChange={handleChange} type="password" className="form-control"></input>
        </div>
        <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input name="email" value={formData.email} id="email" onChange={handleChange} type="text" className="form-control"></input>
        </div>
        <div className="form-group">
            <label htmlFor="band_name">Band Name: <small className="text-white">(Optional)</small></label>
            <input name="band_name" value={formData.band_name} id="band_name" onChange={handleChange} type="text" className="form-control"></input>
        </div>
        {formData.errors ? <Alert type="danger" messages={formData.errors} /> : null}
        <button className="submitButton btn-primary rounded mb-3">Submit</button>
    </form>)

    const loginForm = (<form className="login-form form-container" onSubmit={handleSubmit} data-testid="loginView">
        <h4>Welcome back!</h4>
        <div className="form-group edit">
            <label htmlFor="username">Username: </label>
            <input name="username" value={formData.username} id="username" onChange={handleChange} type="text" className="form-control"></input>
        </div>
        <div className="form-group">
            <label htmlFor="password">Password: </label>
            <input name="password" value={formData.password} id="password" onChange={handleChange} type="password" className="form-control"></input>
        </div>
        {formData.errors ? <Alert type="danger" messages={formData.errors} /> : null}
        <button className="submitButton btn-primary rounded mb-3">Submit</button>
    </form>)

    /****************************************/

    return (
        <div className="container login-container">
            <div className="toggle-container mb-3 mt-3">
                {formView === "login" ? <button id="signup-toggle" value="signup" onClick={toggleView} className="btn-primary rounded ml-1">Sign-Up</button> : <button id="login-toggle" value="login" onClick={toggleView} className="btn-primary mr-1 rounded">Login</button>}
            </div>
            <div className="form-container">
                {formView === "login" ? loginForm : signupForm}
            </div>
        </div>
    )
}

export default Login;