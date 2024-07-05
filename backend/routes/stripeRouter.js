const express = require("express");

const isAuthenticated = require("../MIDDLEWARE/isAuthenticated");
const {
  handlestripePayment,
  handleFreeSubscription,
  verifyPayment,
} = require("../contollers/handlStripePayment");

const stripeRouter = express.Router();

stripeRouter.post("/checkout", isAuthenticated, handlestripePayment);
stripeRouter.post("/free-plan", isAuthenticated, handleFreeSubscription);
stripeRouter.post("/verify-payment/:paymentId", isAuthenticated, verifyPayment);

module.exports = stripeRouter;
