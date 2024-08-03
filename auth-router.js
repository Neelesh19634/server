const express=require('express')
const router=express.Router()
const bcrypt=require('bcryptjs')
const userModel=require('./models/User')
const postModel=require('./models/Post')
const Auth=require('./auth-middleware')
const upload=require('./models/multer')
const commentModel=require('./models/comment')
router.get("/",(req,res)=>{
    res.json({message:"hello my name is neelesh kumar meena"})
})
router.post("/register",async(req,res)=>{
    try{

   
 const {username,email,password,fullname}=req.body

 const userExits=await userModel.findOne({username});
 if(userExits){
    res.status(401).json({message:"user already exits"})
 }
 const salt=10;
 const hash_password=await bcrypt.hash(password,salt);

 const data=await userModel.create({
    username,
    email,
    password:hash_password,
    fullname
 })

 res.status(200).json({message:"registration sucessfull",token:await data.generateToken(),userId:data._id})
}catch(error){
    res.status(500).json("Internal server error")
}
})

router.post("/login",async(req,res)=>{
    try{
        const {username,password}=req.body;
        const userExits=await userModel.findOne({username})
        if(!userExits){
            res.status(401).json({message:"Invalid Credentials"})
        }

        const data=await bcrypt.compare(password,userExits.password);
        if(!data){
            res.status(401).json({message:"Invalid Credentials"})
        }

        res.status(200).json({message:"login sucessfull",token:await userExits.generateToken(),userId:userExits._id})
        
    }catch(error){
        res.status(500).json("Internal server error")
    }
})
router.get("/profile",Auth,(req,res,next)=>{
    try {
        const data=req.user;
        return res.status(200).json({data});
    } catch (error) {
        console.log(error)
    }
})
router.post("/create",upload.single('image'),async(req,res)=>{
    try{
    const {username,caption,description}=req.body;
    const user=await userModel.findOne({username})
    if(!user){
        res.status(401).json({message:"user not found"})
    }
    const image=req.file? `/public/images/uploads/${req.file.filename}` : '';
    const Post=await postModel.create({
        username,
        caption,
        description,
        image,
        user:user._id,
    });
    user.post.push(Post._id);
    await user.save()
    res.status(200).json({message:"Post created successfully"})
}catch(error){
    res.status(500).json("Internal server error")
}
})

router.get("/AllPost",async (req,res)=>{
    try{

        const data=await postModel.find().populate('user')
        res.status(200).json({data})
    }catch(error){
        res.status(500).json("No post available")
    }
})
router.get("/post/:id",async(req,res)=>{
    try {
        const id=req.params.id
        const data=await postModel.findById(id).populate('comment')
        res.status(200).json({data})
    } catch (error) {
        res.status(401).json({message:"post not found"})
    }
})

router.post("/comment",async(req,res)=>{
    try{
    const {comment,postId}=req.body
    const post=await postModel.findOne({_id:postId})
    if(!post){
        res.status(401).json({message:"post not found"})
    }
    const data=await commentModel.create({
        comment,
        post:post._id
    })
    post.comment.push(data._id)
    await post.save()
    res.status(200).json({message:"comment created successfully"})
    }catch(error){
        res.status(500).json("Internal server error")
    }

})
router.post("/userPost",async(req,res)=>{
    try {
        const {username}=req.body;
        const data=await userModel.findOne({username}).populate('post')
        res.status(200).json(data.post)

    } catch (error) {
        res.status(401).json({message:"user not found"})
    }

})
router.post("/update",upload.single('image'),async(req,res)=>{
    try {
        const {username,fullname,email}=req.body
        const user=await userModel.findOne({username})
        if(!user){
            res.status(401).json({message:"user not found"})
        }
        user.fullname=fullname
        user.email=email
        if(req.file){
            user.profile=req.file.filename
        }
        await user.save();
        res.status(200).json({message:"Profile updated successfully"})
    } catch (error) {
        res.status(401).json({message:"user not found"})
    }
})
router.get("/likes/:id",async(req,res)=>{
    try{
    const id=req.params.id
    const post=await postModel.findOne({_id:id}).populate('user')
    const userId=post.user._id
    const user=await userModel.findOne({_id:userId})
    if(!user){
        res.status(401).json({message:"user not found"})
    }
    const isLiked=user.likes.includes(post._id)
    if(isLiked){
        user.likes.pull(post._id)
        post.likes.pull(user._id)
        post.isLiked=false;
        res.status(200).json(false)
    }else{
        user.likes.push(post._id)
        post.likes.push(user._id)
        post.isLiked=true;
        res.status(200).json(true)
    }

    await user.save();
    await post.save();
    }catch(error){
        res.status(401).json({message:"user not found"})
    }
})

router.post("/likePost", async (req, res) => {
    try {
      const { username } = req.body;
      const data = await userModel.findOne({ username }).populate({
        path: 'likes',
        populate: { path: 'user', model: 'User' }
      });
  
      if (data) {
        res.status(200).json(data.likes);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  router.delete("/deletePost/:id",async(req,res)=>{
    try{
        const id=req.params.id;
        const data=await postModel.findByIdAndDelete(id);
        res.status(200).json({message:"post deleted successfully"})
    }catch(error){
        res.status(500).json("Internal server error")
    }
  })
module.exports=router