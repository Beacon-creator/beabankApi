const express = require("express");
const { signinHandler } = require("../controllers/signinController.js");
const { checkSchema } = require("express-validator");
const UserValidationSchema = require("../middlewares/validationMiddleware.js");

const router = express.Router();

router.post(
  "/api/signin",
  [
    // Validate email and password
    checkSchema({
      email: {
        notEmpty: { errorMessage: "Email is required" },
        isEmail: { errorMessage: "Invalid email format" },
      },
      password: {
        notEmpty: { errorMessage: "Password is required" },
      },
    }),
  ],
  signinHandler
);

module.exports = router;
