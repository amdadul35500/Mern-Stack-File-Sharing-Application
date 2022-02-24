const nodemailer = require("nodemailer");

const sendMail = async ({ from, to, subject, text, html }) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  try {
    // send mail
    let info = await transporter.sendMail({
      from: `inShare <${from}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendMail;
