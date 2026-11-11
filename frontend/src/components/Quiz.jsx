function Quiz({quiz, selectQuizAnswer, isRoundOver}){
    return(
        <div className="quiz-container">
            <h3 className="quiz-question">{quiz.question}</h3>
            <div className="option-container">
                {
                    quiz.options.map(option => {
                        let styleClasses = "quiz-option"
                        
                        // see if current option is selected
                        if (quiz.selectedAnswer){
                            if (quiz.selectedAnswer === option){
                                styleClasses = "quiz-option option-selected"
                            }

                            if (quiz.isSelectionCorrect === true){
                                styleClasses = "quiz-option option-correct"
                            }
                            else if (quiz.isSelectionCorrect === false){
                                styleClasses = "quiz-option option-incorrect"
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