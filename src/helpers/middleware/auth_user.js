const jwt = require("jsonwebtoken");
const lang = require("../../../lang/lang.json")
const dotEnv = require("dotenv")
const {getUserDetails} = require("../../modules/user")
dotEnv.config()
const tokenVerifier = (req,res,next)=>{
    const token = req.headers["authorization"];
    if (!token){
        res.status(401).send({
            status:401,
            error:true,
            message:lang.UNAUTHORIZED,
            data:{}
        })
    }else{
        const parsed_token = token.split(" ")[1];
        if (!parsed_token){
            res.status(401).send({
                status:401,
                error:true,
                message:lang.UNAUTHORIZED,
                data:{}
            })
        }else{
            jwt.verify(parsed_token,process.env.JWT_SECRET,async (err,decoded)=>{
                if (err){
                    if (err.message=="jwt expired"){
                        res.status(401).send({
                            status:401,
                            error:true,
                            message:lang.TOKEN_EXPIRED,
                            data:{}
                        })
                    }
                }else{
                    const getUserDetailsResponse =await getUserDetails({email:decoded.email});
                    if (getUserDetailsResponse.error){
                        res.status(401).send({
                            status:401,
                            error:true,
                            message:lang.UNAUTHORIZED,
                            data:{}
                        })
                    }else{
                        req.user = getUserDetailsResponse;
                        next();
                    }
                }
            })
        }
    }
}
module.exports = tokenVerifier