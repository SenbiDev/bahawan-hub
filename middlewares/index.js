/* eslint-disable consistent-return */
/* eslint-disable camelcase */
/* eslint-disable func-names */
/* eslint-disable import/order */
const { getToken, policyFor } = require('../utils');
const jwt = require('jsonwebtoken');
const config = require('../app/config');
const User = require('../app/user/model');

function decodeToken() {
  return async function (req, res, next) {
    try {
      const token = getToken(req);

      if (!token) return next();

      req.user = jwt.verify(token, config.secretkey);

      const user = await User.findOne({ token: { $in: [token] } });

      if (!user) {
        return res
          .status(500)
          .json({
            error: 500,
            message: 'Token Expired',
          });
      }
    } catch (err) {
      if (err && err.name === 'JsonWebTokenError') {
        return res
          .status(500)
          .json({
            error: 500,
            message: 'TokenMalformedError',
            info: err.message,
          });
      }

      next(err);
    }

    return next();
  };
}

// middleware untuk cek hak akses
function police_check(action, subject) {
  return function (req, res, next) {
    const policy = policyFor(req.user);
    if (!policy.can(action, subject)) {
      return res.json({
        error: 1,
        message: `You are not allowed to ${action} ${subject}`,
      });
    }

    next();
  };
}

module.exports = {
  decodeToken,
  police_check,
};
