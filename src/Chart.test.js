import React, {useState} from 'react';
import { render } from '@testing-library/react';
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