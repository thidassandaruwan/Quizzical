import mongoose from "mongoose";
import "./User.js"

const categoryField = {
    correct: { type: Number, default: 0 },
    allQuizzes: { type: Number, default: 0 }
};

const markSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        computers: categoryField,
        videoGames: categoryField,
        geography: categoryField,
        vehicles: categoryField,
        comics: categoryField,
        gadgets: categoryField
    },
    { timestamps: true }
);

const Mark = mongoose.model("Mark", markSchema);
export default Mark;