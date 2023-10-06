import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Email format is not correct').isEmail(),
    body('password', 'Password must be at least 5 symbols').isLength({ min: 5 }),
]