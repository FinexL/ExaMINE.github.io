const express = require("express");
const router = express.Router();
const verify = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

router.delete("/users/:userId", verify, userController.deleteUser);

module.exports = router;
