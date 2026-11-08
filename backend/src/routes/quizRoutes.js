import express from "express";
import { checkAnswers, getQuizes } from "../controllers/quizControllers.js"

const quizRouter = express.Router();

quizRouter.get("/", getQuizes)
quizRouter.post("/submit", checkAnswers)

export default quizRouter;