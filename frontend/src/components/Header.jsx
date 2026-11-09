import quizLogo from "../assets/quiz-logo.png"
import profileImage from "../assets/profileImage.png"

function Header({user}){
    return(
        <header className="header" >
            <div className="header-logo">
                <img src={quizLogo} className="logo-img"/>
                <span className="logo-text"> Quizzical </span>
            </div>
            <div className="profile-container">
                <span className="profile-user-name" aria-label={`logged in user name ${user.name}`}>{user.name}</span>
                <img src={profileImage} alt="profile image" />
            </div>
        </header>
    )
}

export default Header;