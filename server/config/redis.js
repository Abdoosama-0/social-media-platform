
require('dotenv').config();
const { createClient } = require("redis");

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

// 🔑 مهم: الاتصال
(async () => {
  await redis.connect();
})();

module.exports = redis;
