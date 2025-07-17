const userModel = require("../models/userModel")
const axios = require('axios')

exports.image = async (req, res) => {
    try {
        const { prompt } = req.body;
        const userId = req.user.id; // Use authenticated user from JWT
        const user = await userModel.findById(userId);

        if (!user || !prompt) {
            return res.json({ success: false, message: "enter the required fields" });
        }
        if (user.creditBalance === 0) {
            return res.json({ success: false, message: "insufficient balance" });
        }

        // Stable Horde API call
        const hordeApiKey = process.env.STABLE_HORDE_API_KEY;
        const hordeEndpoint = "https://stablehorde.net/api/v2/generate/async";

        const hordePayload = {
            prompt,
            params: {
                n: 1,
                width: 512,
                height: 512,
                steps: 20,
                sampler_name: "k_euler_ancestral"
            }
        };

        const hordeHeaders = {
            "Content-Type": "application/json",
            "apikey": hordeApiKey
        };

        // Submit the generation request
        const submitRes = await axios.post(hordeEndpoint, hordePayload, { headers: hordeHeaders });
        const { id } = submitRes.data;

        // Poll for the result (Stable Horde is async)
        let imageBase64 = null;
        for (let i = 0; i < 20; i++) {
            await new Promise(r => setTimeout(r, 3000)); // wait 3 seconds
            const pollRes = await axios.get(`https://stablehorde.net/api/v2/generate/status/${id}`, { headers: hordeHeaders });
            if (pollRes.data.generations && pollRes.data.generations.length > 0) {
                imageBase64 = pollRes.data.generations[0].img;
                break;
            }
        }

        if (!imageBase64) {
            return res.json({ success: false, message: "Image generation timed out" });
        }

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