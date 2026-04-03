import { ValidationError, NotFoundError, DatabaseError, AuthenticationError, AuthorizationError } from "../utils/errors.js";

export const errorHandler = (error, req, res, next) => {
  console.error("Error:", {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Mongoose validation error
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: Object.values(error.errors).map(e => e.message),
    });
  }

  // JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  // Custom errors
  if (error instanceof ValidationError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof DatabaseError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof AuthenticationError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error instanceof AuthorizationError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  // Default error
  res.status(error.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};