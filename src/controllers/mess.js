const express = require("express");
const messRouter = express.Router();
const checker = require("../helpers/functions/checker");
const lang = require("../../lang/lang.json");
const { checkMenuIds, addMeals, removeMeals, currentMenu, checkMealIds, addFeedback, deletePreviousFeedback, countFeedbacks, checkItemId, addSuggestion, countSuggestions, markAttendance, checkAttendance, addAnnouncement, checkAnnouncmentId, editAnnouncement, deleteAnnouncement, fullMenu, editAttendance, isWastageExist, updateWastage, addWastage, wastages, total_wastages, announcements, totalAnnouncements } = require("../modules/mess");
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
        const editAttendanceResponse = await editAttendance({user_id:user.user_id,meal_slot:slot,meal_date:meal_date,is_attending:body.is_attending});
        if (editAttendanceResponse){
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
messRouter.get("/menu/full",async (req,res)=>{
    const fullMenuResponse = await fullMenu();
    if (fullMenuResponse){
        res.send({
            status:200,
            error:false,
            message:"Menu fetched successfully!!",
            data:fullMenuResponse
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
messRouter.post("/wastage/add",async (req,res)=>{
    const body = req.body;
    const user = req.user;
    if (user.is_admin==1 || user.is_super_admin==1){
        const checkerResponse = checker(body,["wastage","meal_date","meal_slot"])
        if (checkerResponse){    
            res.status(400).send({
                status:400,
                error:true,
                message:checkerResponse,
                data:{}
            })
        }else{
            const crr_date = new Date();
            const meal_date = new Date(body.meal_date)
            meal_date.setMinutes(mess_timing[body.meal_slot]*60)
            if (crr_date.getTime()<meal_date.getTime()){
                res.status(400).send({
                    status:400,
                    error:true,
                    message:lang.ONLY_AFTER_MEAL,
                    data:{}
                })
            }else{
                const isWastageExistResponse = await isWastageExist({wastage:body.wastage,meal_date:body.meal_date,meal_slot:body.meal_slot});
                if (isWastageExistResponse.count>0){
                    const updateWastageResponse = await updateWastage({wastage:body.wastage,meal_date:body.meal_date,meal_slot:body.meal_slot});
                    if (!updateWastageResponse){
                        res.status(400).send({
                            status:400,
                            error:true,
                            message:lang.UNEXPECTED_ERROR,
                            data:{}
                        })
                    }else{
                        res.send({
                            status:200,
                            error:false,
                            message:"Wastage updated successfully!!",
                            data:{}
                        })
                    }
                }else{
                    const addWastageResponse = await addWastage({wastage:body.wastage,meal_date:body.meal_date,meal_slot:body.meal_slot});
                    if (!addWastageResponse){
                        res.status(400).send({
                            status:400,
                            error:true,
                            message:lang.UNEXPECTED_ERROR,
                            data:{}
                        })
                    }else{
                        res.send({
                            status:200,
                            error:false,
                            message:"Wastage added successfully!!",
                            data:{}
                        })
                    }
                }
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
messRouter.post("/wastages/:page",async (req,res)=>{
    const body = req.body;
    const params = req.params;
    const checkerResponse = checker(body,["start_date","end_date"])
    const page = parseInt(params.page);
    if (!page){
        res.status(400).send({
            status:400,
            error:true,
            message:lang.INVALID_PAGE_NUMBER,
            data:{}
        })
    }else{
        if (checkerResponse){    
            res.status(400).send({
                status:400,
                error:true,
                message:checkerResponse,
                data:{}
            })
        }else{
            const wastagesResponse = await wastages({start_date:getDate(new Date(body.start_date)),end_date:getDate(new Date(body.end_date)),page});
            if (wastagesResponse){
                const total_wastagesResponse = await total_wastages({start_date:getDate(new Date(body.start_date)),end_date:getDate(new Date(body.end_date))});
                res.send({
                    status:200,
                    error:false,
                    message:"Wastages fetched successfully!!",
                    data:{
                        total_results:total_wastagesResponse.count,
                        total_in_page:wastagesResponse.length,
                        page_no:page,
                        total_pages:Math.ceil(total_wastagesResponse.count/5),
                        results:wastagesResponse
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
        }
    }
})
messRouter.get("/announcements/:page",async (req,res)=>{
    const params = req.params;
    const page = parseInt(params.page);
    if (!page){
        res.status(400).send({
            status:400,
            error:true,
            message:lang.INVALID_PAGE_NUMBER,
            data:{}
        })
    }else{
        const announcementsResponse = await announcements({page});
        if (announcementsResponse){
            const totalAnnouncementsResponse = await totalAnnouncements();
            res.send({
                status:200,
                error:false,
                message:"Announcements fetched successfully!!",
                data:{
                    total_results:totalAnnouncementsResponse.count,
                    total_in_page:announcementsResponse.length,
                    page_no:page,
                    total_pages:Math.ceil(totalAnnouncementsResponse.count/5),
                    results:announcementsResponse
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
    }
})

messRouter.get("/feedbacks",async (req,res)=>{
    const body = req.body;

})
module.exports= messRouter