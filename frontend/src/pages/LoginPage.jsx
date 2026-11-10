import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function LoginPage({setUser}){
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    async function loginUser(e){
        e.preventDefault();

        setIsLoading(true)
        try{
            const formData = new FormData(e.currentTarget)
            const dataObj = Object.fromEntries(formData.entries())

            const response = await fetch("/api/auth/login", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                credentials: 'include',
                body : JSON.stringify(dataObj)
            })

            const responseData = await response.json();

            if (!response.ok){
                toast.error(responseData.message)
                throw new Error(responseData.message || 'Login failed')
            }

            toast.success(responseData.message)

            // set the user
            setUser(responseData.userData)

            navigate("/")
        }
        catch(error){
            console.log("Error loging in user", error)
        }
        finally{
            setIsLoading(false)
        }
    }

    return (
        <main className="auth-page">
            <form className="input-form" onSubmit={e =>  loginUser(e)}>
                <div className="input-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@mail.com"
                        required
                    />
                </div>

                <div className="input-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
                        required
                    />

                    <div className="show-pass-wrapper">
                        <input
                            className="password-show-hide-check"
                            id="password-show-hide-check"
                            type="checkbox" onChange={(e) => setShowPassword(e.target.checked)}
                        />
                        <label htmlFor="password-show-hide-check">Show password</label>
                    </div>
                </div>
                
                <button 
                    className="form-btn-primary" 
                    type="submit"
                    disabled={isLoading}
                >{isLoading ? "Loggin in..." : "Login"}</button>
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