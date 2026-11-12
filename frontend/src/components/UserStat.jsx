function UserStat({category, mark}){
    return(
        <>
            <h1>{category}</h1>
            <p>{mark.correct}</p>
            <p>{mark.allQuizzes}</p>
        </>
    )
}

export default UserStat;