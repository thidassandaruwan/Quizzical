export async function getQuizes(req, res) {
    try{
    }
    catch(error){
        console.log("An error occured when getting quizes", error);
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
}

export async function checkAnswers(req, res) {
    try{

    }
    catch(error){
        console.log("An error occured when checking answers", error);
        res.status(500).json({message : "Internal server error!, Please try again later!"});
    }
}
