import express from "express";
import { 
    signup,
    login,
    logout 
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"


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

// Defines an endpoint for editing profile information.
router.put("/update-profile", protectRoute, updateProfile);

export default router;