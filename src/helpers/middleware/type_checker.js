const type = require("../../../static/type.json")
const additons = require("../functions/types/additions")
const removes = require("../functions/types/removes")
const feedback = require("../functions/types/feedback")
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
                }else if (i=="feedback"){
                    if (!feedback({data:body[i]})){
                        isError = true
                        res.status(400).json({
                            status:400,
                            error:true,
                            message:"Type of feedback must be an array of objects with the following structure : {menu_id:number,rating:number[1-5],qna:[{question:string,answer:string}]}",
                            data:{}
                        })
                    }
                }else if (i=="meal_date" || i=="start_date" || i=="end_date"){
                    const temp = new Date(body[i]);
                    if (temp=="Invalid Date"){
                        isError = true
                        res.status(400).json({
                            status:400,
                            error:true,
                            message:"Type of meal_date must be a valid date",
                            data:{}
                        })
                    }
                }else if (i=="meal_slot"){
                    if ((body[i]<1 || body[i]>4) || typeof(body[i])!=="number"){
                        isError = true
                        res.status(400).json({
                            status:400,
                            error:true,
                            message:"Type of meal_slot must be a number between 1 and 4",
                            data:{}
                        })
                    }
                }else if (i=="is_attending"){
                    if (!(body[i]==0 || body[i]==1)){
                        isError = true
                        res.status(400).json({
                            status:400,
                            error:true,
                            message:"Type of is_attending must be a 0 or 1",
                            data:{}
                        })
                    }
                }else if(i=="user_role"){
                    if (![1,2].includes(body[i])){
                        isError = true
                        res.status(400).json({
                            status:400,
                            error:true,
                            message:"Type of role must be 1 (normal) or 2 (admin)",
                            data:{}
                        })
                    }
                }else if(i=="poll_options"){
                    if (!Array.isArray(body[i])){
                        isError = true
                        res.status(400).json({
                            status:400,
                            error:true,
                            message:"Type of poll_options must be an array of strings",
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