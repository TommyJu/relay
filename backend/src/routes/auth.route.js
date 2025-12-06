import express from "express";
import { 
    signup,
    login,
    logout 
} from "../controllers/auth.controller.js";
/*
Defines an express router used for exposing 
user authentication endpoints.
*/
const router = express.Router();

/*
Defines endpoints that utilize the
authentication controller to handle requests. 
*/
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);


export default router;