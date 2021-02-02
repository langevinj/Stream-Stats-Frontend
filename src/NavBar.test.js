import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserContext from './UserContext';
import '@testing-library/jest-dom';
import NavBar from './NavBar';

const setCurrUser = jest.fn();
const currUser = { "username": "u1" };
const mockLogOut = jest.fn(() => "")

it("renders without crashing", function(){
    render(<MemoryRouter>
        <UserContext.Provider value={{currUser, setCurrUser}}>
            <NavBar logOut={mockLogOut}/>
        </UserContext.Provider>
    </MemoryRouter>)
});

it("matches the snapshot", function() {
    const {asFragment} = render(<MemoryRouter>
        <UserContext.Provider value={{ currUser, setCurrUser }}>
            <NavBar logOut={mockLogOut} />
        </UserContext.Provider>
    </MemoryRouter>);

    expect(asFragment).toMatchSnapshot();
});