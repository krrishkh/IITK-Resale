import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProductDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);


  // Create axios instance with default config
  const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1/users',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // ✅ this is necessary to send cookies
  });

  // Attach token if exists
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/item/${id}`);
        if (res.data.success) {
          setItem(res.data.item);
        }
      } catch (err) {
        console.error('Error fetching item:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleBuyNow = async () => {
    try {
      const res = await api.post('/request', {
        itemId: item._id,
        message,
      });

      if (res.data.success) {
        setResponseMsg('Purchase request sent successfully!');
        setMessage('');
      } else {
        setResponseMsg('Something went wrong.');
      }
    } catch (err) {
      console.error('Buy request error:', err);
      setResponseMsg('Error sending request.');
    }
  };

  if (loading) return <p className="text-center py-8">Loading...</p>;

  if (!item) return <p className="text-center py-8 text-red-500">Item not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-4">{item.itemName}</h2>

      {/* Images */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {item.images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`item-img-${i}`}
            className="w-full h-48 object-cover rounded-md shadow"
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>

      {/* Info */}
      <p className="mb-2 text-gray-700"><strong>Description:</strong> {item.description}</p>
      <p className="mb-2 text-gray-700"><strong>Category:</strong> {item.category}</p>
      <p className="mb-2 text-gray-700"><strong>Condition:</strong> {item.condition}</p>
      <p className="mb-2 text-gray-700"><strong>Price:</strong> ₹{item.price.toLocaleString('en-IN')}</p>
      <p className="mb-4 text-gray-700"><strong>Seller:</strong> {item.owner.fullname || 'Anonymous'}</p>

      {/* Buy Now */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border rounded-md p-2 mb-4"
        placeholder="Optional message to seller..."
        rows={3}
      />

      <button
        onClick={handleBuyNow}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        Buy Now
      </button>

      {responseMsg && <p className="mt-4 text-blue-600">{responseMsg}</p>}


      {/* Full Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Full View"
              className="max-w-full max-h-[90vh] rounded-md"
              onClick={(e) => e.stopPropagation()} // Prevent modal close on image click
            />
          </div>
        </div>
      )}
    </div>

    
    
  );
}

export default ProductDetails;
