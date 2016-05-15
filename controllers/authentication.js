const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');


function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({
    sub: user.id,
    iat: timestamp
  }, config.secret);
}

exports.signin = function(req, res, next) {
  // Email and password already authed, we need to give them a token.
  var user = req.user;
  res.send({token: tokenForUser(user)});

}

exports.signup = function(req, res, next) {
  // See if a user with given email exists
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(422).send({error:"You must provide email and password."})
  }

  // Return error if they do exist
  User.findOne({email: email}, function (err, existingUser) {
    if (err) { return next(err); };
    if (existingUser) {
      return res.status(422).send({error: "Email is in use."})
    }

    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err); };

      res.json({token: tokenForUser(user)});
    });
  });
}
