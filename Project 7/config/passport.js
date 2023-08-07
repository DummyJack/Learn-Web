const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user._id); // 將 mongoDB 的 id，存在 session，並且將 id sign 後，以 Cookie 的形式給使用者
});

passport.deserializeUser(async (_id, done) => {
  let foundUser = await User.findOne({ _id });
  done(null, foundUser); // 將 req.user 這個屬性設定為 foundUser
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.Google_CLIENT_ID,
      clientSecret: process.env.Google_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(profile);
      try {
        let foundUser = await User.findOne({ googleID: profile.id }).exec();
        if (foundUser) {
          done(null, foundUser);
        } else {
          let newUser = new User({
            name: profile.displayName,
            googleID: profile.id,
            thumbnail: profile.photos[0].value,
            email: profile.emails[0].value,
          });
          let saveUser = await newUser.save();
          done(null, saveUser);
        }
      } catch (e) {
        console.log(e);
      }
    }
  )
);
