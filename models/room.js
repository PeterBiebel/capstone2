const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Room = new Schema({
    name: String,
    date: String,
    owner: String,
   
    
});




module.exports = mongoose.model('rooms', Room);
