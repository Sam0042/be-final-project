import express from "express";
import object from "../controllers/PatientsController.js";
import validateTodo from "../middleware/validateTodo.js";
import AuthController from "../controllers/AuthController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", function (req, res) {
  res.send("Halaman Home by Sam0042 and Fredy Rambitan Simanungkalit");
});

const PatientsController = object;

//PatientsController.method ditaruh di tempat callbackfunct  karena callbackfunct auto dijalankan ketika kita mengakses parameter satu
router.get("/patients", auth, PatientsController.index);
router.post("/patients", auth, validateTodo, PatientsController.store);
// router.post("/patients",auth,PatientsController.store);
router.put("/patients/:id", auth, PatientsController.update);
router.delete("/patients/:id", auth, PatientsController.destroy);
router.get("/patients/:id", auth, PatientsController.show);
//register-login
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

export default router;
