const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

  module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  };
  // req.body is where we access the form data that was sent from the new listing page
  // __dirname is a global variable that represents the directory that this script is running in
  // path.join() combines the file paths to create one complete file path string
  module.exports.showListingForm = async (req, res) => {
    let { id } = req.params;
    const idlisting = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!idlisting) {
      req.flash("error", "Your listing doesn't existing");
      res.redirect("/listings");
    }
    console.log(idlisting);
    res.render("listings/show.ejs", { idlisting });
  }
  //   Validation of input fields using express-validator library
  //   The check() function on the request object is used to perform these validations
  //   If any validation fails, an error will be added to the req.errors array
  //   This array can then be passed into the view so it can display the errors for the user
  //   In this case, we are only doing simple text validation for simplicity sake
  //   We also need to use body-parser middleware to parse the incoming request bodies
  //   So that we can access the values of the input fields through req.body
  //   app.use(bodyParser.urlencoded()) should have been included in our main server file
  //   before we defined our routes
  //   When the submit button on the form is clicked, the POST HTTP method is used
  //   and the data from the form is sent in the request body
  //   Our route handler for the /listings route with the HTTP GET method is not suitable
  //   because it does not handle the submission of the form
  //   Instead, we need to define a route handler for the /listings route with the HTTP POST method
  //   That way, when the form is submitted, the data from the form can be accessed through req.body
  //   And we can process the form data accordingly
  //   Note that we don't actually save anything to the database yet
  //   All we do is log the data to the console for now
  //   To see the logged output, open your terminal and run node app
  //   Then visit http://localhost:3000/listings in your web browser
  module.exports.createListingForm = async (req, res, next) => {
    const newListing = new Listing(req.body.Listing);
    // console.log(req.user);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("ssuccess", "New Listing Created");
    res.redirect("/listings");
  }
  module.exports.editListingForm = async (req, res) => {
    let { id } = req.params;
    const idlisting = await Listing.findById(id);
    if (!idlisting) {
      req.flash("error", "Your listing doesn't existing");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { idlisting });
  }
  module.exports.updateListing = async (req, res) => {
    // if (!req.body.Listing) {
    //     throw new ExpressError(400, "send valid data for listing")
    // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  }
  module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deleteListings = await Listing.findByIdAndDelete(id);

    console.log(deleteListings);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  }


