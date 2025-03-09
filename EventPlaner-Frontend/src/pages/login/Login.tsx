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
      localStorage.setItem('token', token); 
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
    <div className="min-h-[80vh] flex items-center justify-center bg-white" data-testid="login-container">
      <div
        className="w-full max-w-md p-8 rounded-2xl shadow-lg space-y-6"
        style={{
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        }}
        data-testid="login-form-container"
      >
        <h2 className="text-2xl font-bold text-center text-primary" data-testid="login-title">Welcome back</h2>
        {error && (
          <p className="text-red-500 text-center text-sm" data-testid="login-error-message">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
          <InputField
            type="email"
            label="Email"
            value={email}
            onChange={setEmail}
            icon={<Mail className="h-5 w-5 text-text-secondary" />}
            placeholder="your@email.com"
            data-testid="email-input"
          />

          <InputField
            type="password"
            label="Password"
            value={password}
            onChange={setPassword}
            icon={<Lock className="h-5 w-5 text-text-secondary" />}
            placeholder="••••••••"
            data-testid="password-input"
          />
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 disabled:opacity-50"
            disabled={loading}
            data-testid="login-button"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-text-secondary text-sm" data-testid="signup-link-text">
          Don't have an account?{' '}
          <a
            href="/register"
            className="text-primary hover:text-primary-dark font-medium transition-colors"
            data-testid="signup-link"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;