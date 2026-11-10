import { decode } from 'html-entities';
import { shuffleArray } from '../utils/shuffleArray.js';
import Mark from "../model/Mark.js";

export async function getQuizes(req, res) {
    try{
        // expecting url "/api/quiz?amount={}&category={}&difficulty={}"
        const categoryKey = {
            computers : 18,
            videoGames : 15,
            geography : 22,
            vehicles : 28, 
            comics : 29,
            gadgets : 30
        }
        const validDifficulty = ["easy", "medium", "hard"];

        let {amount, category, difficulty} = req.query;

        // check if ammount is number and conver it to Number
        if (Number.isNaN(amount)){
            return res.status(400).json({message : "Valid amount(> 5), category, and difficulty are required parameters."})
        }
        
        amount = Number(amount);
        

        // if ammoint is not a number or less than 5, if category, diffuculty are not valid values
        if (
            ( amount < 5) || 
            !Object.keys(categoryKey).includes(category) || 
            !validDifficulty.includes(difficulty)
        ){
            return res.status(400).json({message : "Valid amount(> 5), category, and difficulty are required parameters."})
        }
        
        // https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple
        const API_URL = `https://opentdb.com/api.php?amount=${amount}&category=${categoryKey[category]}&difficulty=${difficulty}&type=multiple`;

        const response = await fetch(API_URL)

        if (!response.ok){
            throw new Error("Error getting quiz data")
        }

        const responseData = await response.json();
        const quizData = responseData.results;

        // format the quiz data 
        const formatedQuizzData = quizData.map((quiz, index) => {
            const decodedCorrect = decode(quiz["correct_answer"]);
            const decodedIncorrect = quiz["incorrect_answers"].map(answer => decode(answer));

            // randomise the answer order otherwise the correct answer be always be at begining
            const answerOptions = shuffleArray([decodedCorrect, ...decodedIncorrect])

            return {
                id : index,
                category : category,
                question : decode(quiz.question),
                selectedAnswer : null,
                correctAnswer : decodedCorrect,
                options : answerOptions
            }
        })

        // storing the current quiz data in session for checking answers one object where each key is the id of the quiz and value for each key is the answer for the quiz
        req.session.currentQuiz = formatedQuizzData.reduce((acc, quiz) => {
            acc[quiz.id] = quiz.correctAnswer;
            return acc;
        }, {});

        // removing the answer forom the quizzdata before sending to client
        const clientQuizData = formatedQuizzData.map(({correctAnswer, ...rest}) => rest);

        res.status(200).json(clientQuizData)
    }
    catch(error){
        console.log("An error occured when getting quizes", error);
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
}

export async function checkAnswers(req, res) {
    /*
        expects {
            category : string,
            userAnswers : [
                {quizId : value , selectedAnswer : value}
            ]
        }
    */
    try{
        const {category, userAnswers} = req.body;
        if (!category || !Array.isArray(userAnswers)){
            return res.status(400).json({message : "Invalid data submission"})
        }

        const currentQuiz = req.session.currentQuiz;
        if (!currentQuiz){
            return res.status(400).json({message : "No quiz session detected!"})
        }

        const totalQuestions = userAnswers.length;
        let correctAnswerCount = 0;
        
        const results = userAnswers.map( answer => {
            const correctAnswer = currentQuiz[answer.id];
            const isCorrect = correctAnswer === answer.selectedAnswer

            if (isCorrect){
                correctAnswerCount++;
            }

            return {
                id : answer.id,
                selectedAnswer : answer.selectedAnswer,
                correctAnswer,
                isCorrect
            }
        })

        // generating the updating mark fields according to the cagegory
        const correctField = `${category}.correct`;
        const allQuizField = `${category}.allQuizzes`

        // updating the mark
        await Mark.findOneAndUpdate(
            // condidtion
            {userId : req.session.userId},
            // increment values
            {
                $inc : {
                    [correctField] : correctAnswerCount,
                    [allQuizField] : totalQuestions,
                },
            },
            // update document if exist else create new one
            { upsert: true }
        )

        // remove the saved quiz from session memory
        delete req.session.currentQuiz;

        res.status(200).json({
            category,
            correctAnswerCount,
            totalQuestions,
            results
        })
    }
    catch(error){
        console.log("An error occured when checking answers", error);
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
}
