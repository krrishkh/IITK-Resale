import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import socket from '../../socket';
import { Send, ArrowLeft } from 'lucide-react';
import Avatar from '../Chat/avatar'; 

function ChatPage() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    
    // State Management
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatInfo, setChatInfo] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        withCredentials: true,
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch initial chat data, messages, and user info
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [chatDetailsRes, messagesRes, userRes] = await Promise.all([
                    api.get(`/chats/${chatId}`),
                    api.get(`/chats/${chatId}/messages`),
                    api.get('/getUserDetails')
                ]);
                setChatInfo(chatDetailsRes.data.data);
                setMessages(messagesRes.data.data || []);
                setCurrentUser(userRes.data.user);
            } catch (err) {
                console.error("Failed to fetch chat data:", err);
                if (err.response?.status === 404 || err.response?.status === 401) {
                    navigate('/user');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [chatId, navigate]);

    // Set up Socket.IO listeners
    useEffect(() => {
        socket.emit("joinRoom", chatId);

        const handleReceiveMessage = (message) => {
            setMessages(prev => prev.find(m => m._id === message._id) ? prev : [...prev, message]);
            setIsOtherUserTyping(false);
        };

        const handleUserTyping = () => setIsOtherUserTyping(true);
        const handleUserStoppedTyping = () => setIsOtherUserTyping(false);

        socket.on("receiveMessage", handleReceiveMessage);
        socket.on("userTyping", handleUserTyping);
        socket.on("userStoppedTyping", handleUserStoppedTyping);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
            socket.off("userTyping", handleUserTyping);
            socket.off("userStoppedTyping", handleUserStoppedTyping);
        };
    }, [chatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOtherUserTyping]);

    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
        if (!socket.connected) return;
        socket.emit("typing", { chatId, userId: currentUser._id });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", { chatId });
        }, 1500);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        socket.emit("stopTyping", { chatId });

        const messageData = {
            content: newMessage,
            sender: { _id: currentUser._id, fullname: currentUser.fullname },
        };
        
        socket.emit("sendMessage", { chatId, message: messageData });

        setMessages(prev => [...prev, {
            ...messageData,
            _id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        }]);

        setNewMessage('');
    };
    
    const otherParticipant = chatInfo?.participants.find(p => p._id !== currentUser?._id);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-100">
            {/* Chat Header */}
            <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-10 border-b">
                <div className="max-w-4xl mx-auto p-4 flex items-center">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    {/* ⬇️ ADD AVATAR TO HEADER ⬇️ */}
                    <div className="ml-3">
                        <Avatar name={otherParticipant?.fullname} />
                    </div>
                    <div className="ml-3">
                        <h1 className="font-bold text-gray-800">{otherParticipant?.fullname || 'Conversation'}</h1>
                        <p className="text-xs text-gray-500">Regarding: {chatInfo?.item.itemName || 'Item'}</p>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <main className="flex-grow overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((msg) => {
                        const isSentByCurrentUser = msg.sender._id === currentUser._id;
                        return (
                            // ⬇️ UPDATE MESSAGE LAYOUT TO INCLUDE AVATAR ⬇️
                            <div key={msg._id} className={`flex items-end gap-3 ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                {!isSentByCurrentUser && <Avatar name={msg.sender.fullname} />}
                                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isSentByCurrentUser ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-white text-gray-800 border rounded-bl-lg'}`}>
                                    <p className="text-sm break-words">{msg.content}</p>
                                    <p className={`text-xs mt-1 text-right ${isSentByCurrentUser ? 'text-blue-200' : 'text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                {isSentByCurrentUser && <Avatar name={currentUser.fullname} />}
                            </div>
                        );
                    })}
                    
                    {isOtherUserTyping && (
                        <div className="flex items-end gap-3 justify-start">
                            <Avatar name={otherParticipant?.fullname} />
                            <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-white text-gray-500 border rounded-bl-lg">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Message Input Form */}
            <footer className="bg-white/80 backdrop-blur-lg sticky bottom-0 border-t">
                <div className="max-w-4xl mx-auto p-4">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            placeholder="Type your message..."
                        />
                        <button type="submit" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors shadow-md disabled:bg-blue-400" disabled={!newMessage.trim()}>
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </footer>
        </div>
    );
}

export default ChatPage;
