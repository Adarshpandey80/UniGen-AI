const { GoogleGenAI } = require("@google/genai");

const getChatResult = async (req, res) => {
  try {
    const { message } = req.body;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEN_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    res.status(200).json({
      success: true,
      data: response.text,
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = { getChatResult };
