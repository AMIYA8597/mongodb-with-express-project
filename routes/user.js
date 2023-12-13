const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

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

      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        //successful login with flash message and redirect to home page
        req.flash("success", "Welcome to wanderlust!");
        res.redirect("/listings");
      });

    //   req.flash("success", "User Register successfully");
    //   res.redirect("/listings");
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
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome to MajorProject ! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
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

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are Logged out");
    // res.redirect("/login");
    res.redirect("/listings");
  });
});

module.exports = router;
