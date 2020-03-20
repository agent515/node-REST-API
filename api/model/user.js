const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    email : { type : String, required : true, unique : true},       //unique optimizes the access and does not validate the uniqueness of the field-value
    password : { type : String, required : true}
});

module.exports = mongoose.model('User', userSchema);