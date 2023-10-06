import { body } from "express-validator";

export const commentCreateValidation = [
  body("input", "Enter post text").isLength({ min: 1 }).isString(),
  body("pID", "Missing post ID").isLength({ min: 1 }).isString(),
];
