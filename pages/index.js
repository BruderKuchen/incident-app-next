// pages/index.js
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [statusMsg, setStatusMsg] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatusMsg('… speichere');
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setStatusMsg(err.error || `Fehler ${res.status}`);
        return;
      }
      const data = await res.json();
      setStatusMsg(data.message || 'Gespeichert!');
      setForm({ title: '', description: '', category: '' });
    } catch (networkError) {
      setStatusMsg('Netzwerkfehler – bitte prüfe Konsole');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Incident melden</h1>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Titel"
          className="mb-2 w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Beschreibung"
          className="mb-2 w-full p-2 border rounded"
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="mb-4 w-full p-2 border rounded"
          required
        >
          <option value="">Kategorie wählen</option>
          <option value="Phishing">Phishing</option>
          <option value="Malware">Malware</option>
          <option value="Datenverlust">Datenverlust</option>
        </select>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Speichern
        </button>
        {statusMsg && <p className="mt-2 text-center">{statusMsg}</p>}
      </form>
      <div className="mt-4 text-center w-full max-w-lg">
        <Link href="/reports">
          <a className="text-blue-600 hover:underline">→ Alle Incidents ansehen</a>
        </Link>
      </div>
    </div>
  );
}
