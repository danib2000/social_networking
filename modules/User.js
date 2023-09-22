const mongoose = require("mongoose");
const Scheme = mongoose.Schema;
const userScheme = new Scheme({
    userName      : {type: String, required: true, unique:true},
    email         : {type: String, required: true},
    salt          : {type: String, required: true},
    token         : {type: String, required: false},
    passwordHash  : {type: String, required: true},
    firstName     : {type:String},
    lastName      : {type:String},
    notification  : {type:Number, default:0}
});
module.exports = mongoose.model("User", userScheme);
