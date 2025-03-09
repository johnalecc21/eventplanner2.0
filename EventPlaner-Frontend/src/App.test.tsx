import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders Home component on the root route', () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    expect(screen.getByTestId('home-container')).toBeInTheDocument();
  });

  test('renders Marketplace component on the /marketplace route', () => {
    window.history.pushState({}, '', '/marketplace');
    render(<App />);

    expect(screen.getByTestId('marketplace-container')).toBeInTheDocument();
  });

  test('renders Login component on the /login route', () => {
    window.history.pushState({}, '', '/login');
    render(<App />);

    expect(screen.getByTestId('login-container')).toBeInTheDocument();
  });

  test('renders Register component on the /register route', () => {
    window.history.pushState({}, '', '/register');
    render(<App />);

    expect(screen.getByTestId('register-container')).toBeInTheDocument();
  });

  test('renders Bookings component on the /provider/dashboard/bookings route', () => {
    window.history.pushState({}, '', '/provider/dashboard/bookings');
    render(<App />);

    expect(screen.getByTestId('bookings-container')).toBeInTheDocument();
  });
});