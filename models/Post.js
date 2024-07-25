const mongoose=require('mongoose');
const comment = require('./comment');
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
    caption:{
        type:String,

    },
    description:{
        type:String,

    },
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    isLiked:{
        type:Boolean,
        default:false
    }
  
})

module.exports=mongoose.model('Post',postSchema)