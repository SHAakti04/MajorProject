const User=require("../models/user.js");
const express=require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router=express.Router();
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {renderSignUp,saveSignUp,renderLogin,saveLogin,Logout}=require("../controllers/users.js");
//signup
router.get("/signUp", renderSignUp);

router.post("/signup", wrapAsync(saveSignUp));


//login
// GET route for the login page
// When the user visits the "/login" URL, it renders the "login.ejs" view file located in the "users" folder.
router.get("/login", renderLogin);

// POST route for login form submission
// Uses passport's local authentication strategy to handle login logic.
// If authentication fails, it redirects to "/login" and displays an error message via flash.
router.post("/login", 
    saveRedirectUrl,  // Middleware to save the intended redirect URL (if any)
    passport.authenticate("local", { // Use the "local" strategy for user authentication
        failureRedirect: "/login",   // Redirect back to the login page if authentication fails
        failureFlash: true           // Enable flash messages to display login errors
    }), 
    wrapAsync(saveLogin)
);

router.get("/logout",Logout);

// Export the router to be used in other parts of the application
module.exports = router;
