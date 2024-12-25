const express = require("express");
const messRouter = express.Router();
const checker = require("../helpers/functions/checker");
const lang = require("../../lang/lang.json");
const { checkMenuIds, addMeals, removeMeals, currentMenu, checkMealIds, addFeedback, deletePreviousFeedback, countFeedbacks, checkItemId, addSuggestion, countSuggestions, markAttendance, checkAttendance, addAnnouncement, checkAnnouncmentId, editAnnouncement, deleteAnnouncement } = require("../modules/mess");
const getDate = require("../helpers/functions/getDate")
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
messRouter.post("/feedback",async (req,res)=>{
    const body = req.body;
    const user = req.user;
    const checkerResponse = checker(body,["feedback","meal_slot"]);
    if (checkerResponse){
        res.status(400).send({
            status:400,
            error:true,
            message:checkerResponse,
            data:{}
        })
    }else{
        const crr_date = new Date()
        const meal_date = getDate(crr_date)
        const crr_time = crr_date.getHours()+(crr_date.getMinutes()/60);
        if (crr_time<mess_timing[body.meal_slot]){
            res.status(400).send({
                status:400,
                error:true,
                message:lang.ONLY_AFTER_MEAL,
                data:{}
            })
        }else{
            const conv = {0:7,1:1,2:2,3:3,4:4,5:5,6:6};
            let day = conv[crr_date.getDay()];
            let meal_ids = [];
            body.feedback.forEach(element => {
                meal_ids.push(element.menu_id)
            });
            if (meal_ids.length>0){
                const checkMealIdsResponse = await checkMealIds({ids:meal_ids,meal_slot:body.meal_slot,meal_day:day});
                if (checkMealIdsResponse.items!=meal_ids.length){
                    res.status(400).send({
                        status:400,
                        error:true,
                        message:lang.INVALID_MENU_ID,
                        data:{}
                    })
                }else{
                    let isError = false
                    const deletePreviousFeedbackResponse = await deletePreviousFeedback({user_id:user.user_id,meal_slot:body.meal_slot,meal_date:meal_date});
                    if (deletePreviousFeedbackResponse){
                        const addFeedbackResponse = await addFeedback({meal_slot:body.meal_slot,meal_date:meal_date,feedback:body.feedback,user_id:user.user_id});
                        if (!addFeedbackResponse){isError = true}
                    }else{isError = true}
                    if (isError){
                        res.status(400).send({
                            status:400,
                            error:true,
                            message:lang.UNEXPECTED_ERROR,
                            data:{}
                        })
                    }else{
                        const countFeedbacksResponse = await countFeedbacks({user_id:user.user_id});
                        res.send({
                            status:200,
                            error:false,
                            message:"You contributed "+countFeedbacksResponse.count+" times in feedback's. Thanks for the feedback!!",
                            data:{}
                        })
                    }
                }
            }
        }
    }
})
messRouter.post("/suggestion",async (req,res)=>{
    const body = req.body;
    const user = req.user;
    if (!body.changes_new_item){
        res.status(400).send({
            status:400,
            error:true,
            message:lang.NO_INPUTS,
            data:{}
        })
    }else{
        if (body.changes_old_item){
            if (checkItemId(body.changes_old_item).items==0){
                res.status(400).send({
                    status:400,
                    error:true,
                    message:lang.INVALID_MENU_ID,
                    data:{}
                })
                return 0
            }
        }
        const addSuggestionResponse = await addSuggestion({changes_new_item:body.changes_new_item,user_id:user.user_id,reason:body.reason,changes_old_item:body.changes_old_item});
        if (addSuggestionResponse){
            const countSuggestionsResponse = await countSuggestions({user_id:user.user_id})
            res.send({
                status:200,
                error:false,
                message:"You contributed "+countSuggestionsResponse.count+" times in suggestions. Thanks for the suggestion!!",
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
    }

})
messRouter.post("/attend",async (req,res)=>{
    const user = req.user;
    const body = req.body;
    const crr_date = new Date();
    const crr_time = crr_date.getHours()+(crr_date.getMinutes()/60);
    let slot = null
    for (let i of Object.keys(mess_timing)){
        if (crr_time<mess_timing[i]){
            slot = parseInt(i)
        }
    }
    if (!slot){
        slot = 1
        crr_date.setDate(crr_date.getDate()+1)
    }
    const meal_date = getDate(crr_date);
    const checkAttendanceResponse = await checkAttendance({user_id:user.user_id,meal_slot:slot,meal_date:getDate(crr_date)});
    if (checkAttendanceResponse.count>0){
        res.status(400).send({
            status:400,
            error:true,
            message:lang.ALREADY_MARKED,
            data:{}
        })
    }else{
        const markAttendanceResponse = await markAttendance({user_id:user.user_id,meal_slot:slot,meal_date:meal_date,is_attending:body.is_attending});
        if (markAttendanceResponse){
            res.send({
                status:200,
                error:false,
                message:body.is_attending==1?"Attendance marked. Enjoy your meal!!":"Attendance marked successfully!!",
                data:{
                    meal_date:meal_date,
                    meal_slot:slot
                }
            })
        }
    }

})
messRouter.post("/announcement/new",async (req,res)=>{
    const body = req.body;
    const user = req.user;
    if (user.is_admin==1 || user.is_super_admin==1){
        const checkerResponse = checker(body,["announcement_title","announcement_message"]);
        if (checkerResponse){
            res.status(400).send({
                status:400,
                error:true,
                message:checkerResponse,
                data:{}
            })
        }else{
            const addAnnouncementResponse = await addAnnouncement({announcement_title:body.announcement_title,user_id:user.user_id,announcement_message:body.announcement_message});
            if (addAnnouncementResponse){
                res.send({
                    status:200,
                    error:false,
                    message:"Announcement added successfully!!",
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
        }
    }else{
        res.status(400).send({
            status:400,
            error:true,
            message:lang.NOT_ALLOWED,
            data:{}
        })
    }
})
messRouter.post('/announcement/edit',async (req,res)=>{
    const body = req.body;
    const user = req.user;
    if (user.is_admin==1 || user.is_super_admin==1){
        if (!body.announcement_id || (!body.announcement_title && !body.announcement_message)){
            res.send({
                status:400,
                error:true,
                message:lang.NO_INPUTS,
                data:{}
            })
        }else{
            const checkAnnouncmentIdResponse = await checkAnnouncmentId({id:body.announcement_id,user_id:user.user_id});
            if (checkAnnouncmentIdResponse.count==0){
                res.status(400).send({
                    status:400,
                    error:true,
                    message:lang.INVALID_ANNOUNCEMENT_ID,
                    data:{}
                })
            }else{
                const editAnnouncementResponse = await editAnnouncement({id:body.announcement_id,announcement_title:body.announcement_title,announcement_message:body.announcement_message});
                if (editAnnouncementResponse){
                    res.send({
                        status:200,
                        error:false,
                        message:"Announcement edited successfully!!",
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
            }
        }
    }
})
messRouter.post('/announcement/delete',async (req,res)=>{
    const body = req.body;
    const user = req.user;
    if (user.is_admin==1 || user.is_super_admin==1){
        if (!body.announcement_id){
            res.send({
                status:400,
                error:true,
                message:lang.NO_INPUTS,
                data:{}
            })
        }else{
            const checkAnnouncmentIdResponse = await checkAnnouncmentId({id:body.announcement_id,user_id:user.user_id});
            if (checkAnnouncmentIdResponse.count==0){
                res.status(400).send({
                    status:400,
                    error:true,
                    message:lang.INVALID_ANNOUNCEMENT_ID,
                    data:{}
                })
            }else{
                const deleteAnnouncementResponse = await deleteAnnouncement({id:body.announcement_id});
                if (deleteAnnouncementResponse){
                    res.send({
                        status:200,
                        error:false,
                        message:"Announcement deleted successfully!!",
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
            }
        }
    }
})
module.exports= messRouter