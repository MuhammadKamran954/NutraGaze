
const twilio = require('twilio');
require('dotenv').config()

const accountSid = process.env.ACC_SID;
const authToken = process.env.AUTH_TOKEN;
const verifySid  = process.env.SERVICE_SID;

const client = twilio(accountSid, authToken);


async function sendOtp(toNumber) {
    try {
        const verification = await client.verify.v2.services(verifySid)
            .verifications
            .create({ to: toNumber, channel: 'sms' });

        return {
            success: true,
            status: verification.status
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

async function verifyOtp(toNumber, code) {
    try {
        const verificationCheck = await client.verify.v2.services(verifySid)
            .verificationChecks
            .create({ to: toNumber, code });

        return {
            success: verificationCheck.status === 'approved',
            status: verificationCheck.status
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

module.exports = { sendOtp, verifyOtp };