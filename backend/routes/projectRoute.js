const projectController = require("../controllers/projectController");
const express = require("express");
const route = express.Router();
const multer = require("multer");
const adminMiddleware = require("../middleware/adminMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/projects"); // Specify the folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name for storing
  },
});
const upload = multer({ storage: storage });

route.post(
  "/",
  upload.fields([
    { name: "mediaFile", maxCount: 1 },
    { name: "posterImg", maxCount: 1 },
  ]),
  adminMiddleware,
  projectController.createProject
);

route.patch(
  "/:_id",
  upload.fields([
    { name: "media", maxCount: 1 },
    { name: "posterImg", maxCount: 1 },
  ]),
  adminMiddleware,
  projectController.updateProject
);

route.get("/project_details", projectController.getByProjectName);

route.get(
  "/project_media",
  projectController.getProjectMediaByServiceAndGallery
);

route.get("/projectname", projectController.getProjectName);

route.get("/", projectController.getProjects);

route.get("/:_id", projectController.getProject);

route.delete("/:_id", adminMiddleware, projectController.deleteProject);

module.exports = route;
