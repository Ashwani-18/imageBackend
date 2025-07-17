const userModel = require("../models/userModel")
const axios = require('axios')

exports.image = async (req, res) => {
    try {
        const { userId, prompt } = req.body;
        const user = await userModel.findOne({ userId });

        if (!user || !prompt) {
            return res.json({ success: false, message: "enter the required fields" });
        }
        if (user.creditBalance === 0) {
            return res.json({ success: false, message: "insufficient balance" });
        }

        // Gemini 2.0 Flash Preview endpoint
        const apiKey = process.env.GEMINI_API_KEY;
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        // Gemini expects a specific payload structure
        const geminiPayload = {
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: prompt
                        }
                    ]
                }
            ],
            generationConfig: {
                "response_mime_type": "image/png"
            }
        };

        const geminiResponse = await axios.post(geminiEndpoint, geminiPayload, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        // The response will contain a base64-encoded image
        // Adjust the path below based on the actual Gemini response structure
        const imageBase64 = geminiResponse.data.candidates[0].content.parts[0].inlineData.data;

        // Optionally: Deduct credit, save transaction, etc.

        return res.json({ success: true, image: `data:image/png;base64,${imageBase64}` });

    } catch (error) {
        res.status(401).json({
            message: "unable to produce image",
            success: false,
            error: error.message
        });
    }
}