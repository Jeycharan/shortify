const { shortCodeLength } = require('../config/env');

// Base62 characters: a-z, A-Z, 0-9
const BASE62_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/**
 * Generate a random short code of specified length
 * @returns {string} Random base62 string
 */
function generateCode() {
  let code = '';
  for (let i = 0; i < shortCodeLength; i++) {
    const randomIndex = Math.floor(Math.random() * BASE62_CHARS.length);
    code += BASE62_CHARS[randomIndex];
  }
  return code;
}

/**
 * Convert a number to base62 string
 * @param {number} num - Number to convert
 * @returns {string} Base62 encoded string
 */
function toBase62(num) {
  if (num === 0) return BASE62_CHARS[0];

  let result = '';
  while (num > 0) {
    result = BASE62_CHARS[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

/**
 * Convert base62 string to number
 * @param {string} str - Base62 encoded string
 * @returns {number} Decoded number
 */
function fromBase62(str) {
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    result = result * 62 + BASE62_CHARS.indexOf(str[i]);
  }
  return result;
}

module.exports = { generateCode, toBase62, fromBase62 };
