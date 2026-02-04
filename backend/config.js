/**
 * Application configuration from environment variables.
 */
require("dotenv").config();

const PORT = parseInt(process.env.PORT || "4010", 10);
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || null;
const CHAIN_ID = parseInt(process.env.CHAIN_ID || "31337", 10);
const NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
  PORT,
  CONTRACT_ADDRESS,
  CHAIN_ID,
  NODE_ENV,
  isProduction: NODE_ENV === "production",
};
