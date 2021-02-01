import React from 'react';
import DataInput from './DataInput'
import { render, fireEvent } from '@testing-library/react';
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

it('handles toggles', function () {
    const { getByText, queryByTestId } = render(<MemoryRouter>
        <UserContext.Provider value={{ currUser, setCurrUser }}>
            <DataInput />
        </UserContext.Provider>
    </MemoryRouter>);

    expect(getByText("View how-to video")).toBeInTheDocument();
    expect(getByText("I prefer to paste my spotify data")).toBeInTheDocument();

    fireEvent.click(getByText("View how-to video"));
    fireEvent.click(getByText("I prefer to paste my spotify data"));

    expect(queryByTestId("toggleVideoOn")).not.toBeInTheDocument();
    expect(queryByTestId("toggleVideoOff")).toBeInTheDocument();
});