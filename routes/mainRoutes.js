const express = require("express");
const signupRoutes = require("./signupRoutes");
const signinRoutes = require("./signinRoutes");
const index = require("./index");
const users = require("./users");
const balanceRoutes = require("./balanceRoutes");
const useridentifyRoutes = require("./authRoutes");
const router = express.Router();

router.use(signupRoutes);
router.use(signinRoutes);
router.use(balanceRoutes);
router.use(useridentifyRoutes);
router.use(index);
router.use(users);

module.exports = router;
