import express from "express";
import { checkAnswers, getQuizes } from "../controllers/quizControllers.js"

const quizRouter = express.Router();

quizRouter.get("/:category/:difficulty/:ammount", getQuizes)
quizRouter.post("/submit", checkAnswers)

export default quizRouter;