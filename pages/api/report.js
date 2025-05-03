// pages/api/report.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  // 1) Preflight-Request beantworten
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).json({}); 
  }

  // 2) CORS-Header für alle Antworten
  res.setHeader('Access-Control-Allow-Origin', '*');

  // 3) Nur POST zulassen
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // 4) Body prüfen
  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Alle Felder sind erforderlich.' });
  }

  // 5) In DB schreiben
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('incidentsDB');
    await db.collection('reports').insertOne({
      title,
      description,
      category,
      date: new Date().toISOString(),
      status: 'Offen'
    });
    await client.close();
    return res.status(200).json({ message: 'Gespeichert' });
  } catch (e) {
    console.error('DB-Error:', e);
    return res.status(500).json({ error: 'Fehler beim Speichern' });
  }
}
