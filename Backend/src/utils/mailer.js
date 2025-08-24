import nodemailer from 'nodemailer';

console.log('DEBUG > Email User:', process.env.EMAIL_USER, '| Email Pass:', process.env.EMAIL_PASS ? 'Loaded Successfully' : '!!! NOT LOADED !!!');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
})

export const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Your IITKReSale Verification Code',
        text: `Your OTP for account verification is: ${otp}. It is valid for 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
};

