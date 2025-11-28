var express = require("express");
var router = express.Router();

const UserController = require("../../controllers/auth_controller/AuthController");

router.post("/login", UserController.login);

module.exports = router;
