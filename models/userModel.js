const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must contain name']
    },
    email: {
        type: String,
        unique: [true, 'email must be unique']
    },
    role: ['admin','guest','client'],
    active: {
        type: Boolean
    },
    photo: String,
    password:{
        type: String,
        required: [true, 'password must be unique'],
        minlength: [8, 'must contain at least 8 chars']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'must confirm password'],
        validate: {
            validator: function(val){
                return this.password === val
            },
            message: 'password does not match'
        }
    }
})

const User = mongoose.model('User',userScheme)

module.exports = User