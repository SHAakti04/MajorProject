const express=require('express');
const router=express.Router();//to connect routes between database
const ExpressError=require("../utils/ExpressError.js");
const wrapAsync=require("../utils/wrapAsync.js");
//parentfile me child file ko use karna hai toh ./
//child file mei parent file  ko use ,require karna hai toh ../

const Listing = require("../models/listing.js");
const{isLoggedIn,isOwner,listingValidate}=require("../middleware.js");
const{index,New,show,create,edit,update,Delete}=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

//Index Route
router.get("/", wrapAsync(index));
  
  //New Route
  router.get("/new",isLoggedIn,New );
  
  //Show Route
  router.get("/:id", show);
  
  //Create Route
 router.post("/",isLoggedIn,upload.single('listing[image]'),listingValidate, wrapAsync(create));
  //Edit Route
   router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync(edit));
  
  //Update Route
  router.put("/:id",
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    listingValidate,
    wrapAsync( update));
  
  //Delete Route
  router.delete("/:id",
    isLoggedIn,
    isOwner,
   wrapAsync( Delete));
  
  module.exports=router;