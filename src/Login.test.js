import React from 'react'
import { render, fireEvent } from '@testing-library/react';
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

it("properly switches between form views", function() {
    const { getByText, queryByTestId } = render(<MemoryRouter>
        <Login setToken={mockSetToken} />
    </MemoryRouter>);

    const signupButton = getByText("Sign-Up");

    expect(signupButton).toBeInTheDocument();
    expect(queryByTestId("loginView")).toBeInTheDocument();

    //Click the button to toggle
    fireEvent.click(signupButton);

    expect(getByText("Login")).toBeInTheDocument();
    expect(queryByTestId("signupView")).toBeInTheDocument();
    expect(queryByTestId("loginView")).not.toBeInTheDocument();
});