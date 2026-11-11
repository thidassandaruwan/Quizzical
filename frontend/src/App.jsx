import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"
import { useEffect, useState } from "react";

import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage"
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage"
import Dashboard from "./pages/Dashboard";
import AccountPage from "./pages/AccountPage";


function App(){
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    async function getUserData() {
      try{
        const response = await fetch("/api/user/me", {
          credentials: "include",
        });
        const responseData = await response.json();

        if (response.ok){
          setUser(responseData)
        }
      }
      catch(error){
        console.error(error)
      }
      finally{
        setIsLoading(false)
      }
    }

    getUserData()
  }, [])

  if (isLoading){
    return <main className="main-loading">Loading Quizzical...</main>
  }

  // user controlling functions
  function updateUser(newUser){
    const {username, email} = newUser;
    if (!(username && email)){
      return;
    }

    setUser(newUser)
  }

  function removeUser(){
    setUser(null)
  }

  // quizzdata controlling functions
  function updateQuizData(newQuizzes){
    setQuizData(newQuizzes);
  }

  function removeQuizData(){
    setQuizData(null)
  }

  function selectQuizAnswer(id, answer){
    if (id === undefined || id === null || !answer){
      return;
    }

    setQuizData(prevQuizes => prevQuizes.map(quiz => {
      console.log(quiz.id, id)
      console.log(quiz.id === id)

      return quiz.id === id ? {...quiz, selectedAnswer : answer} : quiz
    }))
  }

  function markQuizzes(answers){
    setQuizData(prevquizzes => prevquizzes.map(quiz => {
      return {
        ...quiz, 
        isSelectionCorrect : quiz.selectedAnswer?.toLowerCase() === answers[quiz.id].toLowerCase()
      }
    }))
  }

  return(
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={<LoginPage updateUser={updateUser}/>}
        />

        <Route 
          path="/register"
          element={<RegistrationPage updateUser={updateUser}/>} 
        />  

        <Route 
          path="/"
          element={user? <HomePage updateQuizData={updateQuizData} user={user} removeUser={removeUser}/> : <Navigate to="/login" replace/> }
        />

        <Route 
          path="/takeQuiz"
          element={(user && quizData)? <QuizPage quizData={quizData} selectQuizAnswer={selectQuizAnswer} markQuizzes={markQuizzes} removeQuizzData={removeQuizData} user={user} removeUser={removeUser}/> : <Navigate to="/" replace/> }
        />

        <Route
          path="/dashboard"
          element={(user)? <Dashboard user={user} removeUser={removeUser}/> : <Navigate to="/login" replace/>}
        />

        <Route
          path="/account"
          element={(user)? <AccountPage user={user} setUser={updateUser} removeUser={removeUser}/> : <Navigate to="/login" replace/>}
        />

      </Routes>
      <Toaster/>
    </BrowserRouter>
  )
}

export default App;