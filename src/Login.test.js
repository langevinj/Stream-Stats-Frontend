import React from 'react'
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login.js';

const mockSetToken = jest.fn(() => "");

it("renders without crashing", function() {
    render(<MemoryRouter>
        <Login setToken={mockSetToken} />
    </MemoryRouter>);
});

it("matches the snapshot", function () {
    const {asFragment} = render(<MemoryRouter>
        <Login setToken={mockSetToken} />
    </MemoryRouter>);

    expect(asFragment).toMatchSnapshot();
});