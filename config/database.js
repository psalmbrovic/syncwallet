const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Connect to Database
 * @returns void
 */

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`DB connected to: ${connection.connection.host}`);
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
