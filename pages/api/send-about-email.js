import { getRandomAccount, createTransporter, getAccountByUser } from '../../src/config/emailAccounts';

// Reuse the transporter
// let transporter = null;

// function getTransporter() {
//   if (!transporter) {
//     transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true,
//       auth: {
//         user: 'contacthappydeel@gmail.com',
//         pass: 'pqdc drxx ltlo xapr',
//       },
//     });
//   }
//   return transporter;
// }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerEmail, senderEmail } = req.body;

    // Validate required fields
    if (!customerEmail) {
      return res.status(400).json({
        error: 'Missing required field: customerEmail'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    console.log('=== SENDING ABOUT HAPPYDEEL EMAIL ===');
    console.log('Customer Email:', customerEmail);
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

    // Comprehensive About HappyDeel HTML Template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no">
        <title>✨ How do we keep our prices low? 🛍️</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          
          /* Mobile Responsive Styles - AGGRESSIVE OVERRIDES */
          @media only screen and (max-width: 600px) {
            /* Force larger base font size */
            body {
              font-size: 17px !important;
            }
            
            /* Override ALL paragraph and text elements */
            p, span, div, td, li, a {
              font-size: 17px !important;
              line-height: 1.7 !important;
            }
            
            /* Force larger headings */
            h1, h1 * {
              font-size: 28px !important;
              line-height: 1.3 !important;
            }
            
            h2, h2 * {
              font-size: 24px !important;
              line-height: 1.3 !important;
            }
            
            h3, h3 * {
              font-size: 20px !important;
              line-height: 1.4 !important;
            }
            
            /* Force strong/bold text to be larger */
            strong, b {
              font-size: 17px !important;
            }
            
            /* Adjust padding for mobile */
            .content-cell {
              padding: 24px 16px !important;
            }
            
            /* Make tables full width on mobile */
            .mobile-full-width {
              width: 100% !important;
              max-width: 100% !important;
            }
            
            /* Stack stat boxes vertically on mobile */
            .stat-box {
              display: block !important;
              width: 100% !important;
              margin-bottom: 12px !important;
            }
            
            /* Larger buttons on mobile */
            .cta-button, a[style*="background-color"] {
              padding: 18px 28px !important;
              font-size: 18px !important;
            }
            
            /* Icon sizes */
            .icon-text {
              font-size: 20px !important;
            }
            
            /* Force minimum font size on ALL elements */
            * {
              min-width: 0 !important;
            }
            
            /* Specific overrides for small text */
            [style*="font-size: 12px"],
            [style*="font-size: 13px"],
            [style*="font-size: 16px"],
            [style*="font-size: 17px"] {
              font-size: 17px !important;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8f9fa;">
        
        <!-- Wrapper Table -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8f9fa;">
          <tr>
            <td align="center" style="padding: 20px 10px;">
              
              <!-- Main Container -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 650px; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #ffffff; padding: 48px 32px; text-align: center; border-bottom: 1px solid #f1f5f9;">
                    <div style="display: inline-block; margin-bottom: 24px;">
                      <img src="cid:happydeellogo" alt="HappyDeel" width="180" style="display: block; border: 0; max-width: 100%; height: auto;">
                    </div>
                    
                  </td>
                </tr>


              
                <!-- Headline Question -->
                <tr>
                  <td style="padding: 24px 32px; text-align: center; background-color: #1e3a8a;">
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0;">
                      How do we keep our prices low?
                    </h1>
                  </td>
                </tr>
                
                <!-- Welcome Section -->
                <tr>
                  <td class="content-cell" style="padding: 40px 32px;">
                    <p style="color: #374151; font-size: 18px; line-height: 1.8; margin: 0 0 20px 0;">
                      Hello,<br><br>
                      Premium products below retail. Here's how we do it.
                    </p>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px; margin: 24px 0;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="color: #1e40af; font-size: 18px; font-weight: 600; margin: 0 0 8px 0;">Our Mission</p>
                          <p style="color: #1e3a8a; font-size: 18px; margin: 0; line-height: 1.6;">
                            Make premium products accessible to everyone without inflated retail costs.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <div style="text-align: center; margin: 32px 0;">
                      <a href="https://www.happydeel.com" style="background-color: #3b82f6; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 18px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5);">
                        Visit HappyDeel
                      </a>
                    </div>
                  </td>
                </tr>
                
                <!-- How We Keep Prices Low -->
                <tr>
                  <td style="padding: 0 32px 32px 32px;">
                    <h2 style="color: #1e3a8a; font-size: 24px; font-weight: 700; margin: 0 0 24px 0; text-align: center;">
                      How We Keep Prices Low
                    </h2>
                    
                    <p style="color: #374151; font-size: 17px; line-height: 1.7; margin: 0 0 24px 0; text-align: center;">
                      Our prices are often <strong>30-50% below normal retail</strong> because of how we source products:
                    </p>
                    
                    <!-- Strategy 1 -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                      <tr>
                        <td style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="width: 40px; vertical-align: top;">
                                <div style="width: 32px; height: 32px; background-color: #3b82f6; border-radius: 50%; text-align: center; line-height: 32px; color: #ffffff; font-weight: 700; font-size: 18px;">1</div>
                              </td>
                              <td style="vertical-align: top;">
                                <h3 style="color: #1e3a8a; font-size: 17px; font-weight: 600; margin: 0 0 8px 0;">Daily wins in online auctions</h3>
                                <p style="color: #64748b; font-size: 16px; margin: 0; line-height: 1.6;">We participate in high-volume auctions across multiple platforms. Buying in bulk before items reach regular marketplaces lets us secure lower costs and pass those savings on to you.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Strategy 2 -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                      <tr>
                        <td style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="width: 40px; vertical-align: top;">
                                <div style="width: 32px; height: 32px; background-color: #3b82f6; border-radius: 50%; text-align: center; line-height: 32px; color: #ffffff; font-weight: 700; font-size: 18px;">2</div>
                              </td>
                              <td style="vertical-align: top;">
                                <h3 style="color: #1e3a8a; font-size: 17px; font-weight: 600; margin: 0 0 8px 0;">Direct deals across online marketplaces</h3>
                                <p style="color: #64748b; font-size: 16px; margin: 0; line-height: 1.6;">Our team searches Facebook Marketplace, OfferUp, eBay, Kleinanzeigen, and other platforms. By negotiating directly with private sellers, we consistently find high-value deals.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Strategy 3 -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                      <tr>
                        <td style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="width: 40px; vertical-align: top;">
                                <div style="width: 32px; height: 32px; background-color: #3b82f6; border-radius: 50%; text-align: center; line-height: 32px; color: #ffffff; font-weight: 700; font-size: 18px;">3</div>
                              </td>
                              <td style="vertical-align: top;">
                                <h3 style="color: #1e3a8a; font-size: 17px; font-weight: 600; margin: 0 0 8px 0;">Partnerships with major retailers’ return & liquidation departments</h3>
                                <p style="color: #64748b; font-size: 16px; margin: 0 0 8px 0; line-height: 1.6;">We purchase overstock, open-box items, shelf pulls, refurbished pieces, and customer returns from companies such as Amazon, Best Buy, Target, and others.</p>
                                <p style="color: #1e3a8a; font-size: 13px; margin: 0; font-weight: 600;">Every item is inspected, tested, cleaned, or refurbished before being listed.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Strategy 4 -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                      <tr>
                        <td style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="width: 40px; vertical-align: top;">
                                <div style="width: 32px; height: 32px; background-color: #3b82f6; border-radius: 50%; text-align: center; line-height: 32px; color: #ffffff; font-weight: 700; font-size: 18px;">4</div>
                              </td>
                              <td style="vertical-align: top;">
                                <h3 style="color: #1e3a8a; font-size: 17px; font-weight: 600; margin: 0 0 8px 0;">Local deal hunting</h3>
                                <p style="color: #64748b; font-size: 16px; margin: 0; line-height: 1.6;">We regularly visit auctions, garage sales, estate sales, wholesalers, and liquidation centers. This helps us find items you often won’t see in traditional stores.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Strategy 5 -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 20px;">
                      <tr>
                        <td style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="width: 40px; vertical-align: top;">
                                <div style="width: 32px; height: 32px; background-color: #3b82f6; border-radius: 50%; text-align: center; line-height: 32px; color: #ffffff; font-weight: 700; font-size: 18px;">5</div>
                              </td>
                              <td style="vertical-align: top;">
                                <h3 style="color: #1e3a8a; font-size: 17px; font-weight: 600; margin: 0 0 8px 0;">Fair margins, fast turnover</h3>
                                <p style="color: #64748b; font-size: 16px; margin: 0; line-height: 1.6;">Instead of adding heavy markups, we focus on reasonable pricing and steady rotation of inventory.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Private Seller Network -->
                <tr>
                  <td style="padding: 0 32px 32px 32px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                      <tr>
                        <td style="padding: 32px;">
                          <h2 style="color: #1e3a8a; font-size: 22px; font-weight: 700; margin: 0 0 16px 0;">
                            🤝 A Recent Addition: Approved Private Sellers
                          </h2>
                          <p style="color: #374151; font-size: 17px; line-height: 1.7; margin: 0 0 16px 0;">
                            We’ve expanded our sourcing model with a small network of private sellers who share our commitment to quality.
                          </p>
                          <p style="color: #374151; font-size: 17px; line-height: 1.7; margin: 0 0 16px 0;">
                            They ship their items to our warehouse, where our inspection team performs a complete check:
                          </p>
                          <ul style="color: #1e3a8a; font-size: 16px; margin: 0 0 16px 20px; padding: 0;">
                            <li style="margin-bottom: 8px;">✓ Authentic condition</li>
                            <li style="margin-bottom: 8px;">✓ Full functionality</li>
                            <li style="margin-bottom: 8px;">✓ Pricing aligned with real market value</li>
                          </ul>
                          <p style="color: #374151; font-size: 17px; line-height: 1.7; margin: 0;">
                            <strong>Only after passing inspection does a product go live on our site.</strong>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- What Makes Us Different -->
                <tr>
                  <td style="padding: 0 32px 32px 32px;">
                    <h2 style="color: #1e3a8a; font-size: 24px; font-weight: 700; margin: 0 0 24px 0; text-align: center;">
                      What Makes Us Different
                    </h2>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 16px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="width: 30px; vertical-align: top; padding-right: 12px;">
                                <span style="font-size: 20px;">✨</span>
                              </td>
                              <td>
                                <h3 style="color: #1e3a8a; font-size: 18px; font-weight: 600; margin: 0 0 4px 0;">Curated Inventory</h3>
                                <p style="color: #64748b; font-size: 16px; margin: 0; line-height: 1.6;">Every product goes through a full inspection before shipping.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="width: 30px; vertical-align: top; padding-right: 12px;">
                                <span style="font-size: 20px;">📋</span>
                              </td>
                              <td>
                                <h3 style="color: #1e3a8a; font-size: 18px; font-weight: 600; margin: 0 0 4px 0;">Clear Product Details</h3>
                                <p style="color: #64748b; font-size: 16px; margin: 0; line-height: 1.6;">We always specify whether an item is new, open box, refurbished, or pre-owned.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="width: 30px; vertical-align: top; padding-right: 12px;">
                                <span style="font-size: 20px;">💎</span>
                              </td>
                              <td>
                                <h3 style="color: #1e3a8a; font-size: 18px; font-weight: 600; margin: 0 0 4px 0;">Great Value</h3>
                                <p style="color: #64748b; font-size: 16px; margin: 0; line-height: 1.6;">We constantly compare and track market prices to make sure listings offer real savings.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="width: 30px; vertical-align: top; padding-right: 12px;">
                                <span style="font-size: 20px;">🎯</span>
                              </td>
                              <td>
                                <h3 style="color: #1e3a8a; font-size: 18px; font-weight: 600; margin: 0 0 4px 0;">Customer Support</h3>
                                <p style="color: #64748b; font-size: 16px; margin: 0; line-height: 1.6;">Fast, free shipping within the U.S. and Canada, a 30-day return policy, and responsive human support.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 16px 0;">
                          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                            <tr>
                              <td style="width: 30px; vertical-align: top; padding-right: 12px;">
                                <span style="font-size: 20px;">♻️</span>
                              </td>
                              <td>
                                <h3 style="color: #1e3a8a; font-size: 18px; font-weight: 600; margin: 0 0 4px 0;">Sustainable Shopping</h3>
                                <p style="color: #64748b; font-size: 16px; margin: 0; line-height: 1.6;">By reselling returns, overstock, and refurbished goods, you help reduce waste and support a more sustainable buying cycle.</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Company Stats -->
                <tr>
                  <td style="padding: 0 32px 32px 32px;">
                    <h2 style="color: #1e3a8a; font-size: 24px; font-weight: 700; margin: 0 0 24px 0; text-align: center;">
                      Company Stats
                    </h2>
                    
                    <!-- Responsive Grid for Stats -->
                    <div style="text-align: center; font-size: 0;">
                      <!--[if mso]>
                      <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                      <tr>
                      <td valign="top" width="25%">
                      <![endif]-->
                      <div style="display: inline-block; width: 100%; max-width: 140px; vertical-align: top; margin-bottom: 16px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #eff6ff; border-radius: 12px; text-align: center; padding: 16px; border: 2px solid #3b82f6;">
                          <tr>
                            <td>
                              <div style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin-bottom: 4px;">5000+</div>
                              <div style="font-size: 13px; color: #64748b; font-weight: 500;">Happy Customers</div>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <!--[if mso]>
                      </td>
                      <td valign="top" width="25%">
                      <![endif]-->
                      <div style="display: inline-block; width: 100%; max-width: 140px; vertical-align: top; margin-bottom: 16px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #eff6ff; border-radius: 12px; text-align: center; padding: 16px; border: 2px solid #3b82f6;">
                          <tr>
                            <td>
                              <div style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin-bottom: 4px;">1000+</div>
                              <div style="font-size: 13px; color: #64748b; font-weight: 500;">Products Sold</div>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <!--[if mso]>
                      </td>
                      <td valign="top" width="25%">
                      <![endif]-->
                      <div style="display: inline-block; width: 100%; max-width: 140px; vertical-align: top; margin-bottom: 16px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #eff6ff; border-radius: 12px; text-align: center; padding: 16px; border: 2px solid #3b82f6;">
                          <tr>
                            <td>
                              <div style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin-bottom: 4px;">99%</div>
                              <div style="font-size: 13px; color: #64748b; font-weight: 500;">Satisfaction Rate</div>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <!--[if mso]>
                      </td>
                      <td valign="top" width="25%">
                      <![endif]-->
                      <div style="display: inline-block; width: 100%; max-width: 140px; vertical-align: top; margin-bottom: 16px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #eff6ff; border-radius: 12px; text-align: center; padding: 16px; border: 2px solid #3b82f6;">
                          <tr>
                            <td>
                              <div style="font-size: 28px; font-weight: 700; color: #1e3a8a; margin-bottom: 4px;">24/7</div>
                              <div style="font-size: 13px; color: #64748b; font-weight: 500;">Support Available</div>
                            </td>
                          </tr>
                        </table>
                      </div>
                      <!--[if mso]>
                      </td>
                      </tr>
                      </table>
                      <![endif]-->
                    </div>
                  </td>
                </tr>
                
                <!-- Contact Information -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 32px; border-top: 1px solid #e5e7eb;">
                    <h2 style="color: #1e3a8a; font-size: 22px; font-weight: 700; margin: 0 0 20px 0; text-align: center;">
                      📞 Contact Information
                    </h2>
                    
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding: 12px 0;">
                          <strong style="color: #1e3a8a; font-size: 16px;">Address:</strong><br>
                          <span style="color: #64748b; font-size: 16px;">1420 N McKinley Ave, Los Angeles, CA 90059, United States</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <strong style="color: #1e3a8a; font-size: 16px;">Phone:</strong><br>
                          <a href="tel:+17176484487" style="color: #3b82f6; text-decoration: none; font-size: 16px;">+1 717 648 4487</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <strong style="color: #1e3a8a; font-size: 16px;">Email:</strong><br>
                          <a href="mailto:support@happydeel.com" style="color: #3b82f6; text-decoration: none; font-size: 16px;">support@happydeel.com</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0;">
                          <strong style="color: #1e3a8a; font-size: 16px;">Business Hours:</strong><br>
                          <span style="color: #64748b; font-size: 16px;">Monday to Friday, 9:00 AM - 5:00 PM EST</span><br>
                          <span style="color: #64748b; font-size: 16px;">Saturday, 10:00 AM - 3:00 PM EST</span><br>
                          <span style="color: #64748b; font-size: 16px;">Sunday, Closed</span>
                        </td>
                      </tr>
                    </table>
                    
                    <div style="text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        © 2025 HappyDeel. All rights reserved.<br>
                        Thank you for choosing HappyDeel!<br>
                        <span style="color: #cbd5e1; font-size: 10px;">Ref ID: ${Date.now()}</span>
                      </p>
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

    // Plain text version
    const textTemplate = `
      We win auctions early, before items hit retail
      
      Hello,
      
      Welcome to HappyDeel - a place where shoppers can find quality products at fair, transparent prices. We offer a curated mix of electronics, photography gear, fashion, bicycles, tools, home equipment, and more.
      
      OUR MISSION
      Make premium products accessible to everyone without inflated retail costs.
      
      HOW WE KEEP PRICES LOW (30-50% below normal retail):
      
      1. Daily wins in online auctions
      We participate in high-volume auctions across multiple platforms. Buying in bulk before items reach regular marketplaces lets us secure lower costs and pass those savings on to you.
      
      2. Direct deals across online marketplaces
      Our team searches Facebook Marketplace, OfferUp, eBay, Kleinanzeigen, and other platforms. By negotiating directly with private sellers, we consistently find high-value deals.
      
      3. Partnerships with major retailers’ return & liquidation departments
      We purchase overstock, open-box items, shelf pulls, refurbished pieces, and customer returns from companies such as Amazon, Best Buy, Target, and others.
      Every item is inspected, tested, cleaned, or refurbished before being listed.
      
      4. Local deal hunting
      We regularly visit auctions, garage sales, estate sales, wholesalers, and liquidation centers. This helps us find items you often won’t see in traditional stores.
      
      5. Fair margins, fast turnover
      Instead of adding heavy markups, we focus on reasonable pricing and steady rotation of inventory.
      
      APPROVED PRIVATE SELLERS
      We’ve expanded our sourcing model with a small network of private sellers who share our commitment to quality.
      They ship their items to our warehouse, where our inspection team performs a complete check:
      - Authentic condition
      - Full functionality
      - Pricing aligned with real market value
      Only after passing inspection does a product go live on our site.
      
      WHAT MAKES US DIFFERENT
      ✨ Curated Inventory - Every product goes through a full inspection before shipping.
      📋 Clear Product Details - We always specify whether an item is new, open box, refurbished, or pre-owned.
      💎 Great Value - We constantly compare and track market prices to make sure listings offer real savings.
      🎯 Customer Support - Fast, free shipping within the U.S. and Canada, a 30-day return policy, and responsive human support.
      ♻️ Sustainable Shopping - By reselling returns, overstock, and refurbished goods, you help reduce waste and support a more sustainable buying cycle.
      
      COMPANY STATS
      5000+ Happy Customers
      1000+ Products Sold
      99% Satisfaction Rate
      24/7 Support Available
      
      CONTACT INFORMATION
      Address: 1420 N McKinley Ave, Los Angeles, CA 90059, United States
      Phone: +1 717 648 4487
      Email: support@happydeel.com
      
      Business Hours:
      Mon-Fri: 9:00 AM - 5:00 PM EST
      Saturday: 10:00 AM - 3:00 PM EST
      Sunday: Closed
      
      © 2025 HappyDeel. All rights reserved.
      Thank you for choosing HappyDeel!
      
      Ref ID: ${Date.now()}
    `;

    // Construct absolute URL for logo
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const logoUrl = `${protocol}://${host}/pnglogo.png`;

    const mailOptions = {
      from: `"HappyDeel" <contacthappydeel@gmail.com>`,
      to: customerEmail,
      subject: `How do we keep our prices low? ✨ 🛍️`,
      html: htmlTemplate.replace(
        /src="[^"]*"/,
        'src="cid:happydeellogo"'
      ),
      text: textTemplate,
      attachments: [
        {
          filename: 'logo.png',
          path: logoUrl,
          cid: 'happydeellogo' // same cid value as in the html img src
        }
      ]
    };

    const startTime = Date.now();
    const info = await emailTransporter.sendMail(mailOptions);
    const endTime = Date.now();

    console.log('About email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log(`Email sent in ${endTime - startTime}ms`);

    res.status(200).json({
      success: true,
      message: 'About HappyDeel email sent successfully!',
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