const css = document.createElement("link");

css.rel = "stylesheet";

css.href = "AI/neoma.css";

document.head.appendChild(css);

const html = `
    <!-- =======================
        NEOMA AI
======================== -->

<div id="neoma">

    <button id="neoma-btn">

        <div class="pulse"></div>

        <img
            src="Pic/logo.webp"
            alt="Neoma"
            width="128"
            height="128">

    </button>

</div>

<!-- ==========================
        NEOMA PANEL
=========================== -->

<div id="neoma-panel">

    <div class="neoma-header">

        <div class="neoma-profile">

            <img
                src="Pic/logo.webp"
                alt="Neoma"
                width="128"
                height="128">

            <div>

                <h3>Neoma</h3>

                <span>AI Business Consultant</span>

            </div>

        </div>

        <button id="close-neoma">&times;</button>

    </div>

    <div id="chat-area">

        <div class="bot-message">

            <p>
                Hello, I'm <strong>Neoma</strong>.
            </p>

            <p>
                I can answer questions about our services, pricing,
                websites, AI automation and help you choose the best plan.
            </p>

        </div>

    </div>

    <div class="chat-input">

        <input id="user-input" type="text" placeholder="Ask Neoma anything...">

        <button id="send-message">
            ➜
        </button>

    </div>

</div>
`;

document.body.insertAdjacentHTML("beforeend", html);

initializeNeoma();

const neoma = document.getElementById("neoma");
const neomaButton = document.getElementById("neoma-btn");
const neomaPanel = document.getElementById("neoma-panel");
const closeNeoma = document.getElementById("close-neoma");

// Global helper – opens the Neoma panel from anywhere on the page
window.openNeoma = function () {
    const panel = document.getElementById("neoma-panel");
    const neoma = document.getElementById("neoma");

    if (panel) {
        panel.classList.add("open");
        neoma.classList.add("hidden");
    }
};

// Wire every "Talk to Neoma" / "Discuss This Plan" trigger
document.addEventListener("DOMContentLoaded", function () {

    // IDs used for Talk-to-Neoma buttons
    ["open-ai-nav", "open-ai-mobile", "hero-ai", "open-ai"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) {
            el.addEventListener("click", function (e) {
                e.preventDefault();
                window.openNeoma();
            });
        }
    });

    // Pricing plan buttons (.ai-plan)
    document.querySelectorAll(".ai-plan").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            window.openNeoma();
        });
    });

    // HERO BOOK MEETING BUTTON
    document.querySelectorAll(".book-meeting").forEach(function (button) {

        button.addEventListener("click", function (e) {

            e.preventDefault();

            window.openNeoma();
            window.startNeomaBooking();

        });

    });

    document.querySelectorAll(".open-ai-nav").forEach(function (el) {
        el.addEventListener("click", function (e) {
            e.preventDefault();
            window.openNeoma();
        });
    });
});


// Neoma AI
function initializeNeoma() {
    let lead = {

        name: "",

        email: "",

        phone: "",

        business: ""

    };

    let leadStep = 0;
    console.log("Neoma initialized");
    let lastMessage = "";
    const neomaButton = document.getElementById("neoma-btn");
    const neomaPanel = document.getElementById("neoma-panel");
    const closeNeoma = document.getElementById("close-neoma");

    const sendBtn = document.getElementById("send-message");
    const userInput = document.getElementById("user-input");
    const chatArea = document.getElementById("chat-area");

    // Start booking from external buttons
    window.startNeomaBooking = function () {

        leadStep = 1;

        addBotMessage(
            "Excellent choice. 😊\n\nWhat's your name?"
        );

        userInput.focus();
    };

    // Open Chat
    neomaButton.addEventListener("click", () => {
        neoma.classList.add("hidden");
        neomaPanel.classList.add("open");
    });

    // Close Chat
    closeNeoma.addEventListener("click", () => {
        neomaPanel.classList.remove("open");
        neoma.classList.remove("hidden");
    });

    // Send with Button
    sendBtn.addEventListener("click", sendMessage);

    // Send with Enter
    userInput.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {

            sendMessage();

        }

    });

    async function sendMessage() {

        const text = userInput.value.trim();

        lastMessage = text;

        if (text === "") return;

        addUserMessage(text);

        userInput.value = "";

        if (leadStep > 0) {
            handleLead(text);

            return;

        }

        const typing = showTyping();

        setTimeout(() => {

            const handled = replyToUser(text);

            if (handled) {

                typing.remove();

            } else {

                askAI(text, typing);

        }

        }, 1000);
    }

    function addUserMessage(message) {

        const bubble = document.createElement("div");
        bubble.className = "user-message";

        const p = document.createElement("p");
        p.textContent = message;

        bubble.appendChild(p);
        chatArea.appendChild(bubble);

        scrollBottom();
    }

    function showTyping() {

        const oldTyping = document.getElementById("typing");

        if (oldTyping) oldTyping.remove();

        const typing = document.createElement("div");

        typing.className = "typing";

        typing.id = "typing";

        typing.innerHTML =

            `
        <span></span>
        <span></span>
        <span></span>
    `;

        chatArea.appendChild(typing);

        scrollBottom();

        return typing;

    }

    function addBotMessage(message) {

        const bubble = document.createElement("div");
        bubble.className = "bot-message";

        const p = document.createElement("p");
        p.textContent = message;

        bubble.appendChild(p);
        chatArea.appendChild(bubble);

        scrollBottom();
    }

    function addCard(title, description, buttons) {

        const card = document.createElement("div");

        card.className = "neoma-card";

        let html = `
        <h3>${title}</h3>
        <p>${description}</p>
        <div class="card-buttons">
    `;

        buttons.forEach(btn => {
            html += `
            <button
                class="card-btn"
                data-action="${btn.action}">
                ${btn.label}
            </button>
        `;
        });

        html += `
        </div>
    `;

        card.innerHTML = html;

        chatArea.appendChild(card);

        scrollBottom();

    }

    async function askAI(message, typing) {

        try {

            const response = await fetch("https://mamoon.app.n8n.cloud/webhook-test/neoma/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message
                })
            });

            if (!response.ok) {

                typing.remove();

                const error = await response.text();
                console.error(error);

                addBotMessage(
                    "Sorry, I couldn't reach the AI at the moment."
                );

                return;
            }

            const data = await response.json();

            typing.remove();

            addBotMessage(data.reply);

        } catch (err) {

            typing.remove();

            console.error(err);

            addBotMessage(
                "Sorry, something went wrong while contacting the AI."
            );
        }

    }

    function replyToUser(message) {

        const text = message.toLowerCase();

        // Pricing
        if (text.includes("price") ||
            text.includes("cost") ||
            text.includes("pricing")) {

            addCard(

                "💻 Website Packages",

                "Choose a package or explore our pricing.",

                [

                    {
                        label: "View Pricing",
                        action: "pricing"
                    },

                    {
                        label: "Book Consultation",
                        action: "meeting"
                    }

                ]

            );

            return 1;
        }

        // Portfolio
        if (text.includes("portfolio") ||
            text.includes("work") ||
            text.includes("projects")) {

            addCard(

                "🎨 Our Portfolio",

                "See examples of websites we've designed for our clients.",

                [

                    {
                        label: "Open Portfolio",
                        action: "portfolio"
                    }

                ]

            );

            return 1;
        }

        // AI
        if (text.includes("ai") ||
            text.includes("automation") ||
            text.includes("chatbot")) {

            addCard(

                "🤖 AI Automation",

                "We build AI chatbots, appointment systems and workflow automation.",

                [

                    {
                        label: "Learn More",
                        action: "services"
                    },

                    {
                        label: "Talk to Us",
                        action: "meeting"
                    }

                ]

            );

            return 1;
        }

        // Meeting
        if (text.includes("meeting") ||
            text.includes("call") ||
            text.includes("appointment")) {

            addCard(

                "📅 Free Consultation",

                "Book a free strategy call with our team.",

                [

                    {
                        label: "Book Now",
                        action: "meeting"
                    }

                ]

            );

            return 1;
        }

        // SEO
        if (text.includes("seo")) {

            addBotMessage(
                "Yes. We provide technical SEO, on-page optimisation, Google Business setup and performance improvements."
            );

            return 1;
        }

        // Greeting
        if (text.includes("hello") ||
            text.includes("hi") ||
            text.includes("hey")) {

            addBotMessage(
                "Hello! I'm Neoma. I can help you with websites, AI automation, pricing, SEO or booking a consultation."
            );

            return 1;
        }

        return 0

    }

    function validateName(name) {
        const value = name.trim();

        // 2–50 characters, letters, spaces, apostrophes and hyphens
        return /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]{2,50}$/.test(value);
    }

    function validateEmail(email) {
        const value = email.trim();

        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    }

    function validatePhone(phone) {
        const digits = phone.replace(/\D/g, "");

        // Indian mobile number
        return /^(?:91)?[6-9]\d{9}$/.test(digits);
    }

    function normalizePhone(phone) {
        const digits = phone.replace(/\D/g, "");

        if (digits.length === 10) {
            return "+91" + digits;
        }

        if (digits.length === 12 && digits.startsWith("91")) {
            return "+" + digits;
        }

        return null;
    }

    function handleLead(answer) {

        switch (leadStep) {

            case 1:

                if (!validateName(answer)) {
                    addBotMessage(
                        "Hmm, that doesn't look like a valid name. Please enter your name using letters only."
                    );
                    return;
                }

                lead.name = answer.trim();

                leadStep = 2;

                addBotMessage(
                    "Nice to meet you, " + lead.name +
                    ".\n\nWhat's your email address?"
                );

                break;


            case 2:

                if (!validateEmail(answer)) {
                    addBotMessage(
                        "That doesn't look like a valid email address. Please enter something like name@example.com."
                    );
                    return;
                }

                lead.email = answer.trim().toLowerCase();

                leadStep = 3;

                addBotMessage(
                    "Perfect.\n\nWhat's the best phone number to reach you?"
                );

                break;


            case 3:

                if (!validatePhone(answer)) {
                    addBotMessage(
                        "That doesn't look like a valid Indian phone number. Please enter your 10-digit mobile number."
                    );
                    return;
                }

                lead.phone = normalizePhone(answer);

                leadStep = 4;

                addBotMessage(
                    "Great.\n\nTell me a little about your business."
                );

                break;


            case 4:

                if (answer.trim().length < 2) {
                    addBotMessage(
                        "Please tell me a little about your business."
                    );
                    return;
                }

                lead.business = answer.trim();

                leadStep = 5;

                addBotMessage(
                    "Great.\n\nTell me your budget."
                );

                break;


            case 5:

                if (answer.trim().length < 1) {
                    addBotMessage(
                        "Please enter your approximate budget."
                    );
                    return;
                }

                lead.budget = answer.trim();

                leadStep = 0;

                finishLead();

                break;
        }
    }

    async function finishLead() {

        addCard(

            "🎉 Consultation Requested",

            "Thanks, " + lead.name +

            ". We'll contact you soon.",

            [

                {

                    label: "Done",

                    action: "done"

                }

            ]

        );

        try {
            const response = await fetch(
                "https://mamoon.app.n8n.cloud/webhook-test/neoma/lead",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: lead.name,
                        email: lead.email,
                        phone: lead.phone,
                        business: lead.business,
                        budget: lead.budget,
                        source: "Neoma",
                        page: window.location.href,
                        timestamp: new Date().toISOString()
                    })
                }
            );

            if (!response.ok) {
                console.error(
                    "Lead submission failed:",
                    await response.text()
                );
                return;
            }

            const data = await response.json();

            console.log("Lead successfully sent:", data);

        } catch (error) {

            console.error(
                "Error sending lead to n8n:",
                error
            );

        }

    }

    document.addEventListener("click", (e) => {

        if (!e.target.classList.contains("card-btn")) return;

        const action = e.target.dataset.action;

        switch (action) {

            case "pricing":

                document.querySelector("#pricing")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

                break;

            case "portfolio":

                document.querySelector("#portfolio")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

                break;

            case "services":

                document.querySelector("#services")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

                break;

            case "meeting":

                leadStep = 1;

                addBotMessage(
                    "Excellent choice. 😊\n\nWhat's your name?"
                );

                break;

        }

    });
    function scrollBottom() {

        chatArea.scrollTop = chatArea.scrollHeight;

    }
}