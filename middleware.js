const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./utils/ExpressError");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
    
    req.session.redirectUrl=req.originalUrl;//we are storing original path url in a variable so we can access it any file
    //before login we are storing because we want to redirect on same path from where we logged in
    //login hoge toh access kar lege path pr agr login nahi tb ke liye url store karvaye
    //but passport redirect url ko delete kar deta hai isiliye ham isko res.locals ke andar store karva lege
    if(!req.isAuthenticated()){
        req.flash("error","!Please Logged in Firstly!");
        return res.redirect("/login");
    }
    next();//middlware ke sath next hona chahiye
}
//login hoge toh access kar lege path pr agr login nahi tb ke liye url store karvaye
    //but passport redirect url ko delete kar deta hai isiliye ham isko req.locals ke andar store karva lege
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params
    let listing=await Listing.findById(id);
    if (!listing.owner || !listing.owner.equals(res.locals.currUser._id)){//listing owner hi update,delete kar payega agr nahi h owner toh error flash hoga
        req.flash("error","You are not owner of this listing");
        return res.redirect(`/listing/${id}`);//agr return nahi karege toh niche ki bhi chiz exxecute hogi
    }
   next();
}

// Middleware to validate the listing using Joi
module.exports.listingValidate = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    console.log(error);
    
    if (error) {
        throw new ExpressError(400, error.details.map(el => el.message).join(', '));
    } else {
        next();
    }
};

// Middleware to validate the reviews using Joi

module.exports.schemaValidate=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    console.log(error);
    if(error){
      throw new ExpressError(400,error);
    }else{
      next(error);
    }
  }
  module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params
    let review=await Review.findById(reviewId);
    if (!review.author || !review.author.equals(res.locals.currUser._id)){//listing owner hi update,delete kar payega agr nahi h owner toh error flash hoga
        req.flash("error","You are not author of this review");
        return res.redirect(`/listing/${id}`);//agr return nahi karege toh niche ki bhi chiz exxecute hogi
    }
   next();
}