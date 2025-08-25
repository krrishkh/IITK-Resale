// src/pages/HomePage.jsx
import React from 'react';
import { Upload, Send, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CiLogin } from "react-icons/ci";

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  

  const api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // ✅ this is necessary to send cookies
    });


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/getUserDetails');
        if (res.data.user) {
          setUser(res.data.user); //  User is logged in
        } else {
          setUser(null); // fallback
        }
      } catch (err) {
        console.log('User not logged in or session expired');
        setUser(null); //  Not logged in
      }
    };
  
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="w-full px-4 md:px-6 py-3 flex justify-between items-center">
          <a
            href="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition duration-300"
          >
            IITK<span className="text-green-600">ReSale</span>
          </a>
          <button
            className="text-gray-600 hover:text-blue-600"
            onClick={() => navigate('/register')}
          >
            <CiLogin className="inline-block mr-2" size={24} /> {/* Login Icon */}
            {user ? `Welcome, ${user.fullname}` : 'Login/Register'} {/* Conditional text based on user state */}
          </button> 
          
        </nav>
      </header>


      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 text-white py-16 md:py-24">
        <div className="w-full px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Your Campus Marketplace
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Buy and sell used goods easily within the IIT Kanpur community. Find deals on cycles,
            books, electronics, and more!
          </p>
        </div>
      </section>


      {/* How It Works Section */}
      <section className="w-full px-4 md:px-6 py-12 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-lg shadow-md hover:shadow-xl transition bg-gray-50">
            <Upload size={32} className="mx-auto text-blue-600 mb-3" />
            <h3 className="text-xl font-semibold text-blue-600 mb-2">1. List Your Item</h3>
            <p className="text-gray-600">
              Post new or used items for sale with photos, category, and price. Only IITK students/faculty can post.
            </p>
          </div>
          <div className="p-6 rounded-lg shadow-md hover:shadow-xl transition bg-gray-50">
            <Send size={32} className="mx-auto text-green-600 mb-3" />
            <h3 className="text-xl font-semibold text-green-600 mb-2">2. Send a Request</h3>
            <p className="text-gray-600">
              Interested buyers click on <strong>Buy</strong> and send a short message to the seller to express interest.
            </p>
          </div>
          <div className="p-6 rounded-lg shadow-md hover:shadow-xl transition bg-gray-50">
            <CheckCircle size={32} className="mx-auto text-purple-600 mb-3" />
            <h3 className="text-xl font-semibold text-purple-600 mb-2">3. Confirm & Sell</h3>
            <p className="text-gray-600">
              Sellers review the request. Once both parties agree, seller clicks <strong>Accept</strong> and the item is marked as sold!
            </p>
          </div>
        </div>
      </section>


      {/* Visit the Store Section */}
      <section className="bg-gradient-to-br from-green-100 to-blue-100 py-16 px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Ready to Explore?</h2>
        <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
            Browse listings and find great deals on books, gadgets, cycles, and more within IITK.
        </p>
        <button
            onClick={() => {
                
                    if (user) {
                    navigate("/all-items");
                    } else {
                    navigate("/register");
                    }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300"
        >
            Visit the Store
        </button>
      </section>


        {/* FAQ Section */}
      <section className="bg-white py-12 px-4 md:px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg text-blue-600">Who can use IITK ReSale?</h3>
            <p className="text-gray-700 mt-2">Only students, staff, and residents of IIT Kanpur campus can use this platform to buy and sell items.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg text-blue-600">How do I post an item for sale?</h3>
            <p className="text-gray-700 mt-2">Once you're logged in, go to the 'Post Ad' page and fill in the item details, category, condition, and upload an image. Your listing will be visible to others after submission.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg text-blue-600">What happens when someone wants to buy my item?</h3>
            <p className="text-gray-700 mt-2">Buyers will send a request to you with a short message. You can accept or reject the request based on your agreement with the buyer.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg text-blue-600">Is payment handled on the platform?</h3>
            <p className="text-gray-700 mt-2">No, payment is done offline. The platform only connects buyers and sellers.</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg text-blue-600">Can I delete or edit my listing?</h3>
            <p className="text-gray-700 mt-2">Yes, just go to your profile/dashboard to edit or delete your posted items anytime.</p>
            </div>
        </div>
      </section>


        {/* Meet the Developers Section */}
      <section className="text-center py-12 bg-gray-100">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Curious who built this?</h2>
        <p className="mb-6 text-gray-700 max-w-xl mx-auto">
            Meet the developers who made this platform possible.
        </p>
        <button
            onClick={() => navigate('/meet-developers')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out"
        >
            Meet the Developers
        </button>
      </section>


      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-6 px-4 mt-12 w-full">
        <p>© {new Date().getFullYear()} IITK ReSale Hub.</p>
        <p className="text-sm">Connecting the IIT Kanpur Community.</p>
      </footer>
    </div>
  );
}

export default HomePage;
