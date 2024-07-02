const emailModel = require("../models/emailModel");

const createEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const newEmail = new emailModel({ email });
    await newEmail.save();

    res.status(200).json({
      message: "Email submitted successfully",
      newEmail,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in submitting email: ${error.message}`,
    });
  }
};

const getEmail = async (req, res) => {
  try {
    const email = await emailModel.findById(req.params._id);

    if (!email) {
      return res.status(400).json({
        message: "No email is created with this id.",
      });
    }
    res.status(200).json({ message: "Email fetched successfully", email });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching emails: ${error.message}`,
    });
  }
};

const getEmails = async (req, res) => {
  try {
    const emails = await emailModel.find();
    res.status(200).json({ emails });
  } catch (error) {
    return res.status(500).json({
      message: `Error in fetching emails: ${error.message}`,
    });
  }
};

const createPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const existingEmail = await emailModel.findById(req.params._id);

    if (!existingEmail) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    if (existingEmail.password) {
      return res.status(400).json({
        message: "Password already exists for this email",
      });
    }

    existingEmail.password = password;
    await existingEmail.save();

    res.status(201).json({
      message: "Password created successfully",
      email: existingEmail,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in creating password: ${error.message}`,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    const updatedEmail = await emailModel.findByIdAndUpdate(
      req.params._id,
      { password },
      { new: true }
    );

    if (!updatedEmail) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    res.status(200).json({
      message: "Password updated successfully",
      updatedEmail,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error in updating password: ${error.message}`,
    });
  }
};

const validatePassword = async (req, res) => {
  try {
    const { password } = req.body;

    // if (!password) {
    //   return res.status(400).json({
    //     message: "Password is required",
    //   });
    // }

    const passwordExists = await emailModel.findOne({ password });

    if (!passwordExists) {
      return res.status(400).json({
        message: "Password does not match.",
        isValid: false,
      });
    }

    return res.status(200).json({
      message: "Password validated successfully.",
      isValid: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Password validation failed due to ${error}`,
    });
  }
};

module.exports = {
  createEmail,
  getEmail,
  getEmails,
  updatePassword,
  createPassword,
  validatePassword,
};
