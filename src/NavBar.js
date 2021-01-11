import React from 'react';
import './NavBar.css';
import { NavLink } from 'react-router-dom'

function NavBar() {
    return (
        <div>
                <NavLink exact to="/">
                    Home
                </NavLink>
        </div>
    )
}

export default NavBar