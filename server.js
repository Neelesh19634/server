require("dotenv").config()
const express=require('express')
const app=express()
const cors=require('cors')
const connect=require('./db')
const router=require('./auth-router')

const option={
    origin:"http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true,
}
app.use(cors(option));
app.use(express.json());
app.use("/public", express.static("public"));

app.use("/",router)

connect().then(()=>{


    const PORT=5000;
    app.listen(PORT,()=>{
        console.log(`server is running on port ${PORT}`)
    })
})