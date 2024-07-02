// const express = require("express");
// const dotenv = require("dotenv");
// const Route = require("./routes/index");
// const connectDb = require("./config/database");
// const cors = require("cors");
// const path = require("path");

// dotenv.config();

// // app.use(
// //   cors({
// //     origin: "http://localhost:3000",
// //   })
// // );

// const app = express();
// app.use(express.json());

// const PORT = process.env.PORT || 8000;

// const allowedOrigins =
//   process.env.NODE_ENV === "production"
//     ? [process.env.PROD_URL] // Production URL
//     : [process.env.DEV_URL]; // Development URL

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin like mobile apps or curl requests
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg =
//           "The CORS policy for this site does not allow access from the specified origin.";
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, "../frontend/build")));

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.get("/api", (req, res) => {
//   res.send("This is backend");
// });

// // Apply CORS middleware to all API routes
// app.use("/api", cors());

// // Define API routes
// app.use("/api/auth", Route.authRoute);
// app.use("/api/team", Route.teamRoute);
// app.use("/api/contact", Route.contactRoute);
// app.use("/api/jobapplication", Route.jobApplicationRoute);
// app.use("/api/about", Route.aboutRoute);
// app.use("/api/career", Route.careerRoute);
// app.use("/api/opportunity", Route.opportunitityRoute);
// app.use("/api/service", Route.serviceRoute);
// app.use("/api/gallery", Route.galleryRoute);
// app.use("/api/gallery_name", Route.galleryNameRoute);
// app.use("/api/project", Route.projectRoute);
// app.use("/api/project_detail", Route.projectDetailsRoute);
// app.use("/api/email", Route.emailRoute);

// connectDb();

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
// });

// app.listen(PORT, "0.0.0.0", (error) => {
//   if (error) {
//     console.log(`Server connection failed due to ${error}`);
//   }
//   console.log(`Server is running on port ${process.env.PORT}`);
// });

const express = require("express");
const dotenv = require("dotenv");
const Route = require("./routes/index");
const connectDb = require("./config/database");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.PROD_URL] // Production URL
    : [process.env.DEV_URL]; // Development URL

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin like mobile apps or curl requests
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api", (req, res) => {
  res.send("This is backend");
});

// Define API routes
app.use("/api/auth", Route.authRoute);
app.use("/api/team", Route.teamRoute);
app.use("/api/contact", Route.contactRoute);
app.use("/api/jobapplication", Route.jobApplicationRoute);
app.use("/api/about", Route.aboutRoute);
app.use("/api/career", Route.careerRoute);
app.use("/api/opportunity", Route.opportunitityRoute);
app.use("/api/service", Route.serviceRoute);
app.use("/api/gallery", Route.galleryRoute);
app.use("/api/gallery_name", Route.galleryNameRoute);
app.use("/api/project", Route.projectRoute);
app.use("/api/project_detail", Route.projectDetailsRoute);
app.use("/api/email", Route.emailRoute);

app.get("/api/test-cors", (req, res) => {
  res.json({ message: "CORS is working!" });
});

connectDb();

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.listen(PORT, "0.0.0.0", (error) => {
  if (error) {
    console.log(`Server connection failed due to ${error}`);
  }
  console.log(`Server is running on port ${process.env.PORT}`);
});
