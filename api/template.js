export function getWelcomeEmailHtml(from_name, from_email, details = {}) {
  const { memberId = '', country = '', joinDate = '' } = details || {};
  const memberBadgeHtml = memberId ? `
                          <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#160F29" style="background-color: #160F29; border-radius: 14px; border: 1px solid #D4AF37; margin-bottom: 18px;">
                            <tr>
                              <td style="padding: 16px 18px; color: #FFFFFF; font-family: 'Outfit', sans-serif;">
                                <div style="font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #FFCC00; font-weight: 800; margin-bottom: 6px;">✦ Official Founding Member Credential</div>
                                <div style="font-size: 16px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">${from_name}</div>
                                <div style="font-size: 13px; color: #E2D9F3;">Member ID: <strong style="color: #FFCC00;">${memberId}</strong>${country ? ` &nbsp;·&nbsp; ${country}` : ''}${joinDate ? ` &nbsp;·&nbsp; Joined ${joinDate}` : ''}</div>
                              </td>
                            </tr>
                          </table>` : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Reese's Sunshine Fan Club! ☀️ You're In!</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;800&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
  <style type="text/css">
    body {
      margin: 0; padding: 0; background-color: #FDFBF7;
      font-family: 'Outfit', -apple-system, sans-serif;
      -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;
    }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF7; width: 100% !important;">

  <!-- Outer Wrapper -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FDFBF7" style="background-color: #FDFBF7; width: 100%;">
    <tr>
      <td align="center" valign="top" style="padding: 20px 10px;">
        
        <!-- Main Email Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" align="center" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border: 1px solid #EAE3D2; border-radius: 24px; overflow: hidden; margin: 0 auto; box-shadow: 0 16px 40px rgba(74, 69, 87, 0.04);">
          
          <!-- Top Gradient -->
          <tr>
            <td height="8" style="background: linear-gradient(90deg, #7C3AED 0%, #EC4899 50%, #FFCC00 100%); line-height: 8px; font-size: 8px;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding: 35px 20px 25px 20px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <div style="background: linear-gradient(135deg, #FFCC00 0%, #FF9900 100%); width: 42px; height: 42px; border-radius: 50%; display: inline-block; line-height: 42px; color: #fff; font-size: 22px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">☀️</div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 11px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: #7C3AED; font-family: 'Outfit', sans-serif;">
                    Reese's Official Fan Club
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 900; color: #1A1625; padding-top: 6px;">
                    Sunshine Fan Club
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Image -->
          <tr>
            <td align="center" style="padding: 0 20px;">
              <div style="background-color: #FFF9E6; border-radius: 16px; overflow: hidden; max-width: 520px; margin: 0 auto;">
                <img src="https://reesewitherspoonofficial.com/reesewitherspoon/reesewitherspoon_1634488279_2686604866087878895_367315644.jpg" alt="Reese Witherspoon Smiling" width="520" style="max-width: 100%; height: auto; display: block; width: 100%;" />
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 20px 30px 20px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="font-family: 'Playfair Display', serif; font-size: 28px; line-height: 36px; font-weight: 800; color: #1A1625; padding-bottom: 16px;">
                    Welcome to the Family,<br/><span style="color: #7C3AED;">${from_name}</span>! 🎉
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 16px; line-height: 26px; color: #4A4557; padding-bottom: 30px;">
                    Thank you for joining <strong>Reese's Sunshine Fan Club</strong>! We are absolutely thrilled to welcome you to our inner circle. You're now part of a vibrant, inspiring community celebrating Reese's films, her storytelling journey, Hello Sunshine announcements, and much more.
                  </td>
                </tr>

                <tr>
                  <td align="left" style="font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #EC4899; padding-bottom: 16px;">
                    ✦ Your Exclusive Perks Start Today
                  </td>
                </tr>

                <!-- Benefits List -->
                <!-- Benefit 1 -->
                <tr>
                  <td style="padding-bottom: 12px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FAF8F5" style="border-radius: 12px; border: 1px solid #EAE3D2;">
                      <tr>
                        <td width="40" align="center" valign="middle" style="font-size: 20px; padding: 15px 0 15px 15px;">☀️</td>
                        <td align="left" valign="middle" style="padding: 15px 15px 15px 10px; font-size: 14px; line-height: 20px; color: #1A1625;">
                          <strong>Exclusive News &amp; Early Updates:</strong> Be the first to hear about new movie announcements, casting, and Hello Sunshine drops.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Benefit 2 -->
                <tr>
                  <td style="padding-bottom: 12px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FAF8F5" style="border-radius: 12px; border: 1px solid #EAE3D2;">
                      <tr>
                        <td width="40" align="center" valign="middle" style="font-size: 20px; padding: 15px 0 15px 15px;">📸</td>
                        <td align="left" valign="middle" style="padding: 15px 15px 15px 10px; font-size: 14px; line-height: 20px; color: #1A1625;">
                          <strong>Member-Only Galleries:</strong> Unlock behind-the-scenes clips, early trailer releases, and secret photos.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Benefit 3 -->
                <tr>
                  <td style="padding-bottom: 12px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FAF8F5" style="border-radius: 12px; border: 1px solid #EAE3D2;">
                      <tr>
                        <td width="40" align="center" valign="middle" style="font-size: 20px; padding: 15px 0 15px 15px;">🗳️</td>
                        <td align="left" valign="middle" style="padding: 15px 15px 15px 10px; font-size: 14px; line-height: 20px; color: #1A1625;">
                          <strong>Participate in Polls:</strong> Cast your votes on community decisions and receive VIP invitations to Q&amp;A watch parties.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Benefit 4 -->
                <tr>
                  <td style="padding-bottom: 30px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FAF8F5" style="border-radius: 12px; border: 1px solid #EAE3D2;">
                      <tr>
                        <td width="40" align="center" valign="middle" style="font-size: 20px; padding: 15px 0 15px 15px;">💌</td>
                        <td align="left" valign="middle" style="padding: 15px 15px 15px 10px; font-size: 14px; line-height: 20px; color: #1A1625;">
                          <strong>Monthly Wallpapers:</strong> Download fresh monthly wallpaper packs for your phone.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Action Required -->
                <tr>
                  <td align="left" style="font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #EC4899; padding-bottom: 16px; padding-top: 10px;">
                    ✦ Action Required: Claim Your Welcome Package
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 30px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFF9E6" style="border-radius: 16px; border: 1px solid #FFEBB3;">
                      <tr>
                        <td align="center" style="padding: 25px 20px;">
                          <h4 style="margin: 0 0 10px 0; font-family: 'Playfair Display', serif; font-size: 20px; color: #855D00;">Where should we send your merch? 🎁</h4>
                          <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 22px; color: #855D00;">
                            Please hit the button below to reply to this email with the following details so we can ship your physical Welcome Package:
                          </p>
                          
                          <!-- Form Fields Display -->
                          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFFFFF; border-radius: 8px; border: 1px solid #EAE3D2; margin-bottom: 20px;">
                            <tr>
                              <td style="padding: 15px; font-size: 14px; color: #4A4557; line-height: 1.8;">
                                <strong>1. Home Address</strong> (including City/Zip)<br/>
                                <strong>2. Phone Number</strong><br/>
                                <strong>3. T-Shirt Size</strong> (Optional)
                              </td>
                            </tr>
                          </table>

                          <!-- Mailto Button -->
                          <table border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td align="center" style="border-radius: 50px;" bgcolor="#855D00">
                                <a href="mailto:management@reesewitherspoonofficial.com?subject=My%20Shipping%20Details&body=Hello!%20Here%20are%20my%20details%20for%20the%20Welcome%20Package%3A%0A%0A1.%20Home%20Address%3A%20%0A2.%20Phone%20Number%3A%20%0A3.%20T-Shirt%20Size%3A%20%0A%0AThank%20you!" target="_blank" style="font-size: 15px; font-family: 'Outfit', sans-serif; font-weight: bold; color: #FFFFFF; text-decoration: none; border-radius: 50px; padding: 12px 24px; border: 1px solid #855D00; display: inline-block;">
                                  ✉️ Click Here to Send Details
                                </a>
                              </td>
                            </tr>
                          </table>
                          
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Virtual Card Box -->
                <tr>
                  <td align="left" style="font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #EC4899; padding-bottom: 16px;">
                    ✦ Your Virtual Fan Club Card
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom: 30px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" style="border-radius: 20px; border: 1px solid #EAE3D2; box-shadow: 0 4px 12px rgba(107,33,168,0.05);">
                      <tr>
                        <td style="padding: 25px 20px;">
                          ${memberBadgeHtml}
                          <h3 style="font-family: 'Playfair Display', serif; font-size: 20px; color: #6B21A8; margin: 0 0 15px 0;">What You Unlock Today:</h3>
                          
                          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 10px;">
                            <tr>
                              <td width="30" valign="top" style="font-size: 18px;">🎬</td>
                              <td align="left" style="font-size: 15px; color: #4A5568; line-height: 1.5;"><strong>Early Access:</strong> See trailers before they hit social media.</td>
                            </tr>
                          </table>
                          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 10px;">
                            <tr>
                              <td width="30" valign="top" style="font-size: 18px;">📸</td>
                              <td align="left" style="font-size: 15px; color: #4A5568; line-height: 1.5;"><strong>Members-Only Galleries:</strong> Exclusive behind-the-scenes content.</td>
                            </tr>
                          </table>
                          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 25px;">
                            <tr>
                              <td width="30" valign="top" style="font-size: 18px;">🌟</td>
                              <td align="left" style="font-size: 15px; color: #4A5568; line-height: 1.5;"><strong>Monthly Wallpaper:</strong> A fresh Reese wallpaper for your phone.</td>
                            </tr>
                          </table>

                          <div style="text-align: center;">
                            <a href="https://reesewitherspoonofficial.com/#fan-club" style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); color: #FFCC00; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: bold; display: inline-block;">Explore the Official Fan Club ☀️</a>
                          </div>

                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- CTA Subtext -->
                <tr>
                  <td align="center" style="font-size: 12px; color: #9E9AA8;">
                    Stay connected and enjoy all the perks starting today!
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#1A1625" style="background-color: #1A1625; padding: 35px 20px; border-radius: 0 0 24px 24px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding-bottom: 20px;">
                    <div style="background: linear-gradient(135deg, #7C3AED 0%, #EC4899 100%); width: 28px; height: 28px; border-radius: 50%; display: inline-block; line-height: 28px; color: #FFFFFF; font-size: 13px; font-weight: bold;">✦</div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #FFFFFF; padding-bottom: 8px;">
                    Reese's Sunshine Fan Club
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 13px; line-height: 20px; color: #9E9AA8; padding-bottom: 24px;">
                    Celebrating three decades of storytelling, cinema, and inspiration.
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="https://www.instagram.com/reesewitherspoon" style="font-size: 13px; font-weight: 600; color: #FFCC00; text-decoration: none; margin: 0 5px;">Instagram</a>
                    <span style="color: #4A4557;">•</span>
                    <a href="https://twitter.com/RWitherspoon" style="font-size: 13px; font-weight: 600; color: #FFCC00; text-decoration: none; margin: 0 5px;">Twitter</a>
                    <span style="color: #4A4557;">•</span>
                    <a href="https://hello-sunshine.com" style="font-size: 13px; font-weight: 600; color: #FFCC00; text-decoration: none; margin: 0 5px;">Hello Sunshine</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}
