const queue = require("../config/kue");
const userMailer = require("../mailer/user_mailer");

queue.process("verifyUser", (job, done) => {
    console.log("verify user worker execute", job.data);
    userMailer.verifyUser(job.data);
    done();
})

queue.process("welcomeUser", (job, done) => {
    console.log("welcome user worker execute", job.data);
    userMailer.welcomeUser(job.data);
    done();
})

module.exports = queue; 