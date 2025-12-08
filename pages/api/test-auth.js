import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  console.log('=== TESTING GMAIL AUTHENTICATION ===');
  
  // Log environment variables (safely)
  console.log('Gmail User:', process.env.GMAIL_USER);
  console.log('Gmail Pass exists:', !!process.env.GMAIL_PASS);
  console.log('Gmail Pass length:', process.env.GMAIL_PASS?.length);
  console.log('Gmail Pass (first 4 chars):', process.env.GMAIL_PASS?.substring(0, 4));
  console.log('Gmail Pass (last 4 chars):', process.env.GMAIL_PASS?.substring(-4));

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      debug: true, // Enable debug mode
      logger: true // Enable logging
    });

    console.log('=== TESTING CONNECTION ===');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    return res.status(200).json({ 
      success: true,
      message: 'Gmail authentication successful!',
      user: process.env.GMAIL_USER,
      passLength: process.env.GMAIL_PASS?.length
    });

  } catch (error) {
    console.error('❌ Authentication failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Response code:', error.responseCode);
    console.error('Full response:', error.response);
    
    return res.status(500).json({ 
      error: 'Authentication failed',
      code: error.code,
      message: error.message,
      responseCode: error.responseCode
    });
  }
}