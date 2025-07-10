const logger = require("../winston/logger");
const JwtService = require("./service");
require('dotenv').config()

function validateToken(req, res) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'Authorization token is required'
        });
            return { success: false }
    }

    try{
        const decoded = JwtService.verifyToken(token);
        return {success:true,decoded}
    }catch(error){
        logger.info(`'JWT Error:' ${error.message}`)
          res.status(401).json({ success: false, message: 'Invalid or expired token' });
        return { success: false };
    }
}

module.exports = validateToken;