const express = require("express");
const { getUserRole, changeUserRole } = require("../modules/user");
const userRouter = express.Router();
const lang = require("../../lang/lang.json");
userRouter.get("/",(req,res)=>{
    const user = req.user;
    res.send({
        status:200,
        error:false,
        message:"User details fetched successfully!!",
        data:user
    })
})
userRouter.post("/:user_id/role/change",async (req,res)=>{
    const body = req.body;
    const user = req.user;
    const user_id = parseInt(req.params.user_id);
    if (!body.user_role){
        res.status(400).send({
            status:400,
            error:true,
            message:lang.NO_INPUTS,
            data:{}
        })
    }else{
        if (user.is_super_admin==1){
            const getUserRoleResponse = await getUserRole({user_id:user_id});
            if (getUserRoleResponse.error){
                res.status(400).send({
                    status:400,
                    error:true,
                    message:lang.INVALID_USER_ID,
                    data:{}
                })
            }else{
                if (getUserRoleResponse.is_super_admin!==1){
                    const changeUserRoleResponse = await changeUserRole({user_id:user_id,is_admin:body.user_role==2?1:0});
                    if (changeUserRoleResponse){
                        res.send({
                            status:200,
                            error:false,
                            message:"User role changed successfully!!",
                            data:{}
                        })
                    }else{
                        res.status(400).send({
                            status:400,
                            error:true,
                            message:lang.UNEXPECTED_ERROR,
                            data:{}
                        })
                    }
                }else{
                    res.status(400).send({
                        status:400,
                        error:true,
                        message:lang.NOT_ALLOWED,
                        data:{}
                    })
                }
            }
        }else{
            res.status(400).send({
                status:400,
                error:true,
                message:lang.NOT_ALLOWED,
                data:{}
            })
        }
    }
})
module.exports = userRouter;