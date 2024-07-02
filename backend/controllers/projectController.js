const projectModel = require("../models/projectModel");
const path = require("path");
const url = require("url");

const createProject = async (req, res) => {
  try {
    const {
      project_name,
      subtitle,
      description,
      service_name,
      gallery_name,
      metaTitle,
      metaDescription,
      isPublic = true,
    } = req.body;
    let mediaData = {};

    const file = req.file;
    const media = req.body.media;

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

    // Check if media is a URL (iframe)
    if (isURL(media)) {
      fileType = "video"; // Set fileType to "video" for iframe URLs
      mediaData = {
        filename: null,
        filepath: null,
        iframe: media.trim(),
      };
    } else if (file) {
      // A file is provided
      // Check if the file is a WebP image
      const isWebPImage = (file) => {
        const extname = path.extname(file.originalname).toLowerCase();
        return extname === ".webp";
      };

      if (!isWebPImage(file)) {
        return res.status(400).json({
          message: "Unsupported file type. Please upload a WebP image.",
        });
      }

      fileType = "image";
      mediaData = {
        filename: req.file.originalname,
        filepath: req.file.path,
        iframe: null,
      };
      // } else {
      //   // Neither iframe nor file is provided
      //   return res.status(400).json({
      //     message:
      //       "Either an iFrame URL or an image file is required for the media field.",
      //   });
    }

    const newProject = new projectModel({
      project_name,
      subtitle,
      description,
      service_name,
      gallery_name,
      type: fileType,
      media: mediaData,
      metaTitle,
      metaDescription,
      isPublic,
    });

    await newProject.save();

    return res.status(200).json({
      message: "Added Project content successfully.",
      newProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in adding project due to ${error.message}`,
    });
  }
};

// const updateProject = async (req, res) => {
//   try {
//     const {
//       project_name,
//       subtitle,
//       description,
//       service_name,
//       gallery_name,
//       isPublic,
//       media,
//     } = req.body;

//     // Fetch the existing project to retain current media values if not updated
//     const existingProject = await projectModel.findById(req.params._id);
//     if (!existingProject) {
//       return res.status(404).json({ message: "Project not found." });
//     }

//     let mediaData = {
//       filename: existingProject.media.filename,
//       filepath: existingProject.media.filepath,
//       iframe: existingProject.media.iframe,
//     };

//     // Check if media file is provided
//     if (req.file) {
//       const isWebPImage = (file) => {
//         const extname = path.extname(file.originalname).toLowerCase();
//         return extname === ".webp";
//       };

//       // Validate file type
//       if (!isWebPImage(req.file)) {
//         return res.status(400).json({
//           message: "Unsupported file type. Please upload a WebP image.",
//         });
//       }

//       // Set media data for image
//       mediaData = {
//         filename: req.file.originalname,
//         filepath: req.file.path,
//         iframe: null,
//       };
//     } else if (media !== undefined && media !== null) {
//       const trimmedMedia = media.trim();

//       // Check if media is a URL
//       const isURL = (str) => {
//         try {
//           new URL(str);
//           return true;
//         } catch (error) {
//           return false;
//         }
//       };

//       if (trimmedMedia && !isURL(trimmedMedia)) {
//         return res.status(400).json({
//           message: "Invalid media URL.",
//         });
//       }

//       // Set media data for video
//       mediaData = {
//         filename: null,
//         filepath: null,
//         iframe: trimmedMedia,
//       };
//     }

//     // Create object with updated fields
//     const updatedFields = {
//       ...(project_name && { project_name }),
//       ...(subtitle && { subtitle }),
//       ...(description && { description }),
//       ...(service_name && { service_name }),
//       ...(gallery_name && { gallery_name }),

//       isPublic,
//       media: mediaData,
//       type: mediaData.filename ? "image" : "video",
//     };

//     // Update project in the database by ID
//     const updatedProject = await projectModel.findByIdAndUpdate(
//       req.params._id,
//       updatedFields,
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Project content updated successfully.",
//       updatedProject,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in updating project due to ${error.message}`,
//     });
//   }
// };

const updateProject = async (req, res) => {
  try {
    const {
      project_name,
      subtitle,
      description,
      service_name,
      gallery_name,
      isPublic,
      media,
    } = req.body;

    // Fetch the existing project to retain current media values if not updated
    const existingProject = await projectModel.findById(req.params._id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found." });
    }

    let mediaData = {
      filename: existingProject.media.filename,
      filepath: existingProject.media.filepath,
      iframe: existingProject.media.iframe,
    };

    // Check if media file is provided
    if (req.file) {
      const isWebPImage = (file) => {
        const extname = path.extname(file.originalname).toLowerCase();
        return extname === ".webp";
      };

      // Validate file type
      if (!isWebPImage(req.file)) {
        return res.status(400).json({
          message: "Unsupported file type. Please upload a WebP image.",
        });
      }

      // Set media data for image
      mediaData = {
        filename: req.file.originalname,
        filepath: req.file.path,
        iframe: null,
      };
    } else if (media !== undefined && media !== null) {
      const trimmedMedia = media.trim();

      // Check if media is a URL
      const isURL = (str) => {
        try {
          new URL(str);
          return true;
        } catch (error) {
          return false;
        }
      };

      if (trimmedMedia && !isURL(trimmedMedia)) {
        return res.status(400).json({
          message: "Invalid media URL.",
        });
      }

      // Set media data for video
      mediaData = {
        filename: null,
        filepath: null,
        iframe: trimmedMedia,
      };
    }

    // Create object with updated fields
    const updatedFields = {
      ...(project_name && { project_name }),
      ...(subtitle && { subtitle }),
      ...(description && { description }),
      ...(service_name && { service_name }),
      ...(gallery_name && { gallery_name }),
      isPublic,
      media: mediaData,
      type: mediaData.filename ? "image" : "video",
    };

    // Update project in the database by ID
    const updatedProject = await projectModel.findByIdAndUpdate(
      req.params._id,
      updatedFields,
      { new: true }
    );

    return res.status(200).json({
      message: "Project content updated successfully.",
      updatedProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in updating project due to ${error.message}`,
    });
  }
};

const getProjectMediaByServiceAndGallery = async (req, res) => {
  try {
    const { service_name, gallery_name } = req.query;

    // Validate input
    if (!service_name || !gallery_name) {
      return res
        .status(400)
        .json({ message: "Service name and gallery name are required." });
    }

    let projects;
    if (gallery_name === "all") {
      projects = await projectModel.find({ service_name });
    } else {
      projects = await projectModel.find({ service_name, gallery_name });
    }

    // Check if projects exist
    if (!projects || projects.length === 0) {
      return res.status(404).json({
        message: "No projects found for the given service and gallery name.",
      });
    }

    // Flatten media array from all projects and add isPublic property
    const media = projects.reduce((acc, project) => {
      if (Array.isArray(project.media)) {
        return acc.concat(
          project.media.map((item) => ({
            ...item,
            isPublic: project.isPublic,
            project_Name: project.project_name,
            // .trim()
            // .toLowerCase()
            // .replace(/\s+/g, "-"), // Trim and lowercase project name
          }))
        );
      } else {
        return acc.concat({
          ...project.media,
          isPublic: project.isPublic,
          project_Name: project.project_name,
          // .trim()
          // .toLowerCase()
          // .replace(/\s+/g, "-"), // Trim and lowercase project name
        });
      }
    }, []);

    return res.status(200).json({
      message: "Project media fetched successfully.",
      media,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error fetching project media due to ${error.message}`,
    });
  }
};

// const getByProjectName = async (req, res) => {
//   // Decode the project_name from the query parameter
//   const projectName = decodeURIComponent(req.query.project_name);

//   try {
//     // Use the decoded project name in the database query
//     const project = await projectModel.findOne({ projectName });

//     if (!project) {
//       return res.status(400).json({
//         message: `No project detail found with the provided project name ${project_name}`,
//       });
//     }

//     return res.status(200).json({
//       message: "Project details fetched successfully.",
//       project,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in fetching project detail due to ${error.message}`,
//     });
//   }
// };

const getByProjectName = async (req, res) => {
  try {
    const project_name = req.query.project_name;

    console.log(`Received project name: ${project_name}`);

    const projectName = project_name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
      .trim();

    console.log(`Searching for project: ${projectName}`);
    const project = await projectModel.findOne({ project_name: projectName });

    if (!project) {
      return res.status(400).json({
        message: `No project detail found with the provided project name ${projectName}`,
      });
    }

    return res.status(200).json({
      message: "Project details fetched successfully.",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching project detail due to ${error.message}`,
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await projectModel.find();

    if (projects.length === 0) {
      return res.status(400).json({
        message: "No projects are created. Kindly create one.",
      });
    }
    return res.status(200).json({
      message: "All projects fetched successfully.",
      count: projects.length,
      projects,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching projects due to ${error.message}`,
    });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await projectModel.findById(req.params._id);
    console.log(req.params._id);
    if (!project) {
      return res.status(400).json({
        message: "No project is created with this id.",
      });
    }

    return res.status(200).json({
      message: "project fetched successfully.",
      project,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching project due to ${error.message}`,
    });
  }
};

const getProjectName = async (req, res) => {
  try {
    const projectnames = await projectModel.find({}, "project_name"); // Fetch only the 'title' field

    if (projectnames.length === 0) {
      return res.status(400).json({
        message: `No project names found.`,
      });
    }

    // Extract only the project names
    const projectNameList = projectnames.map((project) => project.project_name);

    res.status(200).json({
      message: "Project Title fetched successfully.",
      projectNames: projectNameList,
    });
  } catch (error) {
    console.error("Error fetching project titles:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const projectExists = await projectModel.findById({
      _id: req.params._id,
    });

    if (projectExists.length === 0) {
      return res.status(400).json({
        message: "No project are created. Kindly create one.",
      });
    }

    const deletedProject = await projectModel.findOneAndDelete({
      _id: req.params._id,
    });

    return res.status(200).json({
      message: "project deleted successfully.",
      deletedProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in deleting project due to ${error.message}`,
    });
  }
};

module.exports = {
  createProject,
  updateProject,
  getProjectMediaByServiceAndGallery,
  getByProjectName,
  getProjects,
  getProject,
  getProjectName,
  deleteProject,
};
