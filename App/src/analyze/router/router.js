const { UploadFoodController } = require('../controller/controller');
const router = require('express').Router();
const {uploadFoodPhoto} = require('./../../../../common/multer/multer');
router.post('/analyze_food',uploadFoodPhoto.single('food_photo'),UploadFoodController);

module.exports = router;