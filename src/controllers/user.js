const express = require("express");
const { getUserRole, changeUserRole, findUsers, countQuery } = require("../modules/user");
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
userRouter.get('/find/:page',async (req,res)=>{
    const params = req.params
    const user = req.user;
    const query = (req.query.q??"").replaceAll("\"","");
    const page = parseInt(params.page);
    if (!page){
        res.status(400).send({
            status:400,
            error:true,
            message:lang.INVALID_PAGE_NUMBER,
            data:{}
        })
    }else{
        if (user.is_super_admin==1 || user.is_admin==1){
            const countQueryResponse = await countQuery({query:query});
            const findUsersResponse = await findUsers({query:query,page:page});
            if (findUsersResponse){
                res.send({
                    status:200,
                    error:false,
                    message:"Users fetched successfully!!",
                    data:{
                        total_results:countQueryResponse.count,
                        total_in_page:findUsersResponse.length,
                        page_no:page,
                        total_pages:Math.ceil(countQueryResponse.count/20),
                        results:findUsersResponse
                    }
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
})
module.exports = userRouter;