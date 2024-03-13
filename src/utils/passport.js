const passport = require('passport');
const userModel = require('../models/userModel');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GitHubStrategy = require('passport-github2').Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

// Passport session setup
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((id, done) => {
    done(null, id);
    // Find user by ID and deserialize
});

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    passReqToCallback: true,
},
    async function (request, accessToken, refreshToken, profile, done) {
        try {
            const { id, _json: { name, picture, email } } = profile;

            let user = await userModel.findOne({ googleId: id }, { token: 0 });
            if (!user) {
                user = await userModel.findOne({ email }, { token: 0 });
                if (!user) {
                    const userdata = {
                        fullName: name, profileImage: picture, email, googleId: id
                    }

                    user = new userModel(userdata);

                    await user.save();
                } else {
                    return done(null, false, { message: "email already exists" });
                }
            }
            // generate token
            const token = await user.generateToken();
            user = await userModel.findByIdAndUpdate({
                _id: user._id
            }, {
                token
            }, { new: true })
            return done(null, user)
        } catch (error) {
            return done(error, null)
        }
    }
));

// Configure facebook strategy
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'emails']
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            const { id, _json: { name, email } } = profile;

            let user = await userModel.findOne({ facebookId: id }, { token: 0 });
            if (!user) {
                const userdata = {
                    fullName: name,  email, facebookId: id
                }

                user = new userModel(userdata);

                await user.save();
            }
            // generate token
            const token = await user.generateToken();
            user = await userModel.findByIdAndUpdate({
                _id: user._id
            }, {
                token
            }, { new: true })
            return done(null, user)
        } catch (error) {
            return done(error, null)
        }
    }
));

// Configure github strategy
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback",
    profileFields: ['id', 'displayName', 'photos', 'emails']
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
        const { id, _json: { name, email,avatar_url } } = profile;

        let user = await userModel.findOne({ githubId: id }, { token: 0 });
        if (!user) {
            const userdata = {
                fullName: name,  email, githubId: id, profileImage: avatar_url
            }

            user = new userModel(userdata);

            await user.save();
        }
        // generate token
        const token = await user.generateToken();
        user = await userModel.findByIdAndUpdate({
            _id: user._id
        }, {
            token
        }, { new: true })
        return done(null, user)
    } catch (error) {
        return done(error, null)
    }
}
));