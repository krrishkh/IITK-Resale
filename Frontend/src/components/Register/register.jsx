import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    contact: '',
    address: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- Frontend Validation ---
    const iitkEmailRegex = /^[a-zA-Z0-9._%+-]+@iitk\.ac\.in$/;
    if (!iitkEmailRegex.test(formData.email)) {
      setError("Please use a valid IITK email address (@iitk.ac.in).");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    setIsLoading(true);
    try {
      // This request now sends an OTP instead of logging the user in
      const response = await axios.post('http://localhost:3000/api/v1/users/register', formData);
      
      // On success, navigate to the OTP page and pass the email
      navigate('/verify-otp', { 
        state: { email: formData.email } 
      });

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputStyle = "w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-6 bg-white p-8 md:p-10 rounded-xl shadow-lg border">
        
        <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600">
                IITK<span className="text-green-600">ReSale</span>
            </h1>
            <h2 className="mt-2 text-2xl font-bold text-gray-800">Create Your Account</h2>
            <p className="mt-2 text-sm text-gray-600">
                Join the exclusive marketplace for the IITK community.
            </p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="fullname" placeholder="Full Name" value={formData.fullname} onChange={handleInputChange} required className={inputStyle} disabled={isLoading} />
            <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} required className={inputStyle} disabled={isLoading} />
          </div>
          
          <input type="email" name="email" placeholder="IITK Email (e.g. yourname@iitk.ac.in)" value={formData.email} onChange={handleInputChange} required className={inputStyle} disabled={isLoading} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="tel" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleInputChange} required className={inputStyle} disabled={isLoading} />
             <select name="gender" value={formData.gender} onChange={handleInputChange} required className={inputStyle} disabled={isLoading}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <input type="text" name="address" placeholder="Address (e.g. Hall 5, A-101)" value={formData.address} onChange={handleInputChange} required className={inputStyle} disabled={isLoading} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required className={inputStyle} disabled={isLoading} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} required className={inputStyle} disabled={isLoading} />
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            <UserPlus size={18} />
            {isLoading ? 'Sending OTP...' : 'Get Verification Code'}
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
