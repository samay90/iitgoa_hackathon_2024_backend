const feedback = ({data}) =>{
    if (!Array.isArray(data)){
        return false
    }else{
        for (let i of data){
            if (typeof(i)!=="object" || !Object.keys(i).length==3){
                return false
            }else{
                if (typeof(i.menu_id)!=="number"){return false}
                else if (typeof(i.rating)!=="number" || !(i.rating>=1 && i.rating<=5)){return false}
                else{
                    if (!Array.isArray(i.qna)){return false}
                    else{
                        for (let j of i.qna){
                            if (typeof(j)!=="object" || !(Object.keys(j).length==2)){return false}
                            else{
                                if (typeof(j.question)!=="string" || typeof(j.answer)!=="string"){return false}
                            }
                        }
                    }
                }
            }
        }
    }
    return true
}
module.exports = feedback