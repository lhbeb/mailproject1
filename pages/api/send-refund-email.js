import { getRandomAccount, createTransporter, getAccountByUser } from '../../src/config/emailAccounts';

// Reuse the transporter from other email endpoints
// let transporter = null;

// function getTransporter() {
//   if (!transporter) {
//     transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true, // Use SSL
//       pool: true, // Use connection pooling
//       maxConnections: 5, // Maximum concurrent connections
//       maxMessages: 100, // Maximum messages per connection
//       auth: {
//         user: 'contacthappydeel@gmail.com',
//         pass: 'pqdc drxx ltlo xapr',
//       },
//     });
//   }
//   return transporter;
// }

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
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authentication bypassed for refund emails

  try {
    const { customerEmail, customerName, productName, refundAmount, senderEmail } = req.body;

    // Validate required fields
    if (!customerEmail || !customerName || !productName || !refundAmount) {
      return res.status(400).json({
        error: 'Missing required fields: customerEmail, customerName, productName, and refundAmount are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate refund amount
    const amount = parseFloat(refundAmount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid refund amount' });
    }

    console.log('=== SENDING REFUND CONFIRMATION EMAIL ===');
    console.log('Customer Email:', customerEmail);
    console.log('Product:', productName);
    console.log('Refund Amount:', `$${amount.toFixed(2)}`);

    // Get the email transporter
    // const emailTransporter = getTransporter();
    let account;
    if (senderEmail) {
      account = getAccountByUser(senderEmail);
      if (!account) {
        console.warn(`Requested sender email ${senderEmail} not found. Falling back to random account.`);
        account = getRandomAccount();
      } else {
        console.log(`Using manually selected email account: ${account.user}`);
      }
    } else {
      account = getRandomAccount();
      console.log(`Using randomly selected email account: ${account.user}`);
    }
    const emailTransporter = createTransporter(account);

    // HTML email template - Redesigned based on design guidelines
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Refund Confirmation</title>
        <style>
          @media screen and (max-width: 600px) {
            .content-cell {
              padding: 20px !important;
            }
            .header h1 {
              font-size: 24px !important;
            }
            .detail-row-label, .detail-row-value {
              display: block !important;
              width: 100% !important;
              text-align: left !important;
              padding-bottom: 8px !important;
            }
            .detail-row-value {
              padding-bottom: 16px !important;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #374151;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="padding: 20px 0; background-color: #f5f5f5;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
                <!-- Header -->
                <tr class="header">
                  <td style="background-color: #1e3a8a; color: white; padding: 48px 32px; text-align: center;">
                    <h1 style="font-size: 32px; font-weight: 700; margin-bottom: 8px;">Refund Processed</h1>
                  </td>
                </tr>
                <!-- Main Content -->
                <tr>
                  <td class="content-cell" style="padding: 48px 32px;">
                    <p style="font-size: 18px; margin-bottom: 32px; color: #374151;">Dear ${customerName},</p>
                    
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: white; border: 1px solid #e5e7eb; border-radius: 20px; padding: 40px; margin-bottom: 32px;">
                      <tr>
                        <td align="center">
                          <div style="width: 80px; height: 80px; background-color: #10b981; border-radius: 50%; display: table; margin: 0 auto 32px;">
                            <span style="display: table-cell; vertical-align: middle; text-align: center; color: white; font-size: 32px; font-weight: bold;">✓</span>
                          </div>
                          <h2 style="font-size: 28px; font-weight: 600; color: #1f2937; text-align: center; margin-bottom: 12px;">Your Order Has Been Successfully Refunded</h2>
                          <p style="font-size: 16px; color: #6b7280; text-align: center; margin-bottom: 32px;">We have processed a full refund for your order. The refund amount will appear in your original payment method.</p>
                          
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; text-align: center;">
                            <tr>
                              <td>
                                <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px; font-weight: 500;">Full Refund Amount</div>
                                <div style="font-size: 32px; font-weight: 700; color: #1e3a8a;">$${amount.toFixed(2)}</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                      <tr>
                        <td>
                          <h3 style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">Refund Details</h3>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td class="detail-row-label" width="150" style="color: #6b7280; font-size: 14px; font-weight: 500; padding: 8px 0;">Product</td>
                              <td class="detail-row-value" style="color: #1f2937; font-weight: 600; text-align: right; word-break: break-word;">${productName}</td>
                            </tr>
                            <tr>
                              <td class="detail-row-label" width="150" style="color: #6b7280; font-size: 14px; font-weight: 500; padding: 8px 0;">Customer Email</td>
                              <td class="detail-row-value" style="color: #1f2937; font-weight: 600; text-align: right; word-break: break-word;">${customerEmail}</td>
                            </tr>
                            <tr>
                              <td class="detail-row-label" width="150" style="color: #6b7280; font-size: 14px; font-weight: 500; padding: 8px 0;">Refund Amount</td>
                              <td class="detail-row-value" style="color: #1e3a8a; font-weight: 700; text-align: right;">$${amount.toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td class="detail-row-label" width="150" style="color: #6b7280; font-size: 14px; font-weight: 500; padding: 8px 0;">Status</td>
                              <td class="detail-row-value" style="color: #3b82f6; font-weight: 700; text-align: right;">Processed</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background: #e0f2fe; border: 1px solid #3b82f6; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                      <tr>
                        <td>
                          <h3 style="color: #1e3a8a; font-size: 18px; font-weight: 600; margin-bottom: 20px;">What happens next?</h3>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="padding-bottom: 16px;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td width="28" style="vertical-align: top;">
                                      <div style="width: 28px; height: 28px; background-color: #fbbf24; color: #000000; border-radius: 50%; text-align: center; line-height: 28px; font-size: 12px; font-weight: 700;">1</div>
                                    </td>
                                    <td style="padding-left: 12px; color: #1e3a8a; font-size: 14px; line-height: 1.5;">Your full refund has been processed by our team</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-bottom: 16px;">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td width="28" style="vertical-align: top;">
                                      <div style="width: 28px; height: 28px; background-color: #fbbf24; color: #000000; border-radius: 50%; text-align: center; line-height: 28px; font-size: 12px; font-weight: 700;">2</div>
                                    </td>
                                    <td style="padding-left: 12px; color: #1e3a8a; font-size: 14px; line-height: 1.5;">The full refund amount will appear in your original payment method within 3-5 business days</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                                  <tr>
                                    <td width="28" style="vertical-align: top;">
                                      <div style="width: 28px; height: 28px; background-color: #fbbf24; color: #000000; border-radius: 50%; text-align: center; line-height: 28px; font-size: 12px; font-weight: 700;">3</div>
                                    </td>
                                    <td style="padding-left: 12px; color: #1e3a8a; font-size: 14px; line-height: 1.5;">You'll see the transaction reflected in your account statement</td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <h3 style="color: #374151; font-size: 18px; font-weight: 600; margin-bottom: 16px;">Need Help?</h3>
                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">If you have any questions about your refund, our customer service team is here to help.</p>
                    <p style="margin-bottom: 16px;"><a href="mailto:support@happydeel.com" style="color: #3b82f6; text-decoration: none; font-weight: 500; font-size: 14px;">📧 Email Support</a></p>
                    <p style="margin-bottom: 16px;"><a href="tel:+17176484487" style="color: #3b82f6; text-decoration: none; font-weight: 500; font-size: 14px;">📞 +17176484487</a></p>
                    <p style="color: #9ca3af; font-size: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">© 2024 HappyDeel. All rights reserved.<br>The smart way to buy quality items — for less.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Send the email
    const mailOptions = {
      from: `"HappyDeel" <${account.user}>`,
      to: customerEmail,
      subject: 'Your Refund Has Been Processed',
      html: htmlTemplate,
      text: `
        Your Order Has Been Successfully Refunded
        
        Dear ${customerName},
        
        Great news! Your order has been successfully refunded with a full refund.
        
        Refund Details:
        - Product: ${productName}
        - Full Refund Amount: ${amount.toFixed(2)}
        - Status: Processed
        
        What happens next:
        1. Your full refund has been processed by our team
        2. The full refund amount will appear in your original payment method within 3-5 business days
        3. You'll see the transaction reflected in your account statement
        
        If you have any questions, please contact us:
        Email: support@happydeel.com
        Phone: +17176484487
        
        Thank you for your business!
        
        This email was sent to ${customerEmail}
      `
    };

    // Send the email
    const info = await emailTransporter.sendMail(mailOptions);

    console.log('✅ Refund email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Refund confirmation email sent successfully',
      data: {
        customerEmail,
        productName,
        refundAmount: `${amount.toFixed(2)}`,
        messageId: info.messageId,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error sending refund email:', error);

    // Return error response
    res.status(500).json({
      success: false,
      error: 'Failed to send refund confirmation email',
      details: error.message
    });
  }
}