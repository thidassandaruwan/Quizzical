import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connectDB } from "./config/db.js";

dotenv.config()

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

connectDB().then( () => {
    app.listen(PORT, () => {
        console.log(`Server started on PORT ${PORT}`);
    })
})