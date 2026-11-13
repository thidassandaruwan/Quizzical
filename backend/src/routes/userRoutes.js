import express from "express";
import { authenticateUser, deleteUser, getMe, getUserStats, updateUser } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("/me", getMe);
userRouter.get("/stats", getUserStats);
userRouter.post("/authenticate", authenticateUser);
userRouter.put("/update", updateUser);
userRouter.delete("/delete", deleteUser);


export default userRouter;