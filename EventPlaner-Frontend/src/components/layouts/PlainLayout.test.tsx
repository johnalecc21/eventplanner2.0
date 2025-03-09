// PlainLayout.test.tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PlainLayout from './PlainLayout';

// Mock del Outlet de React Router
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

describe('PlainLayout Component', () => {
  test('renders Outlet correctly', () => {
    render(
      <MemoryRouter>
        <PlainLayout />
      </MemoryRouter>
    );

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.getByText('Outlet Content')).toBeInTheDocument();
  });

  test('applies correct container and padding styles', () => {
    render(
      <MemoryRouter>
        <PlainLayout />
      </MemoryRouter>
    );

    const mainElement = screen.getByTestId('outlet').parentElement;
    expect(mainElement).toHaveClass('container mx-auto px-4 py-8');
  });

  test('applies correct background style', () => {
    const { container } = render(
      <MemoryRouter>
        <PlainLayout />
      </MemoryRouter>
    );

    expect(container.firstChild).toHaveClass('min-h-screen bg-background');
  });
});
