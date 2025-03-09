import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'; // Importa axios-mock-adapter
import '@testing-library/jest-dom';

const mockAxios = new MockAdapter(axios); // Crea una instancia de MockAdapter

describe('Login', () => {
  beforeEach(() => {
    mockAxios.reset(); // Reinicia el mock antes de cada prueba
  });

  test('renders the login container', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByTestId('login-container')).toBeInTheDocument();
  });

  test('renders the login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByTestId('login-form-container')).toBeInTheDocument();
    expect(screen.getByTestId('login-title')).toHaveTextContent('Welcome back');
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
    expect(screen.getByTestId('signup-link-text')).toBeInTheDocument();
    expect(screen.getByTestId('signup-link')).toBeInTheDocument();
  });

  test('displays error message when fields are empty', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);

    expect(screen.getByTestId('login-error-message')).toHaveTextContent('All fields are required.');
  });

  test('disables login button when loading', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = screen.getByTestId('login-button');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    // Simula la entrada del usuario
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Simula una respuesta exitosa de la API
    mockAxios.onPost('https://eventplannerbackend.onrender.com/api/auth/login').reply(200, {
      token: 'fake-token',
      user: { role: 'provider' },
    });

    fireEvent.click(loginButton);

    // Verifica que el botón esté deshabilitado
    expect(loginButton).toBeDisabled();
    expect(loginButton).toHaveTextContent('Signing In...');

    // Espera a que la carga termine
    await waitFor(() => expect(loginButton).not.toBeDisabled());
  });
});