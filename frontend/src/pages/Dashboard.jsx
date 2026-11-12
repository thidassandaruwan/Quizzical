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
            <main className="dashboard-page">
                <h1 className="dashboard-title">{`Welcome to Dashboard, ${user.username}`}</h1>
                <p className="dashboard-description">Here's how many questions you answered correctly for each category</p>
                <section className="stats-section">
                    {
                        Object.keys(userMarks).map(category => <UserStat key={category} category={category} mark={userMarks[category]}/>)
                    }
                </section>
            </main>
        </>
    )
}

export default Dashboard;