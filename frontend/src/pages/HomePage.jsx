import Header from "../components/Header";

function HomePage({user}){
    return (
        <>
            <Header user={user}/>
            <main>
                <h1>{`Welcome ${user.username}`}</h1>
            </main>
            
        </>
    )
}

export default HomePage