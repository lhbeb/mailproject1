import { getRandomAccount, createTransporter, getAccountByUser } from '../../src/config/emailAccounts';

// Reuse the transporter from the shipping email
// let transporter = null;

// Simple authentication check
function checkAuth(req) {
  const sessionCookie = req.headers.cookie?.split(';')
    .find(cookie => cookie.trim().startsWith('session='));

  if (!sessionCookie) {
    return false;
  }

  try {
    const sessionValue = sessionCookie.split('=')[1];
    // Basic JWT validation (same as shipping email)
    const parts = sessionValue.split('.');
    if (parts.length !== 3) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload.userId === '1234567890';
  } catch (error) {
    console.error('Auth validation error:', error);
    return false;
  }
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authentication bypassed for order confirmation emails
  // if (!checkAuth(req)) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  try {
    const { customerName, customerEmail, orderNumber, orderDate, items, subtotal, shipping, total, senderEmail } = req.body;

    // Validate required fields
    if (!customerEmail || !customerAddress || !productName) {
      return res.status(400).json({
        error: 'Missing required fields: customerEmail, customerAddress, and productName are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    console.log('=== SENDING ORDER CONFIRMATION EMAIL ===');
    console.log('Customer Email:', customerEmail);
    console.log('Email:', customerEmail);
    console.log('Product:', productName);

    // Get the email transporter
    const emailTransporter = getTransporter();

    // HTML email template - HappyDeel Branded with Modern Design
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - HappyDeel</title>
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
            background-color: #1e3a8a; 
            color: white; 
            padding: 48px 32px; 
            text-align: center; 
            position: relative;
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
          .confirmation-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 32px;
            margin-bottom: 32px;
            position: relative;
            overflow: hidden;
          }
          .order-info {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
          .next-steps {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 32px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }
          .next-steps h3 {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
          }
          .step-item-box {
            margin-bottom: 12px;
            padding: 12px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 3px solid #3b82f6;
          }
          .step-content {
            color: #374151;
            font-size: 14px;
            line-height: 1.5;
          }
          .delivery-info {
            background: #fef3c7;
            border: 1px solid #fcd34d;
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
          @media screen and (max-width: 480px) {
            .contact-item {
              display: block !important;
              width: 100% !important;
              max-width: 100% !important;
              padding: 8px 0 !important;
            }
            .content {
              padding: 32px 24px !important;
            }
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
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px;">
                <tr>
                  <td align="center" bgcolor="#3b82f6" style="width: 64px; height: 64px; line-height: 64px; font-size: 28px; color: #ffffff; border-radius: 32px;">
                    📦
                  </td>
                </tr>
              </table>
              <h2 style="text-align: center; font-size: 24px; font-weight: 600; color: #1f2937; margin-bottom: 16px;">Your order has been received</h2>
              <p style="text-align: center; color: #6b7280; font-size: 16px;">We're preparing your item with care and attention to detail.</p>
            </div>

            <div class="order-info">
              <div class="order-title">${productName}</div>
              <div class="order-detail">Shipping to: ${customerAddress}</div>
              <div class="order-detail">Order confirmation sent to: ${customerEmail}</div>
            </div>

            <div class="next-steps">
              <h3>📋 What happens next?</h3>
              <div class="step-item-box">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td valign="top" style="width: 36px; padding-right: 12px;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" bgcolor="#3b82f6" style="width: 24px; height: 24px; line-height: 24px; font-size: 12px; font-weight: 600; color: #ffffff; border-radius: 12px;">
                            1
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle" class="step-content">
                      Our team will carefully inspect and prepare your item for shipping
                    </td>
                  </tr>
                </table>
              </div>
              <div class="step-item-box">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td valign="top" style="width: 36px; padding-right: 12px;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" bgcolor="#3b82f6" style="width: 24px; height: 24px; line-height: 24px; font-size: 12px; font-weight: 600; color: #ffffff; border-radius: 12px;">
                            2
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle" class="step-content">
                      You'll receive a shipping notification with tracking details within 2-3 business days
                    </td>
                  </tr>
                </table>
              </div>
              <div class="step-item-box">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td valign="top" style="width: 36px; padding-right: 12px;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" bgcolor="#3b82f6" style="width: 24px; height: 24px; line-height: 24px; font-size: 12px; font-weight: 600; color: #ffffff; border-radius: 12px;">
                            3
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td valign="middle" class="step-content">
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
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <!--[if mso]>
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center">
                    <tr>
                    <td align="center" width="220" style="padding: 0 10px;">
                    <![endif]-->
                    <div class="contact-item" style="display: inline-block; width: 100%; max-width: 220px; vertical-align: top;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" style="padding: 5px;">
                            <a href="mailto:support@happydeel.com" class="contact-link" style="display: inline-block;">
                              <span style="vertical-align: middle;">📧</span> Email Support
                            </a>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <!--[if mso]>
                    </td>
                    <td align="center" width="220" style="padding: 0 10px;">
                    <![endif]-->
                    <div class="contact-item" style="display: inline-block; width: 100%; max-width: 220px; vertical-align: top;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" style="padding: 5px;">
                            <a href="tel:+17176484487" class="contact-link" style="display: inline-block;">
                              <span style="vertical-align: middle;">📞</span> +17176484487
                            </a>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <!--[if mso]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->
                  </td>
                </tr>
              </table>
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
      
      Thank you for your purchase.
      
      Your order for "${productName}" has been received. We're preparing your item with care and attention to detail.
      
      Shipping to: ${customerAddress}
      Order confirmation sent to: ${customerEmail}
      
      What happens next?
      1. Our team will carefully inspect and prepare your item for shipping.
      2. You'll receive a shipping notification with tracking details within 2-3 business days.
      3. Your package will be delivered within 3-5 business days after shipping.
      
      Delivery Information:
      We'll send you tracking information as soon as your order ships. All items receive extra care during our inspection process.
      
      Need Help?
      If you have any questions about your order, our customer service team is here to help.
      Email Support: support@happydeel.com
      Phone: +17176484487
      
      © 2024 HappyDeel. All rights reserved.
      The smart way to buy quality items — for less.
    `;

    // Email options
    const mailOptions = {
      from: `"Happydeel" <${emailTransporter.transporter.options.auth.user}>`,
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