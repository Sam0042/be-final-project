import jwt from "jsonwebtoken";

const auth = (req,res,next) => {
    const authorization = req.get("Authorization");

    const token = authorization && authorization.split(" ")[1];

    if(!authorization){
        const response = {
            message:"Please provide token",
        };
        res.status(401).json(response);
    }

    try{
        const decode = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = decode;
        next();
    }
    catch(error){
        const response = {
            message:"Authetication failed"
        }
        res.status(401).json(response)
    }
}

export default auth;