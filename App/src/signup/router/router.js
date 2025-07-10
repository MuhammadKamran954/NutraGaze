const ValidateApiKey = require('../../../../common/jwt/strategy');
const { uploadProfilePhoto } = require('../../../../common/multer/multer');
const { SendOtpController ,VerifyOtpController, UpdateProfileController} = require('../controller/controller');
const router = require('express').Router();
router.post('/send_otp',ValidateApiKey,SendOtpController);
router.post('/verify_otp',ValidateApiKey,VerifyOtpController);
router.post('/update_profile',uploadProfilePhoto.single('profile_photo'),UpdateProfileController)

module.exports =router;