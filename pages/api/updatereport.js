// pages/api/updateReport.js
const { MongoClient, ObjectId } = require('mongodb');
const uri = process.env.MONGODB_URI;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { id, status } = req.body;
  if (!id || !status) return res.status(400).json({ error: 'Fehlende Parameter.' });

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('incidentsDB');
    await db
      .collection('reports')
      .updateOne({ _id: new ObjectId(id) }, { $set: { status } });
    client.close();
    res.status(200).json({ message: 'Status aktualisiert' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Fehler beim Aktualisieren' });
  }
};
