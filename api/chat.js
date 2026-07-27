import OpenAI from "openai";

const client = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.Test,
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
    const { message } = req.body;

    console.log("Message:", message);

    const completion = await client.chat.completions.create({
        model: "openai/gpt-oss-20b:free",
        max_tokens: 180,
        temperature: 0.4,
        messages: [
            {
                role: "system",
                content: `You are Neoma, the AI assistant for NeoMoon.
                About NeoMoon-
                - We build modern websites.
                - We create AI chatbots.
                - We automate businesses.
                - We provide SEO.
                - We offer free consultations.
                Always answer as a NeoMoon representative.

                Your primary goal is to help visitors understand NeoMoon's services and guide them toward booking a consultation.

                Rules:

                - Keep replies under 120 words unless the user explicitly asks for details.
                - Use short paragraphs (1-2 sentences each).
                - Never use Markdown.
                - Never use **bold**, *italics*, bullet symbols like ###, or tables.
                - Never roleplay or describe actions.
                - Never invent NeoMoon's pricing, services, or policies.
                - If the question is about NeoMoon's business, answer only using the provided information.
                - For general web development or AI questions, give clear and practical advice.
                - End responses naturally without repeating yourself.
                - Write like a friendly consultant, not a blog article.
                Good response:

                NeoMoon helps businesses build modern websites, AI chatbots, and automation tools. If you're unsure which package fits your needs, I'd be happy to recommend one based on your business.

                Bad response:

                ### Business Growth Strategy

                **Customer First**

                - Bullet point
                - Bullet point
                - Bullet point

                `},
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
    console.error("ERROR:");
    console.error(err);

    return res.status(500).json({
        reply: err.message,
        stack: err.stack
    });
}}