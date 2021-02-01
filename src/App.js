import React, { useEffect, useState } from "react"
import { BrowserRouter } from "react-router-dom"
import { decode } from "jsonwebtoken"
import { useLocalStorage } from './hooks.js'

import NavBar from './NavBar'
import Routes from './Routes'
import StreamingApi from './Api'
import UserContext from './UserContext'
import './App.css';

export const TOKEN_KEY = "stream-stat-token"

function App() {
  const[userLoaded, setUserLoaded] = useState(false);
  const[currUser, setCurrUser] = useState(null);

  const [token, setToken] = useLocalStorage(TOKEN_KEY);
  const [localData, setLocalData] = useLocalStorage("data");

  /**When the app renders, or when the token is set, update the user's information and se the token for API calls */
  useEffect(() => {
    async function getCurrentUser() {
      try {
        const { username } = decode(token);
        StreamingApi.token = token;
        const currentUser = await StreamingApi.getUserInfo(username)
        setCurrUser(currentUser);
      } catch (err) {
        setCurrUser(null);
      }
      setUserLoaded(true);
    }
    setUserLoaded(false);
    getCurrentUser();
  }, [token]);

  //Log out user: clear local storage.
  const logOut = () => {
    setCurrUser(null);
    setToken(null);
    setLocalData({ distrokid: [], bandcamp_alltime: [], bandcamp_month: [], spotify_alltime: [], spotify_month: [] });
  }

  //Loading screen if user is not loaded.
  if (!userLoaded) {
    return <div><h2>Loading...</h2></div>
  }

  return (
      <BrowserRouter>
        <UserContext.Provider value={{ currUser, setCurrUser }}>
          <div className="App" id="App">
            <div className="container">
              <NavBar logOut={logOut} />
              <Routes setToken={setToken}/>
            </div>
          </div>
        </UserContext.Provider>
      </BrowserRouter>
  );
}

export default App;
