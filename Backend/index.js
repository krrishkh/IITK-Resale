import connectDB from './src/db/index.js';
import dotenv from "dotenv"
import { app } from "./app.js";

import http from "http"; 
import { initializeSocket } from './src/socket.js'; 

dotenv.config({
    path:'./env'
})


const server = http.createServer(app);
initializeSocket(server);

connectDB()
.then(()=>{
    server.listen(process.env.PORT, () => {
        console.log(`🚀 Server running on port ${process.env.PORT}`);
    })

})
.catch((error) => {
    console.log("Error ", error)
})