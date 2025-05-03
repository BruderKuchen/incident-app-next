// pages/api/updateReport.js
import { MongoClient, ObjectId } from 'mongodb';
const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).json({});
  }
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  const { id, status } = req.body;
  if (!id || !status) {
    return res.status(400).json({ error: 'Missing id or status' });
  }
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('incidentsDB');
    await db.collection('reports').updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );
    await client.close();
    return res.status(200).json({ message: 'Status aktualisiert' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Fehler beim Aktualisieren' });
  }
}
