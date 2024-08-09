const serviceController = require("../controllers/serviceController");
const express = require("express");
const route = express.Router();
const multer = require("multer");
const adminMiddleware = require("../middleware/adminMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/service"); // Specify the folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name for storing
  },
});
const upload = multer({ storage: storage });

route.post(
  "/",
  upload.fields([
    { name: "media", maxCount: 1 },
    { name: "posterImg", maxCount: 1 },
  ]),
  adminMiddleware,
  serviceController.createService
);

route.patch(
  "/:_id",
  upload.fields([
    { name: "media", maxCount: 1 },
    { name: "posterImg", maxCount: 1 },
  ]),
  adminMiddleware,
  serviceController.updateService
);

route.get("/servicename", serviceController.getByServiceName);

route.get("/:_id", serviceController.getService);

route.get("/", serviceController.getServices);

route.delete("/:_id", adminMiddleware, serviceController.deleteService);

module.exports = route;
