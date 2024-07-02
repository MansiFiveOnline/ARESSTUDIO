const emailController = require("../controllers/emailController");
const express = require("express");
const route = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");

route.post("/", emailController.createEmail);

route.post("/password/:_id", adminMiddleware, emailController.createPassword);

route.patch("/password/:_id", adminMiddleware, emailController.updatePassword);

route.get("/:_id", emailController.getEmail);

route.get("/", emailController.getEmails);

route.post("/validate-password", emailController.validatePassword);

module.exports = route;
