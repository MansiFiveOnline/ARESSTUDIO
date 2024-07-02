const opportunityController = require("../controllers/opportunityController");
const express = require("express");
const route = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");

route.post("/", adminMiddleware, opportunityController.createOpportunity);

route.patch("/:_id", adminMiddleware, opportunityController.updateOpportunity);

route.get("/title", opportunityController.getOpportunityTitle);

route.get("/:_id", opportunityController.getOpportunity);

route.get("/", opportunityController.getOpportunities);

route.delete("/:_id", adminMiddleware, opportunityController.deleteOpportunity);

module.exports = route;
