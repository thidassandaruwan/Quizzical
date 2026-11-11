import quizLogo from "../assets/quiz-logo.png"
import profileImage from "../assets/profileImage.png"
import {Link, useNavigate} from "react-router-dom"
import toast from "react-hot-toast"
import { useState } from "react";

function Header({user, removeUser}){
    const navigate = useNavigate();
    const [optionsHidden, setOptionsHidden] = useState(true)

    async function handleLogout() {
        try{
            const response = await fetch("/api/auth/logout", {
                method :"POST",
                credentials : "include"
            })

            if (response.ok){
                navigate("/login")
                removeUser();
                toast("Logged Out!")
            }
        }
        catch(error){
            console.error("Logout failed", error)
            toast.error("Logout Failed!");
        }
    }

    return(
        <header className="header" >
            <Link className="header-logo-navlink" to={"/"}>
                <div className="header-logo">
                    <img src={quizLogo} className="logo-img"/>
                    <span className="logo-text"> Quizzical </span>
                </div>
            </Link>
            <div className="profile-container" onClick={() => setOptionsHidden(prev => !prev)}>
                <div className="profile-icon">
                    <span className="profile-user-name" aria-label={`logged in user name ${user.username}`}>{user.username}</span>
                    <img className="profile-img" src={profileImage} alt="profile image" />
                </div>

                <div 
                    className={optionsHidden ? "profile-options hidden" : "profile-options"}
                    onClick={(e) => e.stopPropagation()} // stops event bubbling up and causing the options to close
                >
                    <div className="user-profile-preview">
                        <img className="profile-preview-img" src={profileImage} alt="profile image" />
                        <span className="profile-preview-username">{user.username}</span>
                        <span className="profile-previwe-email">{user.email}</span>
                    </div>
                    <Link to="/dashboard" className="profile-option">Dashboard</Link>
                    <Link to="/account" className="profile-option">Account</Link>
                    <button
                        type="button"
                        className="profile-option-logout"
                        onClick={handleLogout}
                    >Logout</button>
                </div>
            </div>
        </header>
    )
}

export default Header;