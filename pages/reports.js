// pages/reports.js
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Reports() {
  const [allReports, setAllReports] = useState([]);
  const [filter, setFilter] = useState({ text: '', category: '' });

  useEffect(() => {
    fetch('/api/getReports')
      .then(res => res.json())
      .then(data => setAllReports(data))
      .catch(console.error);
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch('/api/updateReport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return alert('Update fehlgeschlagen: ' + (err.error || res.status));
      }
      setAllReports(rs => rs.map(r => (r._id === id ? { ...r, status } : r)));
    } catch (e) {
      console.error(e);
      alert('Netzwerkfehler beim Update');
    }
  };

  const deleteReport = async id => {
    if (!confirm('Wirklich löschen?')) return;
    try {
      const res = await fetch('/api/deleteReport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return alert('Löschen fehlgeschlagen: ' + (err.error || res.status));
      }
      setAllReports(rs => rs.filter(r => r._id !== id));
    } catch (e) {
      console.error(e);
      alert('Netzwerkfehler beim Löschen');
    }
  };

  // Filter-Logik
  const reports = allReports.filter(r => {
    if (filter.category && r.category !== filter.category) return false;
    const text = filter.text.toLowerCase();
    const title = (r.title || '').toLowerCase();
    const desc  = (r.description || '').toLowerCase();
    return title.includes(text) || desc.includes(text);
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        {/* Back-Link zum Formular */}
        <div className="mb-4">
          <Link href="/">
            <a className="text-blue-600 hover:underline">← Neuer Incident melden</a>
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-4">Gemeldete Incidents</h1>

        {/* Such- und Filter-UI */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
          <input
            type="text"
            placeholder="Suchen…"
            className="mb-2 sm:mb-0 flex-1 p-2 border rounded"
            value={filter.text}
            onChange={e => setFilter(f => ({ ...f, text: e.target.value }))}
          />
          <select
            className="p-2 border rounded"
            value={filter.category}
            onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
          >
            <option value="">Alle Kategorien</option>
            <option value="Phishing">Phishing</option>
            <option value="Malware">Malware</option>
            <option value="Datenverlust">Datenverlust</option>
          </select>
        </div>

        {/* Liste der Incidents */}
        {reports.length === 0 ? (
          <p className="text-gray-600">Keine Meldungen gefunden.</p>
        ) : (
          <ul className="space-y-4">
            {reports.map(r => (
              <li key={r._id} className="border-b pb-4 flex justify-between">
                <div>
                  <p><strong>Titel:</strong> {r.title}</p>
                  <p><strong>Kategorie:</strong> {r.category}</p>
                  <p><strong>Beschreibung:</strong> {r.description}</p>
                  <p className="text-sm text-gray-500">
                    <strong>Erstellt am:</strong> {new Date(r.date).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-start">
                  {/* Status ändern */}
                  <select
                    className="mr-2 p-1 border rounded"
                    value={r.status}
                    onChange={e => updateStatus(r._id, e.target.value)}
                  >
                    <option value="Offen">Offen</option>
                    <option value="In Bearbeitung">In Bearbeitung</option>
                    <option value="Gelöst">Gelöst</option>
                  </select>
                  {/* Löschen */}
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => deleteReport(r._id)}
                  >
                    Löschen
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
