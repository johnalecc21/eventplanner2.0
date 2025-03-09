import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProviderNavbar from './ProviderNavbar';

describe('ProviderNavbar Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('should render ProviderNavbar correctly', () => {
    render(
      <MemoryRouter>
        <ProviderNavbar />
      </MemoryRouter>
    );
    expect(screen.getByTestId('provider-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-logo')).toBeInTheDocument();
    expect(screen.getByTestId('nav-my-services')).toBeInTheDocument();
    expect(screen.getByTestId('nav-bookings')).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });

  test('should navigate to My Services page when clicked', () => {
    render(
      <MemoryRouter>
        <ProviderNavbar />
      </MemoryRouter>
    );
    const myServicesLink = screen.getByTestId('nav-my-services');
    expect(myServicesLink).toHaveAttribute('href', '/provider/dashboard/my-services');
  });

  test('should navigate to Bookings page when clicked', () => {
    render(
      <MemoryRouter>
        <ProviderNavbar />
      </MemoryRouter>
    );
    const bookingsLink = screen.getByTestId('nav-bookings');
    expect(bookingsLink).toHaveAttribute('href', '/provider/dashboard/bookings');
  });

  test('should clear token and navigate to login page on logout', () => {
    render(
      <MemoryRouter>
        <ProviderNavbar />
      </MemoryRouter>
    );
    const logoutButton = screen.getByTestId('logout-button');
    fireEvent.click(logoutButton);
    expect(localStorage.getItem('token')).toBeNull();
  });
});
