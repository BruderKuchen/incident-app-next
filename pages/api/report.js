// pages/api/report.js
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

module.exports = async function handler(req, res) {
  // 1) OPTIONS / Preflight beantworten
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // 2) CORS-Header auch für POST setzen
  res.setHeader('Access-Control-Allow-Origin', '*');

  // 3) Nur POST zulassen
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({ error: 'Alle Felder sind erforderlich.' });
  }

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
    client.close();
    return res.status(200).json({ message: 'Gespeichert' });
  } catch (e) {
    console.error('DB-Error:', e);
    return res.status(500).json({ error: 'Fehler beim Speichern' });
  }
};
