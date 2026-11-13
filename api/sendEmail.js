import { Resend } from 'resend';
import { getWelcomeEmailHtml } from './template.js';

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

    const rawEmail = String(body.from_email || body.email || '').trim();
    const rawName = String(body.from_name || body.full_name || body.name || '').trim() || 'Sunshine Fan';
    const rawCountry = String(body.country || 'Worldwide').trim() || 'Worldwide';
    const rawMemberId = String(body.member_id || body.memberId || '').trim();
    const rawJoinDate = String(body.join_date || body.joinDate || '').trim();
    const rawPhone = String(body.phone || '').trim();
    const rawMessage = String(body.message || '').trim();
    const rawInterests = Array.isArray(body.interests)
      ? body.interests.filter(Boolean).join(', ')
      : String(body.interests || '').trim();
    const rawSource = String(body.source || 'Official Fan Club — Claim Founding Membership').trim();
    const submittedAt = String(body.timestamp || new Date().toISOString()).trim();

    if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }

    const safeName = escapeHtml(rawName);
    const safeEmail = escapeHtml(rawEmail);
    const safeCountry = escapeHtml(rawCountry);
    const safeMemberId = escapeHtml(rawMemberId);
    const safeJoinDate = escapeHtml(rawJoinDate);
    const safePhone = escapeHtml(rawPhone);
    const safeMessage = escapeHtml(rawMessage);
    const safeInterests = escapeHtml(rawInterests);
    const safeSource = escapeHtml(rawSource);
    const safeTimestamp = escapeHtml(submittedAt);

    // 1. Send confirmation / welcome email to the fan
    const { data: welcomeData, error: welcomeError } = await resend.emails.send({
      from: 'Reese Sunshine Fan Club <management@reesewitherspoonofficial.com>',
      to: [rawEmail],
      replyTo: 'management@reesewitherspoonofficial.com',
      subject: rawMemberId
        ? `Welcome to Reese's Fan Club, ${rawName}! ☀️ (${rawMemberId})`
        : "Welcome to Reese's Sunshine Fan Club! ☀️",
      html: getWelcomeEmailHtml(safeName, safeEmail, {
        memberId: safeMemberId,
        country: safeCountry,
        joinDate: safeJoinDate,
      }),
    });

    // 2. Send full member details notification to the admin inbox (Zoho Mail)
    const adminSubject = rawMemberId
      ? `🎉 New Founding Member: ${rawName} (${rawMemberId})`
      : `☀️ New Fan Club / Sunshine Signup: ${rawName} (${rawEmail})`;

    const { data: adminData, error: adminError } = await resend.emails.send({
      from: 'System Notification <management@reesewitherspoonofficial.com>',
      to: ['management@reesewitherspoonofficial.com'],
      replyTo: rawEmail,
      subject: adminSubject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #130c24; color: #f8f5ff; border-radius: 16px; border: 1px solid rgba(252, 211, 77, 0.3);">
          <p style="margin: 0 0 6px; font-size: 12px; letter-spacing: 0.16em; text-transform: uppercase; color: #fcd34d; font-weight: 700;">✦ Official Reese Witherspoon Fan Club</p>
          <h2 style="margin: 0 0 18px; font-size: 22px; color: #ffffff;">New Member / Subscriber Details</h2>
          <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse: collapse; background: rgba(255,255,255,0.04); border-radius: 12px; overflow: hidden;">
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="color: #c4b5fd; font-weight: 600; width: 38%;">Full Name</td>
              <td style="color: #ffffff; font-weight: 700;">${safeName}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="color: #c4b5fd; font-weight: 600;">Email Address</td>
              <td><a href="mailto:${safeEmail}" style="color: #fcd34d; text-decoration: none; font-weight: 600;">${safeEmail}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="color: #c4b5fd; font-weight: 600;">Country / Location</td>
              <td style="color: #ffffff;">${safeCountry}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="color: #c4b5fd; font-weight: 600;">Member ID</td>
              <td style="color: #fcd34d; font-weight: 700;">${safeMemberId || 'Newsletter / Community Subscriber'}</td>
            </tr>
            ${safeJoinDate ? `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="color: #c4b5fd; font-weight: 600;">Join Date</td>
              <td style="color: #ffffff;">${safeJoinDate}</td>
            </tr>` : ''}
            ${safePhone ? `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="color: #c4b5fd; font-weight: 600;">Phone</td>
              <td style="color: #ffffff;">${safePhone}</td>
            </tr>` : ''}
            ${safeInterests ? `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="color: #c4b5fd; font-weight: 600;">Interests</td>
              <td style="color: #ffffff;">${safeInterests}</td>
            </tr>` : ''}
            ${safeMessage ? `
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="color: #c4b5fd; font-weight: 600;">Fan Message</td>
              <td style="color: #ffffff;">${safeMessage}</td>
            </tr>` : ''}
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
              <td style="color: #c4b5fd; font-weight: 600;">Form Source</td>
              <td style="color: #e9d5ff;">${safeSource}</td>
            </tr>
            <tr>
              <td style="color: #c4b5fd; font-weight: 600;">Timestamp (UTC)</td>
              <td style="color: #e9d5ff;">${safeTimestamp}</td>
            </tr>
          </table>
          <p style="margin: 16px 0 0; font-size: 13px; color: #a78bfa;">
            ${welcomeError ? '⚠️ Automated welcome email encountered a delivery issue, but admin capture succeeded.' : '✓ Automated welcome confirmation email was delivered to this fan.'}
          </p>
        </div>
      `,
    });

    if (welcomeError && adminError) {
      console.error('Resend error:', { welcomeError, adminError });
      return res.status(400).json({ error: welcomeError || adminError });
    }

    return res.status(200).json({
      success: true,
      memberId: rawMemberId || null,
      timestamp: submittedAt,
      data: welcomeData || adminData,
      adminNotificationId: adminData?.id || null,
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
