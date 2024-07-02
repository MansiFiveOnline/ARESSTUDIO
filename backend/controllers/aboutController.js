const aboutModel = require("../models/aboutModel");
const path = require("path");

const createAbout = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      about_description,
      media,
      metaTitle,
      metaDescription,
    } = req.body;
    // Function to check if the file is a WebP image

    let mediaData = {};

    // if (!media || (typeof media === "string" && !isURL(media.trim()))) {
    //   return res.status(400).json({
    //     message:
    //       "Either a file or a valid URL is required for the media field.",
    //   });
    // }
    const file = req.file;
    // Check if the file is a WebP image
    // Function to check if the file is a WebP image
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
    } else {
      const file = req.file;
      if (!file) {
        return res.status(400).json({
          message:
            "Either a file or a valid URL is required for the media field.",
        });
      }
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
    }
    // } else {
    //   mediaData = {
    //     filename: null,
    //     filepath: null,
    //     iframe: media.trim(),
    //   };

    const newAbout = new aboutModel({
      title,
      subtitle,
      description,
      about_description,
      type: fileType,
      media: mediaData,
      metaTitle,
      metaDescription,
    });

    await newAbout.save();

    return res.status(200).json({
      message: "Added About content sucessfully.",
      newAbout,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in adding about due to ${error.message}`,
    });
  }
};

const updateAbout = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      about_description,
      metaTitle,
      metaDescription,
      media, // Add media to destructuring to check its presence
    } = req.body;

    // Fetch the current about document
    const currentAbout = await aboutModel.findOne({});
    if (!currentAbout) {
      return res.status(404).json({ message: "About content not found." });
    }

    let mediaData = currentAbout.media; // Initialize with current media data
    let fileType = currentAbout.type; // Initialize with current media type

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
      fileType = "image";
    } else if (media) {
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
      fileType = "video";
    }

    const updatedFields = {
      title,
      subtitle,
      description,
      about_description,
      metaTitle,
      metaDescription,
      media: mediaData,
      type: fileType,
    };

    const updatedAbout = await aboutModel.findOneAndUpdate({}, updatedFields, {
      new: true,
    });

    console.log(updatedAbout);

    return res.status(200).json({
      message: "About content updated successfully.",
      updatedAbout,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in updating about due to ${error.message}`,
    });
  }
};

const getAbout = async (req, res) => {
  try {
    const abouts = await aboutModel.find();
    // console.log(req.params._id);
    if (!abouts) {
      return res.status(400).json({
        message: "No About is created.",
      });
    }

    return res.status(200).json({
      message: "All About fetched successfully.",
      abouts,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching abouts due to ${error.message}`,
    });
  }
};

module.exports = {
  createAbout,
  updateAbout,
  getAbout,
};
