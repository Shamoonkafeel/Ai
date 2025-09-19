<<<<<<< HEAD
app.post('/api/chat', async (req, res) => {
  try {
    const { history } = req.body;
    if (!history) return res.status(400).send('No history provided');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: history,
        max_tokens: 800,
        temperature: 0.2
      })
    });

    const text = await response.text(); // first read as text
    if (!response.ok) {
      console.error('API Error:', text);
      return res.status(500).send('API Error: ' + text);
    }

    // Try to parse JSON safely
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error('JSON Parse Error:', err, text);
      return res.status(500).send('API returned invalid JSON');
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || 'No reply';
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error: ' + err.message);
  }
});
=======
// server.js
import express from "express";
import fetch from "node-fetch"; // Node 18+ me optional
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // frontend folder

// ✅ Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI Error:", data.error);
      return res.status(500).json({ error: data.error.message || "OpenAI API error" });
    }

    const reply = data.choices?.[0]?.message?.content || "No reply received";
    res.json({ reply });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Catch-all route (Express 5 compatible) for frontend
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
>>>>>>> d2d38d4 (Initial commit with chatbot code)
