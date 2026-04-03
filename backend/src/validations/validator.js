import { z } from "zod";

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      const errors = error.errors?.map(e => ({
        field: e.path.join("."),
        message: e.message,
      })) || [];

      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }
  };
};

// ============================================
// VALIDATION SCHEMAS
// ============================================

export const authRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const authLoginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"], { message: "Type must be income or expense" }),
  amount: z.number().positive("Amount must be positive").or(z.string().transform(Number).pipe(z.number().positive("Amount must be positive"))),
  category: z.string().min(1, "Category is required").trim(),
  notes: z.string().optional().transform(v => v?.trim() || ""),
  date: z.string().optional().refine((val) => {
    if (!val) return true; // Optional field
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Invalid date format"),
});

export const incomeSchema = z.object({
  source: z.string().min(1, "Source is required").trim(),
  amount: z.number().positive("Amount must be positive").or(z.string().transform(Number).pipe(z.number().positive("Amount must be positive"))),
  date: z.string().optional().refine((val) => {
    if (!val) return true; // Optional field
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Invalid date format"),
  notes: z.string().optional().transform(v => v?.trim() || ""),
});

export const budgetSchema = z.object({
  category: z.enum(["Food", "Travel", "Rent", "Shopping", "Bills", "Entertainment", "Transportation", "Healthcare", "Education", "Utilities", "Other"], { message: "Invalid category" }),
  limit: z.number().positive("Limit must be positive").or(z.string().transform(Number).pipe(z.number().positive("Limit must be positive"))),
  month: z.number().min(1).max(12, "Month must be 1-12"),
  year: z.number().min(2000, "Year must be valid"),
});

export const goalSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").trim(),
  targetAmount: z.number().positive("Target amount must be positive").or(z.string().transform(Number).pipe(z.number().positive("Target amount must be positive"))),
  deadline: z.string().refine((val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  }, "Invalid deadline format"),
});

export const goalUpdateSchema = z.object({
  savedAmount: z.number().min(0, "Saved amount cannot be negative").optional(),
});
