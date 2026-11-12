import User from "../model/User.js"
import Mark from "../model/Mark.js"

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

        res.status(200).json(deletedUser);
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

        res.status(200).json(userMarks);

    }
    catch(error){
        console.error("An error occured when getting user stats", error)
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
}



