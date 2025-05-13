import redis from '../../lib/redis';

export default async function handler(req, res) {
  try {
    await redis.set('test', 'hello from redis');
    const value = await redis.get('test');
    res.status(200).json({ value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
