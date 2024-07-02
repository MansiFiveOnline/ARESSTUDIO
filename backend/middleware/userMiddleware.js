const jwt = require("jsonwebtoken");
const authModel = require("../models/authModel");

const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.header("Authorization");
    if (!accessToken) {
      return res.status(400).json({
        message: "Invalid authentication. No token present",
      });
    }

    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (!decodedToken) {
      return res.status(400).json({
        message: "Invalid authentication. Wrong token",
      });
    }

    const user = await authModel.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      message: `Authentication failed due to ${error.message}`,
    });
  }
};

module.exports = authenticateUser;
