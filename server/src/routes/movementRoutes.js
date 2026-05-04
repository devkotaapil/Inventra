import { Router } from "express";
import { movementList } from "../controllers/analyticsController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/", movementList);
export default router;

