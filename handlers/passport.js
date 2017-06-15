const passport = require('passport');
const mongoose = require('mongoose');

const User = mongoose.model('User');

// https://github.com/saintedlama/passport-local-mongoose#simplified-passportpassport-local-configuration
passport.use(User.createStrategy());

// https://github.com/jaredhanson/passport-facebook
const FacebookStrategy = require('passport-facebook').Strategy;
const options = {
    clientID: process.env.APP_ID,
    clientSecret: process.env.APP_SECRET,
    callbackURL: process.env.APP_URL,
    enableProof: true,
    profileFields: ['id', 'displayName', 'email', 'cover']
}

passport.use(new FacebookStrategy(options, (accessToken, refreshToken, profile, done) => {
  User.findOne({ oauthID: profile.id }, (err, user) => {
    if (err) {
      done(err)
    }
    if (!err && user !== null) {
      done(null, user);
    } else {
        const user = new User({
          oauthID: profile.id,
          name: profile.displayName,
          username: slug(profile.displayName),
          avatar: profile._json.cover.source,
          email: profile.emails[0].value
        });
        user.save(function(err) {
          if(err) {
            done(err)
          } else {
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


// Slightly modified version of slugs
// https://github.com/Aaronontheweb/node-slugs
function slug (str) {
  const p = ['.', '=', '-'];
  const s = '';
  return str.toLowerCase().
      replace(/ü/g, 'ue').
      replace(/ä/g, 'ae').
      replace(/ö/g, 'oe').
      replace(/ß/g, 'ss').
      replace(/á/g, 'a').
      replace(/é/g, 'e').
      replace(/í/g, 'i').
      replace(/ó/g, 'o').
      replace(/ú/g, 'u').
      replace(new RegExp('[' + p.join('') + ']', 'g'), ' ').
      replace(/-{2,}/g, ' ').
      replace(/^\s\s*/, '').replace(/\s\s*$/, '').
      replace(/[^\w\ ]/gi, '').
      replace(/[\ ]/gi, s);
}
