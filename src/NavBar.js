import React, { useContext } from 'react'
import { NavLink, Link } from 'react-router-dom'
import UserContext from './UserContext'

import './NavBar.css'

//the navbar for the app
function NavBar({ logOut }) {
    //grab the user from the Context provider
    const { currUser } = useContext(UserContext);
 
    //navbar view if a user is logged in
    const loggedInView = (
        <nav className="navbar navbar-expand-sm navbar-light">
            <NavLink to="/" className="navbar-brand">Stream Stats</NavLink>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target='#navbarNavDropdown' aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <div className="navbar-nav ml-auto">
                    <Link to="/chartdata" className="nav-link nav-item" data-toggle="collapse" data-target='#navbarNavDropdown'>Chart</Link>
                    {/* <Link to="/table" className="nav-link nav-item">Table</Link> */}
                    <Link to="/input" className="nav-link nav-item" data-toggle="collapse" data-target='#navbarNavDropdown'>Import Data</Link>
                    <Link to="/" className="nav-link nav-item" onClick={logOut} data-toggle="collapse" data-target='#navbarNavDropdown'>Logout</Link>
                </div>
            </div>
        </nav>
    )

    //navbar view if a user is logged out
    const loggedOutView = (
        <nav className="navbar navbar-expand-sm navbar-light">
            <NavLink to="/" className="navbar-brand">Stream Stats</NavLink>
            <div className="navbar-nav ml-auto">
                <Link to="/login" className="nav-link nav-item">Login</Link>
            </div>
        </nav>
    )

    return (
        <>
        <div className="container-narrow">{!currUser ? loggedOutView : loggedInView}</div></>
    )
}

export default NavBar;