import express from "express";
import { deleteUser, getMe, getUserStats } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("/me", getMe);
userRouter.get("/stats", getUserStats);
userRouter.delete("/delete", deleteUser)


export default userRouter;