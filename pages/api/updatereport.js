// pages/api/updateReport.js
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  // 1) Preflight OPTIONS abfangen
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).json({});
  }

  // 2) CORS-Header für alle POST-Antworten
  res.setHeader('Access-Control-Allow-Origin', '*');

  // 3) Nur POST zulassen
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // 4) Body prüfen
  const { id, status } = req.body;
  if (!id || !status) {
    return res.status(400).json({ error: 'Missing id or status' });
  }

  // 5) Status updaten
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
    console.error('DB-Error:', e);
    return res.status(500).json({ error: 'Fehler beim Aktualisieren' });
  }
}
