const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
module.exports = {
  rootPath: path.resolve(__dirname, '..'),
  mongoUrl: process.env.MONGO_URL,
  mongoUrlTest: process.env.MONGO_URL_TEST,
  secretkey: process.env.SECRET_KEY,
};
