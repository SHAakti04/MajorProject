const mongoose = require('mongoose');
const Review=require('./review.js');
const User=require("./user.js");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename:String,
        url: String
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});
//if we delete list then review id also deleted from Review database
listingSchema.post("findOneAndDelete",async(listing)=>{
    await Review.deleteMany({_id: { $in : listing.reviews}});
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
