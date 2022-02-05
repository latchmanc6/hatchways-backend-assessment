const express = require("express");
const router = express.Router();

// Controller(s)
const blogController = require('../controllers/blogController');

// GET: Ping server
router.get("/ping", blogController.pingServer);

// GET: Blog posts
router.get("/posts", blogController.getPosts);

module.exports = router;
