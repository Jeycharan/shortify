const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: {
    type: String,
    trim: true,
  },
  userAgent: {
    type: String,
    trim: true,
  },
  referrer: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    trim: true,
  },
  deviceType: {
    type: String,
    enum: ['mobile', 'desktop', 'tablet', 'unknown'],
    default: 'unknown',
  },
  browser: {
    type: String,
    trim: true,
  },
  os: {
    type: String,
    trim: true,
  },
});

const analyticsSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'URL',
      required: true,
      unique: true,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    lastVisit: {
      type: Date,
    },
    visits: {
      type: [visitSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
analyticsSchema.index({ 'visits.timestamp': -1 });

// Method to add a visit
analyticsSchema.methods.addVisit = function (visitData) {
  // Add new visit to beginning of array
  this.visits.unshift(visitData);

  // Limit visits array to max stored
  if (this.visits.length > 100) {
    this.visits = this.visits.slice(0, 100);
  }

  // Update click count and last visit
  this.clickCount += 1;
  this.lastVisit = new Date();

  return this.save();
};

// Method to get daily click counts for chart
analyticsSchema.methods.getDailyClicks = function (days = 7) {
  const dailyCounts = {};
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    dailyCounts[dateKey] = 0;
  }

  this.visits.forEach((visit) => {
    const visitDate = visit.timestamp.toISOString().split('T')[0];
    if (dailyCounts.hasOwnProperty(visitDate)) {
      dailyCounts[visitDate]++;
    }
  });

  return Object.entries(dailyCounts).map(([date, count]) => ({ date, count }));
};

// Method to get device breakdown
analyticsSchema.methods.getDeviceBreakdown = function () {
  const breakdown = { mobile: 0, desktop: 0, tablet: 0, unknown: 0 };
  this.visits.forEach((visit) => {
    if (breakdown[visit.deviceType] !== undefined) {
      breakdown[visit.deviceType]++;
    }
  });
  return breakdown;
};

// Method to get referrer breakdown
analyticsSchema.methods.getReferrerBreakdown = function () {
  const referrers = {};
  this.visits.forEach((visit) => {
    if (visit.referrer) {
      try {
        const url = new URL(visit.referrer);
        const domain = url.hostname;
        referrers[domain] = (referrers[domain] || 0) + 1;
      } catch {
        referrers['direct'] = (referrers['direct'] || 0) + 1;
      }
    } else {
      referrers['direct'] = (referrers['direct'] || 0) + 1;
    }
  });
  return referrers;
};

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
