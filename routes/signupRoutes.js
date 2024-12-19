const express = require("express");
const { signupUserHandler } = require("./controllers/signupController.js");

const router = express.Router();

router.post("/signup", signupUserHandler);

module.exports = router;
