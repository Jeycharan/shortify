const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          try {
            new global.URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: (props) => `${props.value} is not a valid URL`,
      },
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    customAlias: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maxClicks: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
urlSchema.index({ userId: 1, createdAt: -1 });

// Virtual for analytics
urlSchema.virtual('analytics', {
  ref: 'Analytics',
  localField: '_id',
  foreignField: 'urlId',
  justOne: true,
});

// Method to check if URL is expired
urlSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > new Date(this.expiresAt);
};

// Method to check if URL can accept more clicks
urlSchema.methods.canClick = async function () {
  if (!this.isActive) return false;
  if (this.isExpired()) return false;
  if (this.maxClicks) {
    // Import Analytics here to avoid circular dependency
    const Analytics = require('../models/Analytics');
    const analytics = await Analytics.findOne({ urlId: this._id });
    if (analytics && analytics.clickCount >= this.maxClicks) {
      return false;
    }
  }
  return true;
};

// Method to return safe URL data
urlSchema.methods.toSafeObject = function () {
  const {
    _id,
    originalUrl,
    shortCode,
    customAlias,
    title,
    description,
    userId,
    createdAt,
    expiresAt,
    isActive,
    analytics,
  } = this;
  return {
    _id,
    originalUrl,
    shortCode,
    customAlias,
    title,
    description,
    userId,
    createdAt,
    expiresAt,
    isActive,
    analytics: analytics || null,
  };
};

const URL = mongoose.model('URL', urlSchema);

module.exports = URL;
