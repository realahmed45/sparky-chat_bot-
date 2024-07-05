const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const checkApiRequestLimit = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Find the user
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Define the request limit
  let requestLimit = 100; // Default initial credits for new users
  if (user.trialActive) {
    requestLimit = user.monthlyRequestCount || 100; // Ensure monthlyRequestCount is set
  } else if (user.plan) {
    // You can set request limits based on user plans, if applicable
    requestLimit = user.plan.requestLimit || 100; // Ensure the plan request limit is set
  }

  // Check if the user has exceeded their monthly request limit
  if (user.apiRequestCount >= requestLimit) {
    return res
      .status(403)
      .json({
        message: "API request limit reached, please subscribe to a plan",
      });
  }

  // Log current state
  console.log(
    `User: ${user.email}, API Requests: ${user.apiRequestCount}/${requestLimit}`
  );

  // Proceed to the next middleware
  next();
});

module.exports = checkApiRequestLimit;
