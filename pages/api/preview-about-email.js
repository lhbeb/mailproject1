import nodemailer from 'nodemailer';

// Reuse the transporter
let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'contacthappydeel@gmail.com',
        pass: 'pqdc drxx ltlo xapr',
      },
    });
  }
  return transporter;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Sample data for preview
    const customerName = 'John Doe';


    // Comprehensive About HappyDeel HTML Template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no">
        <title>How do we keep our prices low? ✨ 🛍️</title>
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
                  <td style="background-color: #1e3a8a; padding: 48px 32px; text-align: center;">
                    <div style="background-color: #ffffff; padding: 12px 24px; border-radius: 8px; display: inline-block; margin-bottom: 24px;">
                      <img src="data:image/png;base64,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" alt="HappyDeel" width="180" style="display: block; border: 0; max-width: 100%; height: auto;">
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
                                <div style="width: 32px; height: 32px; background-color: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: 700; font-size: 18px;">1</div>
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
      
      Welcome to HappyDeel, the trusted destination for smart shoppers who want quality products at fair and transparent prices.
      
      OUR MISSION
      Make premium products accessible to everyone without inflated retail costs.
      
      HOW WE KEEP PRICES LOW (30-50% below retail):
      
      1. We win thousands of online auctions before items reach the public
      2. We negotiate deals across major online marketplaces
      3. We partner with return and liquidation departments of major retailers
      4. We hunt for deals locally (garage sales, estate sales, etc.)
      5. Fair pricing keeps our store competitive
      
      APPROVED PRIVATE SELLERS
      We partner with private sellers who ship items to our warehouse for inspection before they're available for purchase.
      
      WHAT MAKES US DIFFERENT
      ✨ Curated Inventory - Every product inspected and verified
      📋 Transparent Product Details - You always know what you're buying
      💎 Real Value - Genuine deals, constantly price-checked
      🎯 Customer Focus - Free shipping, 30-day returns, human support
      ♻️ Sustainable Shopping - Reduce waste by buying refurbished/returns
      
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
      Monday to Friday, 9:00 AM - 5:00 PM EST
      Saturday, 10:00 AM - 3:00 PM EST
      Sunday, Closed
      
      © 2025 HappyDeel. All rights reserved.
      Thank you for choosing HappyDeel!
    `;

    // Return HTML for preview
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(htmlTemplate);

  } catch (error) {
    console.error('Error generating preview:', error);
    res.status(500).json({
      error: 'Failed to generate preview',
      details: error.message
    });
  }
}