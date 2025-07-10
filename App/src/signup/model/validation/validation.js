function validateSignUp(data) {
    if (!data.country_code || !data.phone) {
        return {
            success: false,
            message: 'Country code, phone, and password are required.'
        };
    }

    const countryCodeRegex = /^\d{1,3}$/;
    if (!countryCodeRegex.test(data.country_code)) {
        return {
            success: false,
            message: 'Invalid country code format. Example: 92'
        };
    }


    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(data.phone)) {
        return {
            success: false,
            message: 'Invalid phone number format. Only digits allowed, 7-15 characters.'
        };
    }
    return { success: true };
}

function validateVerifyData(data) {
    if (!data.country_code || !data.phone || !data.otp) {
        return {
            success: false,
            message: 'Country code, phone, and password are required.'
        };
    }

    const countryCodeRegex = /^\d{1,3}$/;
    if (!countryCodeRegex.test(data.country_code)) {
        return {
            success: false,
            message: 'Invalid country code format. Example: 92'
        };
    }


    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(data.phone)) {
        return {
            success: false,
            message: 'Invalid phone number format. Only digits allowed, 7-15 characters.'
        };
    }


    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(data.otp)) {
        return {
            success: false,
            message: 'OTP must be exactly 6 digits.'
        };
    }

    return { success: true };
}

module.exports = { validateSignUp, validateVerifyData };