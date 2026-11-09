import { useState } from "react"
import { Link } from "react-router-dom"

function RegistrationPage(){
    const [showPassword, setShowPassword] = useState(false);

    return (
        <main className="auth-page">
            <form className="auth-form">

                <div className="input-field">
                    <label htmlFor="username">Username</label>
                    <input
                        className="username"
                        name="username"
                        type="text"
                        placeholder="Scoob"
                        required
                    />

                    <span className="instruction-text">
                        1–20 characters (letters, numbers, hyphens, underscores).
                    </span>
                </div>
                
                <div className="input-field">
                    <label htmlFor="email">Email</label>
                    <input
                        className="email"
                        name="email"
                        type="email"
                        placeholder="example@mail.com"
                        required
                    />
                </div>

                <div className="input-field">
                    <label htmlFor="password">Password</label>
                    <input
                        className="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
                        required
                    />

                    <span className="instruction-text">
                        Min. 8 characters with 1 uppercase, 1 lowercase, 1 digit, and 1 symbol.
                    </span>

                    <div className="show-pass-wrapper">
                        <input
                            className="password-show-hide-check"
                            type="checkbox" onChange={(e) => setShowPassword(e.target.checked)}
                        />
                        <label htmlFor="password-show-hide-check">Show password</label>
                    </div>
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