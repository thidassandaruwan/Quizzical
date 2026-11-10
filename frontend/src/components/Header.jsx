import quizLogo from "../assets/quiz-logo.png"
import profileImage from "../assets/profileImage.png"
import {Link} from "react-router-dom"

function Header({user}){
    return(
        <header className="header" >
            <Link className="header-logo-navlink" to={"/"}>
                <div className="header-logo">
                    <img src={quizLogo} className="logo-img"/>
                    <span className="logo-text"> Quizzical </span>
                </div>
            </Link>
            <div className="profile-container">
                <span className="profile-user-name" aria-label={`logged in user name ${user.username}`}>{user.username}</span>
                <img className="profile-img" src={profileImage} alt="profile image" />
            </div>
        </header>
    )
}

export default Header;