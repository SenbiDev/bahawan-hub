/* eslint-disable no-useless-escape */
/* eslint-disable no-useless-catch */
/* eslint-disable func-names */
const mongoose = require('mongoose');

const { model, Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = Schema({
  full_name: {
    type: String,
    required: [true, 'Nama harus diisi'],
    minlength: [3, 'Pandjang nama harus antara 3 - 255 karakter'],
    maxlength: [255, 'Pandjang nama harus antara 3 - 255 karakter'],
  },
  email: {
    type: String,
    required: [true, 'Email harus diisi'],
    maxlength: [255, 'Pandjang email maksimal 255 karakter'],
  },
  password: {
    type: String,
    required: [true, 'Password harus diisi'],
    maxlength: [255, 'Pandjang password maksimal 255 karakter'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  token: [String],

}, { timestamps: true });

userSchema.path('email').validate((value) => {
  const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return EMAIL_RE.test(value);
}, (attr) => `${attr.value} harus merupakan email yang valid!`);

userSchema.path('email').validate(async function (value) {
  try {
    const count = await this.model('User').count({ email: value });

    return !count;
  } catch (err) {
    throw err;
  }
}, (attr) => `${attr.value} sudah terdaftar`);

const HASH_ROUND = 10;
userSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

module.exports = model('User', userSchema);
