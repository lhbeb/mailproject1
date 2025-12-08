export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { username, password } = req.body;

  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check credentials (hardcoded as requested)
  if (username === 'elmahboubi' && password === 'Localserver!!2') {
    // Set session cookie (expires in 24 hours)
    const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');
    
    res.setHeader('Set-Cookie', [
      `session=${sessionToken}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`
    ]);

    return res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      user: username
    });
  } else {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
}