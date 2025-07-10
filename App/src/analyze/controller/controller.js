const validateToken = require("../../../../common/jwt/validate");
const logger = require("../../../../common/winston/logger");
const { UploadFoodService } = require("../service/service");

async function UploadFoodController(req, res) {
   const tokenResult = validateToken(req, res);
   if (!tokenResult.success) return;
   console.log('Headers:', req.headers);
   console.log('Body:', req.body);
   console.log('File:', req.file);
   const userId = tokenResult.decoded.id;
   const foodPhoto = req.file ? req.file.filename : null;
   console.log('req.file:', req.file);
   try {
      const response = await UploadFoodService(userId, foodPhoto);
      return res.status(response.status).json({
         success: response.success,
         message: response.message,
         data: response.data,
         error: response.error
      })
   }catch(error){
      logger.info({
         status: 500,
         success: false,
         Message: 'Error while Analyzing Food Image',
         error: error.Message
      })
      return {
         status: 500,
         success: false,
         Message: 'Error while Analyzing Food Image',
         error: error.Message
      }
   }
}

module.exports = { UploadFoodController };