import { BrowserRouter, Routes, Route, Navigate, replace } from "react-router-dom";
import { Toaster } from "react-hot-toast"

import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage"
import { useRef, useState } from "react";
import HomePage from "./pages/HomePage";

function App(){
  const [user, setUser] = useState(null);

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
          element={user? <HomePage user={user}/> : <Navigate to="/login" replace/> }
        />
      </Routes>
      <Toaster/>
    </BrowserRouter>
  )
}

export default App;