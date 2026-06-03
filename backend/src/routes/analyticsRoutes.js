const express = require('express');
const router = express.Router();
const {
  getAnalytics,
  getVisitHistory,
  getAggregatedStats,
} = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');
const { urlIdValidation, handleValidationErrors } = require('../middleware/validate');

// GET /api/analytics/:urlId - Get analytics (protected)
router.get('/:urlId', authMiddleware, urlIdValidation, handleValidationErrors, getAnalytics);

// GET /api/analytics/:urlId/visits - Get visit history (protected)
router.get('/:urlId/visits', authMiddleware, urlIdValidation, handleValidationErrors, getVisitHistory);

// GET /api/analytics/:urlId/stats - Get aggregated stats (protected)
router.get('/:urlId/stats', authMiddleware, urlIdValidation, handleValidationErrors, getAggregatedStats);

module.exports = router;
