import { Router } from "express";
import {
  changePassword,
  login,
  logout,
  me,
  refresh,
  register,
  updateProfile,
} from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, me);
router.patch("/me", authenticate, updateProfile);
router.post("/change-password", authenticate, changePassword);

export default router;

