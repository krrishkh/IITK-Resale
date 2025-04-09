import React, { useEffect, useState } from 'react';
import ProductCard from '../Item/productcard';
import { useNavigate } from 'react-router-dom';

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [condition, setCondition] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3000/api/v1/users/allItems');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data.items || []);
        setFiltered(data.items || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];

    if (search.trim()) {
      result = result.filter((item) =>
        item.itemName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'All') {
      result = result.filter((item) => item.category === category);
    }

    if (condition !== 'All') {
      result = result.filter((item) => item.condition === condition);
    }

    setFiltered(result);
  }, [search, category, condition, products]);

  const categories = [
    "Electronics",
    "Books",
    "Furniture",
    "Clothing",
    "Stationery",
    "Sports Equipment",
    "Bicycles",
    "Room Essentials",
    "Others"
  ];
  
  const conditions = [...new Set(products.map((item) => item.condition))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <a href="/" className="text-3xl font-bold flex items-center space-x-1  pl-2">
          <span className="text-blue-600">IITK</span>
          <span className="text-green-600">ReSale</span>
        </a>

        <a className='text-3xl font-bold flex items-center space-x-1  pl-2'>
        🛒 Marketplace
        </a>

        <button
          onClick={() => navigate('/user')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Your Place
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md"
        >
          <option value="All">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>


        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md"
        >
          <option value="All">All Conditions</option>
          {conditions.map((cond, idx) => (
            <option key={idx} value={cond}>{cond}</option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg animate-pulse">Loading items for you...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">No items match your search or filters.</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((item) => (
            <ProductCard
              key={item._id}
              product={{
                id: item._id,
                name: item.itemName.replaceAll('"', ''),
                price: item.price,
                category: item.category.replaceAll('"', ''),
                seller: item.owner?.fullname || "Unknown Seller",
                postedDate: item.createdAt,
                condition: item.condition,
                imageUrl: item.images?.[0] || '',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllProducts;
