export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { incidentId, resourceId } = req.body;
  const userEmail = req.user?.email || 'team@deinedomain.de';

  const response = await fetch(
    process.env.ESCALATION_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incidentId, resourceId, userEmail })
    }
  );

  const payload = await response.json();
  return res.status(response.status).json(payload);
}
