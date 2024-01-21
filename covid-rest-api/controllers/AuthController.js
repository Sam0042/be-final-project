import bcrypt from "bcrypt";
import User from "../models/User.js"
import jwt from "jsonwebtoken"
import "dotenv"

class AuthController {
    async register(req,res){
        const {username,email,password} = req.body;

        const hash = await bcrypt.hash(password,10);

        const newUser = await User.create({
            username:username,
            email:email,
            password:hash,
        })

        const response = {
            message:"User created successfully",
            data:newUser,
        }

        return res.status(200).json(response);

    }
    
    async login(req,res){
        const {username,password} = req.body;

        const user = await User.findOne({where:{username:username}});
        const match = await bcrypt.compare(password,user.password);

        if(!user || !match){
            const response = {
                massage:"Authentication failed",
            };
            return res.status(401).json(response);
        }
        else{
            const payload = {
                id:user.id,
                username:user.username,
            };

            const secret = process.env.TOKEN_SECRET;
            const token = jwt.sign(payload,secret,{expiresIn: "1h"});

            const response = {
                message:"Login success",
                data:{
                    token:token,
                }
            }
            return res.status(200).json(response)
        }
    }
}

const auth = new AuthController();

export default auth;