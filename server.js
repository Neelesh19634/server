require("dotenv").config()
const express=require('express')
const app=express()
const cors=require('cors')

const router=require('./auth-router')
const path=require('path')
const mongoose=require('mongoose')
const option={
    origin:"http://localhost:3000",
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true,
}
app.use(cors(option));
app.use(express.json());
app.use("/public", express.static("public"));

app.use("/",router)
const connect = async () => {
    try {
    await mongoose.connect(process.env.URL);
    console.log("connected to database");
    } catch (error) {
    console.log(error);
    process.exit(0);
    }
    };



    connect().then(() => {
        const PORT = process.env.PORT;
        app.listen(PORT, () => {
          console.log(`server is running on port ${PORT}`);
        });
      });