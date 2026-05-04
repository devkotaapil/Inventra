import { Router } from "express";
import { createSale, dailySummary, getSale, listSales, monthlySummary, saleRules } from "../controllers/saleController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(protect);
router.get("/summary/daily", dailySummary);
router.get("/summary/monthly", monthlySummary);
router.post("/", saleRules, validate, createSale);
router.get("/", listSales);
router.get("/:id", getSale);
export default router;

