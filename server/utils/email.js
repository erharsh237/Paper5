const nodemailer = require('nodemailer');

const createTransport = () => nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendPasswordReset = async ({ to, name, resetUrl }) => {
  const transport = createTransport();
  await transport.sendMail({
    from: `"Paper5" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Reset your Paper5 password',
    html: `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:520px;margin:0 auto;padding:40px 20px;color:#1a1208;">
        <div style="margin-bottom:32px;">
          <span style="font-size:22px;font-weight:700;letter-spacing:-0.03em;">paper5</span>
        </div>
        <h1 style="font-size:24px;font-weight:400;margin-bottom:12px;">Reset your password</h1>
        <p style="color:#8a7560;line-height:1.75;margin-bottom:24px;">
          Hi ${name}, we received a request to reset your Paper5 admin password.
          Click the button below to set a new one. This link expires in <strong>${process.env.RESET_TOKEN_EXPIRE_MINUTES || 15} minutes</strong>.
        </p>
        <a href="${resetUrl}" style="display:inline-block;background:#1a1208;color:white;padding:14px 28px;border-radius:100px;text-decoration:none;font-weight:600;font-size:15px;margin-bottom:24px;">
          Reset my password →
        </a>
        <p style="color:#8a7560;font-size:13px;line-height:1.6;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${resetUrl}" style="color:#7c3aed;word-break:break-all;">${resetUrl}</a>
        </p>
        <hr style="border:none;border-top:1px solid #f3e6d4;margin:24px 0;"/>
        <p style="color:#8a7560;font-size:12px;">
          If you didn't request this, you can safely ignore this email. Your password won't change.
        </p>
      </div>
    `,
  });
};

const sendLeadNotification = async ({ lead }) => {
  if (!process.env.ADMIN_EMAIL || !process.env.SMTP_USER) return;
  const transport = createTransport();
  const dashboardUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/admin/leads`;
  const timeStr = new Date().toLocaleString('en-IN', { dateStyle:'full', timeStyle:'short', timeZone:'Asia/Kolkata' });

  await transport.sendMail({
    from: `"Paper5 Leads" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🔔 New lead: ${lead.name} — ${lead.service || 'General enquiry'}`,
    html: `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;padding:0;background:#f9efe3;">

        <!-- Header -->
        <div style="background:#1a1208;padding:24px 32px;border-radius:16px 16px 0 0;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <span style="font-size:20px;font-weight:700;letter-spacing:-0.03em;color:white;">paper5</span>
            <span style="font-size:12px;color:rgba(255,255,255,0.5);font-family:monospace;">New lead alert</span>
          </div>
        </div>

        <!-- Alert banner -->
        <div style="background:#7c3aed;padding:16px 32px;display:flex;align-items:center;gap:12px;">
          <span style="font-size:24px;">🔔</span>
          <div>
            <p style="margin:0;font-size:15px;font-weight:700;color:white;">You have a new lead!</p>
            <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.75);">${timeStr} (IST)</p>
          </div>
        </div>

        <!-- Lead details card -->
        <div style="background:white;margin:0;padding:28px 32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f3e6d4;width:130px;">
                <span style="font-size:12px;color:#8a7560;font-family:monospace;letter-spacing:.06em;text-transform:uppercase;">Name</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #f3e6d4;">
                <span style="font-size:15px;font-weight:600;color:#1a1208;">${lead.name}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f3e6d4;">
                <span style="font-size:12px;color:#8a7560;font-family:monospace;letter-spacing:.06em;text-transform:uppercase;">Email</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #f3e6d4;">
                <a href="mailto:${lead.email}" style="font-size:14px;color:#7c3aed;font-weight:500;">${lead.email}</a>
              </td>
            </tr>
            ${lead.company ? `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f3e6d4;">
                <span style="font-size:12px;color:#8a7560;font-family:monospace;letter-spacing:.06em;text-transform:uppercase;">Company</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #f3e6d4;">
                <span style="font-size:14px;color:#1a1208;">${lead.company}</span>
              </td>
            </tr>` : ''}
            ${lead.service ? `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f3e6d4;">
                <span style="font-size:12px;color:#8a7560;font-family:monospace;letter-spacing:.06em;text-transform:uppercase;">Service</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #f3e6d4;">
                <span style="display:inline-block;background:#ede9fe;color:#5b21b6;font-size:12px;font-weight:600;padding:3px 10px;border-radius:100px;font-family:monospace;">${lead.service}</span>
              </td>
            </tr>` : ''}
            <tr>
              <td style="padding:10px 0;vertical-align:top;">
                <span style="font-size:12px;color:#8a7560;font-family:monospace;letter-spacing:.06em;text-transform:uppercase;">Message</span>
              </td>
              <td style="padding:10px 0;">
                <p style="margin:0;font-size:14px;color:#3d2f1e;line-height:1.7;background:#f9efe3;padding:12px 14px;border-radius:10px;border-left:3px solid #7c3aed;">${lead.message || 'No message provided'}</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Quick action buttons -->
        <div style="background:#f9efe3;padding:20px 32px;display:flex;gap:12px;flex-wrap:wrap;">
          <a href="${dashboardUrl}" style="display:inline-block;background:#1a1208;color:white;padding:11px 22px;border-radius:100px;text-decoration:none;font-weight:600;font-size:13px;">
            View in dashboard →
          </a>
          <a href="mailto:${lead.email}?subject=Re: Your enquiry at Paper5&body=Hi ${lead.name},%0A%0AThank you for reaching out to Paper5!%0A%0A" style="display:inline-block;background:white;color:#1a1208;padding:11px 22px;border-radius:100px;text-decoration:none;font-weight:600;font-size:13px;border:1.5px solid #e5d5c5;">
            Reply by email
          </a>
        </div>

        <!-- Footer -->
        <div style="padding:16px 32px;border-radius:0 0 16px 16px;background:#f0e6d8;">
          <p style="margin:0;font-size:11px;color:#8a7560;font-family:monospace;">
            Paper5 · paper5.co · This alert was sent because a new lead was submitted on your website.
          </p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendPasswordReset, sendLeadNotification };
