const additions = ({data}) =>{
    if (!Array.isArray(data)){
        return false
    }else{
        for (let i of data){
            if (!typeof(i)==="object" || !Object.keys(i).length>0){
                return false
            }else{
                if(typeof(i.meal_item)!=="string"){
                    return false
                }else if (typeof(i.meal_type)!=="number" && ![1,2,3,4,5,6,7,8,9].includes(i.meal_type)){
                    return false
                }else if (typeof(i.meal_slot)!=="number" && ![1,2,3,4].includes(i.meal_slot)){
                    return false
                }else if (typeof(i.meal_day)!=="number" && ![1,2,3,4,5,6,7].includes(i.meal_day)){
                    return false
                }
            }
        }
    }
    return true
}
module.exports = additions