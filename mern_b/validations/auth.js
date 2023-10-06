import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Email format is not correct').isEmail(),
    body('password', 'Password must be at least 5 symbols').isLength({ min: 5 }),
    body('fullName', 'Missing name').isLength({ min: 3 }),
    body('avatarUrl','Incorrect avatar URL').optional().isURL()
]