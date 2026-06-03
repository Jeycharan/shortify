const URL = require('../models/URL');
const Analytics = require('../models/Analytics');
const { generateCode } = require('../utils/generateCode');

/**
 * Create a new short URL
 * POST /api/urls
 */
async function createURL(req, res) {
  try {
    const { originalUrl, title, description, expiresAt, maxClicks, customAlias } = req.body;
    const userId = req.userId;

    // Check if custom alias already exists
    if (customAlias) {
      const existingCustom = await URL.findOne({ customAlias: customAlias.toLowerCase() });
      if (existingCustom) {
        return res.status(400).json({ message: 'Custom alias already in use' });
      }
    }

    // Generate short code
    let shortCode = generateCode();
    let attempts = 0;
    const maxAttempts = 5;

    // Ensure unique short code
    while (attempts < maxAttempts) {
      const existing = await URL.findOne({ shortCode });
      if (!existing) break;
      shortCode = generateCode();
      attempts++;
    }

    if (attempts === maxAttempts) {
      return res.status(500).json({ message: 'Failed to generate unique short code' });
    }

    // Create URL document
    const urlData = {
      originalUrl: originalUrl.trim(),
      shortCode,
      title: title?.trim(),
      description: description?.trim(),
      userId,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      maxClicks: maxClicks ? parseInt(maxClicks, 10) : undefined,
    };

    if (customAlias) {
      urlData.customAlias = customAlias.toLowerCase();
    }

    const url = new URL(urlData);
    await url.save();

    // Create analytics document
    const analytics = new Analytics({ urlId: url._id });
    await analytics.save();

    // Send response
    res.status(201).json({
      message: 'Short URL created successfully',
      url: url.toSafeObject(),
    });
  } catch (error) {
    console.error('Create URL error:', error);
    res.status(500).json({ message: 'Server error during URL creation' });
  }
}

/**
 * Get all URLs for the current user
 * GET /api/urls
 */
async function getUserURLs(req, res) {
  try {
    const userId = req.userId;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    const urls = await URL.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate('analytics');

    const total = await URL.countDocuments({ userId });

    res.json({
      message: 'URLs retrieved successfully',
      urls: urls.map((url) => url.toSafeObject()),
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get user URLs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Get URL details by ID
 * GET /api/urls/:id
 */
async function getURLById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const url = await URL.findOne({ _id: id, userId }).populate('analytics');

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    res.json({
      message: 'URL retrieved successfully',
      url: url.toSafeObject(),
    });
  } catch (error) {
    console.error('Get URL by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Update a URL
 * PUT /api/urls/:id
 */
async function updateURL(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { originalUrl, title, description, expiresAt, maxClicks, isActive } = req.body;

    const url = await URL.findOne({ _id: id, userId });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Update fields
    if (originalUrl) {
      url.originalUrl = originalUrl.trim();
    }
    if (title !== undefined) {
      url.title = title.trim();
    }
    if (description !== undefined) {
      url.description = description.trim();
    }
    if (expiresAt !== undefined) {
      url.expiresAt = expiresAt ? new Date(expiresAt) : undefined;
    }
    if (maxClicks !== undefined) {
      url.maxClicks = maxClicks ? parseInt(maxClicks, 10) : undefined;
    }
    if (isActive !== undefined) {
      url.isActive = isActive;
    }

    await url.save();

    res.json({
      message: 'URL updated successfully',
      url: url.toSafeObject(),
    });
  } catch (error) {
    console.error('Update URL error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Delete a URL
 * DELETE /api/urls/:id
 */
async function deleteURL(req, res) {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const url = await URL.findOneAndDelete({ _id: id, userId });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Delete associated analytics
    await Analytics.deleteOne({ urlId: id });

    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error('Delete URL error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Redirect to original URL
 * GET /:shortCode
 */
async function redirectURL(req, res) {
  try {
    const { shortCode } = req.params;

    const url = await URL.findOne({
      $or: [
        { shortCode: shortCode.toLowerCase() },
        { customAlias: shortCode.toLowerCase() }
      ]
    });
    if (!url) {
      return res.status(404).json({ message: 'Short URL not found' });
    }

    // Check if expired
    if (url.isExpired()) {
      return res.status(410).json({ message: 'This link has expired' });
    }

    // Check if can click
    if (!await url.canClick()) {
      return res.status(403).json({ message: 'This link is no longer active' });
    }

    // Update analytics
    const analytics = await Analytics.findOne({ urlId: url._id });

    // Extract visitor info from request
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers['referer'] || req.headers['referrer'] || '';

    // Detect device type
    let deviceType = 'unknown';
    if (/mobile|android|iphone|ipad/i.test(userAgent)) {
      deviceType = /ipad/i.test(userAgent) ? 'tablet' : 'mobile';
    } else if (/desktop|windows|mac|linux/i.test(userAgent)) {
      deviceType = 'desktop';
    }

    // Extract browser and OS from user agent
    let browser = 'unknown';
    let os = 'unknown';

    if (/edge|edg/i.test(userAgent)) browser = 'Edge';
    else if (/opr|opera/i.test(userAgent)) browser = 'Opera';
    else if (/chrome|chromium/i.test(userAgent)) browser = 'Chrome';
    else if (/firefox|fxios/i.test(userAgent)) browser = 'Firefox';
    else if (/safari/i.test(userAgent)) browser = 'Safari';

    if (/windows nt/i.test(userAgent)) os = 'Windows';
    else if (/mac os x/i.test(userAgent)) os = 'macOS';
    else if (/linux/i.test(userAgent)) os = 'Linux';
    else if (/android/i.test(userAgent)) os = 'Android';
    else if (/iphone|ipad|ipod/i.test(userAgent)) os = 'iOS';

    const visitData = {
      timestamp: new Date(),
      ip,
      userAgent,
      referrer,
      deviceType,
      browser,
      os,
    };

    if (analytics) {
      await analytics.addVisit(visitData);
    }

    // Redirect to original URL (Use 302 Temporary Redirect so browsers don't cache it, allowing us to track all clicks)
    res.redirect(302, url.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createURL,
  getUserURLs,
  getURLById,
  updateURL,
  deleteURL,
  redirectURL,
};
