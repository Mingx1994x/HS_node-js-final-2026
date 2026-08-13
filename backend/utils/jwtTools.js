const jwt = require('jsonwebtoken');
const config = require('../config/index');
const createHttpError = require('http-errors');
module.exports = {
  generateJWT: (payload) => {
    return jwt.sign(
      payload,
      config.get('secret.jwtSecret'),
      {
        expiresIn: config.get('secret.jwtExpires')
      }
    )
  },
  verifyJWT: (token) => {
    const secret = config.get('secret.jwtSecret');
    try {
      const decoded = jwt.verify(token, secret);
      return decoded
    } catch (error) {
      switch (error.name) {
        case "TokenExpiredError":
          throw createHttpError(401, 'Token 已過期')
        default:
          throw createHttpError(401, '無效的 token')
      }
    }
  }
}