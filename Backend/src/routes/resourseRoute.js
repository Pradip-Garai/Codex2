const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addResource, fetchResource } = require("../controllers/resourseAdd");
const adminMiddleware = require("../middleware/adminMiddleware");

// Multer setup (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/resources
router.post("/", adminMiddleware, upload.single('thumbnail'), addResource);

// GET /api/resources/fetch-resources
router.get("/fetch-resources", adminMiddleware, fetchResource);

module.exports = router;
