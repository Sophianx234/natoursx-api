const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must contain name']
    },
    email: {
        type: String,
        unique: [true, 'email must be unique']
    },
    role:{
        type: String,
        enum: ['admin','guest','client'],
        default: 'client'

    } ,
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
    },
    passwordChangedAt: Date
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined
    next()
})
userSchema.methods.correctPassword = async function(candPass,userPass){
    

        return await bcrypt.compare(candPass,userPass)
    
}
userSchema.methods.passwordChangedAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){

        const timeChanged = parseInt(this.passwordChangedAt.getTime()/1000,10)
        return JWTTimestamp < timeChanged
    }
    return false
}

const User = mongoose.model('User',userSchema)

module.exports = User