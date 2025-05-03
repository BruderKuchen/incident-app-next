import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Alle Felder sind erforderlich.' });
    }

    try {
      const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
      const db = client.db('incidentsDB');
      const collection = db.collection('reports');
      await collection.insertOne({ name, email, message, date: new Date() });
      client.close();
      res.status(200).json({ message: 'Gespeichert' });
    } catch (error) {
      res.status(500).json({ error: 'Fehler beim Speichern' });
    }
  } else {
    res.status(405).json({ error: 'Nur POST erlaubt' });
  }
}