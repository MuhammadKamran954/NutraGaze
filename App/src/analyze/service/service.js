const logger = require("../../../../common/winston/logger");
const path = require('path');
const fs = require('fs');
const analyzeFoodImage = require("../../../../common/utils/anaylze_image");
async function UploadFoodService(userId, foodPhoto) {
    try {
        if (!foodPhoto) {
            return {
                status: 400,
                success: false,
                message: "No food photo provided.",
                data: null,
                error: null
            };
        }
        const imagePath = path.join(__dirname, './../../../../uploads/food_photo', foodPhoto);
        const analysisResult = await analyzeFoodImage(imagePath);

        if (
            !analysisResult ||
            typeof analysisResult !== "object" ||
            (!analysisResult.foodName && !analysisResult.raw)
        ) {
            return {
                status: 422,
                success: false,
                message: "Image could not be analyzed. Please try a clearer photo.",
                data: null,
                error: "Unrecognized food content"
            };
        }

        console.log("🧾 Inserting to DB:", { userId, foodPhoto });

        await db.query(
            `INSERT INTO food_photo (user_id, image) VALUES ($1, $2) RETURNING *`,
            [userId, foodPhoto]
        );
        logger.info({
            status: 200,
            success: true,
            message: "Food image analyzed successfully.",
            data: analysisResult
        });
        return {
            status: 200,
            success: true,
            message: "Food image analyzed successfully.",
            data: analysisResult
        }
    } catch (error) {
        logger.info({
            status: 500,
            success: false,
            message: 'Error while Analyzing the Food Image.',
            error:error.message
        });
        return{
             status: 500,
            success: false,
            message: 'Error while Analyzing the Food Image.',
            error:error.message 
        }
    }
}

module.exports = { UploadFoodService };