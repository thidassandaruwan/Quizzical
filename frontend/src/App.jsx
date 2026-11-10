import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"
import { useRef, useState } from "react";

import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage"
import HomePage from "./pages/HomePage";
import QuizPage from "./pages/QuizPage"


function App(){
  const [user, setUser] = useState(null);
  const [quizData, setQuizData] = useState(null)

  useRef(() => {
    async function getUserData() {
      try{
        const response = await fetch("/api/user/me");
        const responseData = await response.json();

        if (!response.ok){
          console.log(responseData.message)
        }

        setUser(responseData)
      }
      catch(error){
        console.error(error)
      }
    }

    getUserData()
  }, [])

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage setUser={setUser}/>}/>
        <Route path="/register" element={<RegistrationPage setUser={setUser}/>} />  

        <Route 
          path="/"
          element={user? <HomePage user={user} setQuizData={setQuizData} /> : <Navigate to="/login" replace/> }
        />

        <Route 
          path="/takeQuiz"
          element={quizData? <QuizPage user={user} quizData={quizData} /> : <Navigate to="/" replace/> }
        />


      </Routes>
      <Toaster/>
    </BrowserRouter>
  )
}

export default App;