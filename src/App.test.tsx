import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('Ensure calc box is shown with defaults', () => {
  render(<App />);
  expect(screen.getByText(/Calculations/i)).toBeInTheDocument();
  expect(screen.getByText(/2 workers/i)).toBeInTheDocument();
});

test('Ensure it updates correctly', () => {
  render(<App />);

  const inbound = screen.getByTestId("inbound");
  fireEvent.change(inbound, {target: {value: 10}})

  const input = screen.getByTestId("cpu-speed");
  userEvent.type(input,".6");

  expect(screen.getByTestId("cpu-speed")).toHaveValue(3.6);
  expect(screen.getByText(/43 processes/i)).toBeInTheDocument();
  expect(screen.getByText(/21 workers/i)).toBeInTheDocument();
});