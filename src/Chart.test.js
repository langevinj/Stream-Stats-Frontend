import React, {useState} from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Chart from './Chart.js';
import UserContext from './UserContext'


// it("renders without crashing", function() {
//     const setCurrUser= jest.fn()=
//     const currUser = { "username": "u1" };

//     render(<MemoryRouter>
//         <UserContext.Provider value={{currUser, setCurrUser}}>
//             <Chart />
//         </UserContext.Provider>
//     </MemoryRouter>)
// });