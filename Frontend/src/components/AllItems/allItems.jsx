import React, { useState, useEffect } from 'react';
import ProductCard from '../Item/ProductCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, LayoutGrid, Tag, User } from 'lucide-react';

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [condition, setCondition] = useState('All');
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get('/allItems');
        const items = res.data.items || [];
        setProducts(items);
        setFiltered(items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products
      .filter(item => search.trim() === '' || item.itemName.toLowerCase().includes(search.toLowerCase()))
      .filter(item => category === 'All' || item.category === category)
      .filter(item => condition === 'All' || item.condition === condition);
    setFiltered(result);
  }, [search, category, condition, products]);

  const categories = ["All", "Electronics", "Books", "Furniture", "Clothing", "Stationery", "Sports Equipment", "Bicycles", "Room Essentials", "Others"];
  const conditions = ["All", ...new Set(products.map(item => item.condition))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="/" className="text-3xl font-bold flex items-center">
              <span className="text-blue-600">IITK</span>
              <span className="text-green-600">ReSale</span>
            </a>
            <div className="flex items-center gap-4">
              <h1 className="hidden sm:block text-xl font-semibold text-gray-700">Marketplace</h1>
              <button
                onClick={() => navigate('/user')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"
              >
                <User size={18} />
                <span className="hidden md:inline">Your Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-5 rounded-xl shadow-lg border sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <LayoutGrid size={20} className="text-blue-600" />
                Categories
              </h3>
              <ul className="space-y-2">
                {categories.map((cat, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => setCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        category === cat
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content: Filters + Product Grid */}
          <div className="lg:col-span-3">
            {/* Advanced Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-lg border mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
                <div className="relative md:col-span-2 lg:col-span-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for cycles, books, electronics..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="relative">
                   <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                   <select
                    value={condition}
                    onChange={e => setCondition(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {conditions.map((cond, idx) => (
                      <option key={idx} value={cond}>{cond === 'All' ? 'All Conditions' : cond}</option>
                    ))}
                  </select>
                </div>
                 <div className="text-sm text-gray-600 text-center lg:text-right">
                    <strong>{filtered.length}</strong> {filtered.length === 1 ? 'item' : 'items'} found
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 px-6 bg-white rounded-lg border shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800">No Items Found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filter settings to find what you're looking for.</p>
              </div>
            ) : (
              // --- THIS IS THE UPDATED PRODUCT GRID ---
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filtered.map(item => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AllProducts;
