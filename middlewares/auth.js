require("dotenv").config();
const jwt=require("jsonwebtoken");

// middleware/auth.js
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin role required.'
        });
    }
    next();
};

async function auth (req,res,next) {
    try{
        //extract token
        // console.log(req.cookies.token);

        const token = req.cookies.token  || req.header('Authorization').replace("Bearer ","");
        console.log(token);

        if(!token){
            return res.status(401).json({
                success: false,
                message: "No token found, authorization denied"
            }); 
        }

        //verify token
        try{
            // console.log("inside try block in auth middleware",process.env.JWT_SECRET);
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            req.user=decode;
            console.log("printing req.user in auth",req.user);
        }
        
        catch(error){
            return res.status(401).json({
                success: false,
                message: "Token is invalid or expired, authorization denied"
            });
        }
        next();
    }

    catch(error){
        res.status(401).json({
            success: false,
            message: "something went wrong while validating the token"
        })
    }
}

const isAdminOrOwner = (req, res, next) => {
    const { userId } = req.params;
    if (req.user.role === 'admin' || req.user._id.toString() === userId) {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Access denied.'
    });
};

module.exports = {
    isAdmin,
    auth,
    isAdminOrOwner
}

/*      
    Hash passwords using bcrypt
    Implement JWT tokens with role claims
    Sanitize user inputs
    Rate limiting on admin endpoints
*/