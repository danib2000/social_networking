const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const userScheme = new Scheme({
    userName      : {type: String, required: true, unique:true},
    email         : {type: String, required: true},
    role          : {type: String, required: true},
    salt          : {type: String, required: true},
    token         : {type: String, required: false},
    passwordHash  : {type: String, required: true},
    address       : {type:String},
    city          : {type:String},
    region        : {type:String},
    secondAddress : {type:String},
    country       : {type:String},
    secondCity    : {type:String},
    secondRegion  : {type:String},
    walletAddress : {type:String},
    firstName     : {type:String},
    lastName      : {type:String},
    infoAboutUser : {type:String},
    notification  : {type:Number, default:0}
});
module.exports = mongoose.model("User", userScheme);
