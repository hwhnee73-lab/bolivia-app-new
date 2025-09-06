import '@testing-library/jest-dom';
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProvider } from '../test-utils';
import App from '../App';

test('renders Auth screen by default', async () => {
  renderWithProvider(<App />);
  // Prefer role-based query; adjust the text to your real UI
  // Example: heading with "Bienvenido" or login button
  expect(
    screen.getByRole('heading', { name: /bienvenido/i })
  ).toBeInTheDocument();
});

