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
        let fullResponse = ""; 
    for await (const chunk of stream) {
      const text = chunk.content;
        fullResponse += text;
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
    console.error("Chat error:", error);
    
    // Send error in SSE format so client can handle it properly
    res.write(`data: {"error": "${error.message}"}\n\n`);
    res.end();
  }
};

const getImageResult = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      res.write(`data: {"error": "Prompt is required"}\n\n`);
      return res.end();
    }

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HuggingFace API error: ${response.status} - ${errorText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(imageBuffer).toString("base64");
    const imageUrl = `data:image/png;base64,${base64}`;

    // Send image URL in SSE format
    res.write(`data: ${JSON.stringify({ image: imageUrl })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();

  } catch (error) {
    console.error("Image generation error:", error);
    // Send error in SSE format so client can handle it properly
    res.write(`data: {"error": "${error.message}"}\n\n`);
    res.end();
  }
};



module.exports = { getChatResult, getImageResult };

