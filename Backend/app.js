import express from "express";
import cors from "cors"
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

app.use(helmet()); // Sets various security HTTP headers

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.use(
    cors({
      origin: process.env.CORS_ORIGIN, 
      credentials: true,
    })
  );



app.use(express.json({limit: "16kb"}))  


import userRouter from "./src/routes/user.routes.js";
app.use("/api/v1/users", userRouter);


export  { app };

