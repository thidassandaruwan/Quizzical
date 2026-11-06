import express from "express";
import { getUserStats } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("/stats", getUserStats);

export default userRouter;