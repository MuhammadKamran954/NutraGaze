const { response } = require("express");
const logger = require("../../../../common/winston/logger");
const { SendOtpService, VerifyOtpService, UpdateProfileService } = require("../service/service");
const validateToken = require("../../../../common/jwt/validate");
async function SendOtpController(req, res) {
    const data = req.body;
    try {
        const response = await SendOtpService(data);
        res.status(response.status).json({
            success: response.success,
            message: response.message,
            data: response.data,
            error: response.error
        });
    }
    catch (error) {
        logger.error({
            status: 500,
            success: false,
            message: 'Internal Server error',
            error: error.message
        })
        return {
            status: 500,
            success: false,
            message: 'Internal Server error',
            error: error.message
        }
    }
}

async function VerifyOtpController(req, res) {
    const data = req.body;
    try {
        const response = await VerifyOtpService(data);

        return res.status(response.status).json({
            success: response.success,
            message: response.message,
            data: response.data,
            error: response.error
        });
    } catch (error) {
        logger.info({
            status: 500,
            success: false,
            message: 'Internal server error',
            error: error.message
        });
        return {
            status: 500,
            success: false,
            message: 'Internal server error',
            error: error.message
        }
    }
}

async function UpdateProfileController(req, res) {
    const tokenResult = validateToken(req, res);
    if (!tokenResult.success) return;
    try {
        const userId = tokenResult.decoded.id;
        const userData = req.body;
        const profile_photo = req.file ? req.file.filename : null;
        const response = await UpdateProfileService(userId, userData, profile_photo);
        return res.status(response.status).json({
            success: response.success,
            message: response.message,
            data: response.data,
            error: response.error
        });
    } catch (error) {
        logger.info({
            status: 500,
            success: false,
            message: 'Internal Server error',
            error: error.message
        });
        return {
            status: 500,
            success: false,
            message: 'Internal Server error',
            error: error.message
        }
    }

}



module.exports = { SendOtpController, VerifyOtpController, UpdateProfileController };