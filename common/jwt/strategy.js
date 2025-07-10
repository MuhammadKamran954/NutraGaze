
require('dotenv').config()
function ValidateApiKey(req,res,next){
    const storedApiKey = process.env.API_KEY;
    const apiKey = req.headers['x-api-key'];
    if(!apiKey){
        return res.status(400).json({
            success:false,
            message:'API Key is required'
        });
    }
    if(apiKey!==storedApiKey){
        return res.status(400).json({
            success:false,
            message:'Invalid API Key'
        });
    }
    next();
}

module.exports = ValidateApiKey;