function Quiz({quiz, selectQuizAnswer, isRoundOver, correctAnswer}){
    return(
        <div className="quiz-container">
            <h3 className="quiz-question">{quiz.question}</h3>
            <div className="option-container">
                {
                    quiz.options.map(option => {
                        let styleClasses = "quiz-option"
                        
                        // see if current option is selected
                        if (quiz.selectedAnswer === option){
                            styleClasses = "quiz-option option-selected"

                        }

                        // if correctAnswer prop isnt null (which means quizzes are marked), 
                        // if current option is correct, show it as the correct answer, 
                        // if not if the current answer is selected show the selected current option as incorrect
                        if (correctAnswer){
                            if (option === correctAnswer) {
                                styleClasses = "quiz-option option-correct";   
                            }
                            // if an option is selected and it's not the correct answer
                            else if (quiz.selectedAnswer === option){
                                styleClasses = "quiz-option option-incorrect";
                            }
                        }
                            
                        return (
                            <button key={option}
                                type="button"
                                className={styleClasses}
                                onClick={() => selectQuizAnswer(quiz.id, option)}
                                disabled={isRoundOver}
                            > {option} </button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Quiz;