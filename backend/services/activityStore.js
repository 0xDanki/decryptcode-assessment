/**
 * In-memory store for counter activity (e.g. "increment" / "decrement" from the dApp).
 * Used to demonstrate backend logic; resets when the server restarts.
 */
const activities = [];
const MAX_ACTIVITIES = 100;

function addActivity(type, walletAddress, value) {
  const entry = {
    id: activities.length + 1,
    type,
    walletAddress: walletAddress || null,
    value,
    timestamp: new Date().toISOString(),
  };
  activities.push(entry);
  if (activities.length > MAX_ACTIVITIES) {
    activities.shift();
  }
  return entry;
}

function getActivities(limit = 20) {
  return activities.slice(-limit).reverse();
}

function clearActivities() {
  activities.length = 0;
  return { cleared: true };
}

module.exports = {
  addActivity,
  getActivities,
  clearActivities,
};
