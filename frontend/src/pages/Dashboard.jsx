import { useEffect, useState } from "react";
import Header from "../components/Header";
import toast from "react-hot-toast";
import UserStat from "../components/UserStat";

function Dashboard({user, removeUser}){
    const [isLoading, setIsLoading] = useState(true);
    const [userMarks, setUserMarks] = useState([])
    
    useEffect(() => {
        async function getUserMarks() {
            try{
                const response = await fetch("/api/user/stats", {
                    credentials: "include",
                })

                const responseData = await response.json();

                if (!response.ok){
                    throw new Error(responseData.message)
                }

                console.log(responseData)

                setUserMarks(responseData);
            }
            catch(error){
                toast.error("Error Occured!");
                console.error("An error occured when loading user stats", error)
            }
            finally{
                setIsLoading(false);
            }
        }

        getUserMarks();        
    }, [])
        
    if (isLoading){
        return <main className="main-loading">Loading Quizzical...</main>
    } 

    return(
        <>
             <Header user={user} removeUser={removeUser}/>
            <main>
                <h1>{`Welcome to Dashboard ${user.username}`}</h1>
                {
                    Object.keys(userMarks).map(category => <UserStat key={category} category={category} mark={userMarks[category]}/>)
                }
            </main>
        </>
    )
}

export default Dashboard;