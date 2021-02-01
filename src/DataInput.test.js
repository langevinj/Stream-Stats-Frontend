import React from 'react';
import DataInput from './DataInput'
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import UserContext from './UserContext'

const setCurrUser = jest.fn();
const currUser = { "username": "u1" };

it('renders without crashing', function() {
    render(<MemoryRouter>
        <UserContext.Provider value={{currUser, setCurrUser}}>
            <DataInput />
        </UserContext.Provider>
    </MemoryRouter>);
});

it('matches snapshot', function(){
    const { asFragment } = render(<MemoryRouter>
        <UserContext.Provider value={{ currUser, setCurrUser }}>
            <DataInput />
        </UserContext.Provider>
    </MemoryRouter>);

    expect(asFragment).toMatchSnapshot();
});