import React, { useEffect, useState } from "react";
import { LogOutIcon, CheckIcon, XIcon } from "lucide-react";
import axios from "axios";
import ProductCard from "../Item/productcard";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const [activeTab, setActiveTab] = useState("selling");
  const [sellingItems, setSellingItems] = useState([]);
  const [buyerRequests, setBuyerRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [myRequests, setMyRequests] = useState([]);

  const navigate = useNavigate();

  const API_BASE = "http://localhost:3000/api/v1/users";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sellingRes, buyerRes, myRes] = await Promise.all([
          axios.get(`${API_BASE}/getMyItems`, { withCredentials: true }),
          axios.get(`${API_BASE}/seller-requests`, { withCredentials: true }),
          axios.get(`${API_BASE}/getMyRequests`, { withCredentials: true }),
        ]);
    
        const userRes = await axios.get(`${API_BASE}/getUserDetails`, { withCredentials: true });
        if (userRes.status !== 200) {
          throw new Error("Failed to fetch user details");
        }


        setUser(userRes.data.user);

        setSellingItems(Array.isArray(sellingRes.data) ? sellingRes.data : sellingRes.data.items || []);
        setBuyerRequests(Array.isArray(buyerRes.data) ? buyerRes.data : buyerRes.data.requests || []);
        setMyRequests(Array.isArray(myRes.data) ? myRes.data : myRes.data.requests || []);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/v1/users/logout", {}, {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleRequestAction = async (requestId, response) => {
    try {
      const res = await axios.post(
        `${API_BASE}/respond`,
        { requestId, response },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setBuyerRequests(prev =>
          prev.map(req =>
            req.id === requestId
              ? { ...req, status: response === "accept" ? "accepted" : "rejected" }
              : req
          )
        );
      }
    } catch (err) {
      console.error(`Failed to ${response} request ${requestId}:`, err);
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    if (error) return <p className="text-red-500">{error}</p>;

    switch (activeTab) {
      case "selling":
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sellingItems.map(item => (
              <ProductCard
                key={item._id}
                product={{
                  id: item._id,
                  name: item.itemName.replaceAll('"', ''),
                  price: item.price,
                  category: item.category.replaceAll('"', ''),
                  seller: item.owner?.fullname || "unknown",
                  postedDate: item.createdAt,
                  condition: item.condition,
                  imageUrl: item.images?.[0] || '',
                }}
              />
            ))}
          </div>
        );

      case "buyerRequests":

        return (
          <div className="space-y-4">
            {buyerRequests.map(request => (
              <div
                key={request._id}
                className="border p-4 rounded-lg bg-white shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">Buyer: {request.buyer.email}</p>
                  <p>Contact: {request.buyer.contact}</p>
                  <p>For: {request.item.itemName.replace(/"/g, "")}</p>
                  <p>Message: {request.message}</p>
                  <p>Status: <span className="capitalize">{request.status}</span></p>
                </div>
                {request.status === "pending" && (
                  <div className="flex gap-2">
                    <CheckIcon
                      className="text-green-600 cursor-pointer"
                      onClick={() => handleRequestAction(request._id, "accepted")}
                    />
                    <XIcon
                      className="text-red-600 cursor-pointer"
                      onClick={() => handleRequestAction(request._id, "rejected")}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "yourRequests":
        
          return (
            <div className="space-y-4">
              {myRequests.length === 0 ? (
                <p className="text-gray-500">You haven’t made any Buy requests yet.</p>
              ) : (
                myRequests.map(request => (
                  <div
                    key={request._id}
                    className="border p-4 rounded-lg bg-white shadow-sm"
                  >
                    <p className="font-semibold">To: {request.item.owner}</p>
                    <p>Item: {request.item.itemName.replace(/"/g, "")}</p>
                    <p>Price: ₹{request.item.price}</p>
                    <p>Your Message: {request.message}</p>
                    <p>Status: <span className="capitalize">{request.status}</span></p>
                  </div>
                ))
              )}
            </div>
          )
        
      default:
        return null
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Welcome Back {user?.fullname || "User"}</h1>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/add-item")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            + Add Item
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
          >
            <LogOutIcon size={16} className="mr-1" /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["selling", "buyerRequests", "yourRequests"].map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {{
                selling: "Items You're Selling",
                buyerRequests: "Requests from Buyers",
                yourRequests: "Your Requests"
              }[tab]}
            </button>
        ))}

      </div>

      {/* Tab Content */}
      <div>{renderTabContent()}</div>
    </div>
  );
}

export default UserDashboard;
