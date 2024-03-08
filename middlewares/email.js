const nodemailer = require("nodemailer");
const host = process.env.Host;
const port = process.env.port;
const username = process.env.username;
const password = process.env.password;

const MailSending = (option) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: "7b847c15c15ca2",
        pass: "d7a4e8367647b1",
      },
    });

    const emailOptions = {
      from: "codarhq@gmail.com",
      to: option.email,
      subject: option.subject,
      text: option.message,
    };

    transporter.sendMail(emailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return false;
      } else {
        console.log("Email sent: " + info.response);
        return true;
      }
    });
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

module.exports = { MailSending };
