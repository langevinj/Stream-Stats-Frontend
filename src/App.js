import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import Home from './Home'
import NavBar from './NavBar'
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <NavBar />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
