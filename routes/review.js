const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema");
const Review = require("../models/review");
const {validateReview, isLoggedIn , onlyAuthorUsed } = require("../middleware.js")


// //************************Reviews**************************************************
// //post review Route

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log("newReview", newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("new review save");
    req.flash("success", "New Review Created")
    res.redirect(`/listings/${listing._id}`);
  })
);

//   // ******************delete review route *****************


router.delete(
  "/reveiewId",
  isLoggedIn,
  onlyAuthorUsed,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted")
    res.redirect(`/listings/${_id}`);
  })
);

module.exports = router;
