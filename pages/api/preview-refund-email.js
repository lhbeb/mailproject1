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
  // Authentication bypassed for email previews
  // const auth = checkAuth(req);
  // if (!auth.authenticated) {
  //   return res.status(401).json({ error: auth.error });
  // }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerEmail, customerName, productName, refundAmount } = req.body;

  // Validate required fields
  if (!customerEmail || !customerName || !productName || !refundAmount) {
    return res.status(400).json({ 
      error: 'Missing required fields: customerEmail, customerName, productName, refundAmount' 
    });
  }

  // Validate refund amount - handle both numeric strings and dollar-formatted strings
  const cleanAmount = typeof refundAmount === 'string' ? refundAmount.replace(/[$,]/g, '') : refundAmount;
  const amount = parseFloat(cleanAmount);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid refund amount' });
  }

  try {
    // Format the refund amount for display in the email template
    const formattedAmount = refundAmount.startsWith('$') ? refundAmount : `$${refundAmount}`;
    
    // HTML email template - Redesigned based on design guidelines
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Refund Confirmation</title>
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
            background-color: #f5f5f5; 
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          .header-section { 
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); 
            color: white; 
            padding: 48px 32px; 
            text-align: center; 
            position: relative;
            overflow: hidden;
          }
          .header-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="20" cy="80" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
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
          .refund-card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 32px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
          .refund-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, #3b82f6, transparent);
          }
          .success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 32px;
            color: white;
            font-size: 32px;
            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2);
            position: relative;
            z-index: 1;
            line-height: 1;
            text-align: center;
          }
          .success-icon::before {
            content: '✓';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 32px;
            font-weight: bold;
          }
          .refund-title {
            font-size: 28px;
            font-weight: 600;
            color: #1f2937;
            text-align: center;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
          }
          .refund-subtitle {
            font-size: 16px;
            color: #6b7280;
            text-align: center;
            margin-bottom: 32px;
            line-height: 1.5;
          }
          .amount-display {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            margin-bottom: 0;
            position: relative;
          }
          .amount-display::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #10b981, #059669);
            border-radius: 0 0 8px 8px;
          }
          .amount-label {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
            font-weight: 500;
          }
          .amount-value {
            font-size: 32px;
            font-weight: 700;
            color: #1e3a8a;
          }
          .status-badge {
            display: inline-block;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: #000000;
            padding: 8px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 16px;
            box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
          }
          .refund-details {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }
          .detail-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-label {
            color: #6b7280;
            font-size: 14px;
            font-weight: 500;
          }
          .detail-value {
            color: #000000;
            font-weight: 600;
            text-align: right;
            max-width: 60%;
          }
          .timeline {
            background: #e0f2fe;
            border: 1px solid #3b82f6;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
          }
          .timeline h3 {
            color: #1e3a8a;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .timeline-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 16px;
            padding-left: 8px;
          }
          .timeline-item:last-child {
            margin-bottom: 0;
          }
          .timeline-number {
            width: 28px;
            height: 28px;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: #000000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 700;
            margin-right: 12px;
            flex-shrink: 0;
            text-align: center;
            line-height: 1;
            padding: 0;
            position: relative;
          }
          .timeline-number::before {
            content: attr(data-number);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 12px;
            font-weight: 700;
          }
          .timeline-content {
            color: #1e3a8a;
            font-size: 14px;
            line-height: 1.5;
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
          @media (max-width: 768px) {
            .container { 
              margin: 0 !important; 
              width: 100% !important;
              max-width: 100% !important;
              border-radius: 0 !important;
              box-shadow: none !important;
            }
            .header-section { 
              padding: 24px 16px !important; 
              position: relative !important;
            }
            .header-section::before {
              z-index: 0 !important;
            }
            .header-title {
              font-size: 24px !important;
              z-index: 2 !important;
              position: relative !important;
            }
            .content { 
              padding: 24px 16px !important; 
            }
            .refund-card { 
              padding: 20px 16px !important; 
              margin-bottom: 24px !important;
            }
            .refund-details { 
              padding: 16px !important; 
              margin-bottom: 24px !important;
            }
            .timeline { 
              padding: 16px !important; 
              margin-bottom: 24px !important;
            }
            .footer { 
              padding: 20px 16px !important; 
            }
            
            /* Perfect centering for success icon */
            .success-icon {
              width: 60px !important;
              height: 60px !important;
              margin: 0 auto 20px auto !important;
              position: static !important;
              transform: none !important;
              left: auto !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              z-index: 2 !important;
              font-size: 24px !important;
            }
            
            /* Fix refund titles */
            .refund-title {
              font-size: 20px !important;
              text-align: center !important;
              margin-bottom: 12px !important;
              word-break: break-word !important;
              line-height: 1.3 !important;
            }
            .refund-subtitle {
              font-size: 14px !important;
              text-align: center !important;
              padding: 0 8px !important;
              line-height: 1.4 !important;
            }
            
            /* Fix amount display */
            .amount-display {
              padding: 16px !important;
              text-align: center !important;
            }
            .amount-value {
              font-size: 24px !important;
              word-break: break-word !important;
            }
            
            /* Perfect detail rows */
            .detail-row { 
              display: flex !important;
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 4px !important;
              padding: 8px 0 !important;
              border-bottom: 1px solid #f3f4f6 !important;
            }
            .detail-label {
              font-size: 12px !important;
              margin-right: 0 !important;
              margin-bottom: 2px !important;
            }
            .detail-value { 
              width: 100% !important;
              max-width: 100% !important;
              text-align: left !important;
              word-break: break-word !important;
              font-size: 14px !important;
            }
            
            /* Perfect timeline alignment */
            .timeline-item {
              display: flex !important;
              align-items: flex-start !important;
              margin-bottom: 16px !important;
              padding: 0 !important;
            }
            .timeline-number {
              width: 20px !important;
              height: 20px !important;
              font-size: 10px !important;
              margin-right: 12px !important;
              flex-shrink: 0 !important;
              position: static !important;
              top: auto !important;
              transform: none !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              z-index: 1 !important;
            }
            .timeline-content {
              flex: 1 !important;
              font-size: 13px !important;
              line-height: 1.4 !important;
              word-break: break-word !important;
            }
            
            /* Perfect contact info */
            .contact-info {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              gap: 8px !important;
              text-align: center !important;
            }
            .contact-link {
              font-size: 13px !important;
              word-break: break-word !important;
            }
          }
          
          @media (max-width: 480px) {
            .header-section { 
              padding: 20px 12px !important; 
            }
            .content { 
              padding: 20px 12px !important; 
            }
            .refund-card { 
              padding: 16px 12px !important; 
            }
            .refund-details { 
              padding: 12px !important; 
            }
            .timeline { 
              padding: 12px !important; 
            }
            .footer { 
              padding: 16px 12px !important; 
            }
            .header-title {
              font-size: 20px !important;
            }
            .refund-title {
              font-size: 18px !important;
            }
            .amount-value {
              font-size: 20px !important;
            }
          }
          
          @media (max-width: 320px) {
            .header-section { 
              padding: 16px 8px !important; 
            }
            .content { 
              padding: 16px 8px !important; 
            }
            .refund-card { 
              padding: 12px 8px !important; 
            }
            .header-title {
              font-size: 18px !important;
            }
            .refund-title {
              font-size: 16px !important;
            }
            .amount-value {
              font-size: 18px !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header-section">
            <h1 class="header-title">Refund Processed</h1>
            <p class="header-subtitle">Your refund has been successfully processed</p>
          </div>
          
          <div class="content">
            <p style="font-size: 18px; margin-bottom: 32px; color: #374151;">Dear ${customerName},</p>
            
            <div class="refund-card">
              <div class="success-icon"></div>
              <h2 class="refund-title">Your Order Has Been Successfully Refunded</h2>
              <p class="refund-subtitle">We have processed a full refund for your order. The refund amount will appear in your original payment method.</p>
              
              <div class="amount-display">
                <div class="amount-label">Full Refund Amount</div>
                <div class="amount-value">$${refundAmount}</div>
              </div>
            </div>

            <div class="refund-details">
              <h3 class="detail-title">Refund Details</h3>
              <div class="detail-row">
                <span class="detail-label">Product</span>
                <span class="detail-value" style="color: #000000;">${productName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Customer Email</span>
                <span class="detail-value" style="color: #000000;">${customerEmail}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Refund Amount</span>
                <span class="detail-value" style="color: #000000; font-weight: 700;">${formattedAmount}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Status</span>
                <span class="detail-value" style="color: #000000; font-weight: 700;">Processed</span>
              </div>
            </div>

            <div class="timeline">
              <h3>What happens next?</h3>
              <div class="timeline-item">
                <div class="timeline-number" data-number="1"></div>
                <div class="timeline-content">Your full refund has been processed by our team</div>
              </div>
              <div class="timeline-item">
                <div class="timeline-number" data-number="2"></div>
                <div class="timeline-content">The full refund amount will appear in your original payment method within 3-5 business days</div>
              </div>
              <div class="timeline-item">
                <div class="timeline-number" data-number="3"></div>
                <div class="timeline-content">You'll see the transaction reflected in your account statement</div>
              </div>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-content">
              <h3>Need Help?</h3>
              <p>If you have any questions about your refund, our customer service team is here to help.</p>
              <div class="contact-info">
                <a href="mailto:support@company.com" class="contact-link">📧 Email Support</a>
                <a href="tel:+17176484487" class="contact-link">📞 +17176484487</a>
              </div>
              <div class="copyright">
                © 2024 Customer Service. All rights reserved.<br>
                Thank you for your business.
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Return the preview data
    const previewData = {
      success: true,
      message: 'Refund email preview generated successfully',
      data: {
        customerEmail,
        productName,
        refundAmount: formattedAmount,
        template: 'refund-confirmation',
        timestamp: new Date().toISOString()
      },
      htmlContent: htmlTemplate
    };

    res.status(200).json(previewData);

  } catch (error) {
    console.error('Error generating refund email preview:', error);
    res.status(500).json({ 
      error: 'Failed to generate refund email preview',
      details: error.message 
    });
  }
}