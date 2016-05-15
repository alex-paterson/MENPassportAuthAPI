var passport = require('passport');
var User = require('../models/user');
var config = require('../config');
var JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


// Create local strategy
const loginOptions = {
  usernameField: 'email',
};

const localLogin = new LocalStrategy(loginOptions, function(email, password, done) {
  // Verify this username and password
  User.findOne({email: email}, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }
      return done(null, user);
    });
  });
});


// Set up options for JWT Strategy
var jwtOptions = {
  secretOrKey: config.secret,
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
};

// Create strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findById(payload.sub, function(err, user) {
    if (err) {return done(err, false);}
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});


// Tell passport to use strategy
passport.use(jwtLogin);
passport.use(localLogin);
