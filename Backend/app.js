import express from "express";
import cors from "cors"


const app = express();
app.use(
    cors({
      origin: 'http://localhost:5173', // your frontend origin
      credentials: true, // ✅ allow cookies
    })
  );



app.use(express.json({limit: "16kb"}))  


import userRouter from "./src/routes/user.routes.js";
app.use("/api/v1/users", userRouter);


export  { app };

