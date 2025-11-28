var express = require("express");
var router = express.Router();
const { verifyToken, accessControl } = require("../services/auth.service");

const AuthRoutes = require("./utility_routes/auth.routes");
const MasterRoutes = require("./master_routes/master.routes");

router.use("/auth", AuthRoutes);
router.use("/master", MasterRoutes);

module.exports = router;
