import React, { useEffect, useState } from "react";
import { LogOutIcon, MessageSquare, PlusCircle, Store } from "lucide-react";
import axios from "axios";
import ProductCard from "../Item/ProductCard";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("selling");
  const [sellingItems, setSellingItems] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  
  // Define the axios instance for API calls
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  });

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user details, their items, and their chats in parallel
        const [userRes, sellingRes, chatsRes] = await Promise.all([
          api.get('/getUserDetails'),
          api.get('/getMyItems'),
          api.get('/my-chats')
        ]);

        setUser(userRes.data.user);
        setSellingItems(sellingRes.data.items || []);
        setChats(chatsRes.data.data || []);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard. Please try refreshing.");
        if (err.response?.status === 401) {
            navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // --- Action Handlers ---
  const handleLogout = async () => {
    try {
      await api.post('/logout');
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // --- UI Rendering ---
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>;
    }

    const emptyState = (message) => (
        <div className="text-center py-16 px-6 bg-white rounded-lg border shadow-sm">
            <p className="text-gray-500">{message}</p>
        </div>
    );
    
    switch (activeTab) {
      case "selling":
        return sellingItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sellingItems.map(item => ( <ProductCard key={item._id} product={item} /> ))}
          </div>
        ) : emptyState("You haven't listed any items for sale yet.");

      case "chats":
        return chats.length > 0 ? (
            <div className="space-y-3">
                {chats.map(chat => {
                    // Find the other participant in the chat
                    const otherParticipant = chat.participants.find(p => p._id !== user._id);
                    return (
                        <div 
                            key={chat._id} 
                            onClick={() => navigate(`/chat/${chat._id}`)}
                            className="bg-white p-4 rounded-lg shadow-md border flex justify-between items-center cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-500"
                        >
                            <div className="flex items-center gap-4">
                                <img src={chat.item.images[0] || 'https://placehold.co/64x64/E2E8F0/4A5568?text=Item'} alt={chat.item.itemName} className="w-16 h-16 object-cover rounded-md"/>
                                <div>
                                    <p className="font-bold text-gray-800">{chat.item.itemName}</p>
                                    <p className="text-sm text-gray-600">
                                        Chat with <span className="font-semibold text-blue-600">{otherParticipant?.fullname || 'User'}</span>
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400">
                                Last updated: {new Date(chat.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    );
                })}
            </div>
        ) : emptyState("You have no active conversations.");

      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <header className="bg-white p-6 rounded-xl shadow-lg mb-8 border">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.fullname || "User"}!</h1>
              <p className="text-gray-600 mt-1">Manage your listings and conversations here.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/add-item")} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow-sm"> <PlusCircle size={18} /> Add Item </button>
              <button onClick={() => navigate("/all-items")} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"> <Store size={18} /> Visit Store </button>
              <button onClick={handleLogout} className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"> <LogOutIcon size={18} /> Logout </button>
            </div>
          </div>
        </header>

        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            {[
              { id: 'selling', name: "My Items for Sale" }, 
              { id: 'chats', name: "My Chats" }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap pb-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              > {tab.name} </button>
            ))}
          </nav>
        </div>

        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default UserDashboard;
