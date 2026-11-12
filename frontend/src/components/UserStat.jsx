function UserStat({category, mark}){
    return(
        <div className="stat">
            <h1 className="stat-category">{category}</h1>
            {/* in html 5 if both value and max is 0 (is player hasn't played in our case) the progress bar will be full, therefore passing in value 1 if mark.allquizzes is 0 */}
            <progress className="stat-progress-bar" value={mark.correct} max={mark.allQuizzes || 1}/>
            <p className="stat-text">{`${mark.correct} / ${mark.allQuizzes}`}</p>
        </div>
    )
}

export default UserStat;