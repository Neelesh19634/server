const express=require('express')
const router=express.Router()
const bcrypt=require('bcryptjs')
const userModel=require('./models/User')
const postModel=require('./models/Post')
const Auth=require('./auth-middleware')
const upload=require('./models/multer')

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
    const {username,heading,description}=req.body;
    const user=await userModel.findOne({username})
    if(!user){
        res.status(401).json({message:"user not found"})
    }
    const image=req.file? `/public/images/uploads/${req.file.filename}` : '';
    const Post=await postModel.create({
        username,
        heading,
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
        const data=await postModel.findById(id)
        res.status(200).json({data})
    } catch (error) {
        res.status(401).json({message:"post not found"})
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
        const {username,email,bio}=req.body
        const user=await userModel.findOne({username})
        if(!user){
            res.status(401).json({message:"user not found"})
        }
        user.email=email
        user.bio=bio
        if(req.file){
            user.profile=req.file.filename
        }
        await user.save();
        res.status(200).json({message:"Profile updated successfully"})
    } catch (error) {
        res.status(401).json({message:"user not found"})
    }
})




  router.delete("/deletePost/:id",async(req,res)=>{
    try{
        const id=req.params.id;
        const post=await postModel.findById(id);
        const userId=post.user;
        await postModel.findByIdAndDelete(id);
        await userModel.findByIdAndUpdate(userId, { $pull: { posts: id } });
        res.status(200).json({message:"post deleted successfully"})
    }catch(error){
        res.status(500).json("Internal server error")
    }
  })
module.exports=router