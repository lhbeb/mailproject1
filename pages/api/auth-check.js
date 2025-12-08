export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session } = req.cookies;

  if (!session) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    // Decode session token
    const decoded = Buffer.from(session, 'base64').toString('utf-8');
    const [username, timestamp] = decoded.split(':');
    
    // Check if session is still valid (24 hours)
    const sessionAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (sessionAge > maxAge) {
      return res.status(401).json({ authenticated: false, error: 'Session expired' });
    }

    return res.status(200).json({ 
      authenticated: true, 
      user: username 
    });
  } catch (error) {
    return res.status(401).json({ authenticated: false, error: 'Invalid session' });
  }
}