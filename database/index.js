const mongoose = require('mongoose');
const { mongoUrl } = require('../app/config');

mongoose.connect(mongoUrl);
const db = mongoose.connection;

module.exports = db;
