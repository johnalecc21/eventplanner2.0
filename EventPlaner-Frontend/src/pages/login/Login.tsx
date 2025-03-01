import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import InputField from '../../components/atoms/input/InputField';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('https://eventplannerbackend.onrender.com/api/auth/login', { email, password });

      const { token, user } = response.data;
      localStorage.setItem('token', token); // Guardar el token en el almacenamiento local
      // Redirigir según el rol del usuario
      if (user.role === 'provider') {
        navigate('/provider/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white">
      {/* Contenedor principal */}
      <div
        className="w-full max-w-md p-8 rounded-2xl shadow-lg space-y-6"
        style={{
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Título */}
        <h2 className="text-2xl font-bold text-center text-primary">Welcome back</h2>

        {/* Mensaje de error */}
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo de correo electrónico */}
          <InputField
            type="email"
            label="Email"
            value={email}
            onChange={setEmail}
            icon={<Mail className="h-5 w-5 text-text-secondary" />}
            placeholder="your@email.com"
          />

          {/* Campo de contraseña */}
          <InputField
            type="password"
            label="Password"
            value={password}
            onChange={setPassword}
            icon={<Lock className="h-5 w-5 text-text-secondary" />}
            placeholder="••••••••"
          />

          {/* Botón de inicio de sesión */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Enlace para registrarse */}
        <p className="text-center text-text-secondary text-sm">
          Don't have an account?{' '}
          <a href="/register" className="text-primary hover:text-primary-dark font-medium transition-colors">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;