import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/v1/users/register', {
        fullname,
        username,
        email,
        contact,
        address,
        gender,
        password,
        confirmPassword
      });

      console.log('Registration successful!', response.data);
      navigate('/login?registered=true');

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" value={fullname} onChange={e => setFullname(e.target.value)} required className="input" disabled={isLoading} />
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required className="input" disabled={isLoading} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="input" disabled={isLoading} />
          <input type="tel" placeholder="Contact" value={contact} onChange={e => setContact(e.target.value)} required className="input" disabled={isLoading} />
          <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required className="input" disabled={isLoading} />

          <select value={gender} onChange={e => setGender(e.target.value)} required className="input" disabled={isLoading}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="input" disabled={isLoading} />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="input" disabled={isLoading} />

          <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full">
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
