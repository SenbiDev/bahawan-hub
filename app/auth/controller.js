/* eslint-disable consistent-return */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable import/order */
const User = require('../user/model');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../utils');

const register = async (req, res, next) => {
  try {
    const payload = req.body;

    const user = new User(payload);

    await user.save();

    return res
      .status(201)
      .json(user);
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res
        .status(400)
        .json({
          error: 400,
          message: 'Bad Request',
          info: err.message,
          fields: err.errors,
        });
    }

    next(err);
  }
};

const localStrategy = async (email, password, done) => {
  try {
    const user = await User.findOne({ email }).select('-__v -createdAt -updatedAt -cart_items -token');
    if (!user) return done({ error: 404, message: 'User tidak ditemukan!' });
    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }
  } catch (err) {
    done(err, null);
  }

  done();
};

const login = async (req, res, next) => {
  passport.authenticate('local', async (err, user) => {
    if (err) return res.status(404).json(err);
    if (!user) return res.status(400).json({ error: 400, message: 'Bad Request', info: 'Email dan Password harus diisi!' });

    const signed = jwt.sign(user, config.secretkey);

    await User.findByIdAndUpdate(user._id, { $set: { token: [signed] } });

    return res
      .status(200)
      .json({
        message: 'Login Successfully',
        user,
        token: signed,
      });
  })(req, res, next);
};

const logout = async (req, res) => {
  const token = getToken(req);
  const users = await User.find();
  let user = users.find((data) => data.email === req.user?.email);

  if (user.token.length > 0) {
    user = await User.findOneAndUpdate(
      { token: { $in: [token] } },
      { $set: { token: [] } },
      { useFindAndModify: false },
    );
  }

  if (!token || !user) {
    return res
      .status(404)
      .json({
        error: 404,
        message: 'Not Found',
        info: 'No User Found!!!',
      });
  }

  return res
    .status(200)
    .json({
      message: 'Logout berhasil',
    });
};

const me = (req, res) => {
  if (!req.user) {
    res
      .status(401)
      .json({
        err: 401,
        message: 'Unauthorized',
        info: "You're not login or token expired",
      });
  }

  res.json(req.user);
};

module.exports = {
  register,
  localStrategy,
  login,
  logout,
  me,
};
