const Listing=require("../models/listing");
const mongoose = require('mongoose');

//controller is used to write callbacks
//here all the callbacks of listing
//index call back
module.exports.index=async (req, res,next) => {
    try{ 
      const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
    }catch(err){
      next(err);
    }
  };
//new callback
  module.exports.New=(req, res) => {
    res.render("listing/new.ejs");
  };
//show callback
  module.exports.show=async (req, res) => {
    let { id } = req.params;// Validate the id to ensure it's a valid ObjectId
    
    const listing = await Listing.findById(id)
    .populate({path:"reviews",
      populate:{path:"author"},
    }).//nested populate
    populate("owner");//puri infomation ayegi database se owner aur reviews ki 
    //detail information of other database which connected with listing uski info print karvane ke liye we use .populate
    if(!listing){
      req.flash("error","Listing does not existing!");
      req.redirect("/listing");
    }
    res.render("listing/show.ejs", { listing });

  };

//create callback
module.exports.create=async (req, res,next) => {
    let url=req.file.path;//link dega image ki
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;//owner ki id bhi add karege listing mei
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing is Created!");
    res.redirect("/listing");
};


//edit callback
module.exports.edit=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing does not existing!");
      req.redirect("/listing");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_230,h_150");//image qaulity kam kar rahe we are just displaying preview at the time of editing
    res.render("listing/edit.ejs", { listing,originalImageUrl });
  };

  //update

module.exports.update=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing },{new:true});
    if(typeof req.file!=="undefined"){
       let url=req.file.path;
       let filename=req.file.filename;
       listing.image={url,filename};
       await listing.save();
    }

    req.flash("success","Listing is updated!");
    res.redirect(`/listing/${id}`);
  };

  //delete
  module.exports.Delete=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing is deleted!");
    res.redirect("/listing");
  };