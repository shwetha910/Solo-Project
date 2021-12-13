const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req,res,next){
    const token = req.header('x-auth-token');
    if(!token){
        return res.status(400).json('no token');
    }

    try {
        const verifyToken = jwt.verify(token,config.get('jwtSecret'));
        req.user = verifyToken.user;
        next();
    } catch (error) {
        res.status(400).json('token not valid');
    }

}