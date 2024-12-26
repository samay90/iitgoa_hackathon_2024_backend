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
const addFeedback = ({meal_slot,meal_date,feedback,user_id}) =>{
    const currentTime = getTime();
    return new Promise((resolve,reject)=>{
        const q = `insert into feedbacks (user_id,meal_slot,meal_date,feedback,created_at,updated_at,is_deleted) values (?,?,?,?,?,?,?);`;
        db.query(q,[user_id,meal_slot,meal_date,JSON.stringify(feedback),currentTime,currentTime,0],(err,result)=>{
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
        db.query(q,[announcement_id,getTime()],(err,result)=>{
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
        const q = `select meal_date,meal_slot,wastage,created_at,updated_at from wastages where meal_date between ? and ? LIMIT 20 OFFSET ${20*(page-1)};`;
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
        const q = `select a.announcement_id,a.announcement_title,a.user_id,a.announcement_message,a.created_at,a.updated_at,u.name from announcements as a LEFT JOIN users as u on a.user_id=u.user_id where is_deleted=0 LIMIT 20 OFFSET ${20*(page-1)};`;
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
module.exports = {checkMenuIds,totalAnnouncements,announcements,total_wastages,addWastage,wastages,updateWastage,isWastageExist,editAttendance,fullMenu,deleteAnnouncement,addAnnouncement,editAnnouncement,checkAnnouncmentId,checkAttendance,addSuggestion,markAttendance,countSuggestions,checkItemId,countFeedbacks,deletePreviousFeedback,addFeedback,checkMealIds,addMeals,removeMeals,currentMenu}