const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

    avatar : {
        public_id:String,
        url:String
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true,
        minlength:6,
        select:false
    },

    posts : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],

    followers: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],

    following: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]
});

module.exports = mongoose.model("User",userSchema);