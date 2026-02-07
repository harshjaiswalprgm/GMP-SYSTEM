import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_LOGIN ||
    !process.env.SMTP_PASSWORD ||
    !process.env.EMAIL_FROM
  ) {
    throw new Error("SMTP credentials missing");
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,          // smtp-relay.brevo.com
    port: Number(process.env.SMTP_PORT),  // 587
    secure: false,                        // MUST be false for 587
    auth: {
      user: process.env.SMTP_LOGIN,       // 8643ac001@smtp-brevo.com
      pass: process.env.SMTP_PASSWORD,    // xsmtpsib-xxxx
    },
    tls: {
      rejectUnauthorized: false,          //  IMPORTANT FOR BREVO
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,         // Glowlogics GMP <help@glowlogics.in>
    to,
    subject,
    html,
  });
};

export default sendEmail;
