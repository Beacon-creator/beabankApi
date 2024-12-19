const cors = require("cors");

// Define allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://firstbackend-1c5d.onrender.com",
];

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
