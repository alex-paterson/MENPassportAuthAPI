const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
var passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignIn = passport.authenticate('local', {session: false});

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res, next) {
    res.send({hi: 'there'});
  });
  app.post('/signin', requireSignIn, Authentication.signin);
  app.post('/signup', Authentication.signup);
};
