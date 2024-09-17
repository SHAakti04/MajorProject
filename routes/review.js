const express=require("express");
const router=express.Router({mergeParams:true});
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {schemaValidate, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const{addReview,deleteReview}=require("../controllers/reviews.js");
//Review
//child route
//Post route(after submitting review it comes in play and save review in database)
router.post("/",
  isLoggedIn,
  schemaValidate,
  wrapAsync(addReview));
  //delete review route
  router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(deleteReview));

  module.exports=router;