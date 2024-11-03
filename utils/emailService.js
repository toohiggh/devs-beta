// utils/emailService.js
const nodemailer = require('nodemailer');
const { emailConfig } = require('../config.json');

const ALLOWED_DOMAINS = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
];

const transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass,
    },
});

const validateEmail = (email) => {
    email = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return { valid: false, reason: 'FORMAT' };
    }

    const domain = email.split('@')[1];
    if (!ALLOWED_DOMAINS.includes(domain)) {
        return { valid: false, reason: 'DOMAIN' };
    }

    return { valid: true };
};

const sendOtpEmail = async (email, otp) => {
    const validation = validateEmail(email);
    if (!validation.valid) {
        throw new Error(validation.reason);
    }

    const otpDuration = 2;

    const mailOptions = {
        from: `"Verification" <${emailConfig.user}>`,
        to: email,
        subject: 'Your Verification OTP',
        text: `Your OTP is: ${otp}. It expires in ${otpDuration} minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2d3748;">Email Verification</h2>
                <p style="color: #4a5568;">Your verification code is:</p>
                <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; text-align: center;">
                    <h1 style="color: #2d3748; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
                </div>
                <p style="color: #4a5568;">This code will expire in ${otpDuration} minutes.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('SMTP_ERROR');
    }
};

module.exports = {
    validateEmail,
    sendOtpEmail,
    ALLOWED_DOMAINS,
};