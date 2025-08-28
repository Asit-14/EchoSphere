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

// Social auth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleCallback
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', 
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  githubCallback
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', 
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  facebookCallback
);

router.post('/verify-token', verifyToken);

module.exports = router;
