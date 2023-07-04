require("dotenv").config();
require('./configs/mongoose');
const express=require('express');
const PORT=5000;
const app=express();

//Read the req.body if send as json format
app.use(express.json());


//Routes
app.use('/',require('./routes/index'));

//Listen App on Port 5000
app.listen(PORT,()=>{
    console.log(`App listening on ${PORT} port`)
})