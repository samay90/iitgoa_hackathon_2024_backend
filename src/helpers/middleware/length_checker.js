const rules = require("../../../static/rules.json")
const lengthChecker = (req,res,next) => {
    const body = req.body;
    var isError = false
    for (let i of Object.keys(body)){
        if (rules[i]) {
            if (typeof(body[i])!=="string"){
                isError = true
                res.status(400).json({
                    status:400,
                    error:true,
                    message:"Type of "+i+" must be a string!!",
                    data:{}
                })
            }else{
                if (body[i].length>rules[i]){
                    isError = true
                    res.status(400).json({
                        status:400,
                        error:true,
                        message:"Length of "+i+" must be less than "+rules[i],
                        data:{}
                    })
                }
            }
        }
    }
    if (!isError){
        next()
    }
}

module.exports = lengthChecker