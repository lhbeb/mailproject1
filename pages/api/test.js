export default function handler(req, res) {
  console.log('Test API route called');
  console.log('Method:', req.method);
  console.log('Body:', req.body);
  
  res.status(200).json({ 
    message: 'Test API route is working!',
    method: req.method,
    timestamp: new Date().toISOString()
  });
}