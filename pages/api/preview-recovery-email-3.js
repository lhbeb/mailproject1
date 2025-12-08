import * as cheerio from 'cheerio';

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

  const { customerName, customerEmail, productName, productLink, checkoutUrl } = req.body;

  // Validate required fields
  if (!customerEmail || !checkoutUrl) {
    return res.status(400).json({
      error: 'Missing required fields: customerEmail, checkoutUrl'
    });
  }

  let productImage = null;

  // Fetch product image if link is provided
  if (productLink) {
    try {
      const response = await fetch(productLink);
      const html = await response.text();
      const $ = cheerio.load(html);

      // Try to find og:image
      productImage = $('meta[property="og:image"]').attr('content');

      // Fallback to twitter:image
      if (!productImage) {
        productImage = $('meta[name="twitter:image"]').attr('content');
      }

      // Fallback to first image on page
      if (!productImage) {
        const firstImg = $('img').first().attr('src');
        if (firstImg) {
          // Handle relative URLs
          if (firstImg.startsWith('http')) {
            productImage = firstImg;
          } else {
            const url = new URL(productLink);
            productImage = `${url.protocol}//${url.host}${firstImg.startsWith('/') ? '' : '/'}${firstImg}`;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching product image:', error);
      // Continue without image if fetching fails
    }
  }

  try {
    // HTML email template - HappyDeel Branded Design (Table-Based for iOS Support)
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no">
        <title>Last Chance - Your Item is Going Fast! - HappyDeel</title>
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
          body {
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.5;
            color: #1e293b;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          @media screen and (max-width: 600px) {
            .content-cell {
              padding: 20px !important;
            }
            .header h1 {
              font-size: 24px !important;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.5; color: #1e293b;">
        
        <!-- Wrapper Table -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
          <tr>
            <td align="center" style="padding: 20px 10px;">
              
              <!-- Main Container -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                
                <!-- Header -->
                <tr class="header">
                  <td style="background-color: #1e3a8a; padding: 40px 32px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 12px 0; line-height: 1.2;">
                      ⏰ Last chance! Your ${productName || 'item'} is almost gone
                    </h1>
                    <p style="color: #e0e7ff; font-size: 16px; margin: 0; line-height: 1.5; font-weight: 500;">
                      Only 1 left in stock - don't miss out!
                    </p>
                  </td>
                </tr>
                
                <!-- Content Section -->
                <tr>
                  <td class="content-cell" style="padding: 32px 24px;">
                    
                    <!-- Abandoned Item Card -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 16px; margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 32px; text-align: center;">
                          <!-- Product Image or Icon -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin: 0 auto 24px;">
                            <tr>
                              <td>
                                ${productImage ? `
                                  <img src="${productImage}" alt="${productName || 'Product'}" style="width: 200px; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: block;">
                                ` : `
                                  <div style="width: 64px; height: 64px; background: #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px;">🛒</div>
                                `}
                              </td>
                            </tr>
                          </table>
                          
                          <p style="color: #374151; font-size: 18px; line-height: 1.6; margin: 0 0 24px 0;">
                            ${customerName ? `${customerName},` : 'Hey there,'}<br><br>
                            This is your <strong>final reminder</strong> - the <strong>${productName || 'item'}</strong> in your cart is our last one in stock. We're holding it for you, but we can't guarantee it'll still be here in an hour.
                          </p>
                          
                          <p style="font-weight: 600; color: #1f2937; font-size: 18px; margin: 0 0 24px 0;">Secure it now before it's too late:</p>
                          
                          <!-- CTA Button -->
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
                            <tr>
                              <td style="background-color: #3b82f6; border-radius: 8px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);">
                                <a href="${checkoutUrl}" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px; background-color: #3b82f6; border: 1px solid #3b82f6;">
                                  <span style="color: #ffffff;">Secure My Item Now</span>
                                </a>
                              </td>
                            </tr>
                          </table>
                          
                        </td>
                      </tr>
                    </table>

                    <!-- Footer Info -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px; text-align: center;">
                      <tr>
                        <td style="color: #6b7280; font-size: 14px;">
                          <p style="margin: 0 0 8px 0;"><strong>Why HappyDeel?</strong></p>
                          <p style="margin: 0 0 16px 0;">We inspect every item to ensure quality. 30-day returns. Fast shipping.</p>
                          <p style="margin: 0; color: #6b7280; font-size: 14px;">
                            Questions? Reply here or <a href="https://wa.me/17176484487" style="color: #3b82f6; text-decoration: none;">WhatsApp +1-717-648-4487</a>.
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 32px 24px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <h3 style="color: #1f2937; font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">Need Help?</h3>
                    <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px 0;">If you have any questions about your order, our customer service team is here to help.</p>
                    
                    <!-- Contact Links - Stacked Vertically -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin-bottom: 24px;">
                      <tr>
                        <td style="padding: 8px 0;">
                          <a href="mailto:support@happydeel.com" style="color: #3b82f6; text-decoration: none; font-weight: 500; font-size: 14px; display: block;">📧 Email Support</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <a href="tel:+17176484487" style="color: #3b82f6; text-decoration: none; font-weight: 500; font-size: 14px; display: block;">📞 +17176484487</a>
                        </td>
                      </tr>
                    </table>
                    
                    <div style="color: #9ca3af; font-size: 12px; line-height: 1.5;">
                      © 2025 Customer Service. All rights reserved.<br>
                      Thank you for your business.
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

    // Return the HTML template
    return res.status(200).json({
      success: true,
      htmlContent: htmlTemplate,
      message: 'Abandoned checkout email preview generated successfully',
      data: {
        customerName,
        customerEmail,
        productName,
        productLink,
        checkoutUrl,
        productImage
      }
    });

  } catch (error) {
    console.error('Error generating abandoned checkout email preview:', error);
    return res.status(500).json({
      error: 'Failed to generate abandoned checkout email preview',
      details: error.message
    });
  }
}
