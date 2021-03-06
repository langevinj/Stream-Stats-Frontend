import React, { useContext } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import DataInput from './DataInput'
import Chart from './Chart'
import UserContext from './UserContext'

function Routes({ setToken }) {
    const { currUser } = useContext(UserContext);

    const loggedOutRoutes = (
        <Switch>
            <Route exact path="/login"><Login setToken={setToken} /></Route>
            <Route exact path="/"><Home /></Route>
            <Redirect to="/"></Redirect>
        </Switch>
    )

    const loggedInRoutes = (
        <Switch>
            <Route exact path="/chartdata"><Chart /></Route>
            <Route exact path="/input"><DataInput /></Route>
            <Route exact path="/"><Home /></Route>
            <Redirect to="/"></Redirect>
        </Switch>
    )

    return (
        <>{!currUser ? loggedOutRoutes : loggedInRoutes}</>
    )
}



export default Routes;