// pages/api/report.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  // CORS-Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).json({});
  }

  // nur POST zulassen
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Header für alle Antworten
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Alle Felder (title, description, category) sind erforderlich.' });
  }

  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db('incidentsDB');
    const result = await db.collection('reports').insertOne({
      title,
      description,
      category,
      date: new Date().toISOString(),
      status: 'Offen'
    });
    return res.status(200).json({ message: 'Gespeichert', id: result.insertedId });
  } catch (e) {
    console.error('DB-Error @ /api/report:', e);
    return res.status(500).json({ error: 'Fehler beim Speichern' });
  } finally {
    if (client) await client.close();
  }
}
