const galleryNameController = require("../controllers/gallerynameController");
const express = require("express");
const route = express.Router();

const adminMiddleware = require("../middleware/adminMiddleware");

route.post("/", adminMiddleware, galleryNameController.createGalleryName);

route.patch("/:_id", adminMiddleware, galleryNameController.updateGalleryName);

route.get("/gallerynames", galleryNameController.getGalleryNamesByService);

route.get("/:_id", galleryNameController.getGalleryName);

route.get("/", galleryNameController.getGalleryNames);

route.delete("/:_id", adminMiddleware, galleryNameController.deleteGalleryName);

module.exports = route;
