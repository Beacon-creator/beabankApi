const express = require("express");
const { signupHandler } = require("../controllers/signupcontroller");
const { checkSchema } = require("express-validator");
const UserValidationSchema = require("../middlewares/validationMiddleware"); // Ensure the file has a `.js` extension or `.mjs` is renamed to `.js`.

const router = express.Router();

router.post(
  "/api/signup",
  checkSchema(UserValidationSchema),
  signupHandler
);

module.exports = router;
