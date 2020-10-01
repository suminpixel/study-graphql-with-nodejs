const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/User');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { JWT_SECRET } = require('./config');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
  passReqToCallback: true,
};

passport.use(
  'jwt',
  new JwtStrategy(opts, (req, jwt_payload, done) => {
    User.findById(jwt_payload.sub).exec((err, user) => {
      if (err) {
        return done(null, false, req.flash('loginErrorMessage', err.message));
      }
      return done(null, user);
    });
  }),
);

passport.use(
  'admin',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      User.findOne({ email, password }).exec((err, user) => {
        if (err || !user) {
          return done(null, false, req.flash('loginErrorMessage', `${email} 찾을 수 없습니다.`));
        }
        return done(null, user);
      });
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).exec((err, user) => {
    if (err) {
      return done(err);
    }
    done(err, user);
  });
});

module.exports = passport;
