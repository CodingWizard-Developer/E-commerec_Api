const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const routes = require("./routes/index");
const cors = require("cors");
const { v2: cloudinary } = require("cloudinary");
const { prisma } = require("./config/PrismaClient");
const { config } = require("dotenv");
config();

prisma
  .$connect()
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

// Middleware
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3300",
];

app.use((req, res, next) => {
  const start = Date.now();

  const originalSend = res.send;

  res.send = function (body) {
    res.locals.body = body;
    return originalSend.call(this, body);
  };

  // listen for response to finish
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method}:  ${req.originalUrl} → ${res.statusCode} - ${
        res.statusCode >= 400 ? `Message: ${res.locals.body}` : ""
      } (${duration}ms)`,
    );
  });

  next();
});

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "accessToken",
      "refreshToken",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    exposedHeaders: [
      "access-token",
      "refresh-token",
      "x-new-access-token",
      "x-new-refresh-token",
    ],
    credentials: true,
  }),
);
cloudinary.config({
  api_key: process.env.CLOUDINARY_APIKEY,
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_secret: process.env.CLOUDINARY_SECRETKEY,
});

// routes
app.use("/api/v1", routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
