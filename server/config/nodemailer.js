import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SMTP_PASS,
    },
   
    family: 4,              // Force IPv4 (Render ipv6 issue fix)
    connectionTimeout: 10000, // 10 seconds wait before giving up
    logger: true,           // Logs mein details dikhayega
    debug: true             // Debug info print karega

});

export default transporter;