const Listing=require("../models/listing");
const Review=require("../models/review");

module.exports.addReview=async(req,res,next)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
   console.log("new review was saved successfully");
   req.flash("success","New review is Created!");
   res.redirect(`/listing/${listing._id}`);
  };

  module.exports.deleteReview=async(req,res)=>{
    const { id:listingId, reviewId:reviewId } = req.params;
  
    console.log('Listing ID:', listingId);  // Debugging
    console.log('Review ID:', reviewId);    // Debugging
  
    // Remove the review from the listing's reviews array
    await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId } });
    //listing ke andr ke reviews se jo bhi reviewId match hogi usko delete karege
  
    // Delete the review
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review is deleted");
    res.redirect(`/listing/${listingId}`);
  };