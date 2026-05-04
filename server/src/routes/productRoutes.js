import { Router } from "express";
import { createProduct, deleteProduct, getProduct, listProducts, productRules, updateProduct } from "../controllers/productController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();
router.use(protect);
router.get("/", listProducts);
router.post("/", productRules, validate, createProduct);
router.get("/:id", getProduct);
router.put("/:id", productRules, validate, updateProduct);
router.delete("/:id", deleteProduct);
export default router;

