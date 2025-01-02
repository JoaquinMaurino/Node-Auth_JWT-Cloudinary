const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'User must have an username, please provide one'],
        unique: [true, 'User name is already been used, please try another one'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Must provide an email address'],
        unique: [true, 'Email already in use'],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], //only allow 'user' or 'admin'
        default: 'user'
    }
}, { timestamps: true });


module.exports = mongoose.model('User', UserSchema);
