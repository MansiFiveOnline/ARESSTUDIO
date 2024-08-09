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
    } = req.body;

    // Check if required fields are present
    if (!service_name || !title || (!req.body.media && !req.files.posterImg)) {
      return res.status(400).json({
        message:
          "Name, title, and at least one media file or URL are required fields.",
      });
    }

    const urlSlug = service_name.toLowerCase().replace(/\s+/g, "-");
    const url = `http://localhost:8000/api/${urlSlug}`;

    let mediaData = {};
    let posterImgData = {};

    // Handling media field
    if (req.body.media) {
      const isURL = (str) => {
        try {
          new URL(str);
          return true;
        } catch (error) {
          return false;
        }
      };

      if (isURL(req.body.media)) {
        mediaData = {
          filename: null,
          filepath: null,
          iframe: req.body.media,
        };
      } else {
        mediaData = {
          filename: null,
          filepath: null,
          iframe: null,
        };
      }
    } else if (req.files.media && req.files.media.length > 0) {
      const mediaFile = req.files.media[0];
      mediaData = {
        filename: mediaFile.filename,
        filepath: mediaFile.path,
        iframe: null,
      };
    }

    // Handling posterImg field
    if (req.files.posterImg && req.files.posterImg.length > 0) {
      const posterImgFile = req.files.posterImg[0];
      posterImgData = {
        filename: posterImgFile.filename,
        filepath: posterImgFile.path,
      };
    }

    const newService = new serviceModel({
      service_name,
      url,
      title,
      subtitle,
      description,
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
//       media,
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

//       posterImgData = {
//         filename: req.file.originalname,
//         filepath: req.file.path,
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

// const createService = async (req, res) => {
//   try {
//     const {
//       service_name,
//       title,
//       subtitle,
//       description,
//       metaTitle,
//       metaDescription,
//     } = req.body;

//     if (!service_name || !title || (!req.files.media && !req.files.posterImg)) {
//       return res.status(400).json({
//         message:
//           "Name, title, and at least one media file are required fields.",
//       });
//     }

//     const urlSlug = service_name.toLowerCase().replace(/\s+/g, "-");
//     const url = `http:/localhost:8000/api/${urlSlug}`;

//     let mediaData = {};
//     let posterImgData = {};

//     // Handling media field
//     if (req.files.media && req.files.media.length > 0) {
//       mediaData = {
//         filename: req.files.media[0].filename,
//         filepath: req.files.media[0].path,
//       };
//     }

//     // Handling posterImg field
//     if (req.files.posterImg && req.files.posterImg.length > 0) {
//       posterImgData = {
//         filename: req.files.posterImg[0].filename,
//         filepath: req.files.posterImg[0].path,
//       };
//     }

//     const newService = new serviceModel({
//       service_name,
//       url,
//       title,
//       subtitle,
//       description,
//       media: mediaData,
//       metaTitle,
//       metaDescription,
//       posterImg: posterImgData,
//     });

//     await newService.save();

//     return res.status(200).json({
//       message: "Added Service content successfully.",
//       newService,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       message: `Error in adding Service due to ${error.message}`,
//     });
//   }
// };

const updateService = async (req, res) => {
  try {
    const { _id } = req.params;
    const {
      service_name,
      title,
      subtitle,
      description,
      metaTitle,
      metaDescription,
    } = req.body;

    const updateData = {
      service_name,
      title,
      subtitle,
      description,
      metaTitle,
      metaDescription,
    };

    if (req.files.media && req.files.media.length > 0) {
      updateData.media = {
        filename: req.files.media[0].filename,
        filepath: req.files.media[0].path,
      };
    }

    if (req.files.posterImg && req.files.posterImg.length > 0) {
      updateData.posterImg = {
        filename: req.files.posterImg[0].filename,
        filepath: req.files.posterImg[0].path,
      };
    }

    const updatedService = await serviceModel.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({
      message: "Service updated successfully.",
      updatedService,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in updating Service due to ${error.message}`,
    });
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
