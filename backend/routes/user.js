const express = require("express");
const { register,login, followUser, logoutUser, updatePassword, updateProfile } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/auth");


const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);

router.route("/logout").get(logoutUser);

router.route("/update/password").put(isAuthenticated,updatePassword);

router.route("/update/profile").put(isAuthenticated,updateProfile);

router.route("/follow/:id").get(isAuthenticated,followUser);

module.exports = router;