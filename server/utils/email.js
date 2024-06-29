const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: 'bara spxe yyqj npbi',
  },
});

const sendEmail = (recipient, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error while sending email:', error);
    }
    console.log('Email sent: ' + info.response);
  });
};

module.exports = { sendEmail };