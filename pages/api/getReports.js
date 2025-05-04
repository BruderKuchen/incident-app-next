// pages/api/getReports.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
  res.setHeader('Access-Control-Allow-Origin', '*');

  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db('incidentsDB');
    const reports = await db
      .collection('reports')
      .find({})
      .sort({ date: -1 })
      .toArray();
    return res.status(200).json(reports);
  } catch (e) {
    console.error('DB-Error @ /api/getReports:', e);
    return res.status(500).json({ error: 'Fehler beim Abrufen der Reports' });
  } finally {
    if (client) await client.close();
  }
}
