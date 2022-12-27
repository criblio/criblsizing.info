import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('Ensure calc box is shown with defaults', () => {
  render(<App />);
  expect(screen.getByText(/Calculations/i)).toBeInTheDocument();
  expect(screen.getByText(/2 workers/i)).toBeInTheDocument();
});

test('Ensure it updates correctly', async () => {
  render(<App />);

  const inbound = screen.getByTestId("inbound");
  fireEvent.change(inbound, {target: {value: 10}})

  const input = screen.getByTestId("cpu-speed");
  await userEvent.click(input);
  await userEvent.keyboard(".6");

  expect(screen.getByTestId("cpu-speed")).toHaveValue(3.6);
  expect(screen.getByText(/43 processes/i)).toBeInTheDocument();
  expect(screen.getByText(/21 workers/i)).toBeInTheDocument();
});

test('Ensure query string parameters are set', () => {
  render(<App />);

  expect(window.location.search).toEqual("?cpuspeed=3.6&in=10")
})

test('Ensure loads correctly', () => {
  const location = {
    ...window.location,
    search: "?in=15&out=5&cpuspeed=5"
  }
  Object.defineProperty(window, 'location', {
    writable: true,
    value: location,
  })

  render(<App />)

  expect(screen.getByTestId("inbound")).toHaveValue("15");
  expect(screen.getByTestId("outbound")).toHaveValue("5");
  expect(screen.getByTestId("cpu-speed")).toHaveValue(5);
})

describe("Ensure plurality is correct", () => {
  test("Ensure plural", () => {
    render(<App />);
    expect(screen.getByText(/2 processes/i)).toBeInTheDocument();
  })

  test("Ensure singular", () => {
    render(<App />);
    const cpuavail = screen.getByTestId("cpu-availability");
    fireEvent.change(cpuavail, {target: {value: 1}})
    expect(screen.getByText(/61 processes/i)).toBeInTheDocument();
    expect(screen.getByText(/(?<!\d+)1 process(?!es)/i)).toBeInTheDocument();
  })
});
