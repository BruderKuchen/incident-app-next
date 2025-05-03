// pages/api/getReports.js
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('incidentsDB');
    const docs = await db
      .collection('reports')
      .find()
      .sort({ date: -1 })
      .toArray();
    client.close();
    // _id → String
    const reports = docs.map(r => ({
      ...r,
      _id: r._id.toString()
    }));
    res.status(200).json(reports);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Fehler beim Laden der Reports' });
  }
};
