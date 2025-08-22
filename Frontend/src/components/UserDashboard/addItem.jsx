import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, PackagePlus, ArrowLeft } from 'lucide-react';

function AddItem() {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    category: '',
    price: '',
    condition: '',
    negotiable: 'false',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1/users',
    withCredentials: true, // Use cookies for auth, no need for localStorage token
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('You can upload a maximum of 5 images.');
      return;
    }
    setImages(files);
    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const data = new FormData();
    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    // Append images
    images.forEach((img) => {
      data.append('images', img);
    });

    try {
      const res = await api.post('/addItem', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setSuccess('Item added successfully! Redirecting...');
        setTimeout(() => navigate('/user'), 2000);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err.response?.data?.message || 'An error occurred during upload.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const inputStyle = "w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 mb-4">
            <ArrowLeft size={16} />
            Back to Dashboard
        </button>
        <div className="bg-white p-8 rounded-xl shadow-lg border">
          {/* Branded Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600">
              IITK<span className="text-green-600">ReSale</span>
            </h1>
            <h2 className="mt-2 text-2xl font-bold text-gray-800">List a New Item</h2>
            <p className="mt-2 text-sm text-gray-600">Fill in the details below to reach buyers across the campus.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Item Name */}
              <div>
                <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input id="itemName" type="text" name="itemName" value={formData.itemName} onChange={handleInputChange} placeholder="e.g., Hero Sprint Bicycle" required className={inputStyle} />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleInputChange} required className={inputStyle}>
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
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input id="price" type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="e.g., 2500" required className={inputStyle} />
              </div>

              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                 <select id="condition" name="condition" value={formData.condition} onChange={handleInputChange} required className={inputStyle}>
                    <option value="">Select condition</option>
                    <option value="new">New (Unused)</option>
                    <option value="new">Like New (Used once or twice)</option>
                    <option value="used">Good (Used, but in good shape)</option>
                    <option value="used">Fair (Visible signs of use)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your item, its features, and any defects." rows={4} required className={inputStyle} />
            </div>

            {/* Image Uploader */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (up to 5)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                <span>Upload files</span>
                                <input id="file-upload" name="images" type="file" className="sr-only" accept="image/*" multiple onChange={handleImageChange} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
                <div>
                    <p className="text-sm font-medium text-gray-700">Selected Images:</p>
                    <div className="mt-2 grid grid-cols-3 sm:grid-cols-5 gap-4">
                        {imagePreviews.map((preview, index) => (
                            <img key={index} src={preview} alt={`preview ${index}`} className="h-24 w-24 object-cover rounded-md border" />
                        ))}
                    </div>
                </div>
            )}

            {/* Response Messages */}
            {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-sm">{error}</div>}
            {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md text-sm">{success}</div>}

            {/* Submit Button */}
            <div className="text-right">
              <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out disabled:bg-green-400 disabled:cursor-not-allowed">
                <PackagePlus size={20} />
                {isLoading ? 'Listing Item...' : 'List My Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddItem;
