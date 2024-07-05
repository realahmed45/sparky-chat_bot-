const express = require("express");
const isAuthenticated = require("../MIDDLEWARE/isAuthenticated");
const { openAIController } = require("../contollers/openAIController");
const checkApiRequestLimit = require("../MIDDLEWARE/checkApiRequestLimit");

const openAIRouter = express.Router();

openAIRouter.post(
  "/generate-content",
  isAuthenticated,
  checkApiRequestLimit,
  openAIController
);

module.exports = openAIRouter;
