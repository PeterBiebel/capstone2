const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Comment = new Schema({
    comment: String,
    date: String,
    owner: String,
   	roomId: String,
    likes:{type: Number, default: 0},
    dislikes:{type: Number, default: 0},
    name: String,
    sentiment: Object,
});




module.exports = mongoose.model('comments', Comment);
