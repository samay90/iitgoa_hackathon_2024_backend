const mysql = require("mysql")
const dotEnv = require("dotenv")
dotEnv.config()
const db = mysql.createPool({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE,
    port:process.env.DBPORT
})
module.exports = db