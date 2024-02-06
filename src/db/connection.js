const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connect successfully.")

    } catch (error) {
        console.log('error >>>', error);
        process.exit(0); 
    }
}


module.exports = connectDB;