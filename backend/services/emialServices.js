// emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail", // or another email service
    auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS  // your app password
    }
});

export async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("📧 Email sent:", info.response);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}

export default transporter;