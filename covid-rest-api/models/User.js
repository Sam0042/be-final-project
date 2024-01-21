import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("User", {
    username: {
        type:DataTypes.STRING,
        allowNull:false,
    },

    email: {
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,
    },

    password: {
        type:DataTypes.STRING,
        allowNull:false,
    }
})

try{
    await User.sync();
    console.log("The user table was created")
} 
catch(error){
    console.log("Cannot create table", error)
}

export default User;