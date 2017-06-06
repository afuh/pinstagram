const passport = require('passport');
const mongoose = require('mongoose');
const promisify = require("es6-promisify");

const User = mongoose.model('User');

// https://github.com/saintedlama/passport-local-mongoose#simplified-passportpassport-local-configuration
passport.use(User.createStrategy());


const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    callbackURL: process.env.APP_URL,
    enableProof: true,
    profileFields: ['id', 'displayName', 'email', 'cover']
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ oauthID: profile.id }, function(err, user) {
      if(err) {
        console.log(err);  // handle errors!
      }
      if (!err && user !== null) {
        done(null, user);
      } else {
        const user = new User({
          oauthID: profile.id,
          name: profile.displayName,
          username: profile.displayName.replace(/ /g,''),
          avatar: profile._json.cover.source,
          email: profile.emails[0].value
        });
        user.save(function(err) {
          if(err) {
            console.log(err);  // handle errors!
          } else {
            console.log("saving user ...");
            done(null, user);
          }
        });
      }
    });
  }
));



// http://www.passportjs.org/docs#sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
