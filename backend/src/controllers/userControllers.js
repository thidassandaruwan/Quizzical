import User from "../model/User.js"
import Mark from "../model/Mark.js"
import bcrypt from "bcrypt";
import validator from "validator"

export async function getMe(req, res) {
    try{
        // -password for security reasons
        const user = await User.findById(req.session.userId).select("-password");

        if (!user){
            return res.status(404).json({message : "User not found!"})
        }

        res.status(200).json(user)
    }
    catch(error){
        console.error("Error when loggin in user", error);
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
}

export async function updateUser(req, res) {
    try{
        const {email, password} = req.body;

        if (!email && !password){
            return res.status(400).json({message : "Bad request!"})
        }

        const updatedDetails = {};

        // check if email is valid 
        if (email){
            if (!validator.isEmail(email)){
                return res.status(400).json({message : `${email} is not an valid email!`})
            }

            // check if email is alredy registered
            const existingUser = await User.findOne({email : email}).select("-password")
            if (existingUser){
                // check if the email is registered for someone else account
                if (!existingUser.id === req.session.userId){
                    return res.status(409).json({message : `${email} is already registered!`});
                }   
            }

            updatedDetails.email = email;
        }
    
        if (password){
            // check if password is valid (pattern)
            // a minimum length of 8 characters, at least one lowercase letter, one uppercase letter, one digit, and one special character
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
            if (!passwordPattern.test(password)){
                return res.status(400).json({message : `${password} is not a valid password!`});
            }

            updatedDetails.password = await bcrypt.hash(password, 10);
        } 

        const updatedUser = await User.findByIdAndUpdate(
            req.session.userId,
            updatedDetails,
            { returnDocument: 'after' }
        ).select("-password")

        res.status(200).json({
            message : "Account updated succesfully!",
            updatedUser
        })
        
    }
    catch(error){
        console.error("Error updating user", error)
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
}

export async function authenticateUser(req, res) {
    try{
        const {password} = req.body;
        
        if (!password){
            return res.status(400).json({message : "Bad request!"})
        }

        const user = await User.findById(req.session.userId);  
        const isAuthenticated =await bcrypt.compare(password, user.password);
        
        if (!isAuthenticated){
            return res.status(401).json({message : "Incorrect password!"})
        }

        res.status(200).json({message : "Authenticated!"})
    }
    catch(error){
        console.error("Error when authenticating user", error)
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
}

export async function deleteUser(req, res) {
    try{
        const id = req.session.userId;

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser){
            return res.status(404).json({message : "Invalid user id"})
        }
        const deletedMark = await Mark.deleteOne({userId : id})

        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session on user deletion:", err);
                return res.status(500).json({ message: "Account deleted, but failed to destroy session." });
            }

            res.clearCookie("connect.sid", {
                path: "/",
                httpOnly: true,
                sameSite: "lax",
            });
            
            return res.status(200).json({ message: "Account deleted successfully!" });
        });

        res.status(200).json({
            message : "Account deleted successfully!",
            deletedUser
        });
    }
    catch(error){
        console.error("Error when loggin in user", error);
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
    
}

export async function getUserStats(req, res) {
    try{
        let userMarks = await Mark.findOne({userId : req.session.userId});

        // if usermark doesn't exist for some reason
        if (!userMarks){
            // validate is the user actually does exist in the DB
            const user = await User.findById(req.session.userId).select("-password");

            // if user does not exist desctroy the session id cookie
            if (!user){
                req.session.destroy((error) => {
                    if (error){
                        console.error("Error destroying session", error);
                    }

                    res.clearCookie("connect.sid", {
                        path : "/",
                        httpOnly : true,
                        sameSite : "lax"
                    })

                    return res.status(401).json({ message: "Session invalid. User account no longer exists." });
                })

                return;
            }

            // if user does exist create a new mark for the userr
            userMarks = await Mark.create({userId : user.id})
        }

        // toObject() is a mongoose method and it removed mongoose/mongodb specific properties like metadata and create a plain JS object
        const {_id, userId, createdAt, updatedAt, __v, ...categoryMarks} = userMarks.toObject();

        res.status(200).json(categoryMarks);

    }
    catch(error){
        console.error("An error occured when getting user stats", error)
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
}



