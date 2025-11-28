// ...existing code...
import express from "express";
const router = express.Router();
import {
  getStats,
  getTransaction,
  getTransactionById,
  updateTransactionStatus,
} from "../controller/adminController.js"; // JWT middleware that sets req.user
import { authenticate, isAdmin } from "../middleware/auth.js";

router.get("/stats", authenticate, isAdmin, getStats);
router.get("/recent", authenticate, isAdmin, getStats); // optionally separate
router.get("/transactions", authenticate, isAdmin, getTransaction);
router.get("/transactions/:id", authenticate, isAdmin, getTransactionById);
router.put(
  "/transactions/:id/status",
  authenticate,
  isAdmin,
  updateTransactionStatus
);

export default router;
