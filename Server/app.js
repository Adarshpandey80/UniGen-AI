const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ChatRouter = require("./router/ChatRouter");

require("dotenv").config();


app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));



app.use("/user" , ChatRouter);

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log("Error to connnect to database" , err);
})


app.get("/" ,(req,res)=>{
    res.send("hello world");
})

const PORT = process.env.PORT

app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})