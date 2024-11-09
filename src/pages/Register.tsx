import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import InputField from '../components/InputField';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="glass-effect w-full max-w-md p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-8">Create Account</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            type="text"
            label="Full Name"
            value={name}
            onChange={setName}
            icon={<User className="h-5 w-5" />}
            placeholder="John Doe"
          />
          
          <InputField
            type="email"
            label="Email"
            value={email}
            onChange={setEmail}
            icon={<Mail className="h-5 w-5" />}
            placeholder="your@email.com"
          />
          
          <InputField
            type="password"
            label="Password"
            value={password}
            onChange={setPassword}
            icon={<Lock className="h-5 w-5" />}
            placeholder="••••••••"
          />
          
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg transition-colors"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary/90">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;