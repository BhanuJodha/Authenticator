const User = require("../../../models/user");
const encrypter = require("../../../config/encrypter");
const userWorker = require("../../../workers/user_email_worker");
const jwt = require("jsonwebtoken");
const env = require("../../../config/environment");
const otp = require("otp-generator");

exports.createUser = async (req, res) => {
    try {
        // check password length
        if (!req.body.password || req.body.password.length < 8){
            throw new Error("Invalid password");
        }

        const encryptedData = encrypter.encrypt(req.body.password)

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: encryptedData.content,
            iv: encryptedData.iv,
            otp: otp.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false}),
            expireAt: Date.now()
        });

        let job = userWorker.create("verifyUser", user).priority("high").save((err) => {
            if (err) {
                return console.log("Error in enqueue :", err);
            }
            console.log("Job enqueued", job.id);
        })

        res.status(201).json({
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                verified: user.verified
            },
            message: "User created successfully and OTP send to registered email"
        })
        
    } catch (err) {
        res.status(400).json({
            data: null,
            message: err.message
        })
    }

}

exports.verifyUser = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        // check user exists
        if (!user){
            throw new Error("User not exists or invalid email");
        }

        // check user is verified
        if (user.verified){
            throw new Error("User already verified");
        }

        if (req.body.otp == user.otp){
            user.otp = undefined;
            user.expireAt = undefined;
            user.verified = true;
            await user.save();

            let job = userWorker.create("welcomeUser", user).save((err) => {
                if (err) {
                    return console.log("Error in enqueue :", err);
                }
                console.log("Job enqueued", job.id);
            })

            return res.status(202).json({
                data: {
                    name: user.name,
                    email: user.email
                },
                message: "User verified successfully"
            })
        }

        throw new Error("Invalid OTP");
    } catch (err) {
        res.status(400).json({
            data: null,
            message: err.message
        })
    }
}

exports.login = (req, res) => {
    return res.status(200).json({
        data: {
            jwt: jwt.sign({_id: req.user.id}, env.jwt_token, {expiresIn: 30000})
        },
        message: "Login successfully"
    })
}

exports.authFailure = (req, res) => {
    if (req.session.messages[0]){
        return res.status(401).json({
            data: null,
            message: req.session.messages.pop()
        })
    }
    return res.status(404).json({
        data: null,
        message: "Not found"
    });
}

exports.resetPassword = async (req, res) => {
    let oldPassword = encrypter.decrypt({
        iv: req.user.iv,
        content: req.user.password
    })

    let responseText;
    if (!req.body.old_password || !req.body.new_password) {
        responseText = "old_password and new_password required";
    }
    else if (req.body.old_password !== oldPassword) {
        responseText = "Wrong old password";
    }
    else if (req.body.old_password === req.body.new_password) {
        responseText = "Old password cannot be used as new password";
    }
    else if (req.body.new_password.length < 8) {
        responseText = "Password length is smaller then 8 characters";
    }
    else{
        let newPassword = encrypter.encrypt(req.body.new_password);
        req.user.password = newPassword.content;
        req.user.iv = newPassword.iv
        await req.user.save();
        return res.status(202).json({
            data: null,
            message: "Password updated successfully"
        })
    }
    return res.status(400).json({
        data: null,
        message: responseText
    })
}