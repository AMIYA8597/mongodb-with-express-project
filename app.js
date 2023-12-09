const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");
const Joi = require("joi");
const Review = require("./models/review");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  console.log("root is working");
  res.send("root is working");
});

// const validateListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   console.log("result is :", result);
//   if (result.error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

// const validateReview = (req, res, next) => {
//   let { error } = reviewSchema.validate(req.body);
//   console.log("result is :", result);
//   if (result.error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, errMsg);
//   } else {
//     next();
//   }
// };

// //*************************index route******************************************

// app.get(
//   "/listings",
//   wrapAsync(async (req, res) => {
//     let allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
//   })
// );

// //****************************new route****************************************

// app.get("/listings/new", (req, res) => {
//   res.render("listings/new.ejs");
// });

// // show routes

// app.get(
//   "/listings/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const idlisting = await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", { idlisting });
//   })
// );

// //   create Route

// app.post(
//   "/listings",
//   validateListing,
//   wrapAsync(async (req, res, next) => {
//     // let { title, description, price, image ,country, location} = req.body;
//     // let listing = req.body.Listing;
//     // try {
//     //     const newListing = new Listing(req.body.listing);
//     //     await newListing.save()
//     //     res.redirect("/listings");
//     // } catch (error) {
//     //     next(err)
//     // }
//     // if (!req.body.Listing) {
//     //     throw new ExpressError(400, "send valid data for listing")
//     // }

//     const newListing = new Listing(req.body.Listing);

//     // if (!newListing.title) {
//     //     throw new ExpressError(400, "send valid data for title")
//     // }
//     // if (!newListing.description) {
//     //     throw new ExpressError(400, "send valid data for description")
//     // }
//     // if (!newListing.location) {
//     //     throw new ExpressError(400, "send valid data for location")
//     // }
//     await newListing.save();
//     // console.log("my new Listing", Listing);
//     res.redirect("/listings");
//     // res.redirect(`/listings/${newListing._id}`);
//   })
// );

// //**********************edit routing**************************

// app.get(
//   "/listings/:id/edit",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     const idlisting = await Listing.findById(id);
//     res.render("listings/edit.ejs", { idlisting });
//   })
// );

// // *********************update Route *****************************

// app.put(
//   "/listings/:id",
//   validateListing,
//   wrapAsync(async (req, res) => {
//     // if (!req.body.Listing) {
//     //     throw new ExpressError(400, "send valid data for listing")
//     // }
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
//   })
// );

// // **********************delete Route*******************************************

// app.delete(
//   "/listings/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let deleteListings = await Listing.findByIdAndDelete(id);
//     console.log(deleteListings);
//     res.redirect("/listings");
//   })
// );

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// //************************Reviews**************************************************
// //post review Route

// app.post(
//   "/listings/:id/reviews",
//   validateReview,
//   wrapAsync,
//   (async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();

//     console.log("new review save");
//     res.send("new review saved");

//     res.redirect(`/listings/${listing._id}`)
//   })
// );

//   // ******************delete review route *****************

//     app.delete("/listings/:id/reviews/reveiewId", wrapAsync (async (req,res) => {
//        let { id, reviewId } = req.params;
//        await Listing.findByIdAndUpdate(id, {$pull : {reviews: reviewId}});
//        await Review.findByIdAndDelete(reviewId);
//        res.redirect(`/listings/${id}`)

//     })

// )

// app.get("/listings/:id", async (req, res) => {
//     let { id } = req.params;
//     let idListing = await Listing.findById(id);
//     res.render("listings/show.ejs" , { idListing })
// })

// app.get("/test", async (req, res) => {
//     let sampleList = new listing({
//         title: "Random",
//         description: "Bird image",
//         price: 1290,
//         location: "Washinton",
//         country: "UIEvent.S"
//     })
//     await sampleList.save();
//     console.log("sample saved successfully");
//     res.send("test successful")

// })

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found:"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong !" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(5002, (req, res) => {
  console.log("server is running on port 5002");
});
