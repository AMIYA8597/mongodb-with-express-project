const express = require("express");
const router = express.Router()
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema, reviewSchema } = require("../schema");
const methodOverride = require("method-override");



const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };
  
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
  
  router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  // show routes
  
  router.get(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const idlisting = await Listing.findById(id).populate("reviews");
      res.render("listings/show.ejs", { idlisting });
    })
  );
  
  //   create Route
  
  router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res, next) => {
      const newListing = new Listing(req.body.Listing);
      await newListing.save();
      res.redirect("/listings");
    })
  );
  
  //**********************edit routing**************************
  
  router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      const idlisting = await Listing.findById(id);
      res.render("listings/edit.ejs", { idlisting });
    })
  );
  
  // *********************update Route *****************************
  
  router.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {
      // if (!req.body.Listing) {
      //     throw new ExpressError(400, "send valid data for listing")
      // }
      let { id } = req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listing });
      res.redirect(`/listings/${id}`);
    })
  );
  
  // **********************delete Route*******************************************
  
  router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      let deleteListings = await Listing.findByIdAndDelete(id);
      console.log(deleteListings);
      res.redirect("/listings");
    })
  );

  module.exports = router;