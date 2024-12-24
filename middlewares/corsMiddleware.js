const cors = require("cors");
const express = require("express");
const helmet = require("helmet");

const app = express();

// Define allowed origins for CORS
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Check if the origin is in the list of allowed origins or if there's no origin (like with Postman requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
  })
);

// Configure CSP to allow connections to localhost:3000
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "http://localhost:5173"],
      },
    },
  })
);

// Other middleware and routes
