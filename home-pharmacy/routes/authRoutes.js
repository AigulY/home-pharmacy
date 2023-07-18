const express = require("express");
const passport = require("passport");
const router = express.Router();
const { refreshCSRF } = require('../middlewares/authMiddleware');
const LocalStrategy = require('passport-local').Strategy;

const {
  render_index,
  render_register,
  register,
  log_out,
  login,
} = require("../controllers/authController");

router.route("/").get(render_index);
router.route("/register").get(render_register).post(register);
router
  .route("/login")
  .get(login)
  .post(
      passport.authenticate("local", {
      successRedirect: "/medications",
      failureRedirect: "/login",
      failureFlash: true,
    }),
    refreshCSRF,
  );
router.route("/logOff").get(log_out);

module.exports = router;
