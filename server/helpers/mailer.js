const nodemailer = require('nodemailer');
const { signToken } = require('./jwt');

//single shared transporter, created lazily on first send
let transporter;
const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE, // e.g. 'gmail'; omit to use host/port below
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }
    return transporter;
};

const sendOTPEmail = async (to, otp) => {
    await getTransporter().sendMail({
        from: `"KostInn" <${process.env.SMTP_USER}>`,
        to,
        subject: 'KostInn — Your registration OTP',
        text: `Your KostInn verification code is ${otp}. It expires in 10 minutes.`,
        html: `<p>Your KostInn verification code is <b>${otp}</b>.</p><p>It expires in 10 minutes.</p>`
    });
};

const sendResetEmail = async (to, link) => {
    await getTransporter().sendMail({
        from: `"KostInn" <${process.env.SMTP_USER}>`,
        to,
        subject: 'KostInn — Reset your password',
        text: `Reset your KostInn password: ${link}\nThis link expires in 15 minutes. If you didn't request this, ignore this email.`,
        html: `<p>Reset your KostInn password:</p><p><a href="${link}">${link}</a></p><p>This link expires in 15 minutes. If you didn't request this, ignore this email.</p>`
    });
};

module.exports = { sendOTPEmail, sendResetEmail };
