const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { decodeToken } = require('./middlewares');
const db = require('./database');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRoute = require('./app/auth/router');
const ticketRoute = require('./app/ticket/router');
const categoryRoute = require('./app/category/router');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(decodeToken());

app.delete('/testing/delete-all-collection', async (req, res) => {
  const { collections } = db;

  await Promise.all(Object.values(collections).map(async (collection) => {
    await collection.deleteMany({});
  }));

  res.status(200).json({ message: 'All collection deleted' });
});
app.use('/auth', authRoute);
app.use('/api', ticketRoute);
app.use('/api', categoryRoute);
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
