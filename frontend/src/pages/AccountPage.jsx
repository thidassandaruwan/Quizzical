import { useState } from "react";
import Header from "../components/Header";
import toast from "react-hot-toast";

function AccountPage({user, removeUser, updateUser}){
    const [isLoading, setIsLoading] = useState(false);

    async function handleAccountUpdate(e) {
        e.preventDefault();
        setIsLoading(true)
        try{
            const formData = new FormData(e.currentTarget)
            const dataObj = Object.fromEntries(formData.entries())

            console.log(dataObj)

            // updateUser(userData)
        }
        catch(error){
            toast.error("Error updating account details")
            console.error("Error updating account details", error)
        }
        finally{
            setIsLoading(false)
        }
        
    }


    return(
        <>
            <Header user={user} removeUser={removeUser}/>
            <main>
                <form className="input-form" onSubmit={e => handleAccountUpdate(e)}>

                    <div className="input-field">
                        <label htmlFor="username" className="acc-update-username-label">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Scoob"
                            value={user.username}
                            readOnly
                        />
                    </div>
                    
                    <div className="input-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="example@mail.com"
                            defaultValue={user.email}
                            required
                        />
                    </div>

                    <div className="input-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="text"
                            placeholder="Keep blank if do not want to update"
                        />
                        <span className="instruction-text">
                            Min. 8 characters with 1 uppercase, 1 lowercase, 1 digit, and 1 symbol.
                        </span>
                    </div>
                    
                    <button 
                        className="form-btn-primary acc-update-btn" 
                        type="submit"
                        disabled={isLoading}
                    >{isLoading ? "Updating..." : "Update"}</button>
                </form>

                <button 
                    className="form-btn-primary acc-delete-btn"
                > Delete Account </button>
            </main>
        </>
    )
}

export default AccountPage;