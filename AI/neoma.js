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

        <img src="Pic/logo.png" alt="Neoma">

    </button>

</div>

<!-- ==========================
        NEOMA PANEL
=========================== -->

<div id="neoma-panel">

    <div class="neoma-header">

        <div class="neoma-profile">

            <img src="Pic/photo.jpg" alt="Neoma">

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

// Global helper – opens the Neoma panel from anywhere on the page
window.openNeoma = function () {
    const panel = document.getElementById("neoma-panel");
    if (panel) panel.classList.add("open");
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

    // CTA-banner duplicate id – select by position (second #open-ai-nav)
    document.querySelectorAll("#open-ai-nav").forEach(function (el) {
        el.addEventListener("click", function (e) {
            e.preventDefault();
            window.openNeoma();
        });
    });

    // Pricing plan buttons (.ai-plan)
    document.querySelectorAll(".ai-plan").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
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

    // Open Chat
    neomaButton.addEventListener("click", () => {
        neomaPanel.classList.add("open");
    });

    // Close Chat
    closeNeoma.addEventListener("click", () => {
        neomaPanel.classList.remove("open");
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

        showTyping();

    }

    function addUserMessage(message) {

        const bubble = document.createElement("div");

        bubble.className = "user-message";

        bubble.innerHTML = `<p>${message}</p>`;

        chatArea.appendChild(bubble);

        scrollBottom();

    }

    async function showTyping() {

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

        setTimeout(async () => {

            typing.remove();

            const response = await fetch("/api/chat", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    message: lastMessage

                })

            });

            if (!response.ok) {
                const error = await response.text();
                console.error(error);
                addBotMessage("Sorry, something went wrong. Please try again.");
                return;
            }

            const data = await response.json();

            addBotMessage(data.reply);

        }, 1500);

    }

    function addBotMessage(message) {

        const bubble = document.createElement("div");

        bubble.className = "bot-message";

        bubble.innerHTML = `<p>${message}</p>`;

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

            return;
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

            return;
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

            return;
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

            return;
        }

        // SEO
        if (text.includes("seo")) {

            addBotMessage(
                "Yes. We provide technical SEO, on-page optimisation, Google Business setup and performance improvements."
            );

            return;
        }

        // Greeting
        if (text.includes("hello") ||
            text.includes("hi") ||
            text.includes("hey")) {

            addBotMessage(
                "Hello! I'm Neoma. I can help you with websites, AI automation, pricing, SEO or booking a consultation."
            );

            return;
        }

        // Default
        addBotMessage(
            "That's a great question. In the next version I'll answer using AI. For now, you can ask me about pricing, SEO, websites, AI automation or booking a consultation."
        );

    }

    function handleLead(answer) {

        switch (leadStep) {

            case 1:

                lead.name = answer;

                leadStep = 2;

                addBotMessage(

                    "Nice to meet you, " + lead.name +

                    ".\n\nWhat's your email address?"

                );

                break;

            case 2:

                lead.email = answer;

                leadStep = 3;

                addBotMessage(

                    "Perfect.\n\nWhat's the best phone number to reach you?"

                );

                break;

            case 3:

                lead.phone = answer;

                leadStep = 4;

                addBotMessage(

                    "Great.\n\nTell me a little about your business."

                );

                break;

            case 4:

                lead.business = answer;

                leadStep = 0;

                finishLead();

                break;

        }

    }

    function finishLead() {

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

        console.log(lead);

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