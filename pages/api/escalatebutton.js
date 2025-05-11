// components/EscalateButton.js
'use client'; // falls du Next.js 13+ App-Router nutzt
import { useState } from 'react';

export default function EscalateButton({ incidentId }) {
  const [open, setOpen] = useState(false);
  const [resourceId, setResourceId] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const res = await fetch('/api/escalate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incidentId, resourceId })
    });
    setLoading(false);
    if (res.ok) {
      alert('Escalation ausgelöst!');
      setOpen(false);
    } else {
      const err = await res.json();
      alert('Fehler: ' + (err.error || res.statusText));
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        Escalate
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg mb-4">Incident eskalieren</h2>
            <label className="block mb-2">
              Resource ID:
              <input
                type="text"
                value={resourceId}
                onChange={(e) => setResourceId(e.target.value)}
                className="w-full mt-1 p-2 border rounded"
                placeholder="z.B. i-0123456789abcdef0"
              />
            </label>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Abbrechen
              </button>
              <button
                onClick={submit}
                disabled={loading || !resourceId}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {loading ? '...' : 'Jetzt eskalieren'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
