import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
  console.error("❌ Environment variable REDIS_URL is missing!");
  throw new Error("REDIS_URL not defined");
}

const redis = new Redis(process.env.REDIS_URL);
export default redis;
