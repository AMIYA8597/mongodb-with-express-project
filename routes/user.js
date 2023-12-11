const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.flash("success", "User Register successfully");
      res.redirect("/listings");
    } catch (err) {
      console.log("error", err.message);
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    // res.send("Welcome to MajorProject ! You are logged in!")
    req.flash("success","Welcome to MajorProject ! You are logged in!")
    res.redirect("/listings")
  }
);

// router.post("/login", async (req, res) => {
//     try {
//         let { username, password } = req.body;
//   const newUser = new User({ username });
//   const loginUser = await User.register(newUser, password);
//   console.log(loginUser);
//   req.flash("success", "User login successfully");
//   res.redirect("/listings");
//     }
//     catch (err) {
//         console.log("error", err.message);
//         req.flash("error", err.message);
//         res.redirect("/login");
//     }
// });

module.exports = router;
