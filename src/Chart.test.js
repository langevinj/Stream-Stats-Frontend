import React, {useState} from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Chart from './Chart.js';
import UserContext from './UserContext'
import { useLocalStorage } from './hooks.js';

jest.mock('./hooks.js', () => ({useLocalStorage : jest.fn()}));


it("renders without crashing", function() {
    const setCurrUser= jest.fn()
    const currUser = { "username": "u1"}
    const localData = { distrokid: [], bandcamp_alltime: [], bandcamp_month: [], spotify_alltime: [], spotify_month: [] }
    const setLocalData = () => {localData}
    useLocalStorage.mockImplmentation(() => [localData, setLocalData]);


    render(<MemoryRouter>
        <UserContext.Provider value={{currUser, setCurrUser}}>
            <Chart />
        </UserContext.Provider>
    </MemoryRouter>)
});