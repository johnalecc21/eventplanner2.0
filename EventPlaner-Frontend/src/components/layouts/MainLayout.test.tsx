// MainLayout.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MainLayout from './MainLayout';

// Mock del componente Navbar
jest.mock('../organisms/navbar/Navbar', () => () => <nav data-testid="navbar">Navbar</nav>);

// Mock del Outlet de React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

describe('MainLayout Component', () => {
  test('renders Navbar and Outlet correctly', () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  test('applies correct container and padding styles', () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>
    );

    const mainElement = screen.getByTestId('outlet').parentElement;
    expect(mainElement).toHaveClass('container mx-auto px-4 py-8 pt-16');
  });

  test('applies correct background style', () => {
    const { container } = render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>
    );

    expect(container.firstChild).toHaveClass('min-h-screen bg-background');
  });
});
