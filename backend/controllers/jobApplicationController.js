const jobApplicationModel = require("../models/jobApplicationModel");
const multer = require("multer");
const path = require("path");

const createApplication = async (req, res) => {
  try {
    // Extract form data
    const { name, email, phone_no, location, position, message, document } =
      req.body;

    let documentData = {};

    const file = req.file;

    // let fileType = "";

    if (file) {
      // A file is provided
      // Check if the file is a PDF document
      const isPDFDocument = (file) => {
        const extname = path.extname(file.originalname).toLowerCase();
        return extname === ".pdf", ".doc";
      };

      if (!isPDFDocument(file)) {
        return res.status(400).json({
          message: "Unsupported file type. Please upload a PDF document.",
        });
      }

      fileType = "document"; // Set fileType to "document" for PDF documents
      documentData = {
        filename: req.file.originalname,
        filepath: req.file.path,
      };
    } else {
      // No document provided
      return res.status(400).json({
        message: "A PDF document is required.",
      });
    }

    // Create job application object
    const newApplication = new jobApplicationModel({
      name,
      email,
      phone_no,
      location,
      position,
      document: documentData,
      message,
    });

    // Save job application to the database
    await newApplication.save();

    return res.status(200).json({
      message: "Job application created successfully",
      data: newApplication,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in creating application due to ${error.message}`,
    });
  }
};

const updateApplication = async (req, res) => {
  try {
    const { name, email, phone_no, location, position, message, document } =
      req.body;

    // Fetch the existing application data from the database
    const existingApplication = await jobApplicationModel.findById(
      req.params._id
    );

    // Initialize variables to store updated field values
    let updatedFields = {};

    // Check each field to see if it exists in the request body and update accordingly
    if (name !== undefined) {
      updatedFields.name = name;
    }
    if (email !== undefined) {
      updatedFields.email = email;
    }
    if (phone_no !== undefined) {
      updatedFields.phone_no = phone_no;
    }
    if (location !== undefined) {
      updatedFields.location = location;
    }
    if (position !== undefined) {
      updatedFields.position = position;
    }
    if (message !== undefined) {
      updatedFields.message = message;
    }

    // Handle document field separately
    if (req.files && req.files.document) {
      const documentFile = req.files.document;

      // Check if document is a PDF file
      if (!documentFile.mimetype.endsWith("pdf")) {
        return res.status(400).json({
          message: "Unsupported file type. Please upload a PDF document.",
        });
      }

      // Set document data
      updatedFields.document = {
        filename: documentFile.originalname,
        filepath: documentFile.path,
      };
    }

    // Update the application with the updated fields
    const updatedApplication = await jobApplicationModel.findByIdAndUpdate(
      req.params._id,
      updatedFields,
      { new: true }
    );

    return res.status(200).json({
      message: "Application content updated successfully.",
      updatedApplication,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in updating Application due to ${error.message}`,
    });
  }
};

const getApplications = async (req, res) => {
  try {
    const applications = await jobApplicationModel.find();

    return res.status(200).json({
      message: "Applications retrieved successfully.",
      count: applications.length,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching applications: ${error.message}`,
    });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const applicationExist = await jobApplicationModel.findById({
      _id: req.params._id,
    });

    if (applicationExist.length === 0) {
      return res.status(400).json({
        message: "No applications are created. Kindly create one.",
      });
    }

    const deletedApplication = await jobApplicationModel.findOneAndDelete({
      _id: req.params._id,
    });

    return res.status(200).json({
      message: "Application deleted successfully.",
      deletedApplication,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in deleting application: ${error.message}`,
    });
  }
};

module.exports = {
  createApplication,
  updateApplication,
  getApplications,
  deleteApplication,
};
