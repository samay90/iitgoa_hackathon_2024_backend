const removes = ({data}) =>{
    if (!Array.isArray(data)){
        return false
    }else{
        for (let i of data){
            if (typeof(i)!=="number"){
                return false
            }
        }    
    }
    return true
}
module.exports = removes