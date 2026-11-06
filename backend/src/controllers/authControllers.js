import bcrypt from "bcrypt";
import validator from "validator"
import User from "../model/User.js"

export async function register(req, res) {
    try{
        const {username, email, password} = res.body;
        if (!(username && email && password)){
            res.status(400).json({message : "username , email and password are required for making account!"})
            return
        }
    }
    catch(error){
        console.log("Error when registering user", error)
    }
}

export async function login(req, res) {
    try{

    }
    catch(error){
        console.log("Error when loggin in user", error)
    }
}

export async function logout(req, res) {
    try{

    }
    catch(error){
        console.log("Error when logging out user", error)
    }
}

export async function getCurrentUser(req, res) {
    try{

    }
    catch(error){
        console.log("Error when getting current user data", error)
    }
}