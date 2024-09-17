const User=require("../models/user");

//signup
module.exports.renderSignUp=(req, res) => {
    res.render("users/signup.ejs");
}

module.exports.saveSignUp=async (req, res, next) => {
    try {
        let { username, email, password } = req.body; // extracting username, email, and password from request body
        
        const newUser = new User({ username, email }); // create a new user instance with username and email
        const registerUser = await User.register(newUser, password); // password is automatically converted to a hash code using the Passport local-mongoose plugin
        console.log(registerUser); // log the registered user details

        req.login(registerUser, (err) => { // after signup, log in the user automatically
            if (err) {
                return next(err); // if an error occurs during login, pass it to the error handler
            }
            req.flash("success", "Welcome to WanderLust!"); // flash success message after signup and login
            res.redirect("/listing"); // redirect to the previously saved URL or home if undefined
        });
        
    } catch (e) {
        req.flash("error", "Username already existed!"); // if a username already exists, flash an error message
        res.redirect("/signup"); // redirect back to the signup page
    }
};

//login
module.exports.renderLogin=(req, res) => {
    res.render("users/login.ejs"); // Render the login form for the user
};
module.exports.saveLogin=async (req, res) => {            // If login is successful, this function is called
    req.flash("success", "Welcome back to WanderLust!"); // Flash a success message to the user

    // Determine the redirect URL; default to "/listing" if not set
    let redirectUrl = res.locals.redirectUrl || "/listing";
    console.log("RedirectURL",res.locals.redirectUrl);
    
    // Redirect the user to the determined URL
    res.redirect(redirectUrl);
};

//logout
module.exports.Logout=(req,res,next)=>{
    req.logout((err)=>{//inbuilt method for logout
        if(err){
            return next(err);
        }
        req.flash("success","LogOut Successfully");
        res.redirect("/listing");
    });
};

