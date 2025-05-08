import nodemailer from 'nodemailer';

async function sendTestEmail() {
  // Replace with your real email
  const toEmail = 'dakshkhetarpaul@gmail.com'; // you can use your email

  // Replace with the credentials from https://ethereal.email/create
  const etherealUser = 'samir.walsh72@ethereal.email';
  const etherealPass = 'uYPSDxP5h4WnXvrANg';

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: etherealUser,
      pass: etherealPass
    }
  });

  const info = await transporter.sendMail({
    from: `"Dr. Samir" <${etherealUser}>`,
    to: toEmail,
    subject: 'Test Email from HealthBot',
    text: 'Hello! This is a test email from your chatbot using Ethereal.'
  });

  console.log('✅ Email sent!');
  console.log('📨 Preview it at:', nodemailer.getTestMessageUrl(info));
}

sendTestEmail().catch(console.error);
