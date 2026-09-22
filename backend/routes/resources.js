const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Resource = require("../models/Resource");

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer config — store files in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error("File type not allowed"));
    }
  },
});

// GET /api/resources — list all active resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/resources/:type — list by type
router.get("/:type", async (req, res) => {
  try {
    const resources = await Resource.find({
      type: req.params.type,
      isActive: true,
    });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/resources — add a link resource
router.post("/", async (req, res) => {
  try {
    const { type, label, url } = req.body;
    if (!type || !label) {
      return res.status(400).json({ error: "type and label are required" });
    }
    const resource = await Resource.create({ type, label, url });
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /api/resources/upload — upload a file (resume, document)
router.post("/upload/file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const { label, type = "document" } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;
    const resource = await Resource.create({
      type,
      label: label || req.file.originalname,
      url: fileUrl,
      filename: req.file.originalname,
    });
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/resources/:id
router.delete("/:id", async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!resource) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted", resource });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
