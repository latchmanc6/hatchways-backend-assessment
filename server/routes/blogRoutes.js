const express = require("express");
const router = express.Router();

// Controller(s)
const blogController = require("../controllers/blogController");

// Middleware
const cache = require("../middleware/apiCache");

// GET: Ping server
router.get("/ping", cache(900), blogController.pingServer);

// GET: Blog posts
router.get("/posts/:tags/:sortBy?/:direction?", cache(900), blogController.getPosts);

module.exports = router;
