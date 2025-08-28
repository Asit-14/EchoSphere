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

router.post("/login", login);
router.post("/register", register);
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);
router.post("/updateuser/:id", updateUser);
router.post("/changepassword/:id", changePassword);
router.post("/deleteaccount/:id", deleteAccount);
router.post("/uploadavatar/:id", upload.single("avatar"), uploadAvatar);

module.exports = router;
