import React from 'react'
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
// import { u1 } from './_testCommon'
import Home from './Home'

it('renders without crashing', function() {
    render(<MemoryRouter>
        <Home />
    </MemoryRouter>)
});

it('matches the snapshot', function(){
    const { asFragment } = render(<MemoryRouter>
        <Home />
    </MemoryRouter>);

    expect(asFragment).toMatchSnapshot();
});