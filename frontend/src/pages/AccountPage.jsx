import Header from "../components/Header";

function AccountPage({user, setUser}){
    return(
        <>
            <Header user={user} setUser={setUser}/>
            <main>
                <h1>{`Welcome to Account Page ${user.username}`}</h1>
            </main>
        </>
    )
}

export default AccountPage;