import { Router } from "express";
import { abc, categoryBreakdown, dashboard, recommendationList, revenueTrend, topProducts } from "../controllers/analyticsController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/dashboard", dashboard);
router.get("/top-products", topProducts);
router.get("/revenue-trend", revenueTrend);
router.get("/abc-analysis", abc);
router.get("/category-breakdown", categoryBreakdown);
router.get("/recommendations", recommendationList);
export default router;

