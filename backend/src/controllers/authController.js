import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "../utils/responseHandler.js";

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return sendError(res, "Email already registered", 400);
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    return sendSuccess(res, { userId: user._id, email: user.email }, "User registered successfully", 201);
  } catch (error) {
    console.error("Register error:", error);
    return sendError(res, error.message || "Registration failed", 500);
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "Invalid email or password", 401);
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return sendError(res, "Invalid email or password", 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return sendSuccess(res, { 
      token, 
      user: { id: user._id, name: user.name, email: user.email } 
    }, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    return sendError(res, error.message || "Login failed", 500);
  }
};