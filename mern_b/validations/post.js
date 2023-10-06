import { body } from "express-validator";

export const postCreateValidation = [
  body("title", "Enter post header").isLength({ min: 3 }).isString(),
  body("text", "Enter post text").isLength({ min: 3 }).isString(),
  body("tags", "Incorrect tags format").optional().isArray(),
  body("imageUrl", "Incorrect image URL").optional().isString(),
  body("imagePath", "Incorrect image Path").optional().isString(),
];
