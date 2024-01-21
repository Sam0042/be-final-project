import sequelize from "../config/database.js";
import { DATEONLY, DataTypes} from "sequelize";

const Patient = sequelize.define("Patient", {
    //membuat kolom
        name:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        phone:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        address:{
            type:DataTypes.TEXT,
            allowNull: false,
        },
        status:{
            type:DataTypes.STRING,
            allowNull: false,
        },
        in_date_at:{
            type:DataTypes.DATEONLY,
            allowNull: false,
        },
        out_date_at:{
            type:DataTypes.DATEONLY,
            allowNull: false,
        },
        
})

try{
    await Patient.sync();
    console.log("The table Patient was created");
}
catch(error){
    console.log("Cannot create table", error)
}

export default Patient;