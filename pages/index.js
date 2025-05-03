import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setStatus(data.message || data.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Incident melden</h1>
        <input name="name" onChange={handleChange} placeholder="Name" className="mb-2 w-full p-2 border" required />
        <input name="email" onChange={handleChange} placeholder="E-Mail" className="mb-2 w-full p-2 border" required />
        <textarea name="message" onChange={handleChange} placeholder="Nachricht" className="mb-2 w-full p-2 border" required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Senden</button>
        {status && <p className="mt-2">{status}</p>}
      </form>
    </div>
  );
}