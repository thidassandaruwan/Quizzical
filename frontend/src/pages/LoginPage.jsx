import { useState } from "react";
import { Link } from "react-router-dom";

function LoginPage(){
    const [showPassword, setShowPassword] = useState(false)
    const [logginIn, setLogginIn] = useState(false)

    async function handleFormSubmission(e){
        e.preventDefault();

        setLogginIn(true)
        try{
            const formData = new FormData(e.currentTarget)
            const dataObj = Object.fromEntries(formData.entries())

            const response = await fetch("/auth/login", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(dataObj)
            })

            const responseData = await response.json();
            
            if (!response.ok){
                alert(responseData.message);
            }

            alert(response.message)
        }
        catch(error){
            console.log(error)
            alert("error loggin in");
        }
        finally{
            setLogginIn(false)
        }
    }

    return (
        <main className="auth-page">
            <form className="auth-form" onSubmit={e =>  handleFormSubmission(e)}>
                <label htmlFor="email">Email</label>
                <input 
                    className="email"
                    name="email"
                    type="email" 
                    placeholder="example@mail.com" 
                    required
                />

                <label htmlFor="password">Password</label>
                <input 
                    className="password"
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="password" 
                    required
                />

                <div className="show-pass-wrapper">
                    <input
                        className="password-show-hide-check"
                        type="checkbox" onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    <label htmlFor="password-show-hide-check">Show password</label>
                </div>
                
                <button 
                    className="auth-btn-primary" 
                    type="submit"
                    disabled={logginIn}
                >Login</button>
            </form>

            <p className="auth-redirect-text">
                Don't have an account?{" "}
                <Link to="/register" className="auth-redirect-link">
                    Sign up
                </Link>
            </p>
        </main>
    )
}

export default LoginPage;