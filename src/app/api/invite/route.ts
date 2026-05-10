import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { friendEmail, inviterName, inviterEmail, inviterUserId } = await req.json();

  if (!friendEmail || typeof friendEmail !== 'string') {
    return NextResponse.json({ error: 'Friend email is required.' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(friendEmail)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const fromName    = inviterName ? `${inviterName} via AlgoRift` : 'AlgoRift';
  const fromAddress = 'invite@algorift.org';
  const inviteLink  = inviterUserId
    ? `https://algorift.org?ref=${encodeURIComponent(inviterUserId)}`
    : 'https://algorift.org';

  try {
    const { error: sendError } = await resend.emails.send({
      from: `${fromName} <${fromAddress}>`,
      to: [friendEmail],
      replyTo: inviterEmail || undefined,
      subject: `${inviterName || 'Someone'} invited you to learn Python on AlgoRift! 🐍`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>You've been invited to AlgoRift</title>
</head>
<body style="margin:0;padding:0;background:#0f0f1a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#1a1a2e;border-radius:16px;overflow:hidden;border:1px solid #ffffff18;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6c47ff,#a855f7);padding:36px 40px;text-align:center;">
              <div style="font-size:48px;margin-bottom:8px;">🐍</div>
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">AlgoRift</h1>
              <p style="margin:6px 0 0;color:#e0d4ff;font-size:14px;">Python for the next generation</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;font-weight:700;">
                🎉 ${inviterName || 'A friend'} thinks you&apos;ll love this!
              </h2>
              <p style="margin:0 0 20px;color:#b0b8d8;font-size:15px;line-height:1.7;">
                <strong style="color:#a78bfa;">${inviterName || 'Your friend'}</strong> has invited you to join
                <strong style="color:#ffffff;">AlgoRift</strong> — a fun, game-based platform that teaches
                kids and teens how to code in Python.
              </p>
              <p style="margin:0 0 28px;color:#b0b8d8;font-size:15px;line-height:1.7;">
                Earn XP, unlock achievements, climb the leaderboard, and go from total beginner
                to building real programs — one bite-sized module at a time.
              </p>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${inviteLink}"
                       style="display:inline-block;background:linear-gradient(135deg,#6c47ff,#a855f7);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:10px;font-size:16px;font-weight:700;letter-spacing:0.3px;">
                      Start Learning for Free →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Features -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-top:36px;">
                <tr>
                  <td style="padding:0 8px 0 0;width:33%;vertical-align:top;text-align:center;">
                    <div style="font-size:28px;margin-bottom:8px;">⚡</div>
                    <p style="margin:0;color:#a78bfa;font-size:13px;font-weight:600;">20 Modules</p>
                    <p style="margin:4px 0 0;color:#6b7280;font-size:12px;">From basics to advanced Python</p>
                  </td>
                  <td style="padding:0 4px;width:33%;vertical-align:top;text-align:center;">
                    <div style="font-size:28px;margin-bottom:8px;">🏆</div>
                    <p style="margin:0;color:#a78bfa;font-size:13px;font-weight:600;">Leaderboard</p>
                    <p style="margin:4px 0 0;color:#6b7280;font-size:12px;">Compete with friends worldwide</p>
                  </td>
                  <td style="padding:0 0 0 8px;width:33%;vertical-align:top;text-align:center;">
                    <div style="font-size:28px;margin-bottom:8px;">🎮</div>
                    <p style="margin:0;color:#a78bfa;font-size:13px;font-weight:600;">Run Real Code</p>
                    <p style="margin:4px 0 0;color:#6b7280;font-size:12px;">Python right in your browser</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 32px;border-top:1px solid #ffffff10;text-align:center;">
              <p style="margin:0;color:#4b5563;font-size:12px;">
                You received this because ${inviterName || 'a friend'} sent you an invite.
                No account required to sign up.
              </p>
              <p style="margin:8px 0 0;color:#4b5563;font-size:12px;">
                <a href="${inviteLink}" style="color:#6c47ff;text-decoration:none;">algorift.org</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    if (sendError) {
      console.error('Resend send error:', JSON.stringify(sendError));
      return NextResponse.json({ error: sendError.message ?? 'Failed to send email.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Resend exception:', err);
    return NextResponse.json({ error: 'Failed to send email. Please try again.' }, { status: 500 });
  }
}
