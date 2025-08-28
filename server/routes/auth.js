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

// Fallback route for any social login attempts (for backward compatibility)
router.get('/:provider', (req, res) => {
  return res.redirect(`${process.env.CLIENT_URL}/login?error=social_login_removed`);
});

module.exports = router;
