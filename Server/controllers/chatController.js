const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

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

    for await (const chunk of stream) {
      const text = chunk.content;
      res.write(`data: ${text}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getChatResult };
