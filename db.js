const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    {
        if(mongoose.Connection.readyState===1)return;
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(mongoose.connection.readyState)
    }
    
  
};

module.exports = connectDB; // Ensure this line is present



