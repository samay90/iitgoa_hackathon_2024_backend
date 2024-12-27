const isEmail = ({email}) =>{
    var re = /^[a-zA-Z0-9._%+-]+@iitgoa.ac.in$/;
    return re.test(email);
}
module.exports = isEmail