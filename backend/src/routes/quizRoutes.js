import express from "express";
import { checkAnswers, getQuizzes } from "../controllers/quizControllers.js"

const quizRouter = express.Router();

quizRouter.get("/", getQuizzes)
quizRouter.post("/submit", checkAnswers)

export default quizRouter;