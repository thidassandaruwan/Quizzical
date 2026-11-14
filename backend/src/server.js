import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import path from "path";

import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import { checkUserAuthentication } from "./middleware/checkUserAuthentication.js";
import userRouter from "./routes/userRoutes.js";
import quizRouter from "./routes/quizRoutes.js";

dotenv.config()

const app = express();
const PORT = process.env.PORT;

// configure the cors only if the app in in production configuration 
if (process.env.NODE_ENV !== "production"){
    app.use(cors({
        origin : "http://localhost:5173",
        credentials: true,
    }))
}

app.use(express.json());

app.use(session({
    secret : process.env.WEB_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        httpOnly : true,
        secure : false,
        sameSite : "lax"
    }
}))

// routes
app.use("/api/auth", authRouter);

// protected routes
app.use("/api/user", checkUserAuthentication, userRouter);
app.use("/api/quiz", checkUserAuthentication, quizRouter);

// invalid endpoints api endpoints
app.use("/api", (req, res) => {
    res.status(404).json({ message : `Cannot ${req.method} ${req.originalUrl}`});
})

if (process.env.NODE_ENV === "production"){
    const frontendDistPath = path.join(import.meta.dirname, "../../frontend/dist");
    
    // server assets requets
    app.use(express.static(frontendDistPath));
    
    // when user visits frontend urls, this serves the react entry file index.html which then serves main.jsx then App.jsx which then navigate user for correct page with the react-router
    app.use((req, res) => {
        res.sendFile(path.join(frontendDistPath, "index.html"))
    })
}

// all invalid urls
app.use((req, res) => {
    res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

connectDB().then( () => {
    app.listen(PORT, () => {
        console.log(`Server started on PORT ${PORT}`);
    })
})