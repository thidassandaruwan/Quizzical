import { useState } from "react";
import Header from "../components/Header";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AccountPage({user, removeUser, updateUser}){
    const [isLoading, setIsLoading] = useState(false);
    const [showAccDeletePopUp, setShowAccDeletePopUp] = useState(false);
    const [passInput, setPassInput] = useState("");

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    const enableAccDeleteBtn = passwordPattern.test(passInput);

    const navigate = useNavigate();

    async function handleAccountUpdate(e) {
        e.preventDefault();
        setIsLoading(true)
        try{
            const formData = new FormData(e.currentTarget)
            const dataObj = Object.fromEntries(formData.entries())

            console.log(dataObj)

            const {email, password} = dataObj;
            const updateData = {email}

            if (password){
                updateData.password = password;
            }

            console.log(updateData)
            const response = await fetch("/api/user/update", {
                method : "PUT",
                headers : {
                    "Content-Type" : "application/json"
                },
                credentials: 'include',
                body : JSON.stringify(updateData)
            })

            const responseData = await response.json();

            if (!response.ok){
                toast.error(responseData.message)
                throw new Error(responseData.message)
            }

            toast.success(responseData.message)

            const {username : updatedUsername, email : updatedEmail} = responseData
            updateUser({username : updatedUsername, email : updatedEmail});
        }
        catch(error){
            console.error("Error updating account details", error)
        }
        finally{
            setIsLoading(false)
        }
        
    }

    async function handleAccountDelete() {
        setIsLoading(true);
        try{
            // authenticate user via password
            const verifyResponse = await fetch("/api/user/authenticate",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                credentials: 'include',
                body : JSON.stringify({password : passInput})
            })

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok){
                toast.error(verifyData.message);
                throw new Error(verifyData.message);
            }

            // if verification ok proceed with the acc deletion

            const response = await fetch("/api/user/delete", {
                method : "DELETE",
                credentials: "include",
            })

            const responseData = await response.json();

            if (!response.ok){
                throw new Error(responseData.message);
            }

            toast.success(responseData.message);
            navigate("/login")
        }
        catch(error){
            toast.error("Error deleting the account!")
            console.error("Error deleting the account!", error)
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
                            disabled
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
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}"
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
                    type="button"
                    className="form-btn-primary acc-delete-btn"
                    onClick={() => setShowAccDeletePopUp(true)}
                    disabled={isLoading}
                > Delete Account </button>

                {/* delete confirmation popup */}
                {showAccDeletePopUp && (
                    <div className="popup-overlay">
                        <div className="input-field acc-delete-popup">
                            <h1 className="acc-delete-title">Enter your password : </h1>
                            <input
                                className="acc-delete-input"
                                type="text"
                                placeholder="enter your password"
                                value={passInput}
                                onChange={e => setPassInput(e.target.value)}
                            />
                            <div className="popup-btn-container">
                                <button
                                    className="acc-delete-cancel-btn"
                                    onClick={() => setShowAccDeletePopUp(false)}
                                >Cancel</button>
                                <button
                                    className="acc-delete-confirm-btn"
                                    disabled={!enableAccDeleteBtn}
                                    onClick={handleAccountDelete}
                                >{isLoading? "Deleting..." : "Confirm"}</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    )
}

export default AccountPage;