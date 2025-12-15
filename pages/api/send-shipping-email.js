import { getRandomAccount, createTransporter, getAccountByUser } from '../../src/config/emailAccounts';

// Create a persistent SMTP transporter (connection pool)
// Note: With multiple accounts, we might want to create a pool per account or just create fresh connections.
// For simplicity and rotation, we'll create a fresh connection per request or maintain a map.
// However, to keep it simple and robust for now, we will create a new transporter for each request 
// based on the selected account. Connection pooling is less effective if we rotate constantly, 
// but we can optimize later if volume is huge.

// function getTransporter() {
//   const account = getRandomAccount();
//   console.log(`Selected email account: ${account.user}`);
//   return createTransporter(account);
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
  // Authentication bypassed for shipping emails
  // const authResult = checkAuth(req);
  // if (!authResult.authenticated) {
  //   return res.status(401).json({ error: 'Authentication required', details: authResult.error });
  // }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerEmail, customerAddress, productName, trackingNumber, senderEmail } = req.body;

  // Validate required fields
  if (!customerEmail || !customerAddress || !productName || !trackingNumber) {
    return res.status(400).json({
      error: 'Missing required fields: customerEmail, customerAddress, productName, and trackingNumber are required'
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customerEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate tracking number length
  if (trackingNumber.length > 22) {
    return res.status(400).json({ error: 'Tracking number cannot exceed 22 characters' });
  }

  try {
    // Debug: Log environment variables (without exposing the password)
    // console.log('Gmail User:', 'contacthappydeel@gmail.com'); // Removed hardcoded log


    // Get the persistent transporter (no need to verify each time)
    // const emailTransporter = getTransporter();

    // Determine which account to use
    let account = null;
    if (senderEmail) {
      account = getAccountByUser(senderEmail);
    }

    // Fallback to random account if specific one not found or not requested
    if (!account) {
      account = getRandomAccount();
    }

    console.log(`Selected email account: ${account.user}`);
    const emailTransporter = createTransporter(account);

    // Generate FedEx tracking URL
    const trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;

    // HTML email template - HappyDeel Branded Design (Fully Responsive)
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no">
        <title>Your Order Has Shipped - HappyDeel</title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
        <style>
          @media screen and (max-width: 600px) {
            .content-cell {
              padding: 20px !important;
            }
            .header h1 {
              font-size: 24px !important;
            }
            .product-box {
              display: block !important;
              width: 100% !important;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.5; color: #1e293b; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        
        <!-- Wrapper Table for Email Client Compatibility -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
          <tr>
            <td align="center" style="padding: 20px 10px;">
              
              <!-- Main Container -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                
                <!-- Header -->
                <tr class="header">
                  <td style="background-color: #1e3a8a; padding: 40px 32px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0 0 12px 0; line-height: 1.2;">
                      🚀 Your Order Has Shipped!
                    </h1>
                    <p style="color: #e0e7ff; font-size: 16px; margin: 0; line-height: 1.5; font-weight: 500;">
                      Your item is on its way — expertly inspected and ready for you
                    </p>
                  </td>
                </tr>
                
                <!-- Content Section -->
                <tr>
                  <td class="content-cell" style="padding: 32px 24px;">
                    
                    <!-- Status Indicator -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 16px 20px; background-color: #ecfdf5; border-radius: 12px; border: 1px solid #bbf7d0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="width: 20px; vertical-align: middle;">
                                <div style="width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; display: inline-block;"></div>
                              </td>
                              <td style="vertical-align: middle;">
                                <div style="color: #047857; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">SHIPPED</div>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Description -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 24px;">
                      <tr>
                        <td style="color: #475569; font-size: 16px; line-height: 1.6; text-align: left;">
                          Your carefully inspected item is now on its way. We've ensured it meets our rigorous quality standards.
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Order Card -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; margin: 24px 0;">
                      
                      <!-- Product Section -->
                      <tr>
                        <td style="padding: 24px;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td class="product-box" style="width: 80px; vertical-align: top; padding-right: 20px;">
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 64px; height: 64px; background-color: #3b82f6; border-radius: 12px;">
                                  <tr>
                                    <td style="text-align: center; vertical-align: middle; font-size: 28px; color: #ffffff; line-height: 1;">📦</td>
                                  </tr>
                                </table>
                              </td>
                              <td class="product-box" style="vertical-align: top;">
                                <h3 style="color: #1e293b; font-size: 18px; font-weight: 600; margin: 0 0 8px 0; line-height: 1.4;">${productName}</h3>
                                <p style="color: #64748b; font-size: 14px; margin: 0; line-height: 1.4;">Premium Quality • Expertly Inspected • Fast Shipping</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      
                      <!-- Divider -->
                      <tr>
                        <td style="padding: 0 24px;">
                          <div style="height: 1px; background-color: #e2e8f0; margin: 0;"></div>
                        </td>
                      </tr>
                      
                      <!-- Details Grid - Stacked for Better Mobile Support -->
                      <tr>
                        <td style="padding: 24px;">
                          
                          <!-- Delivery Email Card -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
                            <tr>
                              <td style="padding: 20px;">
                                <div style="color: #3b82f6; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Delivery Email</div>
                                <div style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0; word-break: break-all;">
                                  ${customerEmail}
                                </div>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Status Card -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
                            <tr>
                              <td style="padding: 20px;">
                                <div style="color: #3b82f6; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Status</div>
                                <div style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0;">
                                  In Transit<br>
                                  3-7 Business Days
                                </div>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Delivery Address Card -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <tr>
                              <td style="padding: 20px;">
                                <div style="color: #3b82f6; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">Delivery Address</div>
                                <div style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0;">
                                  ${customerAddress}
                                </div>
                              </td>
                            </tr>
                          </table>
                          
                          </td>
                      </tr>
                      
                    </table>
                    
                    <!-- Tracking Card -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #dbeafe; border-radius: 16px; border: 1px solid #93c5fd; margin: 32px 0;">
                      <tr>
                        <td style="padding: 28px 24px; text-align: center;">
                          <h3 style="color: #1e40af; font-size: 20px; font-weight: 700; margin: 0 0 8px 0;">🚚 Track Your Package</h3>
                          <p style="color: #475569; font-size: 16px; margin: 0 0 20px 0;">Your package is on its way!</p>
                          
                          <!-- Tracking Number -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 16px 0;">
                            <tr>
                              <td style="background-color: #ffffff; color: #1e293b; padding: 16px; border-radius: 8px; font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace; font-size: 16px; font-weight: 600; border: 1px solid #cbd5e1; letter-spacing: 1px; text-align: center; word-break: break-all;">
                                ${trackingNumber}
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Track Package Button -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px auto 0 auto;">
                            <tr>
                              <td style="background-color: #dc2626; border-radius: 8px; text-align: center;">
                                <a href="${trackingUrl}" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">Track Package</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Closing Message -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                      <tr>
                        <td style="color: #475569; font-size: 16px; line-height: 1.6; text-align: left;">
                          We take the risk out of used gear with expert inspection and reliable service on every order. Questions about your order? Our support team is here to help. Thank you for choosing <strong>HappyDeel</strong>!
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #1e3a8a; padding: 32px 24px; text-align: center;">
                    <div style="color: #e0e7ff; font-size: 16px; margin: 0 0 20px 0; font-weight: 500;">The smart way to buy quality items — for less.</div>
                    
                    <!-- Footer Links -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 20px auto;">
                      <tr>
                        <td style="padding: 0 12px;">
                          <a href="https://www.happydeel.com/contact" style="color: #a5b4fc; text-decoration: none; font-size: 14px; font-weight: 500;">Support</a>
                        </td>
                        <td style="padding: 0 12px;">
                          <a href="https://www.happydeel.com/track" style="color: #a5b4fc; text-decoration: none; font-size: 14px; font-weight: 500;">Track Orders</a>
                        </td>
                        <td style="padding: 0 12px;">
                          <a href="https://www.happydeel.com/return-policy" style="color: #a5b4fc; text-decoration: none; font-size: 14px; font-weight: 500;">Returns</a>
                        </td>
                      </tr>
                    </table>
                    
                    <div style="color: #a5b4fc; font-size: 12px; margin-top: 24px; line-height: 1.4;">
                      This email was sent to ${customerEmail}<br>
                      © 2024 HappyDeel. All rights reserved.
                    </div>
                  </td>
                </tr>
                
              </table>
              
            </td>
          </tr>
        </table>
        
      </body>
      </html>
    `;

    // Plain text version for email clients that don't support HTML
    const textTemplate = `
      HappyDeel - Your Order Has Shipped!
      
      The smart way to buy premium tech, cameras, and bikes — for less.
      
      SHIPPED - Your item is on its way — expertly inspected and ready for you.
      
      Order Details:
      Product: ${productName}
      Delivery Email: ${customerEmail}
      Delivery Address: ${customerAddress}
      Status: In Transit (3-7 Business Days)
      
      Tracking Information:
      Your package is on its way!
      Tracking Number: ${trackingNumber}
      Track your package: ${trackingUrl}
      
      Questions about your order? Our support team is here to help. Thank you for choosing Happydeel.
      
      ---
      Happydeel - The smart way to buy quality items for less
      
      This email was sent to ${customerEmail}
      Happydeel • Premium Pre-Owned Technology
    `;

    // Email options
    const mailOptions = {
      from: `"Happydeel" <${account.user}>`,
      to: customerEmail,
      subject: `Your Order Has Shipped! 📦 - ${productName}`,
      text: textTemplate,
      html: htmlTemplate,
    };

    // Send email
    const info = await emailTransporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    return res.status(200).json({
      success: true,
      message: 'Shipping confirmation email sent successfully!',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Detailed error information:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);

    // Return appropriate error message
    if (error.code === 'EAUTH') {
      return res.status(500).json({
        error: 'Email authentication failed. Please check your Gmail credentials.',
        details: error.message
      });
    } else if (error.code === 'ECONNECTION') {
      return res.status(500).json({
        error: 'Failed to connect to Gmail SMTP server. Please check your internet connection.',
        details: error.message
      });
    } else {
      return res.status(500).json({
        error: 'Failed to send email. Please try again later.',
        details: error.message
      });
    }
  }
}