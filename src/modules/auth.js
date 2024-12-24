const db = require("../helpers/database/db")
const getTime = require("../helpers/functions/getTime")
const isEmailExist = ({email}) =>{
    return new Promise((resolve,reject)=>{
        const q = `select count(*) as flag from users where email=?;`
        db.query(q,[email],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0])
            }
        })
    })
}
const createUser = ({name,email,password})=>{
    return new Promise((resolve,reject)=>{
        const q = `insert into users(name,email,password,is_admin,is_super_admin,created_at,updated_at) values(?);`;
        db.query(q,[[name,email,password,0,0,getTime(),getTime()]],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result)
            }
        })
    })
}
const getUserCredentials = ({email})=>{
    return new Promise((resolve,reject)=>{
        const q = `select email,password from users where email=?;`
        db.query(q,[email],(err,result)=>{
            if (err){
                reject(err)
            }else{
                resolve(result[0]??{error:true})
            }
        })
    })
}
module.exports = {isEmailExist,createUser,getUserCredentials}