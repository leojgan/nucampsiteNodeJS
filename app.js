const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
/* ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
because of JavaScript's higher-order functions, we are calling the
function being returned by require('session-file-store') with the
parameter of (session), which we just got from require('express-session)
*/
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// This connect method refers to connecting to the MongoDB server
// then methods have an optional second argument that will run if an error is caught
// removes necessity for .catch method. Useful if you're not chaining promises.
connect.then(
  () => console.log('Connection to nucampsite collection in the MongoDB server successful.'), // first argument, what to do once Promise is resolved
  err => console.log(err) // second argument, what to do if Promise throws an error
);

const app = express();
// app.use(cookieParser('12345-67890-09876-54321')); ...don't  use Cookie-Parser with Express-Session

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  // if no updates are made in a session, the session will not be saved
  saveUninitialized: false,
  // When true, this will force the session to be saved back to the session store, even if there were no updates
  // Typically, you'll want to set this as false
  resave: false,
  store: new FileStore()
}));

function auth(req, res, next){
  console.log(req.session);
  if (!req.session.user) {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
      const err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }

    // Buffer is a type of object used to represent a fixed-sized chunk of data
    // here we are taking the Base-64 portion of the string and converting it into binary
      // we then take the Buffer and convert it back into a string
        // by not using an argument in the toString() method, we are using UTF-8 for conversion
      // we then split the string which now reads <username>:<password>
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];
    if (user === 'admin' && pass === 'password') {
      req.session.user = 'admin';
      return next(); // authorized
    } else {
      const err = new Error('You are unauthenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  } else {
    if (req.session.user === 'admin') {
      return next();
    } else {
      const err = new Error('You are not authenticated!');
      err.status = 401;
      return next(err);
    }
  }
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
