var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var userModel = require('../model/userModel');

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.TOKEN_SEC_KEY;
  passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    let user = await userModel.findOne({_id: jwt_payload._id});
    if (user) {
        done(null, user);
    } else {
        done(null, false);
    }
  }));
};
