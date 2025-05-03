// pages/api/deleteReport.js
import { MongoClient, ObjectId } from 'mongodb';
const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('incidentsDB');
    await db.collection('reports').deleteOne({ _id: new ObjectId(id) });
    await client.close();
    return res.status(200).json({ message: 'Deleted' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error deleting' });
  }
}
