const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const methodOverride = require("method-override");
const { isLoggedIn , onlyOwnerUsed, validateListing } = require("../middleware.js");



//   const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     console.log("result is :", result);
//     if (result.error) {
//       let errMsg = error.details.map((el) => el.message).join(",");
//       throw new ExpressError(400, errMsg);
//     } else {
//       next();
//     }
//   };

//*************************index route******************************************

router.get(
  "/",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//****************************new route****************************************

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// show routes

router.get(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const idlisting = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!idlisting) {
      req.flash("error", "Your listing doesn't existing");
      res.redirect("/listings");
    }
    console.log(idlisting);
    res.render("listings/show.ejs", { idlisting });
  })
);

//   create Route

router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.Listing);
    // console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("ssuccess", "New Listing Created");
    res.redirect("/listings");
  })
);

//**********************edit routing**************************

router.get(
  "/:id/edit",
  isLoggedIn,
  onlyOwnerUsed,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const idlisting = await Listing.findById(id);
    if (!idlisting) {
      req.flash("error", "Your listing doesn't existing");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { idlisting });
  })
);

// *********************update Route *****************************

router.put(
  "/:id",
  isLoggedIn,
  onlyOwnerUsed,
  validateListing,
  wrapAsync(async (req, res) => {
    // if (!req.body.Listing) {
    //     throw new ExpressError(400, "send valid data for listing")
    // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  })
);

// **********************delete Route*******************************************

router.delete(
  "/:id",
  isLoggedIn,
  onlyOwnerUsed,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListings = await Listing.findByIdAndDelete(id);

    console.log(deleteListings);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
