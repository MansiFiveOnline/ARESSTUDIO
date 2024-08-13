const path = require("path");
const projectDetailsModel = require("../models/projectDetailsModel");
const projectModel = require("../models/projectModel");
const validator = require("validator");

const { isURL } = require("url");

const createProjectDetail = async (req, res) => {
  try {
    const { project_name, media: mediaField } = req.body;

    // Extract files from the request
    const posterImgFile = req.files?.posterImg ? req.files.posterImg[0] : null;
    const mediaFile = req.files?.media ? req.files.media[0] : null;

    // Log the values to ensure they're being received correctly
    console.log("Project Name:", project_name);
    console.log("Media File:", mediaFile);
    console.log("Media Field (URL):", mediaField);

    let mediaData = {
      filename: null,
      filepath: null,
      iframe: null,
    };
    let fileType = "";

    // Function to check if the input is a URL
    const isURL = (str) => {
      try {
        new URL(str);
        return true;
      } catch (error) {
        return false;
      }
    };

    // Handle media field
    if (mediaField && isURL(mediaField)) {
      fileType = "video"; // Set fileType to "video" for iframe URLs
      mediaData = {
        filename: null,
        filepath: null,
        iframe: mediaField.trim(),
      };

      // Ensure posterImg is provided when media is an iframe URL
      if (!posterImgFile) {
        return res.status(400).json({
          message: "Poster image is required when an iFrame URL is provided.",
        });
      }
    } else if (mediaFile) {
      fileType = "image"; // Assuming media is an image
      const isWebPImage = (file) => {
        const extname = path.extname(file.originalname).toLowerCase();
        return extname === ".webp";
      };

      if (!isWebPImage(mediaFile)) {
        return res.status(400).json({
          message: "Unsupported file type. Please upload a WebP image.",
        });
      }

      mediaData = {
        filename: mediaFile.originalname,
        filepath: mediaFile.path,
        iframe: null,
      };
    } else {
      // Handle the case where neither media nor file is provided
      return res.status(400).json({
        message: "Please provide either an iFrame URL or an image.",
      });
    }

    // Custom validation for posterImg
    if (fileType === "video" && !posterImgFile) {
      return res.status(400).json({
        message: "Poster image is required for video media.",
      });
    }

    const posterImgData = posterImgFile
      ? {
          filename: posterImgFile.originalname,
          filepath: posterImgFile.path,
        }
      : null; // Poster image is not required for image media

    // Find the project_id based on project_name
    const project = await projectModel.findOne({ project_name });
    if (!project) {
      return res.status(404).json({
        message: `Project with name '${project_name}' not found.`,
      });
    }

    // Get the total number of existing project details
    const totalProjectImg = await projectDetailsModel.countDocuments({
      project_name,
    });

    const newProjectDetail = new projectDetailsModel({
      project_name,
      media: mediaData,
      type: fileType,
      project_id: project._id,
      sequence: totalProjectImg + 1,
      posterImg: posterImgData,
    });

    await newProjectDetail.save();

    return res.status(200).json({
      message: "Added project details successfully.",
      newProjectDetail,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in adding project details due to ${error.message}`,
    });
  }
};

const updateProjectDetail = async (req, res) => {
  try {
    const projectId = req.params._id;
    const {
      project_name,
      sequence,
      description,
      type,
      media: mediaField,
    } = req.body;

    // Ensure project name and type are present
    if (!project_name) {
      return res.status(400).json({ message: "Project name is required" });
    }
    if (!type) {
      return res.status(400).json({ message: "Type field is required" });
    }

    // Retrieve files
    const mediaFile = req.files?.media ? req.files.media[0] : null;
    const posterImgFile = req.files?.posterImg ? req.files.posterImg[0] : null;

    // Fetch existing project detail
    const existingProjectDetail = await projectDetailsModel.findById(projectId);
    if (!existingProjectDetail) {
      return res.status(404).json({ message: "Project Detail not found." });
    }

    // Update fields
    const updatedFields = {
      project_name: project_name || existingProjectDetail.project_name,
      sequence: sequence || existingProjectDetail.sequence,
      description: description || existingProjectDetail.description,
      type: type || existingProjectDetail.type,
    };

    // Handle media based on type
    if (type === "video") {
      if (mediaField && mediaField.startsWith("http")) {
        updatedFields.media = {
          filename: "",
          filepath: "",
          iframe: mediaField,
        };
      } else if (mediaFile) {
        updatedFields.media = {
          filename: mediaFile.originalname,
          filepath: mediaFile.path,
          iframe: "",
        };
      } else {
        return res.status(400).json({
          message: "A valid media URL or file is required for video type.",
        });
      }

      // Handle posterImg
      if (posterImgFile) {
        updatedFields.posterImg = {
          filename: posterImgFile.originalname,
          filepath: posterImgFile.path,
        };
      } else if (!posterImgFile && !existingProjectDetail.posterImg) {
        return res.status(400).json({
          message: "Poster Image is required when media is a video.",
        });
      } else {
        updatedFields.posterImg = existingProjectDetail.posterImg; // Retain existing posterImg if not provided
      }
    } else if (type === "image") {
      if (mediaFile) {
        updatedFields.media = {
          filename: mediaFile.originalname,
          filepath: mediaFile.path,
          iframe: "",
        };
      } else if (
        !existingProjectDetail.media ||
        !existingProjectDetail.media.filepath
      ) {
        return res.status(400).json({
          message: "Image media file is required when type is image.",
        });
      } else {
        updatedFields.media = existingProjectDetail.media; // Retain existing media if not provided
      }
      updatedFields.posterImg = null; // Poster image is not required for image type
    } else {
      if (mediaFile) {
        updatedFields.media = {
          filename: mediaFile.originalname,
          filepath: mediaFile.path,
          iframe: "",
        };
      } else if (mediaField && mediaField.startsWith("http")) {
        updatedFields.media = {
          filename: "",
          filepath: "",
          iframe: mediaField,
        };
      } else {
        updatedFields.media = existingProjectDetail.media; // Retain existing media data if none provided
      }
      updatedFields.posterImg = null; // Poster image is not required for types other than video
    }

    // Perform update operation
    const updatedProjectDetail = await projectDetailsModel.findByIdAndUpdate(
      projectId,
      updatedFields,
      { new: true }
    );

    // Check if update was successful
    if (!updatedProjectDetail) {
      return res.status(404).json({ message: "Project Detail not found" });
    }

    res.status(200).json({ updatedProjectDetail });
  } catch (error) {
    console.error("Error updating project detail:", error);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = { updateProjectDetail };

module.exports = { updateProjectDetail };

const getProjectMediaByName = async (req, res) => {
  try {
    const project_name = req.query.project_name;

    const projectName = project_name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
      .trim();

    if (!projectName) {
      return res.status(400).json({ message: "Project Name is required." });
    }

    const projectDetail = await projectDetailsModel.find({
      project_name: projectName,
    });

    if (!projectDetail || projectDetail.length === 0) {
      return res.status(404).json({
        message: `No project media found for this given project name ${project_name}`,
      });
    }

    // Assuming posterImg is within media
    const media = projectDetail
      .map((detail) => detail.media)
      .flat()
      .sort((a, b) => a.sequence - b.sequence);

    const posterImg =
      projectDetail.length > 0 ? projectDetail[0].posterImg : null;

    return res.status(200).json({
      message: "Project details media fetched successfully.",
      media,
      posterImg,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching project detail media due to ${error.message}`,
    });
  }
};

const getProjectDetails = async (req, res) => {
  try {
    // const projectDetails = await projectDetailsModel
    //   .find()
    //   .sort({ sequence: 1 })
    //   .populate("project_id", "project_name");

    const projectDetails = await projectDetailsModel.aggregate([
      {
        $lookup: {
          from: "projects",
          localField: "project_id",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $sort: {
          "project.project_name": 1,
          sequence: 1,
        },
      },
    ]);

    console.log(projectDetails); // Log the populated project details

    if (projectDetails.length === 0) {
      return res.status(400).json({
        message: "No project details are created. Kindly create one.",
      });
    }
    return res.status(200).json({
      message: "All project details fetched successfully.",
      count: projectDetails.length,
      projectDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching project details due to ${error.message}`,
    });
  }
};

const getProjectDetail = async (req, res) => {
  try {
    const projectDetail = await projectDetailsModel.findById(req.params._id);
    console.log(req.params._id);
    if (!projectDetail) {
      return res.status(400).json({
        message: "No project detail is created with this id.",
      });
    }

    return res.status(200).json({
      message: "project detail fetched successfully.",
      projectDetail,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching project detail due to ${error.message}`,
    });
  }
};

const getTotalCount = async (req, res) => {
  try {
    const projectName = req.params.project_name;
    const count = await projectDetailsModel.countDocuments({
      project_name: projectName,
    });
    res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({
      message: `Error in deleting project detail due to ${error.message}`,
    });
  }
};

// const deleteProjectDetail = async (req, res) => {
//   try {
//     const projectDetailExists = await projectDetailsModel.findById({
//       _id: req.params._id,
//     });

//     if (projectDetailExists.length === 0) {
//       return res.status(400).json({
//         message: "No project details are created. Kindly create one.",
//       });
//     }

//     const deletedProjectDetail = await projectDetailsModel.findOneAndDelete({
//       _id: req.params._id,
//     });

//     return res.status(200).json({
//       message: "project detail deleted successfully.",
//       deletedProjectDetail,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in deleting project detail due to ${error.message}`,
//     });
//   }
// };

// const deleteProjectDetail = async (req, res) => {
//   try {
//     const projectDetail = await projectDetailsModel.findById(req.params._id);

//     if (!projectDetail) {
//       return res.status(404).json({
//         message: "Project detail not found.",
//       });
//     }

//     const deletedSequence = projectDetail.sequence;
//     const projectName = projectDetail.project_name;

//     await projectDetailsModel.deleteOne({ _id: req.params._id });

//     // Update sequence for subsequent entries of the same project name
//     await projectDetailsModel.updateMany(
//       { project_name: projectName, sequence: { $gt: deletedSequence } },
//       { $inc: { sequence: -1 } }
//     );

//     return res.status(200).json({
//       message: "Project detail deleted successfully.",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in deleting project detail due to ${error.message}`,
//     });
//   }
// };

const deleteProjectDetail = async (req, res) => {
  try {
    const projectDetail = await projectDetailsModel.findById(req.params._id);

    if (!projectDetail) {
      return res.status(404).json({
        message: "Project detail not found.",
      });
    }

    const deletedSequence = projectDetail.sequence;
    const projectName = projectDetail.project_name;

    await projectDetailsModel.deleteOne({ _id: req.params._id });

    // Update sequence for subsequent entries of the same project name
    await projectDetailsModel.updateMany(
      { project_name: projectName, sequence: { $gt: deletedSequence } },
      { $inc: { sequence: -1 } }
    );

    // Fetch updated project details after deletion and sequence update
    const updatedProjectDetails = await projectDetailsModel.aggregate([
      {
        $lookup: {
          from: "projects",
          localField: "project_id",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $sort: {
          "project.project_name": 1,
          sequence: 1,
        },
      },
    ]);

    return res.status(200).json({
      message: "Project detail deleted successfully.",
      count: updatedProjectDetails.length,
      projectDetails: updatedProjectDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in deleting project detail due to ${error.message}`,
    });
  }
};

module.exports = {
  createProjectDetail,
  updateProjectDetail,
  getProjectMediaByName,
  getProjectDetails,
  getProjectDetail,
  getTotalCount,
  deleteProjectDetail,
};
