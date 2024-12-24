const db = require("../helpers/database/db")

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
module.exports = {getUserDetails}