const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('1. Creating transporter...');
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'contacthappydeel@gmail.com',
            pass: 'pqdc drxx ltlo xapr',
        },
        debug: true, // Enable debug output
        logger: true  // Log to console
    });

    try {
        console.log('2. Verifying connection...');
        await transporter.verify();
        console.log('✅ Connection verified successfully!');

        console.log('3. Sending test email...');
        const info = await transporter.sendMail({
            from: '"Debug Test" <contacthappydeel@gmail.com>',
            to: 'elmahboubimehdi@gmail.com',
            subject: 'Debug Test Email',
            text: 'This is a simple test email to verify delivery.',
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testEmail();
