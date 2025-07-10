const { sendOtp, verifyOtp } = require('../../../../common/twilio/twilio');
const logger = require('./../../../../common/winston/logger');
const { validateSignUp, validateVerifyData } = require('./../model/validation/validation');
const db = require('./../../../../config/db');
const JwtService = require('../../../../common/jwt/service');
require('dotenv').config()
async function SendOtpService(data) {
    try {
        const validation = await validateSignUp(data);
        if (!validation.success) {
            logger.error({
                status: 400,
                success: false,
                message: validation.message
            });
            return {
                status: 400,
                success: false,
                message: validation.message
            }
        }
        const fullNumber = `+${data.country_code}${data.phone}`;
        if (process.env.BUILD_TYPE === 'production') {
            const otpResult = await sendOtp(fullNumber);

            if (!otpResult.success) {
                logger.error({
                    status: 500,
                    success: false,
                    message: 'Failed to send OTP',
                    error: otpResult.message
                });

                return {
                    status: 500,
                    success: false,
                    message: 'Failed to send OTP',
                    error: otpResult.message
                };
            }

            logger.info({
                status: 200,
                success: true,
                message: 'OTP sent successfully',
                phone: fullNumber,
                status_detail: otpResult.status
            });

            return {
                status: 200,
                success: true,
                message: 'OTP sent successfully',
                phone: fullNumber
            };
        }

        logger.info({
            status: 200,
            success: true,
            message: 'OTP sent successfully (dev mode)',
            data: {
                phone: fullNumber
            }
        });

        return {
            status: 200,
            success: true,
            message: 'OTP sent successfully (dev mode)',
            data: {
                phone: fullNumber
            }
        };


    } catch (error) {
        logger.error({
            status: 500,
            success: false,
            message: 'Internal Server error (dev mode)',
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

async function VerifyOtpService(verifyData) {
    const validation = await validateVerifyData(verifyData);
    if (!validation.success) {
        logger.error({
            status: 400,
            success: false,
            message: validation.message
        });
        return {
            status: 400,
            success: false,
            message: validation.message
        }
    }
    const fullNumber = `+${verifyData.country_code}${verifyData.phone}`;
    try {
        if (process.env.BUILD_TYPE === 'production') {
            const verifyResult = await verifyOtp(fullNumber, verifyData.otp);
            if (verifyResult.status !== 'approved') {
                // OTP was incorrect or expired
                logger.warn({
                    status: 401,
                    success: false,
                    message: 'OTP is incorrect or expired',
                    statusFromTwilio: verifyResult.status
                });

                return {
                    status: 401,
                    success: false,
                    message: 'OTP is incorrect or expired'
                };
            }

            const userFind = await db.query(`SELECT * FROM users WHERE phone=$1`, [verifyData.phone]);
            if (userFind.rows && userFind.rows.length > 0) {
                const token = JwtService.generateToken({ id: userFind.rows[0].id, country_code: userFind.rows[0].country_code, phone: userFind.rows[0].phone })

                logger.info({
                    status: 200,
                    success: true,
                    message: 'Logged in successfully',
                    data: {
                        total: userFind.rowCount,
                        user: userFind.rows[0],
                        token: token
                    }
                });
                return {
                    status: 200,
                    success: true,
                    message: 'Logged in successfully',
                    data: {
                        total: userFind.rowCount,
                        user: userFind.rows[0],
                        token: token
                    }
                }
            }
            const addUserQuery = await db.query(
                `INSERT INTO users (country_code, phone) VALUES($1, $2) RETURNING *`,
                [verifyData.country_code, verifyData.phone]
            );
            const token = JwtService.generateToken({ id: addUserQuery.rows[0].id, country_code: addUserQuery.rows[0].country_code, phone: addUserQuery.rows[0].phone })

            logger.info({
                status: 201,
                success: true,
                message: 'User created successfully',
                data: {
                    total: addUserQuery.rowCount,
                    user: addUserQuery.rows[0],
                    token: token
                }
            });
            return {
                status: 201,
                success: true,
                message: 'User created successfully',
                data: {
                    total: addUserQuery.rowCount,
                    user: addUserQuery.rows[0],
                    token: token
                }
            };
        }
        //here start development mode for testing the otp verify api
        const userFind = await db.query(`SELECT * FROM users WHERE phone=$1`, [verifyData.phone]);
        if (userFind.rows && userFind.rows.length > 0) {
            const token = JwtService.generateToken({ id: userFind.rows[0].id, country_code: userFind.rows[0].country_code, phone: userFind.rows[0].phone })
            logger.info({
                status: 200,
                success: true,
                message: 'Logged in successfully (dev mode)',
                data: {
                    total: userFind.rowCount,
                    user: userFind.rows[0],
                    token: token
                }
            });
            return {
                status: 200,
                success: true,
                message: 'Logged in successfully (dev mode)',
                data: {
                    total: userFind.rowCount,
                    user: userFind.rows[0],
                    token: token
                }
            }
        }
        const addUserQuery = await db.query(
            `INSERT INTO users (country_code, phone) VALUES($1, $2) RETURNING *`,
            [verifyData.country_code, verifyData.phone]
        );
        const token = JwtService.generateToken({ id: addUserQuery.rows[0].id, country_code: addUserQuery.rows[0].country_code, phone: addUserQuery.rows[0].phone })
        logger.info({
            status: 201,
            success: true,
            message: 'User created successfully (dev mode)',
            data: {
                total: addUserQuery.rowCount,
                user: addUserQuery.rows[0],
                token: token
            }
        });
        return {
            status: 201,
            success: true,
            message: 'User created successfully (dev mode)',
            data: {
                total: addUserQuery.rowCount,
                user: addUserQuery.rows[0],
                token: token
            }
        };
    } catch (error) {
        logger.error({
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

async function UpdateProfileService(userId, userData, profile_photo) {
    try {
        const userFind = await db.query(`SELECT * FROM users WHERE id=$1`, [userId]);
        if (userFind.rows.length === 0) {
            logger.info({
                status: 404,
                success: false,
                message: 'User not found'
            })
            return {
                status: 404,
                success: false,
                message: 'User not found'
            };
        }
        const user = userFind.rows[0];
        const updateData = {
            name: userData.name || user.name,
            profile_photo: profile_photo || user.profile_photo
        }
        const updateQuery = await db.query(`UPDATE users SET name=$1,profile_photo=$2, is_profile_completed=$3 WHERE id=$4 RETURNING *`,
            [updateData.name, updateData.profile_photo,true,userId]);

        logger.info({
            status: 200,
            success: true,
            message: 'Profile Updated successfully',
            data: {
                user: user,
                UpdatedData: updateQuery.rows[0]
            }
        })
        return {
            status: 200,
            success: true,
            message: 'Profile Updated successfully',
            data: {
                user: user,
                UpdatedData: updateQuery.rows[0]
            }
        }
    } catch (error) {
        logger.error({
            status: 500,
            success: false,
            message: 'Error in updating the profile',
            error: error.message
        });

        return {
            status: 500,
            success: false,
            message: 'Error in updating the profile',
            error: error.message
        };
    }
}


module.exports = { SendOtpService, VerifyOtpService, UpdateProfileService };