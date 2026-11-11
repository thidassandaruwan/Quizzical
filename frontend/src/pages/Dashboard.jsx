import Header from "../components/Header";

function Dashboard({user, setUser}){
    return(
        <>
             <Header user={user} setUser={setUser}/>
            <main>
                <h1>{`Welcome to Dashboard ${user.username}`}</h1>
            </main>
        </>
    )
}

export default Dashboard;