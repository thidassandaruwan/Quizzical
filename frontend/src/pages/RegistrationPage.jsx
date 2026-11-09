import { useState } from "react"
import { Link } from "react-router-dom"

function RegistrationPage(){
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="auth-page">
            <form className="auth-form">
                <label htmlFor="username">Username</label>
                <input 
                    className="username"
                    name="username"
                    type="text" 
                    placeholder="Scoob" 
                    required
                />

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
                
                <button className="auth-btn-primary" type="submit">Register</button>
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