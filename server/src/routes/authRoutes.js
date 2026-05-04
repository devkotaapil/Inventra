import { Router } from "express";
import { checkSetup, login, loginRules, me, register, registerRules, updateProfile, updateProfileRules } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/check-setup", checkSetup);
router.post("/register", registerRules, validate, register);
router.post("/login", loginRules, validate, login);
router.get("/me", protect, me);
router.put("/me", protect, updateProfileRules, validate, updateProfile);

export default router;
