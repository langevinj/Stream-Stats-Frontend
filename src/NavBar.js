import React from 'react';
import './NavBar.css';
import { NavLink } from 'react-router-dom'

function NavBar() {
    return (
        <div>
            <Navbar>
                <NavLink exact to="/">
                    Home
                </NavLink>
            </Navbar>
        </div>
    )
}

export default NavBar