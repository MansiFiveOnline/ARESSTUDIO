const serviceModel = require("../models/serviceModel");
const path = require("path");

const createService = async (req, res) => {
  try {
    const {
      service_name,
      title,
      subtitle,
      description,
      metaTitle,
      metaDescription,
      media: mediaField,
    } = req.body;

    const posterImgFile = req.files?.posterImg ? req.files.posterImg[0] : null;
    const mediaFile = req.files?.media ? req.files.media[0] : null;

    // Log the values to ensure they're being received correctly
    console.log("Service Name:", service_name);
    console.log("Title:", title);
    console.log("Media File:", mediaFile);
    console.log("Media Field (URL):", mediaField);

    // Check if required fields are present
    if (!service_name || !title || (!mediaField && !mediaFile)) {
      return res.status(400).json({
        message: "Name, title, and media are required fields.",
      });
    }

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
      mediaData = {
        filename: mediaFile.originalname,
        filepath: mediaFile.path,
        iframe: null,
      };
    }

    // Custom validation for posterImg.filepath
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

    const urlSlug = service_name.toLowerCase().replace(/\s+/g, "-");
    const url = `http://localhost:8000/api/${urlSlug}`;

    const newService = new serviceModel({
      service_name,
      url,
      title,
      subtitle,
      description,
      type: fileType,
      media: mediaData,
      metaTitle,
      metaDescription,
      posterImg: posterImgData,
    });

    await newService.save();

    return res.status(200).json({
      message: "Added Service content successfully.",
      newService,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in adding Service due to ${error.message}`,
    });
  }
};

// const updateService = async (req, res) => {
//   try {
//     const {
//       service_name,
//       title,
//       subtitle,
//       description,
//       metaTitle,
//       metaDescription,
//     } = req.body;

//     let mediaData = null;

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
//     } else if (req.body.media) {
//       // Check if media is a URL
//       const isURL = (str) => {
//         try {
//           new URL(str);
//           return true;
//         } catch (error) {
//           return false;
//         }
//       };

//       if (!isURL(req.body.media)) {
//         return res.status(400).json({
//           message: "Invalid media URL.",
//         });
//       }

//       // Set media data for video
//       mediaData = {
//         filename: null,
//         filepath: null,
//         iframe: req.body.media.trim(),
//       };
//     }

//     // Create object with updated fields
//     const updatedFields = {
//       service_name,
//       title,
//       subtitle,
//       description,
//       metaTitle,
//       metaDescription,
//     };

//     // Update the URL based on the updated name
//     const urlSlug = service_name.toLowerCase().replace(/\s+/g, "-");
//     updatedFields.url = `http://localhost:8000/api/service/${urlSlug}`;

//     // Add media data if provided
//     if (mediaData) {
//       updatedFields.media = mediaData;
//       updatedFields.type = mediaData.filename ? "image" : "video";
//     }

//     // Update career in the database
//     const updatedService = await serviceModel.findByIdAndUpdate(
//       req.params._id,
//       updatedFields,
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Service content updated successfully.",
//       updatedService,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in updating Service due to ${error.message}`,
//     });
//   }
// };

// const updateService = async (req, res) => {
//   try {
//     const {
//       service_name,
//       title,
//       subtitle,
//       description,
//       metaTitle,
//       metaDescription,
//       media,
//     } = req.body;

//     // Fetch the existing project to retain current media values if not updated
//     const existingService = await serviceModel.findById(req.params._id);
//     if (!existingService) {
//       return res.status(404).json({ message: "Service not found." });
//     }

//     let mediaData = {
//       filename: existingService.media.filename,
//       filepath: existingService.media.filepath,
//       iframe: existingService.media.iframe,
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
//       service_name,
//       title,
//       subtitle,
//       description,
//       metaTitle,
//       metaDescription,
//       media: mediaData,
//       type: mediaData.filename ? "image" : "video",
//     };

//     // Only include fields that are explicitly provided, even if they are empty strings
//     const nonNullUpdatedFields = {};
//     for (const key in updatedFields) {
//       if (updatedFields[key] !== undefined) {
//         nonNullUpdatedFields[key] = updatedFields[key];
//       }
//     }

//     // Update project in the database by ID
//     const updatedService = await serviceModel.findByIdAndUpdate(
//       req.params._id,
//       { $set: nonNullUpdatedFields },
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Service content updated successfully.",
//       updatedService,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in updating service due to ${error.message}`,
//     });
//   }
// };

// const updateService = async (req, res) => {
//   try {
//     const {
//       service_name,
//       title,
//       subtitle,
//       description,
//       metaTitle,
//       metaDescription,
//       media,
//     } = req.body;

//     // Fetch the existing service to retain current media values if not updated
//     const existingService = await serviceModel.findById(req.params._id);
//     if (!existingService) {
//       return res.status(404).json({ message: "Service not found." });
//     }

//     // Check if required fields are present
//     if (!service_name || !title || !media) {
//       return res.status(400).json({
//         message: "Name, title, and media are required fields.",
//       });
//     }

//     let mediaData = {
//       filename: existingService.media.filename,
//       filepath: existingService.media.filepath,
//       iframe: existingService.media.iframe,
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
//       ...(service_name && { service_name }),
//       ...(title && { title }),
//       ...(subtitle && { subtitle }),
//       ...(description && { description }),
//       ...(metaTitle && { metaTitle }),
//       ...(metaDescription && { metaDescription }),
//       media: mediaData,
//       type: mediaData.filename ? "image" : "video",
//     };

//     // Update the URL based on the updated name
//     if (service_name) {
//       const urlSlug = service_name.toLowerCase().replace(/\s+/g, "-");
//       updatedFields.url = `http://localhost:8000/api/service/${urlSlug}`;
//     }

//     // Update service in the database by ID
//     const updatedService = await serviceModel.findByIdAndUpdate(
//       req.params._id,
//       updatedFields,
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Service content updated successfully.",
//       updatedService,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in updating Service due to ${error.message}`,
//     });
//   }
// };

// const updateService = async (req, res) => {
//   try {
//     const {
//       service_name,
//       title,
//       subtitle,
//       description,
//       metaTitle,
//       metaDescription,
//       media,
//       posterImg,
//     } = req.body;

//     // Fetch the existing service to retain current media values if not updated
//     const existingService = await serviceModel.findById(req.params._id);
//     if (!existingService) {
//       return res.status(404).json({ message: "Service not found." });
//     }

//     let mediaData = {
//       filename: existingService.media.filename,
//       filepath: existingService.media.filepath,
//       iframe: existingService.media.iframe,
//     };

//     let posterImgData = existingService.posterImg;

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
//       service_name,
//       title,
//       subtitle,
//       description,
//       metaTitle,
//       metaDescription,
//       media: mediaData,
//       posterImg: posterImgData,
//       type: mediaData.filename ? "image" : "video",
//     };

//     // Only include fields that are explicitly provided, even if they are empty strings
//     const nonNullUpdatedFields = {};
//     for (const key in updatedFields) {
//       if (updatedFields[key] !== undefined) {
//         nonNullUpdatedFields[key] = updatedFields[key];
//       }
//     }

//     // Update service in the database by ID
//     const updatedService = await serviceModel.findByIdAndUpdate(
//       req.params._id,
//       { $set: nonNullUpdatedFields },
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Service content updated successfully.",
//       updatedService,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in updating service due to ${error.message}`,
//     });
//   }
// };

const updateService = async (req, res) => {
  try {
    const {
      service_name,
      url,
      title,
      subtitle,
      description,
      metaTitle,
      metaDescription,
      type,
      media: mediaField,
    } = req.body;

    // Retrieve files
    const mediaFile = req.files?.media ? req.files.media[0] : null;
    const posterImgFile = req.files?.posterImg ? req.files.posterImg[0] : null;

    // Find the existing service
    const service = await serviceModel.findById(req.params._id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Update fields
    service.service_name = service_name || service.service_name;
    service.url = url || service.url;
    service.title = title || service.title;
    service.subtitle = subtitle || service.subtitle;
    service.description = description || service.description;
    service.metaTitle = metaTitle || service.metaTitle;
    service.metaDescription = metaDescription || service.metaDescription;
    service.type = type || service.type;

    // Handle media based on type
    if (type === "video") {
      if (mediaFile) {
        service.media = {
          filename: mediaFile.originalname,
          filepath: mediaFile.path,
          iframe: "",
        };
      } else if (mediaField && mediaField.startsWith("http")) {
        service.media = {
          filename: "",
          filepath: "",
          iframe: mediaField,
        };
      }
    } else if (type === "image" && mediaFile) {
      service.media = {
        filename: mediaFile.originalname,
        filepath: mediaFile.path,
        iframe: "",
      };
    }

    // Handle posterImg only if type is video
    if (type === "video") {
      if (posterImgFile) {
        service.posterImg = {
          filename: posterImgFile.originalname,
          filepath: posterImgFile.path,
        };
      } else if (!posterImgFile && !service.posterImg) {
        service.posterImg = null;
      }
    } else if (type === "image") {
      // Do not clear posterImg if it exists and no new posterImgFile is provided
      if (posterImgFile) {
        service.posterImg = null;
      }
    }

    // Save the updated service
    const updatedService = await service.save();
    res.status(200).json({ updatedService });
  } catch (error) {
    console.error("Error updating service:", error);
    res
      .status(500)
      .json({ message: `Failed to update service: ${error.message}` });
  }
};

const getByServiceName = async (req, res) => {
  const { service_name } = req.query;
  try {
    const serviceName = service_name.toUpperCase();
    const service = await serviceModel.findOne({ service_name: serviceName });

    if (!service) {
      return res.status(400).json({
        message: "No service found with the provided service name.",
      });
    }

    return res.status(200).json({
      message: "Service fetched successfully.",
      service,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching service due to ${error.message}`,
    });
  }
};

const getService = async (req, res) => {
  try {
    const service = await serviceModel.findById(req.params._id);

    if (service.length === 0) {
      return res.status(400).json({
        message: "No services are created. Kindly create one.",
      });
    }
    return res.status(200).json({
      message: "Service fetched successfully.",
      service,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching service due to ${error.message}`,
    });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await serviceModel.find();

    if (services.length === 0) {
      return res.status(400).json({
        message: "No services are created. Kindly create one.",
      });
    }
    return res.status(200).json({
      message: "All services fetched successfully.",
      count: services.length,
      services,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching services due to ${error.message}`,
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const serviceExists = await serviceModel.findById({
      _id: req.params._id,
    });

    if (serviceExists.length === 0) {
      return res.status(400).json({
        message: "No services are created. Kindly create one.",
      });
    }

    const deletedService = await serviceModel.findOneAndDelete({
      _id: req.params._id,
    });

    return res.status(200).json({
      message: "Service deleted successfully.",
      deletedService,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in deleting service due to ${error.message}`,
    });
  }
};

module.exports = {
  createService,
  updateService,
  getByServiceName,
  getService,
  getServices,
  deleteService,
};
