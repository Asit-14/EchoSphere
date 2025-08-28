const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
  updateUser,
  changePassword,
  deleteAccount,
} = require("../controllers/userController");

const {
  googleCallback,
  githubCallback,
  facebookCallback,
  verifyToken,
} = require("../controllers/socialAuthController");

const passport = require('../config/passport');
const { uploadAvatar } = require("../controllers/userControllerExtensions");
const upload = require("../utils/uploadMiddleware");
const router = require("express").Router();

// Regular auth routes
router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);
router.post("/updateuser/:id", updateUser);
router.post("/changepassword/:id", changePassword);
router.post("/deleteaccount/:id", deleteAccount);
router.post("/uploadavatar/:id", upload.single("avatar"), uploadAvatar);

// Social auth routes with fallbacks for development environment
router.get('/google', (req, res, next) => {
  console.log('Google auth route accessed');
  
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log('Google OAuth credentials not set up');
    return res.redirect(`${process.env.CLIENT_URL}/login?error=google_not_configured`);
  }
  
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: process.env.CLIENT_URL + '/login?error=google_auth_failed' 
  }),
  googleCallback
);

router.get('/github', (req, res, next) => {
  console.log('GitHub auth route accessed');
  
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.log('GitHub OAuth credentials not set up');
    return res.redirect(`${process.env.CLIENT_URL}/login?error=github_not_configured`);
  }
  
  passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
});

router.get('/github/callback', 
  passport.authenticate('github', { 
    session: false, 
    failureRedirect: process.env.CLIENT_URL + '/login?error=github_auth_failed' 
  }),
  githubCallback
);

router.get('/facebook', (req, res, next) => {
  console.log('Facebook auth route accessed');
  
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    console.log('Facebook OAuth credentials not set up');
    return res.redirect(`${process.env.CLIENT_URL}/login?error=facebook_not_configured`);
  }
  
  passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
});

router.get('/facebook/callback', 
  passport.authenticate('facebook', { 
    session: false, 
    failureRedirect: process.env.CLIENT_URL + '/login?error=facebook_auth_failed' 
  }),
  facebookCallback
);

router.post('/verify-token', verifyToken);

module.exports = router;
