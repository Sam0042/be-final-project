import express, { json } from "express";
import router from "./routes/api.js";
import dotenv from "dotenv";
import logger from "./middleware/logger.js";
import auth from "./middleware/auth.js";

dotenv.config();

const app = express();

app.use(logger);

const port = process.env.APP_PORT;

app.use(express.json());
app.use(express.urlencoded());

app.use(router)
app.use(auth)

app.listen(port,() =>{
    console.log(`Server running at https://localhost:${port}`)
});