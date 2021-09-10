import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders coming soon text', () => {
  render(<App />);
  const linkElement = screen.getByText(/Coming soon.../i);
  expect(linkElement).toBeInTheDocument();
});
