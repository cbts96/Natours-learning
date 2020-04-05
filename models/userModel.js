const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please tell us your name"]
    },
    email:{
        type:String,
        required:[true,"Please provide your email"],
        unique:true,
        lowercase:true
    },
    photo:String,
    password:{
        type:String,
        required:[true,"Please provide your password"],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,"Please confirm password"]
    },
    passwordChangedAt:Date
})
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;
    next();
})
userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.changesPasswordAfter=function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
        
        return JWTTimestamp<changedTimestamp
    }
}
const User=mongoose.model("User",userSchema);
module.exports=User;