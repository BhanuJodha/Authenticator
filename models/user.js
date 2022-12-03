const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String, 
        required: true
    },
    iv: {
        type: String,
        required: true
    },  
    otp: {
        type: String,
        maxLength: 6,
        minLength: 6
    },  
    expireAt: {
        type: Date,
        index: { expires: 180 }
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);