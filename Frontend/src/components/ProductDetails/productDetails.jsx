import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IndianRupee, Tag, ShieldCheck, User, Calendar, ArrowLeft, Send } from 'lucide-react';

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedImage, setSelectedImage] = useState(0); // Index of the selected image
    const [user, setUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch item and user details in parallel
                const [itemRes, userRes] = await Promise.all([
                    api.get(`/item/${id}`),
                    api.get('/getUserDetails')
                ]);

                if (itemRes.data.success) {
                    setItem(itemRes.data.item);
                } else {
                    setError("Could not find the requested item.");
                }
                setUser(userRes.data.user || null);

            } catch (err) {
                console.error('Error fetching data:', err);
                setError("Failed to load product details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSendRequest = async () => {
        if (!message) {
            setError("Please write a message to the seller.");
            return;
        }
        setIsSubmitting(true);
        setError('');
        setSuccess('');
        try {
            const res = await api.post('/request', { itemId: item._id, message });
            if (res.data.success) {
                setSuccess('Your request was sent successfully! Redirecting...');
                setTimeout(() => navigate('/all-items'), 2500);
            } else {
                setError(res.data.message || 'Something went wrong.');
            }
        } catch (err) {
            console.error('Buy request error:', err);
            setError(err.response?.data?.message || 'Error sending request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }
    
    if (error && !item) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (!item) {
        return <div className="text-center py-10">Product not found.</div>;
    }

    const isOwner = user && item.owner && user._id === item.owner._id;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 mb-6">
                    <ArrowLeft size={16} />
                    Back to Marketplace
                </button>

                <div className="bg-white rounded-2xl shadow-xl border p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className="aspect-square w-full bg-gray-100 rounded-xl overflow-hidden">
                            <img
                                src={item.images[selectedImage]}
                                alt={`${item.itemName} - view ${selectedImage + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            {item.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square w-full rounded-lg overflow-hidden transition-all duration-200 ${selectedImage === index ? 'ring-4 ring-blue-500' : 'hover:opacity-80'}`}
                                >
                                    <img src={img} alt={`thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-4 mb-3">
                            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"><Tag size={14}/>{item.category}</span>
                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5"><ShieldCheck size={14}/>{item.condition}</span>
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{item.itemName}</h1>
                        
                        <p className="text-gray-600 mb-6">{item.description}</p>
                        
                        <div className="mb-6">
                           <p className="text-4xl font-extrabold text-green-600 flex items-center">
                                <IndianRupee size={32} className="mr-1"/>
                                {item.price.toLocaleString('en-IN')}
                            </p>
                        </div>

                        <div className="bg-gray-50 border rounded-lg p-4 space-y-3 text-sm mb-6">
                           <p className="flex items-center text-gray-700"><User size={16} className="mr-2 text-gray-400"/><strong>Seller:</strong><span className="ml-2 text-blue-600 font-semibold">{item.owner.fullname || 'Anonymous'}</span></p>
                           <p className="flex items-center text-gray-700"><Calendar size={16} className="mr-2 text-gray-400"/><strong>Posted on:</strong><span className="ml-2">{new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></p>
                        </div>

                        {/* Action Area */}
                        <div className="mt-auto">
                            {isOwner ? (
                                <div className="bg-yellow-100 text-yellow-800 text-center p-3 rounded-lg font-medium">This is your own listing.</div>
                            ) : (
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Send a message to the seller</label>
                                    <textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-blue-500"
                                        placeholder={`Hi ${item.owner.fullname}, I'm interested in your ${item.itemName}...`}
                                        rows={3}
                                    />
                                    <button
                                        onClick={handleSendRequest}
                                        disabled={isSubmitting}
                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-blue-400"
                                    >
                                        <Send size={18} />
                                        {isSubmitting ? 'Sending...' : 'Send Purchase Request'}
                                    </button>
                                    {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
                                    {success && <p className="mt-3 text-sm text-green-600">{success}</p>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
