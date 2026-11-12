import Header from "../components/Header";

function Dashboard({user, removeUser}){
    
    return(
        <>
             <Header user={user} removeUser={removeUser}/>
            <main>
                <h1>{`Welcome to Dashboard ${user.username}`}</h1>
            </main>
        </>
    )
}

export default Dashboard;