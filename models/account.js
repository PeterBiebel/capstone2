const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Account = new Schema({
    username: String,
    password: String,
    email: String,
    bio: String,
    address: String,

});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);
