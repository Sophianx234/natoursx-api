const mongoose = require('mongoose');
const User = require('./userModel');
const { promises } = require('nodemailer/lib/xoauth2');

const tourSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "must contain name"]
    },
    duration:{
        type: Number,
        require: [true,'must contain duration']

    },
    maxGroupSize:{
        type: Number,
        default: 8
    },
    difficulty: {
        type: String,
        required: [true,'must contain difficulty'],
        enum:{
            values:['easy','medium','difficult'],
            message: 'value  not supported'
        } 
    },
    ratingsAverage:{
        type: Number,
        default: 4.7

    },
    ratingsQuantity: {
        type: Number
    },
    price:{
        type: Number,
        required: [true,'must contain price']
    },
    summary: String,
    description: String,
    imageCover: String,
    images:[String] ,
    startDates: {
        type: [Date],
        select:false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations:[ {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
    }],
    guides: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]

})

/* tourSchema.pre('save', async function(next){
    const guidesPromises = this.guides.map(async id=> User.findById(id));
    this.guides = await Promise.all(guidesPromises)
    next()
}) */

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour