const type = require("../../../static/type.json")
const additons = require("../functions/types/additions")
const removes = require("../functions/types/removes")
const typeChecker = (req,res,next) =>{
    const body = req.body;
    var isError = false
    for (let i of Object.keys(body)){
        if (type[i]){
           if(type[i]!=="custom"){
                if (typeof(body[i])!==type[i]){
                    isError = true
                    res.status(400).json({
                        status:400,
                        error:true,
                        message:"Type of "+i+" must be "+type[i],
                        data:{}
                    })
                }
            }else{
                if (i=="additions"){
                    if (!additons({data:body[i]})){
                        isError = true
                        res.status(400).json({
                            status:400,
                            error:true,
                            message:"Type of additions must be an array of objects with the following structure : {meal_item:string,meal_type:[1-9],meal_slot:[1-4],meal_day:[1-7]}",
                            data:{}
                        })
                    }
                }else if (i=="removes"){
                    if (!removes({data:body[i]})){
                        isError = true
                        res.status(400).json({
                            status:400,
                            error:true,
                            message:"Type of removes must be an array of numbers",
                            data:{}
                        })
                    }
                }
            }
        }
    }
    if (!isError){
        next()
    }
}
module.exports = typeChecker