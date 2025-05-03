// pages/api/report.js
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

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
    res.status(200).json({ message: 'Gespeichert' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Fehler beim Speichern' });
  }
};
