import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import InputField from '../../components/atoms/input/InputField';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('https://eventplannerbackend.onrender.com/api/auth/register', {
        name,
        email,
        password,
        role,
      });
      console.log('User registered:', response.data);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white" data-testid="register-container">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-lg space-y-6" data-testid="register-card">
        <h2 className="text-2xl font-bold text-center text-primary" data-testid="register-title">Create Account</h2>
        {error && <p className="text-red-500 text-center text-sm" data-testid="register-error">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="register-form">
          <InputField
            type="text"
            label="Full Name"
            value={name}
            onChange={setName}
            icon={<User className="h-5 w-5 text-text-secondary" />}
            placeholder="John Doe"
            data-testid="input-name"
          />

          <InputField
            type="email"
            label="Email"
            value={email}
            onChange={setEmail}
            icon={<Mail className="h-5 w-5 text-text-secondary" />}
            placeholder="your@email.com"
            data-testid="input-email"
          />

          <InputField
            type="password"
            label="Password"
            value={password}
            onChange={setPassword}
            icon={<Lock className="h-5 w-5 text-text-secondary" />}
            placeholder="••••••••"
            data-testid="input-password"
          />

          <div className="space-y-2" data-testid="role-selector">
            <label className="block text-sm font-medium text-text-secondary">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white/5 rounded-lg pl-3 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
              data-testid="input-role"
            >
              <option value="user">User</option>
              <option value="provider">Provider</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 disabled:opacity-50"
            disabled={loading}
            data-testid="submit-button"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-text-secondary text-sm" data-testid="login-link">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-dark font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
