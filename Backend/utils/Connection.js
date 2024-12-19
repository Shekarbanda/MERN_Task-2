const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({
    path:'./.env'
})

function dbConnection(){
    mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));
}



module.exports = dbConnection;
