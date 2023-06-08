const nodeMailer = require('nodemailer');

exports.sendEmail = async(options) => {

    var transporter = nodeMailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "b7d7714b23254d",
          pass: "a56b2c9f453eaa"
        }
      });

    const mailOptions = {
        from : process.env.SMPT_MAIL,
        to : options.email,
        subject : options.subject,
        text : options.message
    }

    await transporter.sendMail(mailOptions);
}