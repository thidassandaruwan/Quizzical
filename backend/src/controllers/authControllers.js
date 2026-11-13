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
            return res.status(400).json({message : `'${username}' is not a valid password!`});
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

        // not getting user password with .select (unless neded even transmitting hashed passwords can be unsecure)
        // check if user already exist (check if user exists with email or username )
        const existingUser = await User.findOne({
            $or: [
                {email : email},
                {username : username}
            ]
        }).select("-password")

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
        const mark = await Mark.create({userId : savedUser.id})

        // save user is in session
        req.session.userId = savedUser.id;

        return res.status(201).json({
            message : "account creation successful",
            userData : {
                userId : user.id,
                username : user.username,
                email : user.email,
            }
        })

    }
    catch(error){
        console.error("Error when registering user", error)
        res.status(500).json({message : "Internal server error!, Please try again later!"})
    }
}

export async function login(req, res) {
    try{
        const {email, password} = req.body;
        if (!email || !password){
            return res.status(400).json({message : "Missing authentication credentials!"})
        }

        // not getting user password with .select (unless neded even transmitting hashed passwords can be unsecure)
        const user = await User.findOne({email});

        if (!user){
            return res.status(404).json({message : "Invalid email or password!"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid){
            return res.status(404).json({message : "Invalid email or password!"});
        }

       // save user is in session
        req.session.userId = user.id;


        return res.status(200).json({
            message : "login successful",
            userData : {
                userId : user.id,
                username : user.username,
                email : user.email,
            }
        })
    }
    catch(error){
        console.error("Error when loggin in user", error);
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
}

export function logout(req, res) {
    req.session.destroy((error) => {
        if (error){
            console.error("Error destroying session", error);
            return res.status(500).json({message : "Log out failed please try again later!"})
        }

        res.clearCookie("connect.sid", {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
        });
        return res.status(200).json({message : "Logged out successfully!"})

    })
}
