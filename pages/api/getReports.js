// pages/api/getReports.js
import { MongoClient } from 'mongodb';
const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('incidentsDB');
    const docs = await db.collection('reports').find().sort({ date: -1 }).toArray();
    await client.close();
    const reports = docs.map(r => ({ ...r, _id: r._id.toString() }));
    return res.status(200).json(reports);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Fehler beim Laden der Reports' });
  }
}
