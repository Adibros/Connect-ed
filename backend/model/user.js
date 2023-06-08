const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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
    }],

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});





userSchema.pre("save", async function(next){
    //agr password modify hua h tbhi crypt kro nhi toh voh hashed pass ko phirse hash krdega
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }

    next();
});

userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password);
} 

userSchema.methods.generateToken = async function(){
    return jwt.sign({_id:this._id},process.env.JWT_SECRET);
}

userSchema.methods.passwordToken = async function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    console.log(resetToken);

    // database me toh super encypt hoke store ho
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // 10 min k liye token valid rhega
    thyis.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
}

userSchema.methods.getResetPasswordToken = async function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    console.log(resetToken);

    // aur hash krdiya token
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    //10 min k liye valid token
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model("User",userSchema);