import express from "express";
import { deleteUser, getCurrentUser, login, logout, register } from "../controllers/authControllers.js"

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/logout", logout);
authRouter.get("/me", getCurrentUser);
authRouter.delete("/user/:id", deleteUser);

export default authRouter;