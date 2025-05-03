import { useEffect, useState } from 'react';

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetch('/api/getReports')
      .then(res => res.json())
      .then(data => setReports(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Gemeldete Incidents</h1>
        {reports.length === 0 ? (
          <p className="text-gray-600">Keine Meldungen vorhanden.</p>
        ) : (
          <ul className="space-y-4">
            {reports.map((r, i) => (
              <li key={i} className="border-b pb-4">
                <p><strong>Name:</strong> {r.name}</p>
                <p><strong>E-Mail:</strong> {r.email}</p>
                <p><strong>Nachricht:</strong> {r.message}</p>
                <p className="text-sm text-gray-500"><strong>Datum:</strong> {new Date(r.date).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}