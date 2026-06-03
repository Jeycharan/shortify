const Analytics = require('../models/Analytics');
const URL = require('../models/URL');

/**
 * Get analytics for a URL
 * GET /api/analytics/:urlId
 */
async function getAnalytics(req, res) {
  try {
    const { urlId } = req.params;
    const userId = req.userId;

    // Verify URL belongs to user
    const url = await URL.findOne({ _id: urlId, userId });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    const analytics = await Analytics.findOne({ urlId }).populate('urlId');

    if (!analytics) {
      return res.status(404).json({ message: 'Analytics not found' });
    }

    res.json({
      message: 'Analytics retrieved successfully',
      analytics: {
        ...analytics.toObject(),
        dailyClicks: analytics.getDailyClicks(7),
        deviceBreakdown: analytics.getDeviceBreakdown(),
        referrerBreakdown: analytics.getReferrerBreakdown(),
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Get visit history for a URL
 * GET /api/analytics/:urlId/visits
 */
async function getVisitHistory(req, res) {
  try {
    const { urlId } = req.params;
    const userId = req.userId;
    const { page = 1, limit = 50 } = req.query;

    // Verify URL belongs to user
    const url = await URL.findOne({ _id: urlId, userId });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    const analytics = await Analytics.findOne({ urlId });

    if (!analytics) {
      return res.status(404).json({ message: 'Analytics not found' });
    }

    const skip = (page - 1) * limit;
    const visits = analytics.visits.slice(skip, skip + parseInt(limit, 10));

    res.json({
      message: 'Visit history retrieved successfully',
      visits,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total: analytics.visits.length,
      },
    });
  } catch (error) {
    console.error('Get visit history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Get aggregated stats for a URL
 * GET /api/analytics/:urlId/stats
 */
async function getAggregatedStats(req, res) {
  try {
    const { urlId } = req.params;
    const userId = req.userId;

    // Verify URL belongs to user
    const url = await URL.findOne({ _id: urlId, userId });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    const analytics = await Analytics.findOne({ urlId });

    if (!analytics) {
      return res.status(404).json({ message: 'Analytics not found' });
    }

    const stats = {
      totalClicks: analytics.clickCount,
      lastVisit: analytics.lastVisit,
      dailyClicks: analytics.getDailyClicks(7),
      deviceBreakdown: analytics.getDeviceBreakdown(),
      referrerBreakdown: analytics.getReferrerBreakdown(),
    };

    res.json({
      message: 'Stats retrieved successfully',
      stats,
    });
  } catch (error) {
    console.error('Get aggregated stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getAnalytics,
  getVisitHistory,
  getAggregatedStats,
};
