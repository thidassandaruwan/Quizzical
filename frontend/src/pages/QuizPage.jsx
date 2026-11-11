import { useState } from "react";
import Header from "../components/Header";

function QuizPage({user, quizData, updateQuizzData, removeQuizzData}){
    const [quizAnswers, setQuizAnswers] = useState([]);
    const isRoundOver = quizAnswers.length === quizData.length;

    function addAnswer(answer){
        /*
            expects {id : , selectedValue : }
        */

        const {id, selectedValue} = answer;
        if (!(id && selectedValue)){
            return;
        } 

        
    }

    return (
        <>
            <Header user={user}/>
            <main className="quizpage">
                {
                    quizData.map(quiz => {
                        return (
                            <>
                                <p>{quiz.category}</p>
                                <p>{quiz.question}</p>
                                <p>{quiz.options}</p>
                            </>
                        )
                    })
                }
            </main>
        </>
    )
}

export default QuizPage;
