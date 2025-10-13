const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/authMiddleware");

router.use(authenticateToken);

// User routes
router.get("/profile", userController.getProfile); // anyone logged in

// Admin routes
router.get("/", authorizeRole("Admin"), userController.getAllUsers);
router.post("/", authorizeRole("Admin"), userController.createUser);
router.delete("/:userId", authorizeRole("Admin"), userController.deleteUser);

// Update route (Admin can edit anyone, user can edit self)
router.put("/:userId", userController.updateUser);

module.exports = router;
