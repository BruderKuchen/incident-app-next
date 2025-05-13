import pkg from 'pg';
const { Pool } = pkg;

if (!process.env.PG_URL) {
  console.error("❌ Environment variable PG_URL is missing!");
  throw new Error("PG_URL not defined");
}

const pool = new Pool({
  connectionString: process.env.PG_URL,
});

export default pool;
