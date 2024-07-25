const mongoose=require('mongoose');
const commentSchema=mongoose.Schema({
    comment:String,
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model("comment",commentSchema);