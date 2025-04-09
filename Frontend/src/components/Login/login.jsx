import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [identifier, setIdentifier] = useState(''); // username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/v1/users/login', {
        identifier, // username or email
        password
      },
      {
        withCredentials: true, // ✅ Send/receive cookies
      });

      console.log('Login successful:', response.data);

      navigate('/user'); // or any route after login
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            disabled={isLoading}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="input"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
