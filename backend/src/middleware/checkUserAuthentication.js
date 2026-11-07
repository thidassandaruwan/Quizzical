export function checkUserAuthentication(req, res, next) {
    if (!req.session.userId){
        return res.status(401).json({message : "Access denied! Login required"})
    }

    next();
}