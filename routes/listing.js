const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const methodOverride = require("method-override");
const {
  isLoggedIn,
  onlyOwnerUsed,
  validateListing,
} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListingForm)
  );

router
  .route("/:id")
  .get(isLoggedIn, wrapAsync(listingController.showListingForm))
  .put(
    isLoggedIn,
    onlyOwnerUsed,
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    onlyOwnerUsed,
    wrapAsync(listingController.deleteListing)
  );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get(
  "/:id/edit",
  isLoggedIn,
  onlyOwnerUsed,
  wrapAsync(listingController.editListingForm)
);

module.exports = router;








//*************************index route******************************************
// index Route

// router.get("/", wrapAsync(listingController.index));

//****************************new route****************************************

// show routes

// router.get("/:id", isLoggedIn, wrapAsync(listingController.showListingForm));

//   create Route

// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListingForm)
// );

//**********************edit routing**************************

// *********************update Route *****************************

// router.put(
//   "/:id",
//   isLoggedIn,
//   onlyOwnerUsed,
//   validateListing,
//   wrapAsync(listingController.updateListing)
// );

// **********************delete Route*******************************************

// router.delete(
//   "/:id",
//   isLoggedIn,
//   onlyOwnerUsed,
//   wrapAsync(listingController.deleteListing)
// );
