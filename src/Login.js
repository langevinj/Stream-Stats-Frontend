import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Alert from './Alert'
import StreamingApi from './Api'
import './Forms.css'

function Login({ setToken }) {
    const history = useHistory();

    //set initial viewstate to the login form
    const [formView, setFormView] = useState("login")
    //set the initial entered formData to blank
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        bandName: "",
        errors: []
    });

    //flip between login and signup views
    function loginView() {
        setFormView("login")
    }

    function signupView() {
        setFormView("signup")
    }

    async function handleSubmit(evt) {
        evt.preventDefault();
        let data;
        let endpoint;

        if (formView === "signup") {
            //if the field is not required, have undefined as backup
            data = {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                bandName: formData.bandName || undefined
            };
            endpoint = "register";
        } else {
            data = {
                username: formData.username,
                password: formData.password
            };
            endpoint = "login"
        }

        let token;

        try {
            if (endpoint === 'login') {
                token = await StreamingApi.login(data);
                console.log(token)
                StreamingApi.token = token;
            } else {
                token = await StreamingApi.signup(data);
                StreamingApi.token = token;
            }
        } catch (errors) {
            return setFormData(f => ({ ...f, errors }));
        }

        //set the token in local storage
        setToken(token);
        //return to homepage
        history.push("/");
    }

    function handleChange(evt) {
        const { name, value } = evt.target;
        setFormData(f => ({ ...f, [name]: value }));
    }

    let loginActive = formView === "login";

    const signupForm = (<form className="signup-form form-container" onSubmit={handleSubmit}>
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
            <label htmlFor="bandName">Band Name:</label>
            <input name="bandName" value={formData.bandName} id="bandName" onChange={handleChange} type="text" className="form-control"></input>
        </div>
        {formData.errors ? <Alert type="danger" messages={formData.errors} /> : null}
        <button className="submitButton btn-primary rounded">Submit</button>
    </form>)

    const loginForm = (<form className="login-form form-container" onSubmit={handleSubmit}>
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
        <button className="submitButton btn-primary rounded">Submit</button>
    </form>)


    return (
        <div className="container">
            <div className="toggle-container mb-3">
                <button id="login-toggle" value="login" onClick={loginView} className="btn-primary mr-1 rounded">Login</button>
                <button id="signup-toggle" value="signup" onClick={signupView} className="btn-primary rounded ml-1">Sign-Up</button>
            </div>
            <div className="form-container">
                {loginActive ? loginForm : signupForm}
            </div>
        </div>
    )
}

export default Login;