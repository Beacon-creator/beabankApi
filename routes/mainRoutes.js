const express = require("express");
const signupRoutes = require("./signupRoutes");
const signinRoutes = require("./signinRoutes");
const balanceRoutes = require("./balanceRoutes");
const useridentifyRoutes = require("./authRoutes");
const networkRoutes = require("./networkRoutes");
const logoutRoutes = require("./logoutRoutes");
const profileRoutes = require("./profileRoutes");
const index = require("./index");
const users = require("./users");
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
