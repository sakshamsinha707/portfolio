const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

// POST /api/contact — submit a contact message
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const contact = await Contact.create({ name, email, message });
    res.status(201).json({ message: "Message received!", id: contact._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/contact — list all messages (simple admin use)
router.get("/", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
