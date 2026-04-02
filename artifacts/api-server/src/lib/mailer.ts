import nodemailer from "nodemailer";

export function createTransporter() {
  const host = process.env.SMTP_HOST ?? "smtp-mail.outlook.com";
  const port = parseInt(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER ?? "";
  const pass = process.env.SMTP_PASS ?? "";

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass },
    tls: { ciphers: "SSLv3" },
  });
}

export async function sendPasswordResetEmail(toEmail: string, resetLink: string) {
  const transporter = createTransporter();
  const fromName = "AI শিখি বাংলায়";
  const fromEmail = process.env.SMTP_USER ?? "";

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: toEmail,
    subject: "Admin Panel — পাসওয়ার্ড রিসেট লিংক",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f172a; color: #e2e8f0; border-radius: 12px;">
        <h2 style="color: #22d3ee; margin-bottom: 8px;">AI শিখি বাংলায়</h2>
        <p style="color: #94a3b8; margin-bottom: 24px;">Admin Panel Password Reset</p>

        <p style="margin-bottom: 16px;">আপনার Admin Panel-এর পাসওয়ার্ড রিসেটের জন্য নিচের বাটনে ক্লিক করুন:</p>

        <a href="${resetLink}"
           style="display: inline-block; background: #22d3ee; color: #0f172a; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; margin-bottom: 24px;">
          পাসওয়ার্ড রিসেট করুন
        </a>

        <p style="color: #64748b; font-size: 13px; margin-top: 16px;">
          এই লিংকটি <strong style="color: #94a3b8;">১৫ মিনিট</strong> পর্যন্ত কার্যকর থাকবে।<br/>
          আপনি যদি এই রিকোয়েস্ট না করে থাকেন, তাহলে এই ইমেইলটি উপেক্ষা করুন।
        </p>

        <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
        <p style="color: #475569; font-size: 12px; text-align: center;">
          AI শিখি বাংলায় • Admin Panel
        </p>
      </div>
    `,
  });
}
