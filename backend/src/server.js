import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";

import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import { checkUserAuthentication } from "./middleware/checkUserAuthentication.js";
import userRouter from "./routes/userRoutes.js";
import quizRouter from "./routes/quizRoutes.js";

dotenv.config()

const app = express();
const PORT = process.env.PORT;

app.use(cors())
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

// invalid endpoints
app.use((req, res) => {
    res.status(404).json({ message : `Cannot ${req.method} ${req.originalUrl}`});
})

connectDB().then( () => {
    app.listen(PORT, () => {
        console.log(`Server started on PORT ${PORT}`);
    })
})