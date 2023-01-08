const dotenv =  require('dotenv');
dotenv.config({path:'./config.env'});


const jwt = require('jsonwebtoken');
const User = require('../models/users');
//const JWT_SECRET = 'kccJUYHFV87fb6768O^(043jbrj(&5t&597%98%34bt242erjfbs424dihGFYUFK6ikRRKylfv6fULsdi5464&^$*sbdvs';
const JWT_SECRET = process.env.JWT_SECRET;


const requireAuth = (req,res,next) =>{
    const token = req.cookies.JWT; // JWT is the name of the cookie
    console.log(req.body);
    //Check if JSON web token exists and verified  
    if(token)
    { 
        //console.log('Token : ',token);
        jwt.verify(token,JWT_SECRET,(err,decodedToken) =>{
        
            if(err)
            {
                console.log(err.message);
                res.redirect('/login');
            }
            
            else{
                console.log(decodedToken);
                next();
            }

        });
    }
    else
    {
        res.redirect('/login');
    }
}
// Check Current user
const checkUser = (req,res,next)=>{
    const token = req.cookies.JWT;
    if(token)
    { 
        //console.log('Token : ',token);
        jwt.verify(token,JWT_SECRET,async(err,decodedToken) =>{
        
            if(err)
            {
                console.log(err.message);
                res.locals.user = null;
                next();
            }
            else{
                console.log('Decoded token : ',decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }

        });
    }
    else
    {
        res.locals.user = null;
        next();
    }
}



module.exports = {requireAuth ,checkUser};