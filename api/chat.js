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
    console.log("Brian_API_KEY exists:", !!process.env.Brian_API_KEY);

    try {
    const { message } = req.body;

    console.log("Message:", message);

    const completion = await client.chat.completions.create({
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        messages: [
            {
                role: "system",
                content: "You are Neoma."
            },
            {
                role: "user",
                content: message
            }
        ]
    });

    console.log("OpenRouter Success");

    return res.status(200).json({
        reply: completion.choices[0].message.content
    });

} catch (err) {
    console.log("Brian_API_KEY exists:", !!process.env.Brian_API_KEY);
    console.error("ERROR:");
    console.error(err);

    return res.status(500).json({
        reply: err.message,
        stack: err.stack
    });
}