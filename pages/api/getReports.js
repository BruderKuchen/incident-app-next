import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  try {
    const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
    const db = client.db('incidentsDB');
    const reports = await db.collection('reports').find().sort({ date: -1 }).toArray();
    client.close();
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Fehler beim Laden der Reports' });
  }
}