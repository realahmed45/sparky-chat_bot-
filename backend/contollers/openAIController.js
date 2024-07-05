const { GoogleGenerativeAI } = require("@google/generative-ai");
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const openAIController = async (req, res) => {
  const { prompt } = req.body;
  console.log(prompt);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    console.log(text);

    const newContent = await ContentHistory.create({
      user: req?.user?._id,
      content: text,
    });

    const userFound = await User.findById(req?.user?.id);
    userFound.contentHistory.push(newContent?._id);
    userFound.apiRequestCount += 1;
    await userFound.save();

    res.status(200).json({ content: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  openAIController,
};
