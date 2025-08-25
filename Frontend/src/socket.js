import { io } from "socket.io-client";

// Get the backend URL from the environment variable
const URL = import.meta.env.VITE_SOCKET_URL;

// Connect to your backend server using the variable
const socket = io(URL, {
    withCredentials: true, // This is crucial for sending cookies for authentication
});

export default socket;
