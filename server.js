require("dotenv").config()
const express=require('express')
const app=express()
const cors=require('cors')
const connect=require('./db')
const router=require('./auth-router')
const path=require('path')
const option={
    origin:"http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true,
}
app.use(cors(option));
app.use(express.json());
app.use("/public", express.static("public"));

app.use("/",router)




    const PORT=process.env.PORT;
    app.listen(PORT,()=>{
        console.log(`server is running on port ${PORT}`)
    })
