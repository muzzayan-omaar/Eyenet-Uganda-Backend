import nodemailer from "nodemailer";

export const sendEmail = async ({ subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Eyenet Uganda Website" <${process.env.EMAIL_USER}>`,
    to: process.env.CLIENT_EMAIL,
    subject,
    html,
  });
};