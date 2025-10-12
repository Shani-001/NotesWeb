import nodemailer from "nodemailer"

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS,
  },
});

// Wrap in an async IIFE so we can use await.
export const sendMail=async (to,subject,text,html) => {
    // console.log(to,subject)
  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text, // plain‑text body
    html, // HTML body
  });

//   console.log("Message sent:", info.messageId);
}