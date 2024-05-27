const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    created_on: {
        type: String,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('user', userSchema);