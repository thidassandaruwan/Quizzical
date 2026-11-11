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

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage setUser={setUser}/>}/>
        <Route path="/register" element={<RegistrationPage setUser={setUser}/>} />  

        <Route 
          path="/"
          element={user? <HomePage user={user} setQuizData={setQuizData} setUser={setUser}/> : <Navigate to="/login" replace/> }
        />

        <Route 
          path="/takeQuiz"
          element={(user && quizData)? <QuizPage user={user} quizData={quizData} setUser={setUser}/> : <Navigate to="/" replace/> }
        />

        <Route
          path="dashboard"
          element={(user)? <Dashboard user={user} setUser={setUser}/> : <Navigate to="/login" replace/>}
        />

        <Route
          path="account"
          element={(user)? <AccountPage user={user} setUser={setUser}/> : <Navigate to="/login" replace/>}
        />

      </Routes>
      <Toaster/>
    </BrowserRouter>
  )
}

export default App;