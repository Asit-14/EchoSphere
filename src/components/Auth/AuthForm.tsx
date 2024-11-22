import React, { useState } from 'react';
import { Mail, Lock, User, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

type AuthMode = 'login' | 'register' | 'forgot';

interface AuthFormProps {
  onAuthSuccess: (token: string, user: any) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { data } = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem('token', data.token);
        onAuthSuccess(data.token, data.user);
        toast.success('Login successful!');
      } else if (mode === 'register') {
        const { data } = await axios.post('http://localhost:5000/api/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        toast.success('Registration successful! Please login.');
        setMode('login');
      } else if (mode === 'forgot') {
        await axios.post('http://localhost:5000/api/auth/forgot-password', {
          email: formData.email,
        });
        toast.success('Password reset instructions sent to your email!');
        setMode('login');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Reset Password'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            required
          />
        </div>

        {mode !== 'forgot' && (
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <Loader className="animate-spin h-5 w-5" />
          ) : mode === 'login' ? (
            'Sign In'
          ) : mode === 'register' ? (
            'Create Account'
          ) : (
            'Reset Password'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        {mode === 'login' ? (
          <>
            <button
              onClick={() => setMode('forgot')}
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
            <p className="mt-2">
              Don't have an account?{' '}
              <button
                onClick={() => setMode('register')}
                className="text-blue-500 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              onClick={() => setMode('login')}
              className="text-blue-500 hover:underline"
            >
              Sign In
            </button>
          </p>
        )}
      </div>
    </div>
  );
};