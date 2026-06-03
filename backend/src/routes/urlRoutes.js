const express = require('express');
const router = express.Router();
const {
  createURL,
  getUserURLs,
  getURLById,
  updateURL,
  deleteURL,
} = require('../controllers/urlController');
const authMiddleware = require('../middleware/auth');
const {
  validate,
  urlCreateValidation,
  customAliasValidation,
  urlIdValidation,
  handleValidationErrors,
} = require('../middleware/validate');

// POST /api/urls - Create new short URL (protected)
router.post('/', authMiddleware, validate(urlCreateValidation), handleValidationErrors, createURL);

// GET /api/urls - Get all user URLs (protected)
router.get('/', authMiddleware, getUserURLs);

// GET /api/urls/:id - Get URL by ID (protected)
router.get('/:id', authMiddleware, urlIdValidation, handleValidationErrors, getURLById);

// PUT /api/urls/:id - Update URL (protected)
router.put('/:id', authMiddleware, urlIdValidation, handleValidationErrors, updateURL);

// DELETE /api/urls/:id - Delete URL (protected)
router.delete('/:id', authMiddleware, urlIdValidation, handleValidationErrors, deleteURL);

module.exports = router;
