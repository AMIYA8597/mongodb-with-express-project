const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema");
const Review = require("../models/review");

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  console.log("result is :", result);
  if (result.error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// //************************Reviews**************************************************
// //post review Route

router.post("/", validateReview, wrapAsync, async (req, res) => {
    // console.log("id",req.params.id);
    // console.log("_id",req.params._id);
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  console.log("new review save");
  res.send("new review saved");

  res.redirect(`/listings/${listing._id}`);
});

//   // ******************delete review route *****************

router.delete(
  "/reveiewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
