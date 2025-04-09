import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddItem() {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    category: '',
    price: '',
    condition: '',
    negotiable: 'false',
    sellerRating: '',
  });

  const [images, setImages] = useState([]);
  const [responseMsg, setResponseMsg] = useState('');
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1/users',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('You can upload up to 5 images only.');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    images.forEach((img) => {
      data.append('images', img);
    });

    try {
      const res = await api.post('/addItem', data);
      if (res.data.success) {
        setResponseMsg('Item added successfully!');
        setFormData({
          itemName: '',
          description: '',
          category: '',
          price: '',
          condition: '',
          negotiable: 'false',
          sellerRating: '',
        });
        setImages([]);
        navigate('/user'); 
      } else {
        setResponseMsg('Something went wrong while adding item.');
      }
    } catch (err) {
      console.error('Error adding item:', err);
      setResponseMsg('Error occurred during upload.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="itemName"
          value={formData.itemName}
          onChange={handleInputChange}
          placeholder="Item Name"
          required
          className="w-full border rounded p-2"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
          rows={3}
          required
          className="w-full border rounded p-2"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
        Category
        </label>
        <select
        name="category"
        value={formData.category}
        onChange={handleInputChange}
        required
        className="w-full border rounded p-2"
        >
        <option value="">Select a category</option>
        <option value="Electronics">Electronics</option>
        <option value="Books">Books</option>
        <option value="Furniture">Furniture</option>
        <option value="Clothing">Clothing</option>
        <option value="Stationery">Stationery</option>
        <option value="Sports Equipment">Sports Equipment</option>
        <option value="Bicycles">Bicycles</option>
        <option value="Room Essentials">Room Essentials</option>
        <option value="Others">Others</option>
        </select>

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="Price (INR)"
          required
          className="w-full border rounded p-2"
        />

        <input
          type="text"
          name="condition"
          value={formData.condition}
          onChange={handleInputChange}
          placeholder="Condition (e.g., new/used)"
          required
          className="w-full border rounded p-2"
        />

        <select
          name="negotiable"
          value={formData.negotiable}
          onChange={handleInputChange}
          className="w-full border rounded p-2"
        >
          <option value="false">Negotiable: No</option>
          <option value="true">Negotiable: Yes</option>
        </select>

        <input
          type="number"
          name="sellerRating"
          value={formData.sellerRating}
          onChange={handleInputChange}
          placeholder="Seller Rating (1-5)"
          className="w-full border rounded p-2"
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full border rounded p-2"
        />
        {images.length > 0 && (
          <p className="text-sm text-gray-600">{images.length} image(s) selected.</p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>

        {responseMsg && <p className="text-green-600 mt-2">{responseMsg}</p>}
      </form>
    </div>
  );
}

export default AddItem;
