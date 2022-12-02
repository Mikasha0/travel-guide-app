const crypto = require('crypto');

const randomString = (size = 25) => crypto.randomBytes(size).toString('hex');

module.exports = {
  randomString
};