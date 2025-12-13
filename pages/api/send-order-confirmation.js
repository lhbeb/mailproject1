import { getRandomAccount, createTransporter, getAccountByUser } from '../../src/config/emailAccounts';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerName, customerEmail, customerAddress, productName, senderEmail } = req.body;

    // Validate required fields
    if (!customerEmail || !customerName || !productName) {
      return res.status(400).json({
        error: 'Missing required fields: customerEmail, customerName, and productName are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    console.log('=== SENDING ORDER CONFIRMATION EMAIL ===');
    console.log('Customer:', customerName);
    console.log('Email:', customerEmail);
    console.log('Product:', productName);

    // Get the email account and create transporter
    const account = senderEmail ? await getAccountByUser(senderEmail) : getRandomAccount();
    const emailTransporter = createTransporter(account);

    // HTML email template - Refined for Email Client Compatibility
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - HappyDeel</title>
        <style>
          /* Reset */
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
            line-height: 1.6; 
            color: #374151; 
            margin: 0; 
            padding: 0; 
            background-color: #f9fafb; 
          }
          
          /* Container */
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          
          /* Header */
          .header { 
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); 
            color: white; 
            padding: 48px 32px; 
            text-align: center; 
            position: relative;
          }
          /* Fallback background for clients that don't support gradients well */
          .header { background-color: #1e3a8a; }

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
          
          /* Content */
          .content { 
            padding: 48px 32px; 
          }
          
          /* Confirmation Card */
          .confirmation-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 32px;
            text-align: center;
          }
          
          /* Icon - Fixed centering and shape using block/line-height instead of flex */
          .confirmation-icon {
            width: 64px;
            height: 64px;
            line-height: 64px; /* Vertically center text */
            background-color: #3b82f6; /* Solid color fallback */
            border-radius: 50%;
            display: inline-block; /* Better structure */
            text-align: center; /* Horizontally center text */
            margin: 0 auto 24px auto;
            color: white;
            font-size: 28px;
            /* Ensure it doesn't get squashed */
            min-width: 64px;
            min-height: 64px;
          }
          
          /* Order Info */
          .order-info {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
          }
          .order-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
          }
          .order-detail {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 4px;
          }
          
          /* Next Steps */
          .next-steps {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
          }
          .next-steps h3 {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
          }
          
          /* Step Item - Table-like layout for better alignment */
          .step-item {
            margin-bottom: 12px;
            padding: 12px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 3px solid #3b82f6;
          }
          .step-table {
            width: 100%;
            border-collapse: collapse;
          }
          .step-number-cell {
            width: 40px;
            vertical-align: top;
          }
          
          /* Step Number - Fixed centering */
          .step-number {
            background: #3b82f6;
            color: white;
            width: 24px;
            height: 24px;
            line-height: 24px; /* Vertically center */
            border-radius: 50%;
            display: inline-block;
            text-align: center; /* Horizontally center */
            font-size: 12px;
            font-weight: 600;
          }
          
          .step-content-cell {
            vertical-align: top;
            color: #374151;
            font-size: 14px;
            line-height: 1.5;
          }
          
          /* Delivery Info */
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
          
          /* Footer */
          .footer { 
            background: #f8fafc; 
            padding: 32px; 
            text-align: center; 
            border-top: 1px solid #e5e7eb;
          }
          .footer-content h3 { 
            color: #1f2937; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 8px; 
          }
          .footer-content p { 
            color: #6b7280; 
            font-size: 14px; 
            margin-bottom: 16px; 
          }
          
          /* Contact Info - Stacked layout */
          .contact-info { 
            margin-bottom: 24px; 
          }
          .contact-link-wrapper {
            margin-bottom: 8px;
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
            line-height: 1.5; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="header-title">Order Confirmed!</h1>
            <p class="header-subtitle">Thank you for your purchase</p>
          </div>
          
          <div class="content">
            <div class="confirmation-card">
              <!-- Using a span for the icon with explicit block display and dimensions -->
              <span class="confirmation-icon">📦</span>
              <h2 style="font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 16px;">Your order has been received</h2>
              <p style="color: #6b7280; font-size: 16px;">We're preparing your item with care and attention to detail.</p>
            </div>

            <div class="order-info">
              <div class="order-title">${productName}</div>
              <div class="order-detail">Shipping to: ${customerAddress}</div>
              <div class="order-detail">Order confirmation sent to: ${customerEmail}</div>
            </div>

            <div class="next-steps">
              <h3>📋 What happens next?</h3>
              
              <!-- Using tables for steps to ensure alignment in all clients -->
              <div class="step-item">
                <table class="step-table" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="step-number-cell">
                      <span class="step-number">1</span>
                    </td>
                    <td class="step-content-cell">
                      Our team will carefully inspect and prepare your item for shipping
                    </td>
                  </tr>
                </table>
              </div>
              
              <div class="step-item">
                <table class="step-table" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="step-number-cell">
                      <span class="step-number">2</span>
                    </td>
                    <td class="step-content-cell">
                      You'll receive a shipping notification with tracking details within 2-3 business days
                    </td>
                  </tr>
                </table>
              </div>
              
              <div class="step-item">
                <table class="step-table" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="step-number-cell">
                      <span class="step-number">3</span>
                    </td>
                    <td class="step-content-cell">
                      Your package will be delivered within 3-5 business days after shipping
                    </td>
                  </tr>
                </table>
              </div>
            </div>

            <div class="delivery-info">
              <h3>📅 Delivery Information</h3>
              <p>We'll send you tracking information as soon as your order ships. All items receive extra care during our inspection process.</p>
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-content">
              <h3>Need Help?</h3>
              <p>If you have any questions about your order, our customer service team is here to help.</p>
              
              <div class="contact-info">
                <div class="contact-link-wrapper">
                  <a href="mailto:support@happydeel.com" class="contact-link">📧 Email Support</a>
                </div>
                <div class="contact-link-wrapper">
                  <a href="tel:+17176484487" class="contact-link">📞 +17176484487</a>
                </div>
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

    // Plain text version
    const textTemplate = `
      Order Confirmed!
      
      Thank you for your purchase, ${customerName}.
      
      Your order for "${productName}" has been received.
      
      Shipping To: ${customerAddress || 'Address not provided'}
      
      Questions? Email support@happydeel.com
      
      © 2024 HappyDeel. All rights reserved.
    `;

    // Email options
    const mailOptions = {
      from: `Happydeel <${account.user}>`,
      to: customerEmail,
      subject: `Order Confirmation - ${productName} 🎉`,
      html: htmlTemplate,
      text: textTemplate,
    };

    // Send email
    const startTime = Date.now();
    const info = await emailTransporter.sendMail(mailOptions);
    const endTime = Date.now();

    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log(`Email sent in ${endTime - startTime}ms`);

    res.status(200).json({
      success: true,
      message: 'Order confirmation email sent successfully!',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
}