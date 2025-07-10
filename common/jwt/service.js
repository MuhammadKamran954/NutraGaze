
const jwt = require('jsonwebtoken')
require('dotenv').config();
class JwtService{
    static generateToken(payload){
        const secretKey = process.env.JWT_SECRET_KEY;
        const option ={
                expiresIn: process.env.JWT_SECRET_KEY_EXPIRY || '3h'
        };
        return jwt.sign(payload,secretKey,option);
    }

    static verifyToken(token){
         const secretKey = process.env.JWT_SECRET_KEY;
                        try{
                            return jwt.verify(token,secretKey)
                        }catch(error){
                            throw new Error('Invalid token');
                        }
    }
}

module.exports = JwtService;