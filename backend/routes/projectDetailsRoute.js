const projectDetailsController = require("../controllers/projectDetailsController");
const express = require("express");
const route = express.Router();
const multer = require("multer");
const adminMiddleware = require("../middleware/adminMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/project_details"); // Specify the folder where files will be stored
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
  projectDetailsController.createProjectDetail
);

route.patch(
  "/:_id",
  upload.fields([
    { name: "media", maxCount: 1 },
    { name: "posterImg", maxCount: 1 },
  ]),
  adminMiddleware,
  projectDetailsController.updateProjectDetail
);

route.get("/project_media", projectDetailsController.getProjectMediaByName);

route.get("/:_id", projectDetailsController.getProjectDetail);

route.get("/", projectDetailsController.getProjectDetails);

route.get("/count/:project_name", projectDetailsController.getTotalCount);

route.delete(
  "/:_id",
  adminMiddleware,
  projectDetailsController.deleteProjectDetail
);

module.exports = route;
