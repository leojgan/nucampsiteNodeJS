const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();

// GET users listing (will eventually be used as an admin feature)
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
  // since we are registering a new user, first step is to run the User.register method
  User.register(
    // 1st argument: we'll get the username from the request
    new User({username: req.body.username}),
    // 2nd argument: grab the password, also from the request
    req.body.password,
    // 3rd, a callback function to handle errors
    err => {
      if (err) {
        // if err is not null, indicates there was some internal error
        res.statusCode = 500; // the "It's not you, it's me" error
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      } else {
        // if err is null, input was valid, and we can authenticate the new user
        // function takes the req, res, and a callback function for sending data back to the client from the server
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      }
    }
  );
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    const err = new Error('You are not logged in!');
    err.status = 401;
    return next(err);
  }
});

module.exports = router;