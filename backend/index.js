const express = require("express");
const expressCoreValidator = require('express-core-validator');
const cors = require("cors");
const config = require("./config");
const { requestLogger } = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");
const healthRoutes = require("./routes/health");
const configRoutes = require("./routes/config");
const activityRoutes = require("./routes/activity");

const app = express();
app.use(expressCoreValidator());

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use("/api/health", healthRoutes);
app.use("/api/config", configRoutes);
app.use("/api/activity", activityRoutes);

app.get("/", (req, res) => {
  res.json({
    name: "Counter dApp API",
    version: "1.0.0",
    endpoints: {
      health: "GET /api/health",
      config: "GET /api/config",
      activity: "GET /api/activity",
      "activity (post)": "POST /api/activity",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Backend running at http://localhost:${config.PORT}`);
  if (!config.CONTRACT_ADDRESS) {
    console.warn(
      "CONTRACT_ADDRESS is not set. Set it in .env and restart. GET /api/config will return 503 until then."
    );
  }
});

module.exports = app;
