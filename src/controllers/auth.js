const express = require("express");
const { isEmailExist, createUser, getUserCredentials } = require("../modules/auth");
const authRouter = express.Router();
const lang = require("../../lang/lang.json")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotEnv = require("dotenv");
const isEmail = require("../helpers/functions/isEmail");
const checker = require("../helpers/functions/checker")
const rules = require("../../static/rules.json")
dotEnv.config()

authRouter.post("/signup",async (req,res)=>{
    const body = req.body;
    const isError = checker(body,["name","email","password"])
    if (isError){
        res.status(400).send({
            status:400,
            error:true,
            message:isError,
            data:{}
        })
    }else{
        if (!isEmail({email:body.email})){
            res.status(400).send({
                status:400,
                error:true,
                message:lang.INVALID_EMAIL,
                data:{}
            })
        }else{
            const isEmailExistResponse = await isEmailExist({email:body.email})
            if (isEmailExistResponse.flag==1){
                res.status(400).send({
                    status:400,
                    error:true,
                    message:lang.DUPLICATE_EMAIL,
                    data:{}
                })
            }else{
                const hassPass = bcrypt.hashSync(body.password,10);
                const createUserResponse = await createUser({name:body.name,email:body.email,password:hassPass});
                if (createUserResponse){
                    const token = jwt.sign({email:body.email,user_id:createUserResponse.insertId},process.env.JWT_SECRET,{expiresIn:rules.token});
                    res.status(200).send({
                        status:200,
                        error:false,
                        message:"User created successfully!!",
                        data:{token:token}
                    })
                }else{
                    res.status(501).send({
                        status:501,
                        error:true,
                        message:lang.UNEXPECTED_ERROR,
                        data:{}
                    })
                }
            }
        }
    }
})
authRouter.post("/signin",async(req,res)=>{
    const body = req.body;
    const isError = checker(body,["email","password"])
    if (isError){
        res.status(400).send({
            status:400,
            error:true,
            message:isError,
            data:{}
        })
    }else{
        if (!isEmail({email:body.email})){
            res.status(400).send({
                status:400,
                error:true,
                message:lang.INVALID_EMAIL,
                data:{}
            })
        }else{
            const getUserCredentialsResponse = await getUserCredentials({email:body.email});
            if (getUserCredentialsResponse.error){
                res.status(400).send({
                    status:400,
                    error:true,
                    message:lang.INVALID_CREDENTIALS,
                    data:{}
                })
            }else{
                const isPasswordMatch = bcrypt.compareSync(body.password,getUserCredentialsResponse.password);
                if (isPasswordMatch){
                    const token = jwt.sign({email:body.email,user_id:getUserCredentialsResponse.user_id},process.env.JWT_SECRET,{expiresIn:rules.token});
                    res.status(200).send({
                        status:200,
                        error:false,
                        message:"Signed In successfully!!",
                        data:{token:token}
                    })
                }else{
                    res.status(400).send({
                        status:400,
                        error:true,
                        message:lang.INVALID_CREDENTIALS,
                        data:{}
                    })
                }
            }
        }
    }
})
module.exports = authRouter