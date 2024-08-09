// // const express = require("express");
// // const dotenv = require("dotenv");
// // const Route = require("./routes/index");
// // const connectDb = require("./config/database");
// // const cors = require("cors");
// // const path = require("path");

// // dotenv.config();

// // // app.use(
// // //   cors({
// // //     origin: "http://localhost:3000",
// // //   })
// // // );

// // const app = express();
// // app.use(express.json());

// // const PORT = process.env.PORT || 8000;

// // const allowedOrigins =
// //   process.env.NODE_ENV === "production"
// //     ? [process.env.PROD_URL] // Production URL
// //     : [process.env.DEV_URL]; // Development URL

// // app.use(
// //   cors({
// //     origin: function (origin, callback) {
// //       // Allow requests with no origin like mobile apps or curl requests
// //       if (!origin) return callback(null, true);
// //       if (allowedOrigins.indexOf(origin) === -1) {
// //         const msg =
// //           "The CORS policy for this site does not allow access from the specified origin.";
// //         return callback(new Error(msg), false);
// //       }
// //       return callback(null, true);
// //     },
// //   })
// // );

// // // Serve static files from the React app
// // app.use(express.static(path.join(__dirname, "../frontend/build")));

// // app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // app.get("/api", (req, res) => {
// //   res.send("This is backend");
// // });

// // // Apply CORS middleware to all API routes
// // app.use("/api", cors());

// // // Define API routes
// // app.use("/api/auth", Route.authRoute);
// // app.use("/api/team", Route.teamRoute);
// // app.use("/api/contact", Route.contactRoute);
// // app.use("/api/jobapplication", Route.jobApplicationRoute);
// // app.use("/api/about", Route.aboutRoute);
// // app.use("/api/career", Route.careerRoute);
// // app.use("/api/opportunity", Route.opportunitityRoute);
// // app.use("/api/service", Route.serviceRoute);
// // app.use("/api/gallery", Route.galleryRoute);
// // app.use("/api/gallery_name", Route.galleryNameRoute);
// // app.use("/api/project", Route.projectRoute);
// // app.use("/api/project_detail", Route.projectDetailsRoute);
// // app.use("/api/email", Route.emailRoute);

// // connectDb();

// // app.get("*", (req, res) => {
// //   res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
// // });

// // app.listen(PORT, "0.0.0.0", (error) => {
// //   if (error) {
// //     console.log(`Server connection failed due to ${error}`);
// //   }
// //   console.log(`Server is running on port ${process.env.PORT}`);
// // });

// const express = require("express");
// const dotenv = require("dotenv");
// const Route = require("./routes/index");
// const connectDb = require("./config/database");
// const cors = require("cors");
// const path = require("path");

// dotenv.config();

// const app = express();
// app.use(express.json());

// console.log("Environment Variables:");
// console.log("NODE_ENV:", process.env.NODE_ENV);
// console.log("PROD_URL:", process.env.PROD_URL);
// console.log("DEV_URL:", process.env.DEV_URL);

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

// app.get("/api/test-cors", (req, res) => {
//   res.json({ message: "CORS is working!" });
// });

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
const axios = require("axios");
const cron = require("node-cron");

dotenv.config();

console.log("Environment Variables:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("PROD_URL:", process.env.PROD_URL);
console.log("DEV_URL:", process.env.DEV_URL);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.PROD_URL]
    : [process.env.DEV_URL];

console.log("Allowed Origins:", allowedOrigins);

// Temporary CORS middleware to allow all origins for testing
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.post("/api/cookie-consent", (req, res) => {
  const { consent } = req.body;
  // You can log this consent information or perform other actions
  console.log(`User consent: ${consent}`);
  res.status(200).send("Consent logged");
});

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

// Define ping route
app.get("/ping", (req, res) => {
  res.send("Server is alive");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.get("/test-db", async (req, res) => {
  try {
    const test = await mongoose.connection.db.collection("test").findOne({});
    res.status(200).json({ message: "Database is connected", test });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Database connection test failed: ${error.message}` });
  }
});

// Replace with your server URL
const serverUrl = "https://ares-studio-calb.onrender.com/ping";

// Schedule the keep-alive ping every 5 minutes
cron.schedule("*/5 * * * *", async () => {
  try {
    await axios.get(serverUrl);
    console.log("Ping sent to keep server alive.");
  } catch (error) {
    console.error("Error pinging server:", error.message);
  }
});

app.listen(PORT, "0.0.0.0", (error) => {
  if (error) {
    console.log(`Server connection failed due to ${error}`);
  }
  console.log(`Server is running on port ${PORT}`);
});
