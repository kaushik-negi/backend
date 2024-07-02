import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { loginUser } from "../controllers/user.controllers.js";
import { logoutUser } from "../controllers/user.controllers.js";
import { refreshAccessToken } from "../controllers/user.controllers.js";
const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)


//secured routes

router.route("/logout").post(verifyJWT , logoutUser)
router.route("/refresh-Token").post(refreshAccessToken)


export default router