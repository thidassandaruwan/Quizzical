import { useState } from "react";
import Header from "../components/Header";
import Quiz from "../components/Quiz";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function QuizPage({user, quizData, selectQuizAnswer, markQuizzes, removeQuizzData}){
    const isAllAnswered = quizData.every(quiz => quiz.selectedAnswer !== null);
    const isRoudOver = quizData.every(quiz => quiz.isSelectionCorrect !== null);
    const [isLoading, setIsLoading] = useState(false);
    const totalQuestions = quizData.length;
    const correctAnswers = quizData.reduce((quiz, acc) => (quiz.isSelectionCorrect ? acc + 1 : acc), 0);
    const navigate = useNavigate();

    async function checkAnswers() {
        setIsLoading(true)
        try{
            // gather the selections into list [{quizId : value, selectedAnswer : value}]
            const userSelections = quizData.map(quiz => ({
                quizId : quiz.id, 
                selectedAnswer : quiz.selectedAnswer,
            }))

            // create a obj server expects {category: value , userAnswers : []}
            const quizSelectionData = {
                category : quizData.category,
                userAnswers : userSelections,
            }

            const response = await fetch("/api/quiz/submit", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                credentials: 'include',
                body : JSON.stringify(quizSelectionData)
            })

            if (!response.ok){
                throw new Error(response.message)
            }

            const {answers} = await response.json();

            // send the answers to app.jsx where the quizData will be updated
            markQuizzes(answers)
        }
        catch(error){
            toast.error("Error occured when checking answers!")
            console.error("Error occured when checking answers!", error)
        }
        finally{
            setIsLoading(false)
        }
    }

    function redirectToHome(){
        // remove current quizzdata from memory
        removeQuizzData();
        navigate("/")
    }

    return (
        <>
            <Header user={user}/>
            <main className="quizpage">
                {quizData.map(quiz => <Quiz key={quiz.id} quiz={quiz} selectQuizAnswer={selectQuizAnswer} isGameOver={isRoudOver}/>)}
                
                { (isAllAnswered && !isRoudOver) && 
                    <button
                        className="form-btn-primary"
                        id="check-answers-btn"
                        disabled={isLoading || isRoudOver}
                        onClick={checkAnswers}
                    >{isLoading? "Checking Answers...": "Check anwsers"}</button>
                }

                {
                    isRoudOver &&
                    <div className="quiz-over-container">
                        <span className="result-text">{`You scored ${correctAnswers}/${totalQuestions} correct answers`}</span>
                        <button
                            className="form-btn-primary"
                            id="check-answers-btn"
                            disabled={isLoading || isRoudOver}
                            onClick={redirectToHome}
                        >Home</button>
                    </div>
                }

            </main>
        </>
    )
}

export default QuizPage;
