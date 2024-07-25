const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const { profile } = require('console');

const userSchema=new mongoose.Schema({
 username:{
     type:String,
     required:true
 },
 password:{
    type:String,
    required:true
 },
 email:{
    type:String,
    required:true
 },
 fullname:{
    type:String,
    required:true

 },
 profile:{
    type:String,
 },
 post:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post"
 }],
 likes:[{
   type:mongoose.Schema.Types.ObjectId,
   ref:"Post"
}]
 
 


})
userSchema.methods.generateToken=async function(){
 return jwt.sign({
    _id:this._id,
    username:this.username,
    email:this.email

 },
 "Neeleshkumarmeena",
 {expiresIn:"7d"}
 )
}
module.exports=mongoose.model("User",userSchema)