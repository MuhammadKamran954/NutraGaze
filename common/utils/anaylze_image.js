
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { OpenAI } = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
async function analyzeFoodImage(imagePath) {
    try {
        const imageData = fs.readFileSync(imagePath);
        const base64Image = imageData.toString('base64');
        const response = await openai.chat.completions.create({
            model:'gpt-4o',
            messages: [
                {
                    role: "user",
                    content:[
                            {
                                type:'text',
                                text:'Analyze this food image. Give me the name of the dish, estimated calories, and a list of common ingredients.'
                            },
                            {
                                type:'image_url',
                                image_url:{
                                    url: `data:image/jpeg;base64,${base64Image}`
                                }
                            }
                    ]
                }

            ],
            max_tokens:500
        });

        const resultText = response.choices[0].message.content;

        return{
            raw: resultText
        };
    } catch (error) {
        console.error("OpenAI error:", error);
        throw error;
    }
}

module.exports = analyzeFoodImage;