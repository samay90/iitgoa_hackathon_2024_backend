const db = require("../helpers/database/db")
const getTime = require("../helpers/functions/getTime")
const getUserDetails = ({email}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select user_id,email,is_admin,is_super_admin,created_at,updated_at from users where email=?;`
        db.query(q,[email],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0]??{error:true})
            }
        })
    })
}
const getUserRole = ({user_id}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select is_admin,is_super_admin from users where user_id=?;`
        db.query(q,[user_id],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0]??{error:true})
            }
        })
    })
}
const changeUserRole = ({user_id,is_admin})=>{
    return new Promise((resolve,reject)=>{
        const q = `update users set is_admin=?,updated_at=? where user_id=?;`
        db.query(q,[is_admin,getTime(),user_id],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
module.exports = {getUserDetails,changeUserRole,getUserRole}