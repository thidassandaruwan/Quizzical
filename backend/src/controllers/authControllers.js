import bcrypt from "bcrypt";
import validator from "validator"
import User from "../model/User.js"
import Mark from "../model/Mark.js"

export async function register(req, res) {
    try{
        const username = req.body?.username?.trim();
        const email = req.body?.email?.trim();
        const password = req.body?.password?.trim();

        if (!(username && email && password)){
            return res.status(400).json({message : "username , email and password are required for making account!"})
        }

        const usernamePattern = /^[a-zA-Z0-9_-]{1,20}$/;
        if (!usernamePattern.test(username)){
            return res.status(400).json({message : `'${username}' is not in valid format!`});
        }

        // a minimum length of 8 characters, at least one lowercase letter, one uppercase letter, one digit, and one special character
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
        if (!passwordPattern.test(password)){
            return res.status(400).json({message : `${password} is not in valid format!`});
        }

        if (!validator.isEmail(email)){
            return res.status(400).json({message : `${email} is not an valid email!`})
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // check if user already exist (check if user exists with email or username )
        const existingUser = await User.findOne({
            $or: [
                {email : email},
                {username : username}
            ]
        })

        if (existingUser){
            if (existingUser.email === email){
                return res.status(409).json({message : `${email} is already registered!`});
            }
            if (existingUser.username === username){
                return res.status(409).json({message : `${username} is not available!`});
            }
        }

        // create user
        const user = new User({username, email, password : hashedPassword});
        const savedUser = await user.save()

        // create a mark for the user
        const mark = new Mark({
            userId : savedUser.id,
            computers : { correct : 0, allQuizzes : 0},
            games : { correct : 0, allQuizzes : 0},
            movies : { correct : 0, allQuizzes : 0},
            vehicles : { correct : 0, allQuizzes : 0}
        })
        const savedMark = await mark.save();

        res.status(201).json({savedUser, savedMark});

    }
    catch(error){
        console.log("Error when registering user", error)
        res.status(500).json({message : "Internal server error!, Please try again later!"})
    }
}

export async function login(req, res) {
    try{
        const {email, password} = req.body;
        if (!email || !password){
            return res.status(400).json({message : "Missing authentication credentials!"})
        }

        
    }
    catch(error){
        console.log("Error when loggin in user", error);
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
}

export async function logout(req, res) {
    try{

    }
    catch(error){
        console.log("Error when loggin in user", error);
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
}

export async function deleteUser(req, res) {
    try{
        const id = req.params.id;
        if (!id){
            return res.status(400).json({message : "Missing user id"})
        }
        
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser){
            return res.status(404).json({message : "Invalid user id"})
        }

        const deletedMark = await Mark.deleteOne({userId : id})
        res.status(200).json(deletedUser);
    }
    catch(error){
        console.log("Error when loggin in user", error);
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
    
}

export async function getCurrentUser(req, res) {
    try{

    }
    catch(error){
        console.log("Error when loggin in user", error);
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
}

