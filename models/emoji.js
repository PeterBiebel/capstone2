const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Emoji = new Schema({
    emoji: String,
    date: String,
    owner: String,
   	
    
});




module.exports = mongoose.model('emoji', Emoji);
