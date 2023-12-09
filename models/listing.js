const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        type: String,
        default: "https://www.google.com/imgres?imgurl=https%3A%2F%2Fthumbs.dreamstime.com%2Fz%2Frandom-click-squirrel-wire-random-picture-cute-squirrel-219506797.jpg&tbnid=ADKlCsGJ66uOGM&vet=12ahUKEwj6jtecv9qCAxVa2zgGHXQ7CeUQMygJegQIARBZ..i&imgrefurl=https%3A%2F%2Fwww.dreamstime.com%2Frandom-click-squirrel-wire-random-picture-cute-squirrel-image219506797&docid=C063LPn7sNb0TM&w=1600&h=1290&q=random%20image&ved=2ahUKEwj6jtecv9qCAxVa2zgGHXQ7CeUQMygJegQIARBZ",
        set: (v) =>
            v === ""
                ? "https://www.google.com/imgres?imgurl=https%3A%2F%2Fthumbs.dreamstime.com%2Fz%2Frandom-click-squirrel-wire-random-picture-cute-squirrel-219506797.jpg&tbnid=ADKlCsGJ66uOGM&vet=12ahUKEwj6jtecv9qCAxVa2zgGHXQ7CeUQMygJegQIARBZ..i&imgrefurl=https%3A%2F%2Fwww.dreamstime.com%2Frandom-click-squirrel-wire-random-picture-cute-squirrel-image219506797&docid=C063LPn7sNb0TM&w=1600&h=1290&q=random%20image&ved=2ahUKEwj6jtecv9qCAxVa2zgGHXQ7CeUQMygJegQIARBZ" : v,
    },
    price: String,
    location: String,
    country: String,
    
    reviews: [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ]

});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {    
    await Review.deleteMany({ _id: {$in: listing.reviews}});
    };
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
