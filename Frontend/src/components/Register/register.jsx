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

  // Your handleSubmit function remains the same, no changes needed to the logic.
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
        fullname, username, email, contact, address, gender, password, confirmPassword
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
  
  // Define a consistent style for input fields
  const inputStyle = "w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200";

  return (
    // Themed background gradient
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-6 bg-white p-8 md:p-10 rounded-xl shadow-lg">
        
        {/* Branded Header */}
        <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600">
                IITK<span className="text-green-600">ReSale</span>
            </h1>
            <h2 className="mt-2 text-2xl font-bold text-gray-800">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
                Join the exclusive marketplace for the IITK community.
            </p>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Using grid for a 2-column layout on medium screens and up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" value={fullname} onChange={e => setFullname(e.target.value)} required className={inputStyle} disabled={isLoading} />
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required className={inputStyle} disabled={isLoading} />
          </div>
          
          <input type="email" placeholder="IITK Email (e.g. yourname@iitk.ac.in)" value={email} onChange={e => setEmail(e.target.value)} required className={inputStyle} disabled={isLoading} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="tel" placeholder="Contact Number" value={contact} onChange={e => setContact(e.target.value)} required className={inputStyle} disabled={isLoading} />
             <select value={gender} onChange={e => setGender(e.target.value)} required className={inputStyle} disabled={isLoading}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <input type="text" placeholder="Address (e.g. Hall 5, A-101)" value={address} onChange={e => setAddress(e.target.value)} required className={inputStyle} disabled={isLoading} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className={inputStyle} disabled={isLoading} />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className={inputStyle} disabled={isLoading} />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;