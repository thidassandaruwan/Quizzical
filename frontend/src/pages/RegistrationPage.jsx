import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

function RegistrationPage({updateUser}){
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    async function registerUser(e){
        e.preventDefault();
        setIsLoading(false)
        
        setIsLoading(true)
        try{
            const formData = new FormData(e.currentTarget)
            const dataObj = Object.fromEntries(formData.entries())

            const response = await fetch("/api/auth/register", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                credentials: 'include',
                body : JSON.stringify(dataObj)
            })

            const responseData = await response.json();
            
            if (!response.ok){
                toast.error(responseData.message || 'Registration failed')
                throw new Error(responseData.message || 'Registration failed')
            }

            toast.success(responseData.message)

            // set the user
            updateUser(responseData.userData)

            navigate("/")
        }
        catch(error){
            console.error("Error registering user", error)
        }
        finally{
            setIsLoading(false)
        }
    }   

    return (
        <main className="auth-page">
            <form className="input-form" onSubmit={e => registerUser(e)}>

                <div className="input-field">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Scoob"
                        pattern="[a-zA-Z0-9_\-]{1,20}"
                        required
                    />

                    <span className="instruction-text">
                        1–20 characters (letters, numbers, hyphens, underscores).
                    </span>
                </div>
                
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
                        pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}"
                        required
                    />

                    <span className="instruction-text">
                        Min. 8 characters with 1 uppercase, 1 lowercase, 1 digit, and 1 symbol.
                    </span>

                    <div className="show-pass-wrapper">
                        <input
                            className="password-show-hide-check"
                            id="password-show-hide-check"
                            type="checkbox"
                            onChange={(e) => setShowPassword(e.target.value)}
                        />
                        <label htmlFor="password-show-hide-check">Show password</label>
                    </div>
                </div>
                
                <button 
                    className="form-btn-primary" 
                    type="submit"
                    disabled={isLoading}
                >{isLoading ? "Creating..." : "Create Account"}</button>
            </form>

            <p className="auth-redirect-text">
                Already have an account?{" "}
                <Link to="/login" className="auth-redirect-link">
                    Log in
                </Link>
            </p>
        </main>
    )
}

export default RegistrationPage;