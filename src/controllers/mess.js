const express = require("express");
const messRouter = express.Router();
const checker = require("../helpers/functions/checker");
const lang = require("../../lang/lang.json");
const { checkMenuIds, addMeals, removeMeals, currentMenu, checkMealIds, addFeedback, deletePreviousFeedback, countFeedbacks, checkItemId, addSuggestion, countSuggestions, markAttendance, checkAttendance, addAnnouncement, checkAnnouncmentId, editAnnouncement, deleteAnnouncement, fullMenu, editAttendance, isWastageExist, updateWastage, addWastage, wastages, total_wastages, announcements, totalAnnouncements, countAttendance, feedbacks, totalFeedbacks, suggestions, totalSuggestions, createPoll, checkOptionNo, checkPollAnswered, editPollAnswer, addPollAnswer, checkPollId, getPollResults, deletePoll, deletePollAnswers, getPolls, getTotalPolls } = require("../modules/mess");
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
            break
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
    const checkerResponse = checker(body,["questions","answers","rating","meal_slot"]);
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
            if (!(body.rating>=1 && body.rating<=5)){
                res.status(400).send({
                    status:400,
                    error:true,
                    message:lang.INVALID_RATING,
                    data:{}
                })
            }else{
                let isError = false
                const deletePreviousFeedbackResponse = await deletePreviousFeedback({user_id:user.user_id,meal_slot:body.meal_slot,meal_date:meal_date});
                if (deletePreviousFeedbackResponse){
                    const addFeedbackResponse = await addFeedback({meal_slot:body.meal_slot,meal_date:meal_date,rating:body.rating,questions:body.questions,answers:body.answers,user_id:user.user_id});
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
            break
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
                const deleteAnnouncementResponse = await deleteAnnouncement({announcement_id:body.announcement_id});
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
                        total_pages:Math.ceil(total_wastagesResponse.count/28),
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
                    total_pages:Math.ceil(totalAnnouncementsResponse.count/20),
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
messRouter.get("/attendance/next",async (req,res)=>{
    const user = req.user
    if (user.is_admin==1 || user.is_super_admin==1){
        const date = new Date();
        const time = date.getHours()+(date.getMinutes()/60);
        let slot = null
        for (let i of Object.keys(mess_timing)){
            if (time<mess_timing[i]){
                slot = parseInt(i)
                break
            }
        }
        if (!slot){
            date.setDate(date.getDate()+1)
            slot = 1
        }
        const countAttendanceResponse = await countAttendance({meal_date:getDate(date),meal_slot:slot});
        if (countAttendanceResponse){
            res.send({
                status:200,
                error:false,
                message:"Attendance fetched successfully!!",
                data:{
                    total_attendance : countAttendanceResponse.count,
                    meal_date : getDate(date),	
                    meal_slot : slot
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
})
messRouter.post("/feedbacks/:page",async (req,res)=>{
    const body = req.body;
    const user = req.user;
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
        if (user.is_admin==1 || user.is_super_admin==1){
            if (!body.meal_date){
                res.send({
                    status:400,
                    error:true,
                    message:lang.MEAL_DATE_REQ,
                    data:{}
                })
            }else{
                const feedbacksResponse = await feedbacks({meal_date:getDate(new Date(body.meal_date)),page});
                if (feedbacksResponse){
                    const totalFeedbacksResponse = await totalFeedbacks({meal_date:getDate(new Date(body.meal_date))});
                    res.send({
                        status:200,
                        error:false,
                        message:"Feedbacks fetched successfully!!",
                        data:{
                            total_results:totalFeedbacksResponse.count,
                            total_in_page:feedbacksResponse.length,
                            page_no:page,
                            total_pages:Math.ceil(totalFeedbacksResponse.count/20),
                            results:feedbacksResponse
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
messRouter.get("/suggestions/:page",async (req,res)=>{
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
        const suggestionsResponse = await suggestions({page});
        if (suggestionsResponse){
            const totalSuggestionsResponse = await totalSuggestions();
            res.send({
                status:200,
                error:false,
                message:"Suggestions fetched successfully!!",
                data:{
                    total_results:totalSuggestionsResponse.count,
                    total_in_page:suggestionsResponse.length,
                    page_no:page,
                    total_pages:Math.ceil(totalSuggestionsResponse.count/20),
                    results:suggestionsResponse
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
messRouter.post("/poll/new",async (req,res)=>{
    const body = req.body;
    const user = req.user;
    if (user.is_admin==1 || user.is_super_admin==1){
        const checkerResponse = checker(body,["poll_title","poll_options"]);
        if (checkerResponse){
            res.status(400).send({
                status:400,
                error:true,
                message:checkerResponse,
                data:{}
            })
        }else{
            const createPollResponse = await createPoll({poll_title:body.poll_title,poll_options:body.poll_options,user_id:user.user_id});   
            if (createPollResponse){
                res.send({
                    status:200,
                    error:false,
                    message:"Poll added successfully!!",
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
messRouter.post("/poll/:poll_id",async (req,res)=>{
    const user = req.user;
    const params = req.params;
    const poll_id = parseInt(params.poll_id);
    const body = req.body;
    if (!poll_id){
        res.status(400).send({
            status:400,
            error:true,
            message:lang.INVALID_POLL_ID,
            data:{}
        })
    }else{
        if (body.option_no==undefined){
            res.status(400).send({
                status:400,
                error:true,
                message:lang.NO_INPUTS,
                data:{}
            })
        }else{
            const checkOptionNoResponse = await checkOptionNo({poll_id});
            if (checkOptionNoResponse.error){
                res.status(400).send({
                    status:400,
                    error:true,
                    message:lang.INVALID_POLL_ID,
                    data:{}
                })
            }else{
                if (body.option_no>checkOptionNoResponse.count || body.option_no<1){
                    res.status(400).send({
                        status:400,
                        error:true,
                        message:lang.INVALID_OPTION_NO,
                        data:{}
                    })
                }else{
                    const checkPollAnsweredResponse = await checkPollAnswered({user_id:user.user_id,poll_id});
                    if (checkPollAnsweredResponse.count>0){
                        const editPollResponse = await editPollAnswer({poll_id,user_id:user.user_id,option_no:body.option_no});
                        if (editPollResponse){
                            res.send({
                                status:200,
                                error:false,
                                message:"Poll answered successfully!!",
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
                        const addPollResponse = await addPollAnswer({poll_id,user_id:user.user_id,option_no:body.option_no});
                        if (addPollResponse){
                            res.send({
                                status:200,
                                error:false,
                                message:"Poll answered successfully!!",
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
        }
    }
})
messRouter.delete("/poll/:poll_id/close",async (req,res)=>{
    const user = req.user;
    const params = req.params;
    const poll_id = parseInt(params.poll_id);
    if (!poll_id){
        res.status(400).send({
            status:400,
            error:true,
            message:lang.INVALID_POLL_ID,
            data:{}
        })
    }else{
        if (user.is_admin==1 || user.is_super_admin==1){
            const checkPollIdResponse = await checkPollId({poll_id,user_id:user.user_id});   
            if (checkPollIdResponse.count>0){
                const getPollResultsResponse = await getPollResults({poll_id});
                if (getPollResultsResponse){
                    const checkOptionNoResponse = await checkOptionNo({poll_id});
                    let results = []
                    for (let i=1;i<=checkOptionNoResponse.count;i++){
                        if (getPollResultsResponse.find(j=>j.option_no==i)){
                            results.push(getPollResultsResponse.find(j=>j.option_no==i).count)
                        }else{
                            results.push(0)
                        }
                    }
                    const deletePollResponse = await deletePoll({poll_id,results:results});
                    if (deletePollResponse){
                        const deletePollAnswersResponse = await deletePollAnswers({poll_id});
                        res.send({
                            status:200,
                            error:false,
                            message:"Poll ended successfully!!",
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
                        message:lang.UNEXPECTED_ERROR,
                        data:{}
                    })
                }
            }else{
                res.status(400).send({
                    status:400,
                    error:true,
                    message:lang.INVALID_POLL_ID,
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
messRouter.get("/polls/:page",async(req,res)=>{
    const params = req.params;
    const user = req.user;
    const page = parseInt(params.page);
    if (!page){
        res.status(400).send({
            status:400,
            error:true,
            message:lang.INVALID_PAGE,
            data:{}
        })
    }else{
        const getPollsResponse = await getPolls({page,user_id:user.user_id});
        if (getPollsResponse){
            const getTotalPollsResponse = await getTotalPolls();
            res.send({
                status:200,
                error:false,
                message:"Polls fetched successfully!!",
                data:{
                    total_results:getTotalPollsResponse.count,
                    total_in_page:getPollsResponse.length,
                    page_no:page,
                    total_pages:Math.ceil(getTotalPollsResponse.count/20),
                    results:getPollsResponse
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
module.exports= messRouter