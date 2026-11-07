import {decode} from 'html-entities';

export async function getQuizes(req, res) {
    try{
        // https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple
        const categoryKey = {
            computers : 18,
            videoGames : 15,
            geography : 22,
            vehicles : 28, 
            comics : 29,
            gadgets : 30
        }
        const validDifficulty = ["easy", "medium", "hard"];

        const {amount, category, difficulty} = req.query;

        console.log(amount, category, difficulty)

        // if ammoint is not a number or less than 5, if category, diffuculty are not valid values
        if (
            (Number.isNaN(amount) && Number(amount) < 5) || 
            !Object.keys(categoryKey).includes(category) || 
            !validDifficulty.includes(difficulty)
        ){
            return res.status(400).json({message : "Valid amount(> 5), category, and difficulty are required parameters."})
        }
        
        const API_URL = `https://opentdb.com/api.php?amount=${amount}&category=${categoryKey[category]}&difficulty=${difficulty}&type=multiple`;

        const response = await fetch(API_URL)

        if (!response.ok){
            throw new Error("Error getting quizz data")
        }

        const responseData = await response.json();
        const quizzData = responseData.results;

        const formatedQuizzData = quizzData.map((quizz, index) => {
            return {
                id : index,
                category : category,
                question : decode(quizz.question),
                correctAnswer : decode(quizz["correct_answer"]),
                options : [
                    decode(quizz["correct_answer"]),
                    ...quizz["incorrect_answers"].map(answer => decode(answer))
                ]
            }
        })

        res.status(200).json(quizzData)
    }
    catch(error){
        console.log("An error occured when getting quizes", error);
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
}

export async function checkAnswers(req, res) {
    try{

    }
    catch(error){
        console.log("An error occured when checking answers", error);
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
}
