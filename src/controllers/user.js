const express = require("express");
const userRouter = express.Router();

userRouter.get("/",(req,res)=>{
    const user = req.user;
    res.send({
        status:200,
        error:false,
        message:"User details fetched successfully!!",
        data:user
    })
})

module.exports = userRouter;