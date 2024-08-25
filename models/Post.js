const mongoose=require('mongoose');

const postSchema=mongoose.Schema({
    image:String,
    username:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    date:{
        type:Date,
        default:Date.now
    },
    heading:{
        type:String,

    },
    description:{
        type:String,

    },
   
})

module.exports=mongoose.model('Post',postSchema)