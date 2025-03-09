// ProviderLayout.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProviderLayout from './ProviderLayout';

// Mock del Outlet de React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

// Mock del ProviderNavbar
jest.mock('../organisms/navbar/ProviderNavbar', () => () => (
  <div data-testid="provider-navbar">Provider Navbar</div>
));

describe('ProviderLayout Component', () => {
  test('renders ProviderNavbar and Outlet correctly', () => {
    render(
      <MemoryRouter>
        <ProviderLayout />
      </MemoryRouter>
    );

    expect(screen.getByTestId('provider-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.getByText('Outlet Content')).toBeInTheDocument();
  });

  test('applies correct container and padding styles', () => {
    render(
      <MemoryRouter>
        <ProviderLayout />
      </MemoryRouter>
    );

    const mainElement = screen.getByTestId('outlet').parentElement;
    expect(mainElement).toHaveClass('container mx-auto px-4 py-8 pt-16');
  });

  test('applies correct background style', () => {
    const { container } = render(
      <MemoryRouter>
        <ProviderLayout />
      </MemoryRouter>
    );

    expect(container.firstChild).toHaveClass('min-h-screen bg-background');
  });
});
