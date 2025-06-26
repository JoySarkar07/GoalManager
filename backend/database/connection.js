require('dotenv').config();
const mongoose = require('mongoose');


const connectDB = async () => {
    try{
        await mongoose.connect( process.env.MONGO_URI ).then(()=>{
            console.log("Database connected successfully");
        });
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process with failure
    }
}

module.exports = connectDB;