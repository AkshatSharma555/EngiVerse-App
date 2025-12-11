import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,              // 465 ki jagah 587 use karenge
    secure: false,          // 587 ke liye ye false hona chahiye (STARTTLS)
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false // Cloud server certificate issues ko bypass karega
    }
});

export default transporter;