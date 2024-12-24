const express = require("express");
const messRouter = express.Router();
const lang = require("../../lang/lang.json");
const { checkMenuIds, addMeals, removeMeals } = require("../modules/mess");

messRouter.post("/menu/edit",async (req,res)=>{
    const user = req.user;	
    if (user.is_admin==1 || user.is_super_admin==1){
        const body = req.body;
        if (!body.additions && !body.removes){
            res.status(400).send({
                status:400,
                error:true,
                message:lang.NO_INPUTS,
                data:{}
            })
        }else{
            if (body.removes && body.removes.length>0){
                const checkMenuIdsResponse = await checkMenuIds({ids:body.removes});
                if (checkMenuIdsResponse.items!=body.removes.length){
                    res.status(400).send({
                        status:400,
                        error:true,
                        message:lang.INVALID_MENU_ID,
                        data:{}
                    })
                    return 0
                }
            }
            if (body.additions && body.additions.length>0){
                const addMealsResponse = await addMeals({meals:body.additions});
            }
            if (body.removes && body.removes.length>0){
                const removeMealsResponse = await removeMeals({meals:body.removes});
            }
            res.send({
                status:200,
                error:false,
                message:"Menu updated successfully!!",
                data:{}
            })
        }
    }else{
        res.status(403).send({
            status:403,
            error:true,
            message:lang.NOT_ALLOWED,
            data:{}
        })
    }
})

module.exports= messRouter