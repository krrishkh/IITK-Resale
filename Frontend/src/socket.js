import { io } from "socket.io-client";

// Connect to your backend server
const socket = io("http://localhost:3000", {
    withCredentials: true, // This is crucial for sending cookies for authentication
});

export default socket;