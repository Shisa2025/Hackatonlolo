// server.js - Node.js backend for a DeepSeek-powered chatbot
// -----------------------------------------------------------
// IMPORTANT:
// Store your DeepSeek API key ONLY on the backend.
// Never expose it in frontend HTML or JavaScript.

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

// Parse incoming JSON requests
app.use(bodyParser.json());

// Serve static frontend files (e.g., chat.html inside "public" folder)
app.use(express.static("public"));

// -----------------------------------------------------------
// 1. DeepSeek API Key (put your NEW key here)
// DO NOT SHARE THIS KEY WITH ANYONE
// -----------------------------------------------------------
const DEEPSEEK_API_KEY = "sk-47c53c76c6cc42cb9bd887742799dfeb";

// -----------------------------------------------------------
// 2. Backend route: browser sends message → server forwards to DeepSeek
// -----------------------------------------------------------
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message || "";

  try {
    // Call DeepSeek Chat Completion API
    const response = await axios.post(
      "https://api.deepseek.com/chat/completions",
      {
        model: "deepseek-chat",   // or "deepseek-reasoner"
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Send AI response back to browser
    res.json({ reply: response.data.choices[0].message.content });

  } catch (err) {
    console.error("DeepSeek API Error:", err.response?.data || err);
    res.json({ reply: "Server error, please try again later." });
  }
});

// -----------------------------------------------------------
// 3. Start the server
// -----------------------------------------------------------
app.listen(3000, () => {
  console.log("Chatbot running at http://localhost:3000/chat.html");
});