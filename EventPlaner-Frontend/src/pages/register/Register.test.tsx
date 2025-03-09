import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';

const mockAxios = new MockAdapter(axios);

describe('Register Component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  test('renders the register form', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Verifica que los elementos principales estén en el DOM
    expect(screen.getByTestId('register-container')).toBeInTheDocument();
    expect(screen.getByTestId('register-card')).toBeInTheDocument();
    expect(screen.getByTestId('register-title')).toHaveTextContent('Create Account');
    expect(screen.getByTestId('input-name')).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByTestId('input-role')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    expect(screen.getByTestId('login-link')).toBeInTheDocument();
  });

  test('displays error message when fields are empty', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(screen.getByTestId('register-error')).toHaveTextContent('All fields are required.');
  });

  test('submits the form successfully', async () => {
    mockAxios.onPost('https://eventplannerbackend.onrender.com/api/auth/register').reply(200, {
      message: 'User registered successfully',
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Simula la entrada del usuario
    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByTestId('input-role'), { target: { value: 'user' } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    // Verifica que el botón esté deshabilitado durante la carga
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Signing Up...');

    // Espera a que la solicitud se complete
    await waitFor(() => {
      expect(mockAxios.history.post.length).toBe(1);
      expect(mockAxios.history.post[0].data).toBe(
        JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'user',
        })
      );
    });
  });

  test('displays error message when registration fails', async () => {
    mockAxios.onPost('https://eventplannerbackend.onrender.com/api/auth/register').reply(500);

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Simula la entrada del usuario
    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByTestId('input-role'), { target: { value: 'user' } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    // Espera a que se muestre el mensaje de error
    await waitFor(() => {
      expect(screen.getByTestId('register-error')).toHaveTextContent('Failed to register. Please try again.');
    });
  });

});