import { Router } from "express";
import { adjust, listInventory, lowStock, restock, stockRules } from "../controllers/inventoryController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(protect);
router.get("/", listInventory);
router.get("/low-stock", lowStock);
router.put("/restock/:productId", stockRules, validate, restock);
router.put("/adjust/:productId", stockRules, validate, adjust);
export default router;

