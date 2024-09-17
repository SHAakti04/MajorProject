const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");
    
    // Initialize the database
    await initDB();
  } catch (err) {
    console.error("Error connecting to DB or initializing data:", err);
  } finally {
    // Close the connection when done
    mongoose.connection.close();
  }
}

const initDB = async () => {
  try {
    // Delete all existing documents in the 'Listing' collection to ensure a clean slate
    await Listing.deleteMany({});

    // Modify each object in 'initData.data' to add an 'owner' property with a specific value
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: '66dd8a9cc245f6c8c9bce172',  // Set a default owner ID for each listing
    }));

    // Insert the modified data into the 'Listing' collection
    await Listing.insertMany(initData.data);

    // Log a success message indicating that the data initialization was successful
    console.log("Data was initialized");
  } catch (err) {
    // Catch and log any errors that occur during the data initialization process
    console.error("Error initializing data:", err);
  }
};

// Call the 'main' function to execute the database initialization
main();
