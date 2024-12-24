const rules = require( "../../../static/rules.json")
const checker = (data,fields) =>{
    for (let field of fields){
        if(!data[field]) return "Please enter "+field+"!!";
    }
    return false;
}

module.exports = checker