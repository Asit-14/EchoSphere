const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/userModel');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
          // User exists
          return done(null, user);
        }
        
        // Check if email already exists
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          user.provider = 'google';
          await user.save();
          return done(null, user);
        }
        
        // Create new user
        const newUser = await User.create({
          username: profile.displayName.replace(/\s/g, '') + Math.floor(Math.random() * 1000), // Remove spaces and add random number
          email: profile.emails[0].value,
          googleId: profile.id,
          provider: 'google',
          isAvatarImageSet: profile.photos && profile.photos.length > 0,
          avatarImage: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
        });
        
        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// GitHub Strategy
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/github/callback`,
      scope: ['user:email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ githubId: profile.id });
        
        if (user) {
          // User exists
          return done(null, user);
        }
        
        // Get primary email
        const email = profile.emails && profile.emails.length > 0 
          ? profile.emails[0].value 
          : null;
          
        if (!email) {
          return done(new Error('GitHub account does not have a public email'), null);
        }
        
        // Check if email already exists
        user = await User.findOne({ email });
        
        if (user) {
          // Link GitHub account to existing user
          user.githubId = profile.id;
          user.provider = 'github';
          await user.save();
          return done(null, user);
        }
        
        // Create new user
        const newUser = await User.create({
          username: profile.username || 'github_' + Math.floor(Math.random() * 1000),
          email,
          githubId: profile.id,
          provider: 'github',
          isAvatarImageSet: profile.photos && profile.photos.length > 0,
          avatarImage: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
        });
        
        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.SERVER_URL}/api/auth/facebook/callback`,
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ facebookId: profile.id });
        
        if (user) {
          // User exists
          return done(null, user);
        }
        
        // Get email
        const email = profile.emails && profile.emails.length > 0 
          ? profile.emails[0].value 
          : null;
          
        if (!email) {
          return done(new Error('Facebook account does not have a public email'), null);
        }
        
        // Check if email already exists
        user = await User.findOne({ email });
        
        if (user) {
          // Link Facebook account to existing user
          user.facebookId = profile.id;
          user.provider = 'facebook';
          await user.save();
          return done(null, user);
        }
        
        // Create new user
        const newUser = await User.create({
          username: 'fb_' + profile.displayName.replace(/\s/g, '') + Math.floor(Math.random() * 1000),
          email,
          facebookId: profile.id,
          provider: 'facebook',
          isAvatarImageSet: profile.photos && profile.photos.length > 0,
          avatarImage: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
        });
        
        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
