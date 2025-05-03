// pages/reports.js
import { useEffect, useState } from 'react';

export default function Reports() {
  const [allReports, setAllReports] = useState([]);
  const [filter, setFilter] = useState({ text: '', category: '' });

  useEffect(() => {
    fetch('/api/getReports')
      .then(r => r.json())
      .then(data => setAllReports(data));
  }, []);

  const updateStatus = async (id, status) => {
    await fetch('/api/updateReport', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });
    setAllReports(reports =>
      reports.map(r => (r._id === id ? { ...r, status } : r))
    );
  };

  // Filter anwenden
  const reports = allReports
    .filter(r =>
      (filter.category === '' || r.category === filter.category) &&
      (r.title.toLowerCase().includes(filter.text.toLowerCase()) ||
       r.description.toLowerCase().includes(filter.text.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Gemeldete Incidents</h1>

        {/* Suche & Kategorie */}
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

        {/* Liste */}
        {reports.length === 0 ? (
          <p className="text-gray-600">Keine Meldungen gefunden.</p>
        ) : (
          <ul className="space-y-4">
            {reports.map(r => (
              <li key={r._id} className="border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p><span className="font-semibold">Titel:</span> {r.title}</p>
                    <p><span className="font-semibold">Kategorie:</span> {r.category}</p>
                    <p><span className="font-semibold">Beschreibung:</span> {r.description}</p>
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Erstellt am:</span>{' '}
                      {new Date(r.date).toLocaleString()}
                    </p>
                  </div>
                  <select
                    className="ml-4 p-1 border rounded"
                    value={r.status}
                    onChange={e => updateStatus(r._id, e.target.value)}
                  >
                    <option value="Offen">Offen</option>
                    <option value="In Bearbeitung">In Bearbeitung</option>
                    <option value="Gelöst">Gelöst</option>
                  </select>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
