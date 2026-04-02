import { Router, type IRouter } from "express";
import { Resend } from "resend";
import * as zod from "zod";

const router: IRouter = Router();

const ContactBody = zod.object({
  name: zod.string().min(1).max(100),
  email: zod.string().email(),
  message: zod.string().min(10).max(2000),
});

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = ContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "সব ফিল্ড সঠিকভাবে পূরণ করুন।" });
    return;
  }

  const { name, email, message } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "AI শিখি বাংলায় <onboarding@resend.dev>",
        to: ["contact@aishikhibanglay.com"],
        replyTo: email,
        subject: `📩 নতুন বার্তা: ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #0f172a; color: #e2e8f0; border-radius: 12px;">
            <h2 style="color: #22d3ee; margin-bottom: 4px;">AI শিখি বাংলায়</h2>
            <p style="color: #64748b; font-size: 13px; margin-bottom: 28px;">Contact Form Submission</p>

            <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
              <tr><td style="padding:8px 0; color:#94a3b8; width:100px;">নাম</td><td style="padding:8px 0; color:#f1f5f9; font-weight:600;">${name}</td></tr>
              <tr><td style="padding:8px 0; color:#94a3b8;">ইমেইল</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#22d3ee;">${email}</a></td></tr>
            </table>

            <div style="background:#1e293b; border-radius:8px; padding:20px; margin-bottom:24px;">
              <p style="color:#94a3b8; font-size:13px; margin:0 0 10px;">বার্তা:</p>
              <p style="color:#f1f5f9; margin:0; white-space:pre-wrap; line-height:1.7;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            </div>

            <hr style="border:none; border-top:1px solid #1e293b; margin:24px 0;" />
            <p style="color:#475569; font-size:12px; text-align:center;">Reply to this email to respond directly to ${name}.</p>
          </div>
        `,
      });
    } catch (err) {
      console.error("[contact] email send error:", err);
    }
  }

  res.json({ ok: true });
});

export default router;
