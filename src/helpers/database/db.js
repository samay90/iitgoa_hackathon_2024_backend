const mysql = require("mysql")
const db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"password",
    database:"mess_frs",
})
module.exports = db