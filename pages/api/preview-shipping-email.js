// Authentication middleware
function checkAuth(req) {
  const { session } = req.cookies;
  
  if (!session) {
    return { authenticated: false, error: 'No session found' };
  }

  try {
    const decoded = Buffer.from(session, 'base64').toString('utf-8');
    const [username, timestamp] = decoded.split(':');
    
    // Check if session is still valid (24 hours)
    const sessionAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (sessionAge > maxAge) {
      return { authenticated: false, error: 'Session expired' };
    }

    return { authenticated: true, user: username };
  } catch (error) {
    return { authenticated: false, error: 'Invalid session' };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authentication bypassed for email previews
  // const authResult = checkAuth(req);
  // if (!authResult.authenticated) {
  //   return res.status(401).json({ error: authResult.error });
  // }

  const { customerEmail, customerAddress, productName, trackingNumber } = req.body;

  // Validate required fields
  if (!customerEmail || !customerAddress || !productName || !trackingNumber) {
    return res.status(400).json({ 
      error: 'Missing required fields: customerEmail, customerAddress, productName, trackingNumber' 
    });
  }

  try {
    // Generate FedEx tracking URL
    const trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;

    // HTML email template - HappyDeel Branded with Modern Design
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Order Has Shipped - HappyDeel</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
            line-height: 1.6; 
            color: #374151; 
            margin: 0; 
            padding: 0; 
            background-color: #f9fafb; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); 
            color: white; 
            padding: 48px 32px; 
            text-align: center; 
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="20" cy="80" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
          }

            font-size: 20px;
          }
          .header-title { 
            font-size: 32px; 
            font-weight: 700; 
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
          }
          .header-subtitle { 
            font-size: 18px; 
            opacity: 0.9;
            font-weight: 400;
            position: relative;
            z-index: 1;
          }
          .content { 
            padding: 48px 32px; 
          }
          .shipping-card {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 32px;
            position: relative;
            overflow: hidden;
          }
          .shipping-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #1e3a8a, #3b82f6, #ffef02);
          }
          .shipping-icon {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #3b82f6, #1e3a8a);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            color: white;
            font-size: 28px;
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
          }
          .status-badge {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 8px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 16px;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          }
          .product-info {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }
          .product-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
          }
          .product-detail {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 4px;
          }
          .tracking-section {
            background: white;
            border: 2px solid #3b82f6;
            border-radius: 16px;
            padding: 32px;
            text-align: center;
            margin-bottom: 32px;
            position: relative;
            overflow: hidden;
          }
          .tracking-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.02), rgba(30, 58, 138, 0.02));
          }
          .tracking-title {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
            position: relative;
            z-index: 1;
          }
          .tracking-number {
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 18px;
            font-weight: 600;
            color: #1e3a8a;
            background: #f1f5f9;
            padding: 16px 24px;
            border-radius: 12px;
            margin-bottom: 24px;
            border: 1px solid #e2e8f0;
            position: relative;
            z-index: 1;
          }
          .track-button {
            display: inline-block;
            background: linear-gradient(135deg, #3b82f6, #1e3a8a);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
            position: relative;
            z-index: 1;
          }
          .track-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(59, 130, 246, 0.4);
          }
          .delivery-info {
            background: #fef3c7;
            border: 1px solid #ffef02;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
          }
          .delivery-info h3 {
            color: #92400e;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          .delivery-info p {
            color: #78350f;
            font-size: 14px;
            margin: 0;
          }
          .footer { 
            background: #f8fafc; 
            padding: 32px; 
            text-align: center; 
            border-top: 1px solid #e5e7eb;
          }
          .footer-content {
            max-width: 400px;
            margin: 0 auto;
          }
          .footer h3 {
            color: #374151;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
          }
          .footer p { 
            color: #6b7280; 
            font-size: 14px; 
            margin-bottom: 16px;
          }
          .contact-info {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin-bottom: 16px;
          }
          .contact-link {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
            font-size: 14px;
          }
          .contact-link:hover {
            color: #1e3a8a;
          }
          .copyright {
            color: #9ca3af;
            font-size: 12px;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
          }
          @media (max-width: 600px) {
            .container { margin: 16px; }
            .header { padding: 32px 24px; }
            .content { padding: 32px 24px; }
            .shipping-card { padding: 24px; }
            .tracking-section { padding: 24px; }
            .footer { padding: 24px; }
            .contact-info { flex-direction: column; gap: 12px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="header-title">📦 Your Order Has Shipped!</h1>
            <p class="header-subtitle">Your item is on its way</p>
          </div>
          
          <div class="content">
            <div class="shipping-card">
              <div class="shipping-icon">🚚</div>
              <h2 style="text-align: center; font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 16px;">Great news! Your order is on the way</h2>
              <p style="text-align: center; color: #6b7280; font-size: 16px;">We've carefully packaged your item and handed it off to our shipping partner.</p>
            </div>

            <div class="product-info">
              <div class="product-title">${productName}</div>
              <div class="product-detail">Shipping to: ${customerAddress}</div>
              <div class="product-detail">Customer: ${customerEmail}</div>
            </div>

            <div class="tracking-section">
              <h3 class="tracking-title">Track Your Package</h3>
              <div class="tracking-number">${trackingNumber}</div>
              <a href="${trackingUrl}" class="track-button">Track Package →</a>
            </div>

            <div class="delivery-info">
              <h3>📅 Delivery Information</h3>
              <p>Your package is expected to arrive within 3-5 business days. You'll receive updates as your package moves through our network.</p>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-content">
              <h3>Need Help?</h3>
              <p>Our customer service team is here to help with any questions about your order.</p>
              <div class="contact-info">
                <a href="mailto:support@happydeel.com" class="contact-link">📧 Email Support</a>
                <a href="tel:+17176484487" class="contact-link">📞 +17176484487</a>
              </div>
              <div class="copyright">
                © 2024 HappyDeel. All rights reserved.<br>
                The smart way to buy quality items — for less.
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    // Return the HTML content for preview
    res.status(200).json({
      success: true,
      htmlContent: htmlTemplate,
      previewData: {
        customerEmail,
        customerAddress,
        productName,
        trackingNumber,
        trackingUrl
      }
    });

  } catch (error) {
    console.error('Preview generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate email preview',
      details: error.message 
    });
  }
}