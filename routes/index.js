require('dotenv').config();
const express=require('express');
const router=express.Router();


//Get the message on http://localhost:5000
router.get('/',(req,res)=>{
    return res.json({Message:"Welcome to my Webpage"});
})

//Routes for different URL
router.use('/questions',require('./questions'));
router.use('/options',require('./options'))

module.exports=router;