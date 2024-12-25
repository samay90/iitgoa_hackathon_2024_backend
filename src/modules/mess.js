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
        const q = `update feedbacks set is_deleted=1 where user_id=? and meal_slot=? and meal_date=?;`;
        db.query(q,[user_id,meal_slot,meal_date],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
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
module.exports = {checkMenuIds,deletePreviousFeedback,addFeedback,checkMealIds,addMeals,removeMeals,currentMenu}