import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react"
import toast from "react-hot-toast"

function HomePage({user, updateQuizData, removeUser}){
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    
        async function startQuiz(e) {
            e.preventDefault();
            setIsLoading(true)
            try{
                const formData = new FormData(e.currentTarget)
                const dataObj = Object.fromEntries(formData.entries())

                const response = await fetch(`/api/quiz?amount=${dataObj.amount}&category=${dataObj.category}&difficulty=${dataObj.difficulty}`)

                if (!response.ok){
                    toast.error(response.message);
                    throw new Error(response.message);
                }

                const quizData = await response.json();

                navigate("/takeQuiz")

                setQuizData(quizData);
            }
            catch(error){
                console.error("Error starting quizz", error)
            }
            finally{
                setIsLoading(false)
            }
        }

    return (
        <>
            <Header user={user} removeUser={removeUser}/>
            <main className="homepage">
                <h1 className="title"> Select Quiz Options From Below To Start the Quiz! </h1>
                <form className="input-form" onSubmit={e => startQuiz(e)}>
                    <div className="input-field">
                        <label htmlFor="category"> Category </label>
                        <select id="category" name="category" className="select-input" defaultValue="" required>
                            <option value="" disabled>---Please select an option---</option>
                            <option value="computers"> Computers </option>
                            <option value="videoGames"> Vide Games </option>
                            <option value="geography"> Geography </option>
                            <option value="comics"> Comics </option>
                            <option value="gadgets"> Gadgets </option>
                        </select>
                    </div>
                    
                    <div className="input-field">
                        <label htmlFor="amount"> How many questions? </label>
                        <select id="amount"  name="amount" className="select-input" required>
                            <option value={5}>5 questions</option>
                            <option value={10}>10 questions</option>
                            <option value={15}>15 questions</option>
                        </select>
                    </div>

                    <div className="input-field">
                        <label htmlFor="difficulty"> Difficulty </label>
                        <select id="difficulty" name="difficulty" className="select-input" required>
                            <option value="easy"> Easy </option>
                            <option value="medium"> Medium </option>
                            <option value="hard"> Hard </option>
                        </select>
                    </div>

                    <button
                        id="start-quiz-btn"
                        className="form-btn-primary"
                        disabled={isLoading}
                    > {isLoading ? "Loading" : "Start Quiz"} </button>
                </form>
            </main>
            
        </>
    )
}

export default HomePage;