const express = require("express");
const router = express.Router();
const { addActivity, getActivities, clearActivities } = require("../services/activityStore");

/**
 * GET /api/activity
 * Returns recent counter activity (increment/decrement) from the in-memory store.
 * Query: ?limit=20 (optional, default 20)
 */
router.get("/", (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
  const activities = getActivities(limit);
  res.json({ activities });
});

/**
 * POST /api/activity
 * Record a counter action (e.g. when user increments/decrements on the dApp).
 * Body: { type: "increment" | "decrement", walletAddress?: string, value: number }
 */
router.post("/", (req, res) => {
  const { type, walletAddress, value } = req.body;
  if (!type || (type !== "increment" && type !== "decrement")) {
    return res.status(400).json({
      error: "Invalid or missing 'type'. Must be 'increment' or 'decrement'.",
    });
  }
  const numValue = typeof value === "number" ? value : parseInt(value, 10);
  if (Number.isNaN(numValue)) {
    return res.status(400).json({
      error: "Invalid or missing 'value'. Must be a number.",
    });
  }
  const entry = addActivity(type, walletAddress || null, numValue);
  res.status(201).json(entry);
});

/**
 * DELETE /api/activity
 * Clear all stored activity (useful for testing). Optional for assessment.
 */
router.delete("/", (req, res) => {
  clearActivities();
  res.json({ message: "Activity log cleared." });
});

module.exports = router;
