import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck } from 'lucide-react';

function VerifyOtpPage() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Safely access email from location state
    const email = location.state?.email;

    useEffect(() => {
        // If there's no email, the user shouldn't be on this page.
        // Redirect them to register after a short delay.
        if (!email) {
            setTimeout(() => {
                navigate('/register');
            }, 3000);
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('http://localhost:3000/api/v1/users/verify-otp', { email, otp });
            setSuccess(response.data.message || "Verification successful! Redirecting to login...");
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setError(err.response?.data?.message || "Verification failed. Please check the OTP and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-red-600">Invalid Access</h2>
                    <p className="text-gray-600 mt-2">No email address was provided. Redirecting you to the registration page...</p>
                </div>
            </div>
        );
    }
    
    const inputStyle = "w-full text-center tracking-[1em] text-2xl font-bold px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 bg-white p-8 md:p-10 rounded-xl shadow-lg border">
                
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-600">
                        IITK<span className="text-green-600">ReSale</span>
                    </h1>
                    <h2 className="mt-2 text-2xl font-bold text-gray-800">Verify Your Account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        A 6-digit verification code has been sent to <br/> <strong className="text-gray-800">{email}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="otp" className="sr-only">OTP</label>
                        <input 
                            id="otp"
                            type="text" 
                            maxLength="6"
                            placeholder="------" 
                            value={otp} 
                            onChange={e => setOtp(e.target.value)} 
                            required 
                            className={inputStyle}
                            disabled={isLoading}
                        />
                    </div>
                    
                    {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md text-sm">{error}</div>}
                    {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded-md text-sm">{success}</div>}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        <ShieldCheck size={18} />
                        {isLoading ? 'Verifying...' : 'Verify & Proceed'}
                    </button>
                </form>
                
                <p className="text-xs text-center text-gray-500">
                    Didn't receive the code? Check your spam folder or try registering again.
                </p>
            </div>
        </div>
    );
}

export default VerifyOtpPage;
