const { body, param, validationResult } = require('express-validator');

// Validation middleware for express-validator
const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length > 0) {
        return res.status(400).json({ message: result.errors[0].msg });
      }
    }
    next();
  };
};

// Validation rules for registration
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Validation rules for login
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .exists()
    .withMessage('Password is required'),
];

// Validation rules for URL creation
const urlCreateValidation = [
  body('originalUrl')
    .trim()
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format for expiration'),
  body('maxClicks')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Max clicks must be a positive integer'),
];

// Validation rules for custom alias
const customAliasValidation = [
  body('customAlias')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Custom alias must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Custom alias can only contain letters, numbers, underscores, and hyphens'),
];

const urlIdValidation = [
  param('id')
    .optional()
    .isMongoId()
    .withMessage('Invalid URL ID'),
  param('urlId')
    .optional()
    .isMongoId()
    .withMessage('Invalid URL ID'),
];

// Error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  urlCreateValidation,
  customAliasValidation,
  urlIdValidation,
  handleValidationErrors,
};
