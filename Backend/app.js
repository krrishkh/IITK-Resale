import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";

dotenv.config()

const app = express();


connectDB();

const port = process.env.PORT;


app.get('/', (req, res) => {
    res.send("Hello Developer");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);

});