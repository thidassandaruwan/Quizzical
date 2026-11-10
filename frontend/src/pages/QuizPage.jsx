import Header from "../components/Header";

function QuizPage({user, quizData}){
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
