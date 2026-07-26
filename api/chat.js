import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.Brian_API_KEY,
    defaultHeaders: {
    "HTTP-Referer": "https://neo-moon-git-main-mamoonkhan663-4872s-projects.vercel.app",
    "X-Title": "Neomoon"
    }
});

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        
        console.log("API Key exists:", !!process.env.Brian_API_KEY);

        const { message } = req.body;

        const completion = await client.chat.completions.create({

            model: "nvidia/nemotron-3-ultra-550b-a55b:free",

            messages: [
                {
                    role: "system",
                    content: `
You are Neoma, the AI consultant for Neomoon.

You help visitors with:
- Website Design
- SEO
- AI Automation
- Chatbots
- Pricing
- Booking consultations

Keep answers friendly, professional, and concise.
`
                },
                {
                    role: "user",
                    content: message
                }
            ]

        });

        return res.status(200).json({
            reply: completion.choices[0].message.content
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            reply: err.message
        });

    }

}