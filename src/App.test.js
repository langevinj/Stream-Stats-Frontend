// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

import React from 'react'
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import App from './App';

it('renders without crashing', function () {
  render(<MemoryRouter>
    <App />
  </MemoryRouter>);
});

it('matches the snapshot', function () {
  const { asFragment } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>);

  expect(asFragment).toMatchSnapshot();
});
