const express = require("express");
const messRouter = express.Router();
const lang = require("../../lang/lang.json");
const { checkMenuIds, addMeals, removeMeals, currentMenu } = require("../modules/mess");
const mess_timing = require("../../static/mess_timing.json")

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
messRouter.get("/menu/current",async (req,res)=>{
    const date = new Date();
    const conv = {0:7,1:1,2:2,3:3,4:4,5:5,6:6};
    let day = conv[date.getDay()];
    const time = date.getHours()+(date.getMinutes()/60);
    let slot = null
    for (let i of Object.keys(mess_timing)){
        if (time<mess_timing[i]){
            slot = parseInt(i)
        }
    }
    if (!slot){
        if (day==7){day=1}
        else{day++}
        slot = 1
    }
    const currentMenuResponse = await currentMenu({meal_slot:slot,meal_day:day});
    if (currentMenuResponse){
        res.send({
            status:200,
            error:false,
            message:"Menu fetched successfully!!",
            data:{
             menu_day:day,
             menu_slot:slot,
             menu:currentMenuResponse
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
})
module.exports= messRouter