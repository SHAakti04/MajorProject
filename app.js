if(process.env.NODE_ENV!="production"){
  require("dotenv").config();//use to connect environment into backend
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //this is used when we apply boilerplate
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const MongoStore=require("connect-mongo");


const dbURL=process.env.ATLAS_URL;

const store=MongoStore.create({
  mongoUrl:dbURL,
  crypto:{
    secret:process.env.SECRET  //encryption
  },
  touchAfter:24*3600,//it stores last time update
});
// Session configuration options
const sessionOptions = {
  store,
  secret: process.env.SECRET , // **Your Comment:** session secret
  resave: false, // **My Comment:** Don't save session if nothing is changed
  saveUninitialized: true, // **My Comment:** Save uninitialized session
  cookie: {
    expire: Date.now() + 7 * 24 * 60 * 60 * 1000, // **Your Comment:** cookie expiration date
    maxAge: 7 * 24 * 60 * 60 * 1000, // **Your Comment:** cookie duration (7 days in milliseconds)
    httpOnly: true, // **Your Comment:** avoid cross-scripting attacks
  },
};

store.on('error',()=>{
  console.log("Error in session",error);
});


// Connect to MongoDB
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

// **My Comment:** Async function to connect to the database
async function main() {
  await mongoose.connect(dbURL);
}

// Middleware and configurations
app.set("view engine", "ejs"); // **Your Comment:** EJS as view engine
app.set("views", path.join(__dirname, "views")); // **Your Comment:** Views directory setup
app.engine("ejs", ejsMate); // **Your Comment:** EJS Mate for layout support

// **My Comment:** Parse incoming request body as URL-encoded data (for forms)
app.use(express.urlencoded({ extended: true }));

// **My Comment:** Method override to support PUT and DELETE from forms
app.use(methodOverride("_method"));

// **My Comment:** Serve static files from the /public directory
app.use(express.static(path.join(__dirname, "/public")));

// Session and Flash middleware
app.use(session(sessionOptions)); // **Your Comment:** Set session middleware with options
app.use(flash()); // **Your Comment:** Flash middleware to handle flash messages

// Passport configuration
// **My Comment:** Set up LocalStrategy with passport and user authentication methods
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // **My Comment:** Serialize user info into session
passport.deserializeUser(User.deserializeUser()); // **My Comment:** Deserialize user info from session

app.use(passport.initialize()); // **Your Comment:** Initialize passport
app.use(passport.session()); // **Your Comment:** Use passport session handling

// Flash middleware to pass flash messages to templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // **Your Comment:** Pass success flash message to views
  res.locals.error = req.flash("error"); // **Your Comment:** Pass error flash message to views
  res.locals.currUser=req.user;//for add uthentication.because we cannot access req.user in ejs file so firstly we are storing value in user then accessing it in ejs file
  next(); // **My Comment:** Call next middleware
});

// Routes
app.get("/", (req, res) => {
  res.send("Hi, I am root"); // **Your Comment:** Default root route
});

// **My Comment:** Listing and review routers for handling routes like /listing, /listing/:id/review
app.use("/listing", listingRouter); 
app.use("/listing/:id/review", reviewRouter);
app.use("/", userRouter); // **Your Comment:** User routes

// Catch-all route for undefined routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!")); // **Your Comment:** Catch 404 errors
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const { codeStatus = 500, message = "something went wrong!" } = err;
  res.status(codeStatus).render("error.ejs", { err }); // **Your Comment:** Render error page
});

// **My Comment:** Server starts listening on port 8080
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
