const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const History = require("../model/ChatHistoryModel")

const getChatResult = async (req, res) => {
  try {
    const { message } = req.body;

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GEN_KEY,
      streaming: true,
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await model.stream(message);
    console.log(stream)
    console.log(stream.content)

    let fullResponse = "";

    for await (const chunk of stream) {
      let text = "";

      if (typeof chunk.content === "string") {
        text = chunk.content;
      } else if (Array.isArray(chunk.content)) {
        text = chunk.content.map(c => c.text || "").join("");
      }

      fullResponse += text;

      // res.write(`data: ${JSON.stringify(text)}\n\n`);
      res.write(`data: ${text}\n\n`);

    }

    await History.create({
      request: message,
      response: fullResponse,
      type: "text",
    });

    res.write("data: [DONE]\n\n");
    res.end();

  } catch (error) {
    console.error("STREAM ERROR:", error);

    if (!res.headersSent) {
      return res.status(500).json({ error: error.message });
    }

    res.write(`data: ERROR: ${error.message}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
};



const getImageResult = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: message,
          options: { wait_for_model: true }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `HuggingFace API error: ${errorText}`,
      });
    }

    const imageBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64}`;

    // ✅ Normal JSON response
    res.json({ image: imageUrl });

  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({ error: error.message });
  }
};

const createOrUpdateChat = async (req, res) => {
  try {
    const { message } = req.body;
    const chatId = req.params.id;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GEN_KEY,
      streaming: true,
    });

    // ✅ SSE HEADERS
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await model.stream(message);

    let fullResponse = "";

    for await (const chunk of stream) {
      let text = "";

      if (typeof chunk.content === "string") {
        text = chunk.content;
      } else if (Array.isArray(chunk.content)) {
        text = chunk.content.map(c => c.text || "").join("");
      }

      fullResponse += text;

      // 🔥 Send chunk to frontend
      res.write(`data: ${JSON.stringify({ text })}\n\n`);
    }

    // ✅ Save to DB AFTER stream complete
    await History.findByIdAndUpdate(
      chatId,
      {
        $push: {
          request: message,
          response: fullResponse,
        },
      },
      { new: true }
    );

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();

  } catch (error) {
    console.error(error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

const getHistory = async (req,res)=>{
  try {
    const history = await History.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const DeleteHistory = async(req,res)=>{
  const {id} = req.params;
  await History.findByIdAndDelete(id);
  
}






module.exports = { getChatResult, getImageResult ,getHistory , createOrUpdateChat , DeleteHistory};

