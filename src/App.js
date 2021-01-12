import React, { useEffect, useState } from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { decode } from "jsonwebtoken"
// import useLocalStorage from './hooks'

import Home from './Home'
import NavBar from './NavBar'
// import Routes from './Routes'
import StreamingApi from './Api'
// import UserContext from './UserContext'
import './App.css';

export const TOKEN_KEY = "stream-stat-token"

function App() {
  const[userLoaded, setUserLoaded] = useState(false);
  const[currUser, setCurrUser] = useState(null);

  const [token, setToken] = useLocalStorage(TOKEN_KEY);

  //when the app renders, or when the token is set, update the users information and set the token for API calls
  useEffect(() => {
    async function getCurrentUser() {
      try {
        let { username } = decode(token);
        StreamingApi.token = token;
        let currentUser = await StreamingApi.getUserInfo(username)
        setCurrUser(currentUser);
      } catch (err) {
        setCurrUser(null);
      }
      setUserLoaded(true);
    }
    setUserLoaded(false);
    getCurrentUser();
  }, [token]);

  //function to log a user out and reset localStorage
  const logOut = () => {
    setCurrUser(null);
    setToken(null);
  }

  //if the users data is not loaded, present a loading screen
  if (!userLoaded) {
    return <div><h2>Loading...</h2></div>
  }

  return (
      <BrowserRouter>
      {/* <UserContext.Provider value={{ currUser, setCurrUser }}> */}
        <div className="App">
          <NavBar logOut={logOut} />
          <Routes setToken={setToken} />
        </div>
      {/* </UserContext.Provider> */}
      </BrowserRouter>
  );
}

export default App;
