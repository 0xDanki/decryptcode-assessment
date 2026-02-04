const express = require("express");
const router = express.Router();
const { CONTRACT_ADDRESS, CHAIN_ID } = require("../config");

/**
 * GET /api/config
 * dApp config: contract address and chain ID for the front-end.
 */
router.get("/", (req, res) => {
  if (!CONTRACT_ADDRESS) {
    return res.status(503).json({
      error:
        "CONTRACT_ADDRESS not configured. Set it in backend .env after deploying the contract.",
    });
  }
  res.json({
    contractAddress: CONTRACT_ADDRESS,
    chainId: CHAIN_ID,
  });
});

module.exports = router;
