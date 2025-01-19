const express = require("express");
const signupRoutes = require("./signupRoutes.js");
const signinRoutes = require("./signinRoutes.js");
const balanceRoutes = require("./balanceRoutes.js");
const useridentifyRoutes = require("./authRoutes.js");
const networkRoutes = require("./networkRoutes.js");
const logoutRoutes = require("./logoutRoutes.js");
const profileRoutes = require("./profileRoutes.js");
const index = require("./index.js");
const users = require("./users.js");
const router = express.Router();

router.use(signupRoutes);
router.use(signinRoutes);
router.use(balanceRoutes);
router.use(useridentifyRoutes);
router.use(networkRoutes);
router.use(logoutRoutes);
router.use(profileRoutes);
router.use(index);
router.use(users);

module.exports = router;
