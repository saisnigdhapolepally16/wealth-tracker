import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { validate, authRegisterSchema, authLoginSchema } from "../validations/validator.js";

const router = express.Router();

// Register with validation
router.post("/register", validate(authRegisterSchema), registerUser);

// Login with validation
router.post("/login", validate(authLoginSchema), loginUser);

export default router;