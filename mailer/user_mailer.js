const mailer = require("../config/nodemailer");

exports.verifyUser = (data) => {
    mailer.transporter.sendMail({
        from: "support@bhanujodha.tech",
        to: data.email,
        subject: "Confirm your email",
        html: mailer.renderTemplate(data, "verify_user.ejs")
    }, (err, info) => {
        if (err) {
            return console.log("Error in sending mail :", err);
        }
        console.log("Message sent :", info);
    })
}

exports.welcomeUser = (data) => {
    mailer.transporter.sendMail({
        from: "support@bhanujodha.tech",
        to: data.email,
        subject: "Congratulation",
        html: mailer.renderTemplate(data, "welcome_user.ejs")
    }, (err, info) => {
        if (err) {
            return console.log("Error in sending mail :", err);
        }
        console.log("Message sent :", info);
    })
}