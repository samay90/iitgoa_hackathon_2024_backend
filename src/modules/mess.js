const db = require("../helpers/database/db")
const getTime = require("../helpers/functions/getTime")
const checkMenuIds = ({ids}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as items from menu where menu_id in (?) and is_deleted=0;`;
        db.query(q,[ids],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const addMeals = ({meals}) =>{
    const currentTime = getTime();
    return new Promise((resolve,reject)=>{
        const q = `insert into menu (meal_item,meal_day,meal_slot,meal_type,created_at,is_deleted) values ?;`;
        db.query(q,[meals.map((meal)=>[meal.meal_item,meal.meal_day,meal.meal_slot,meal.meal_type,currentTime,0])],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const removeMeals = ({meals}) =>{
    return new Promise((resolve,reject)=>{
        const q = `update menu set is_deleted=1 where menu_id in (?);`;
        db.query(q,[meals],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const currentMenu = ({meal_slot,meal_day}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select meal_item,meal_type,menu_id from menu where is_deleted=0 and meal_slot=? and meal_day=?;`;
        db.query(q,[meal_slot,meal_day],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const checkMealIds = ({ids,meal_slot,meal_day}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as items from menu where menu_id in (?) and is_deleted=0 and meal_slot=? and meal_day=?;`;
        db.query(q,[ids,meal_slot,meal_day],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })

    })
}
const deletePreviousFeedback = ({user_id,meal_slot,meal_date}) =>{
    return new Promise((resolve,reject)=>{
        const q = `update feedbacks set is_deleted=1,updated_at=? where user_id=? and meal_slot=? and meal_date=?;`;
        db.query(q,[getTime(),user_id,meal_slot,meal_date],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const countFeedbacks = ({user_id}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as count from feedbacks where user_id=? and is_deleted=0;`;
        db.query(q,[user_id],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const addFeedback = ({meal_slot,meal_date,rating,questions,answers,user_id}) =>{
    const currentTime = getTime();
    return new Promise((resolve,reject)=>{
        const q = `insert into feedbacks (user_id,meal_slot,meal_date,rating,questions,answers,created_at,updated_at,is_deleted) values (?,?,?,?,?,?,?,?,?);`;
        db.query(q,[user_id,meal_slot,meal_date,rating,JSON.stringify(questions),JSON.stringify(answers),currentTime,currentTime,0],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const checkItemId = ({id}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as items from menu where menu_id=? and is_deleted=0;`;
        db.query(q,[id],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const addSuggestion = ({changes_old_item,changes_new_item,user_id,reason}) =>{
    return new Promise((resolve,reject)=>{
        const q = `insert into suggestions (changes_old_item,changes_new_item,user_id,reason,created_at) values (?,?,?,?,?);`;
        db.query(q,[changes_old_item,changes_new_item,user_id,reason,getTime()],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const countSuggestions = ({user_id}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as count from suggestions where user_id=?;`;
        db.query(q,[user_id],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const markAttendance = ({user_id,meal_slot,meal_date,is_attending}) =>{
    return new Promise((resolve,reject)=>{
        const q = `insert into attendance (user_id,meal_slot,meal_date,is_attending,created_at,updated_at) values (?,?,?,?,?,?);`;
        db.query(q,[user_id,meal_slot,meal_date,is_attending,getTime(),getTime()],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const checkAttendance = ({user_id,meal_slot,meal_date}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as count from attendance where user_id=? and meal_slot=? and meal_date=?;`;
        db.query(q,[user_id,meal_slot,meal_date],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const editAttendance = ({user_id,meal_slot,meal_date,is_attending}) =>{
    return new Promise((resolve,reject)=>{

        const q = `update attendance set is_attending=?,updated_at=? where user_id=? and meal_slot=? and meal_date=?;`;
        db.query(q,[is_attending,getTime(),user_id,meal_slot,meal_date],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const addAnnouncement = ({announcement_title,user_id,announcement_message}) =>{
    const currentTime = getTime();
    return new Promise((resolve,reject)=>{
        const q = `insert into announcements (announcement_title,announcement_message,created_at,user_id,updated_at,is_deleted) values (?,?,?,?,?,?);`;
        db.query(q,[announcement_title,announcement_message,currentTime,user_id,currentTime,0],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const checkAnnouncmentId = ({id,user_id}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as count from announcements where announcement_id=? and is_deleted=0 and user_id=?;`;
        db.query(q,[id,user_id],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const editAnnouncement = ({announcement_title,announcement_message,announcement_id}) =>{
    const currentTime = getTime();
    return new Promise((resolve,reject)=>{
        const q = `update announcements set announcement_title=?,announcement_message=?,updated_at=? where announcement_id=?;`;
        db.query(q,[announcement_title,announcement_message,currentTime,announcement_id],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const deleteAnnouncement = ({announcement_id}) =>{
    return new Promise((resolve,reject)=>{
        const q = `update announcements set is_deleted=1,updated_at=? where announcement_id=?;`;
        db.query(q,[getTime(),announcement_id],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const fullMenu = ()=>{
    return new Promise((resolve,reject)=>{
        let menu = [];
        for (let i=1;i<=7;i++){
            for (let j=1;j<=4;j++){
                const q = `select menu_id,meal_item,meal_type from menu where is_deleted=0 and meal_slot=? and meal_day=?;`;
                db.query(q,[j,i],(err,result)=>{
                    if (err){
                        reject(err)
                    }else{
                        menu.push({meal_day:i,meal_slot:j,menu:result})
                        if (menu.length==28){resolve(menu)}
                    }
                })
            }
        }
    })
}
const isWastageExist = ({meal_date,meal_slot}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as count from wastages where meal_date=? and meal_slot=?;`;
        db.query(q,[meal_date,meal_slot],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const updateWastage = ({meal_date,meal_slot,wastage}) =>{
    const currentTime = getTime();
    return new Promise((resolve,reject)=>{
        const q = `update wastages set wastage=?,updated_at=? where meal_date=? and meal_slot=?;`;
        db.query(q,[wastage,currentTime,meal_date,meal_slot],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const addWastage = ({meal_date,meal_slot,wastage}) =>{
    const currentTime = getTime();
    return new Promise((resolve,reject)=>{
        const q = `insert into wastages (meal_date,meal_slot,wastage,created_at,updated_at) values (?,?,?,?,?);`;
        db.query(q,[meal_date,meal_slot,wastage,currentTime,currentTime],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const wastages = ({start_date,end_date,page}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select meal_date,meal_slot,wastage,created_at,updated_at from wastages where meal_date between ? and ? LIMIT 28 OFFSET ${28*(page-1)};`;
        db.query(q,[start_date,end_date],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const total_wastages = ({start_date,end_date}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as count from wastages where meal_date between ? and ?;`;
        db.query(q,[start_date,end_date],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const announcements = ({page}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select a.announcement_id,a.announcement_title,a.user_id,a.announcement_message,a.created_at,a.updated_at,u.name from announcements as a LEFT JOIN users as u on a.user_id=u.user_id  where a.is_deleted=0 ORDER BY a.created_at DESC LIMIT 20 OFFSET ${20*(page-1)};`;
        db.query(q,(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const totalAnnouncements = () =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as count from announcements where is_deleted=0;`;
        db.query(q,(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const countAttendance = ({meal_date,meal_slot}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as count from attendance where meal_date=? and meal_slot=? and is_attending=1;`;
        db.query(q,[meal_date,meal_slot],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const feedbacks = ({meal_date,page}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select f.meal_date,f.meal_slot,f.questions,f.rating,f.answers,f.user_id,f.created_at,f.updated_at,u.name from feedbacks as f LEFT JOIN users as u on f.user_id=u.user_id where meal_date=? and is_deleted=0 LIMIT 20 OFFSET ${20*(page-1)};`;
        db.query(q,[meal_date],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result.map((i)=>({...i,questions:JSON.parse(i.questions),answers:JSON.parse(i.answers)})))
            }
        })
    })
}
const totalFeedbacks = ({meal_date}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as count from feedbacks where meal_date=? and is_deleted=0;`;
        db.query(q,[meal_date],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const suggestions = ({page}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select s.suggestion_id,s.changes_old_item,s.changes_new_item,s.user_id,s.created_at,u.name from suggestions as s LEFT JOIN users as u on s.user_id=u.user_id ORDER BY created_at DESC LIMIT 20 OFFSET ${20*(page-1)} ; `;
        db.query(q,(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const totalSuggestions = () =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as count from suggestions;`;
        db.query(q,(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const createPoll = ({poll_title,poll_options,user_id}) =>{
    const currentTime = getTime();
    return new Promise((resolve,reject)=>{
        const q = `insert into polls(poll_title,poll_options,user_id,created_at,is_deleted) values(?,JSON_Array(?),?,?,?);`;
        db.query(q,[poll_title,poll_options,user_id,currentTime,0],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const checkOptionNo = ({poll_id,option_no}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select JSON_LENGTH(poll_options) as count from polls where poll_id=? and is_deleted=0;`;
        db.query(q,[poll_id,option_no],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0]??{error:true})
            }
        })
    })
}
const checkPollAnswered = ({user_id,poll_id}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as count from poll_responses where user_id=? and poll_id=?;`;
        db.query(q,[user_id,poll_id],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const addPollAnswer = ({poll_id,user_id,option_no}) =>{
    const currentTime = getTime();
    return new Promise((resolve,reject)=>{
        const q = `insert into poll_responses(poll_id,user_id,option_no,created_at,updated_at) values(?,?,?,?,?);`;
        db.query(q,[poll_id,user_id,option_no,currentTime,currentTime],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const editPollAnswer = ({poll_id,user_id,option_no}) =>{
    const currentTime = getTime();
    return new Promise((resolve,reject)=>{
        const q = `update poll_responses set option_no=?,updated_at=? where poll_id=? and user_id=?;`;
        db.query(q,[option_no,currentTime,poll_id,user_id],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const checkPollId = ({poll_id,user_id}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as count from polls where poll_id=? and user_id=? and is_deleted=0;`;
        db.query(q,[poll_id,user_id],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const getPollResults = ({poll_id}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select option_no,count(*) as count from poll_responses where poll_id=?  group by option_no ORDER BY option_no;`;
        db.query(q,[poll_id],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const deletePoll = ({poll_id,results}) =>{
    return new Promise((resolve,reject)=>{
        const q = `update polls set is_deleted=1,results=JSON_Array(?) where poll_id=?;`;
        db.query(q,[results,poll_id],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const deletePollAnswers = ({poll_id}) =>{
    return new Promise((resolve,reject)=>{
        const q = `delete from poll_responses where poll_id=?;`;
        db.query(q,[poll_id],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const getTotalPolls = () =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as count from polls;`;
        db.query(q,(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const getPolls = ({page,user_id}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select p.poll_id,p.poll_title,p.poll_options,p.results ,p.user_id,u.name,p.created_at,p.is_deleted as is_closed,r.option_no as your_answer from polls as p left join users as u on p.user_id=u.user_id left join poll_responses as r on p.poll_id=r.poll_id and r.user_id=${user_id} order by created_at desc limit ? offset ?;`;
        db.query(q,[20,(page-1)*20],async (err,result)=>{
            if (err){
                reject(err)
            }else{
                for (let i=0;i<result.length;i++){
                    result[i].poll_options = JSON.parse(result[i].poll_options)
                    result[i].results = JSON.parse(result[i].results)
                    if (result[i].is_closed==0){
                        const getPollResultsResponse =await getPollResults({poll_id:result[i].poll_id})
                        let results = []
                        for (let j=1;j<=result[i].poll_options.length;j++){
                            if (getPollResultsResponse.find(k=>k.option_no==j)){
                                results.push(getPollResultsResponse.find(k=>k.option_no==j).count)
                            }else{
                                results.push(0)
                            }
                        }
                        result[i].results = results
                    }
                }
                resolve(result)
            }
        })
    })
}
module.exports = {checkMenuIds,getTotalPolls,getPolls,deletePollAnswers,checkPollId,deletePoll,editPollAnswer,getPollResults,addPollAnswer,createPoll,checkPollAnswered,checkOptionNo,suggestions,totalSuggestions,feedbacks,totalFeedbacks,countAttendance,totalAnnouncements,announcements,total_wastages,addWastage,wastages,updateWastage,isWastageExist,editAttendance,fullMenu,deleteAnnouncement,addAnnouncement,editAnnouncement,checkAnnouncmentId,checkAttendance,addSuggestion,markAttendance,countSuggestions,checkItemId,countFeedbacks,deletePreviousFeedback,addFeedback,checkMealIds,addMeals,removeMeals,currentMenu}