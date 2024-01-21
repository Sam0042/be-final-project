import express from "express";
import object from "../controllers/PatientsController.js";
import validateTodo from "../middleware/validateTodo.js";
import AuthController from "../controllers/AuthController.js";
import auth from "../middleware/auth.js";


const router = express.Router();

router.get("/",function(req,res){
    res.send("Halaman Home by Sam0042 and Fredy Rambitan Simanungkalit")
});

const PatientsController = object;

//PatientsController.method ditaruh di tempat callbackfunct  karena callbackfunct auto dijalankan ketika kita mengakses parameter satu
router.get("/students",auth,PatientsController.index);
router.post("/students",auth,validateTodo,PatientsController.store);
// router.post("/students",auth,PatientsController.store);
router.put("/students/:id",auth,PatientsController.update);
router.delete("/students/:id",auth,PatientsController.destroy);
router.get("/students/:id",auth,PatientsController.show);
//register-login
router.post("/register",AuthController.register);
router.post("/login",AuthController.login);

export default router;