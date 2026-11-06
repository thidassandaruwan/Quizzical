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
        games : {
            correct : Number,
            allQuizzes : Number
        },
        movies : {
            correct : Number,
            allQuizzes : Number
        },
        vehicles : {
            correct : Number,
            allQuizzes : Number
        }
    },
    {timestamps : true}
)

const Mark = mongoose.model("Mark", markSchema);
export default Mark;