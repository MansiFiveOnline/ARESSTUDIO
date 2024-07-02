const contactController = require("../controllers/contactController");
const express = require("express");
const route = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");

route.post("/", contactController.createContact);

route.get("/", contactController.getContacts);

route.delete("/:id", adminMiddleware, contactController.deleteContact);

module.exports = route;
