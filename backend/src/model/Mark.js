import mongoose from "mongoose";
import "./User.js"

const markSchema = new mongoose.Schema(
    {
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        }, 
        computers : {
            correct : Number,
            allQuizzes : Number
        },
        videoGames : {
            correct : Number,
            allQuizzes : Number
        },
        geography : {
            correct : Number,
            allQuizzes : Number
        },
        vehicles : {
            correct : Number,
            allQuizzes : Number
        }, 
        comics : {
            correct : Number,
            allQuizzes : Number
        },
        gadgets : {
            correct : Number,
            allQuizzes : Number
        }
    },
    {timestamps : true}
)

const Mark = mongoose.model("Mark", markSchema);
export default Mark;