const mongoose = require('mongoose');
const { hashPassword, comparePassword } = require('../utils/hashPassword');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await hashPassword(this.password);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await comparePassword(password, this.password);
};

// Method to return safe user data (without password)
userSchema.methods.toSafeObject = function () {
  const { _id, username, email, createdAt, isActive } = this;
  return { _id, username, email, createdAt, isActive };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
