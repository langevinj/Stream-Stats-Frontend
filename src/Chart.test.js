import React, {useState} from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Chart from './Chart.js';
import UserContext from './UserContext';

const setCurrUser = jest.fn();
const currUser = { "username": "u1" };

beforeEach(() => {
    localStorage.setItem("data", { distrokid: [], bandcamp_alltime: [], bandcamp_month: [], spotify_alltime: [], spotify_month: [] });
});

afterEach(() => {
    localStorage.removeItem("data");
});

it("renders without crashing", function() {
    render(<MemoryRouter>
        <UserContext.Provider value={{currUser, setCurrUser}}>
            <Chart />
        </UserContext.Provider>
    </MemoryRouter>)
});

it("matches the snapshot", function() {
    const {asFragement} = render(<MemoryRouter>
        <UserContext.Provider value={{ currUser, setCurrUser }}>
            <Chart />
        </UserContext.Provider>
    </MemoryRouter>);

    expect(asFragement).toMatchSnapshot();
});

it("shows a message indicating no data has been added", function() {
    const { getByText } = render(<MemoryRouter>
        <UserContext.Provider value={{ currUser, setCurrUser }}>
            <Chart />
        </UserContext.Provider>
    </MemoryRouter>);

    //Wait for render lag
    setTimeout(() => {
        expect(getByText("No data has been imported for All time yet. Wait a few seconds, or import data now.")).toBeInTheDocument();
    }, 2000);
});

it("toggles between views", function() {
    const { getByText, queryByTestId } = render(<MemoryRouter>
        <UserContext.Provider value={{ currUser, setCurrUser }}>
            <Chart />
        </UserContext.Provider>
    </MemoryRouter>);
    
    
    let title = queryByTestId("chartTitle");
    setTimeout(() => {
        expect(title.innerText).toEqual('All time');
    }, 1000);
    
    let toggleButtom = getByText("30-day");
    fireEvent.click(toggleButtom);

    title = queryByTestId("chartTitle");

    setTimeout(() => {
        expect(title.innerText).toEqual('30-day');
    }, 1000);
});