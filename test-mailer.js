// test-mailer.js
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'recipient@example.com', // Replace with a valid email address
  subject: 'Test Email',
  text: 'This is a test email from Nodemailer',
}, (error, info) => {
  if (error) {
    return console.error('Error:', error);
  }
  console.log('Email sent:', info.response);
});
