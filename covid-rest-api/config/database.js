import { Sequelize } from "sequelize";
import "dotenv/config"

//destructing
const {
    DB_HOST,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
} = process.env;

const sequelize = new Sequelize({
    host: DB_HOST,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    dialect:"mysql",
});

try{
    await sequelize.authenticate();
    console.log("Database Connected");
}
catch(error){
    console.log("Database Connection Failed",error);
}

export default sequelize;