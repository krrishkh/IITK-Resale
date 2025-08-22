import React, { useEffect, useState } from "react";
import { LogOutIcon, CheckIcon, XIcon, PlusCircle, Store } from "lucide-react";
import axios from "axios";
import ProductCard from "../Item/productcard"; // Assuming this component is also styled
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("selling");
  const [sellingItems, setSellingItems] = useState([]);
  const [buyerRequests, setBuyerRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const API_BASE = "http://localhost:3000/api/v1/users";

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data in parallel for speed
        const [userRes, sellingRes, buyerRes, myRes] = await Promise.all([
          axios.get(`${API_BASE}/getUserDetails`, { withCredentials: true }),
          axios.get(`${API_BASE}/getMyItems`, { withCredentials: true }),
          axios.get(`${API_BASE}/seller-requests`, { withCredentials: true }),
          axios.get(`${API_BASE}/getMyRequests`, { withCredentials: true }),
        ]);

        setUser(userRes.data.user);
        setSellingItems(sellingRes.data.items || []);
        setBuyerRequests(buyerRes.data.requests || []);
        setMyRequests(myRes.data.requests || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard. Please try refreshing.");
        // If unauthorized, redirect to login
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
      await axios.post(`${API_BASE}/logout`, {}, { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleRequestAction = async (requestId, response) => {
    try {
      await axios.post(`${API_BASE}/respond`, { requestId, response }, { withCredentials: true });
      // Refresh buyer requests to show the updated status
      setBuyerRequests(prev =>
        prev.map(req =>
          req._id === requestId
            ? { ...req, status: response === "accepted" ? "accepted" : "rejected" }
            : req
        )
      );
    } catch (err) {
      console.error(`Failed to ${response} request:`, err);
    }
  };

  // --- UI Components ---

  // Helper component for colored status badges
  const StatusBadge = ({ status }) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

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

      case "buyerRequests":
        return buyerRequests.length > 0 ? (
          <div className="space-y-4">
            {buyerRequests.map(req => (
              <div key={req._id} className="bg-white p-5 rounded-lg shadow-md border transition hover:shadow-lg hover:border-blue-500">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Request for <strong className="text-gray-800">{req.item.itemName.replace(/"/g, "")}</strong></p>
                        <p className="font-semibold text-blue-600">From: {req.buyer.fullname}</p>
                        <p className="text-sm text-gray-600">Contact: {req.buyer.contact || 'Not provided'}</p>
                    </div>
                    <StatusBadge status={req.status} />
                </div>
                <p className="mt-4 text-gray-700 bg-gray-50 p-3 rounded-md border text-sm italic">"{req.message}"</p>
                {req.status === "pending" && (
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => handleRequestAction(req._id, "accepted")} className="flex items-center gap-1.5 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition"> <CheckIcon size={16}/> Accept </button>
                    <button onClick={() => handleRequestAction(req._id, "rejected")} className="flex items-center gap-1.5 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"> <XIcon size={16}/> Reject </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : emptyState("You have no pending or completed requests from buyers.");

      case "yourRequests":
        return myRequests.length > 0 ? (
          <div className="space-y-4">
            {myRequests.map(req => (
              <div key={req._id} className="bg-white p-5 rounded-lg shadow-md border">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-gray-500">Request for <strong className="text-gray-800">{req.item.itemName.replace(/"/g, "")}</strong></p>
                        <p className="font-semibold text-blue-600">To: {req.item.owner?.fullname || 'Unknown Seller'}</p>
                    </div>
                    <StatusBadge status={req.status} />
                </div>
                <p className="mt-4 text-gray-700 bg-gray-50 p-3 rounded-md border text-sm italic">Your message: "{req.message}"</p>
              </div>
            ))}
          </div>
        ) : emptyState("You haven't made any purchase requests yet. Go visit the store!");

      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Themed Welcome Header */}
        <header className="bg-white p-6 rounded-xl shadow-lg mb-8 border">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome, {user?.fullname || "User"}!</h1>
              <p className="text-gray-600 mt-1">Manage your listings and requests all in one place.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/add-item")} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition shadow-sm"> <PlusCircle size={18} /> Add Item </button>
              <button onClick={() => navigate("/all-items")} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-sm"> <Store size={18} /> Visit Store </button>
              <button onClick={handleLogout} className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"> <LogOutIcon size={18} /> Logout </button>
            </div>
          </div>
        </header>

        {/* Modern Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            {[
              { id: 'selling', name: "My Items for Sale" }, 
              { id: 'buyerRequests', name: "Requests from Buyers" }, 
              { id: 'yourRequests', name: "My Sent Requests" }
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

        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default UserDashboard;